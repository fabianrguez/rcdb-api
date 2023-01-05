import axios from 'axios';
import config from '@scrapper/config';

export default axios.create({
  baseURL: config.RCDB_URL,
  timeout: 10000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
  },
});
