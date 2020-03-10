const cwd = process.cwd();
const unified = require('unified');
const markdown = require('remark-parse');
const html = require('remark-html');
const fs = require('fs');

function getReadmeFile(path) {
  const fileNames = [
    'README',
    'README.markdown',
    'README.md',
    'README.txt',
    'Readme.md',
    'readme.markdown',
    'readme.md',
    'readme.txt',
  ];


  const index = fileNames.findIndex((name) => {
    let content = null;

    try {
      content = fs.existsSync(`${path}/${name}`);
    } catch (_) {
      return false;
    }

    return content;
  });

  return fs.readFileSync(`${path}/${fileNames[index]}`);
}

async function getReadme(pkg) {
  const path = `${cwd}/node_modules/${pkg}`;
  const content = getReadmeFile(path);

  const htmlContent = await unified()
    .use(markdown)
    .use(html)
    .process(content);

  return htmlContent;
}

function sortByName(a, b) {
  return a.localeCompare(b);
}

module.exports = {
  getReadme,
  sortByName,
};
