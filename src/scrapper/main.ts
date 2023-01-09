import Application from '@scrapper/application';
import { program } from 'commander';
import type { Regions } from '@scrapper/rcdb';

program.option('--region <regionName>');

program.parse();

const { region = 'Europe' } = program.opts<{ region: Regions }>();

const app = new Application();

app.start(region);
