import process from 'process';
import { unified } from 'unified';
import markdown from 'remark-parse';
import frontmatter from 'remark-frontmatter';
import gemoji from 'remark-gemoji';
import gemoji2emoji from 'remark-gemoji-to-emoji';
import html from 'remark-html';
import fs from 'fs';

const cwd = process.cwd();

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
    .use(frontmatter)
    .use(gemoji)
    .use(gemoji2emoji)
    .use(html)
    .process(content);

  return htmlContent;
}

function sortByName(a, b) {
  return a.localeCompare(b);
}

export { getReadme, sortByName };
