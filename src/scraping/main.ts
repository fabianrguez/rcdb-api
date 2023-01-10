import Application from '@scraping/application';
import { program } from 'commander';
import type { Regions } from '@scraping/rcdb';

program.option('--region <regionName>');

program.parse();

const { region = 'Europe' } = program.opts<{ region: Regions }>();

const app = new Application();

app.start(region);
