#!/usr/bin/env node

const cwd = process.cwd();
const hostPckg = require(`${cwd}/package.json`);
const express = require('express');
const path = require('path');
const fp = require('find-free-port');
const open = require('open');
const {
  getReadme, sortByName,
} = require('./lib');

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
  const port = await fp(5000, 6000);
  const url = `http://localhost:${port}`;

  app.listen(port[0], () => {
    console.log('\x1b[32m', `pkg-docs running on ${url}`);
    // open(url);
  });
});

init();
