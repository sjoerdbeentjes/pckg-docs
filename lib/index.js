const got = require('got');
const unified = require('unified');
const markdown = require('remark-parse');
const html = require('remark-html');
const NpmApi = require('npm-api');

const npm = new NpmApi();

async function getRepo([key]) {
  const repo = npm.repo(key);
  const packageInfo = await repo.package();

  if (packageInfo.repository) {
    const path = packageInfo.repository.url.split('github.com')[1];
    return path.replace('.git', '');
  }

  return null;
}

async function getReadme(repo) {
  const url = `https://api.github.com/repos${repo}/readme`;
  const { body } = await got(url);
  const base64Content = JSON.parse(body).content;
  const content = Buffer.from(base64Content, 'base64').toString('binary');
  const htmlContent = await unified()
    .use(markdown)
    .use(html)
    .process(content);

  return htmlContent;
}

function formatRepoData(url) {
  const [, user, name] = url.split('/');

  return {
    url: `/${user}/${name}`,
    user,
    name,
  };
}

function filterDuplicates(item, index, array) {
  return array.indexOf(item) === index;
}

function filterEmpty(item) {
  return item;
}

function sortByName(a, b) {
  return a.name.localeCompare(b.name);
}

module.exports = {
  getRepo,
  getReadme,
  formatRepoData,
  filterDuplicates,
  filterEmpty,
  sortByName,
};
