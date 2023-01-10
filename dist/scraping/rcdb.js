"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axiosInstance_1 = __importDefault(require("./axiosInstance"));
const cheerio_1 = require("cheerio");
const cli_progress_1 = require("cli-progress");
const camelize = (str) => str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
    .replace(/\s+/g, '');
const REGION_COASTERS_MAPPER = {
    Madrid: 'ol=25959&ot=2',
    Europe: 'ol=25852&ot=2',
    Spain: 'ol=25940&ot=2',
};
class Rcdb {
    /**
     * Only that contains gotham: nc=Gotham&ot=2
     * Only spain roller coasters: ol=25940&ot=2
     * Only Europe roller coasters: ol=25852&ot=2
     * Only Madrid roller coasters: ol=25959&ot=2
     */
    static _coastersUrl = '/r.htm?';
    static COASTERS_PER_PAGE = 24;
    static _coasters = [];
    static _progressBar = new cli_progress_1.SingleBar({}, cli_progress_1.Presets.shades_classic);
    static _getPagination(html) {
        const $ = (0, cheerio_1.load)(html);
        const totalCoasters = parseInt($('.int').text()) || parseInt($('table.t-list tr:nth-child(2) td:nth-child(2)').text());
        const totalPages = Math.ceil(totalCoasters / this.COASTERS_PER_PAGE);
        return {
            totalCoasters,
            totalPages,
        };
    }
    static _getCoasterStats($) {
        return $('table.stat-tbl tr')
            .map((_, element) => {
            const dataValue = $(element).find('td');
            const getValue = (value) => {
                if (value.children().length > 1) {
                    return value
                        .children()
                        .map((_, element) => element.children.map((child) => child.data))
                        .get();
                }
                else {
                    return value.text();
                }
            };
            return {
                key: camelize($(element).find('th').text()),
                value: getValue(dataValue),
            };
        })
            .get()
            .reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {});
    }
    static async _getCoasterDetails(link) {
        const getCoasterId = (link) => Number(link?.match(/\d/g)?.join(''));
        const coasterDetailResponse = await axiosInstance_1.default.get(link);
        const $ = (0, cheerio_1.load)(coasterDetailResponse.data);
        const stateDate = $('time[datetime]');
        const coasterStats = this._getCoasterStats($);
        return {
            id: getCoasterId(link),
            name: $('#feature h1').text(),
            parkName: $('#feature > div > a:nth-of-type(1)').text(),
            city: $('#feature > div > a:nth-of-type(2)').text(),
            state: $('#feature > div > a:nth-of-type(3)').text(),
            country: $('#feature > div > a:nth-of-type(4)').text(),
            link: link,
            status: {
                state: stateDate.prev().text(),
                date: stateDate.prop('datetime'),
            },
            make: $('#feature .scroll:nth-of-type(2) a:nth-of-type(1)').text(),
            model: $('#feature .scroll:nth-of-type(2) a:nth-of-type(2)').text(),
            type: $('#feature ul:nth-of-type(1) > li:nth-of-type(2) a:nth-of-type(1)').text(),
            design: $('#feature ul:nth-of-type(1) > li:nth-of-type(3) a:nth-of-type(1)').text(),
            stats: coasterStats,
        };
    }
    static async _getCoastersByPage(page) {
        const pageResponse = await axiosInstance_1.default.get(`${this._coastersUrl}&page=${page}`).catch(() => ({ data: {} }));
        const $paginated = (0, cheerio_1.load)(pageResponse.data);
        const rows = $paginated('.stdtbl.rer tbody tr');
        let coastersPage = [];
        for (let i = 0; i < rows.length; i++) {
            const row$ = (0, cheerio_1.load)(rows[i]);
            const link = row$('td:nth-of-type(2) a').attr('href');
            if (link) {
                this._progressBar.increment();
                const rollerCoaster = await this._getCoasterDetails(link);
                coastersPage = [...coastersPage, rollerCoaster];
            }
        }
        return coastersPage;
    }
    static async scrapeCoasters({ region }) {
        this._coastersUrl += REGION_COASTERS_MAPPER[region];
        const axiosResponse = await axiosInstance_1.default.get(this._coastersUrl);
        const { totalCoasters, totalPages } = this._getPagination(axiosResponse.data);
        console.log(`Scrapping ${region} coasters 🎢`);
        console.log(`Coasters: ${totalCoasters} Pages: ${totalPages}\n`);
        this._progressBar.start(totalCoasters, 0);
        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const coastersByPage = await this._getCoastersByPage(currentPage);
            this._coasters = [...this._coasters, ...coastersByPage];
        }
        this._progressBar.stop();
        return this._coasters;
    }
}
exports.default = Rcdb;
