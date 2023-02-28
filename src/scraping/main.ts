import Application from '@scraping/application';
import { program } from 'commander';
import type { Regions } from '@scraping/rcdb-application';

program.option('--region <regionName>');
program.option('--saveData <boolean>');

program.parse();

const { region = 'World', saveData = 'true' } = program.opts<{ region: Regions; saveData: string }>();

const app = new Application();

app.start({ region, saveData: saveData === 'true' });
