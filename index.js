#!/usr/bin/env node

const cwd = process.cwd();
const hostPckg = require(`${cwd}/package.json`);
const express = require('express');
const fp = require('find-free-port');
const {
  getRepo, getReadme, formatRepoData, filterDuplicates, filterEmpty, sortByName,
} = require('./lib');

const app = express();
const { dependencies } = hostPckg;
let repos = [];

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');

async function init() {
  try {
    const repoUrls = await Promise.all(Object.entries(dependencies).map(getRepo));
    repos = repoUrls
      .filter(filterEmpty)
      .filter(filterDuplicates)
      .map(formatRepoData)
      .sort(sortByName);

    app.emit('ready');
  } catch (error) {
    console.log(error.message);
  }
}

app.get('/', (req, res) => {
  res.render('pages/index', {
    repos,
    readmeHtml: null,
    activeRepo: null,
  });
});

app.get('/:user/:repo', async (req, res) => {
  const activeRepo = req.path;
  try {
    const readmeHtml = await getReadme(activeRepo);

    res.render('pages/index', {
      activeRepo,
      repos,
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

  app.listen(port[0], () => {
    console.log(`Listening on http://localhost:${port}`);
  });
});

init();
