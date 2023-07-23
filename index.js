#!/usr/bin/env node
import process from 'process';
import express from 'express';
import path from 'path';
import yargs from 'yargs';
import open from 'open';
import findFreePort from 'find-free-port';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

import { getReadme, sortByName } from './lib/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url); // workaround to use 'require' for json files

const cwd = process.cwd();
const hostPckg = require(`${cwd}/package.json`);
const app = express();
const { dependencies, devDependencies } = hostPckg;
let packages = [];

app.use(express.static(`${__dirname}/public`));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

async function init() {
  try {
    const deps = {
      ...(dependencies || {}),
      ...(devDependencies || {}),
    };

    packages = Object.keys(deps).sort(sortByName);

    app.emit('ready');
  } catch (error) {
    console.log(error.message);
  }
}

app.get('/', (req, res) => {
  res.redirect(`/${packages[0]}`);
});

app.get('/*', async (req, res) => {
  const activePackage = req.path.substr(1);

  try {
    const readmeHtml = await getReadme(activePackage);

    res.render('pages/index', {
      activePackage,
      packages,
      readmeHtml,
    });
  } catch (error) {
    res.render('pages/error', {
      error,
    });
  }
});

app.on('ready', async () => {
  const argv = yargs(process.argv.slice(2)).argv;
  const port = argv.port ? [argv.port] : await findFreePort(5000, 6000);
  const url = `http://localhost:${port}`;

  app.listen(port[0], () => {
    console.log('\x1b[32m', `pkg-docs running on ${url}`);
    open(url);
  });
});

init();
