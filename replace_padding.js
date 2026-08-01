const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.js')) results.push(file);
    }
  });
  return results;
}

const files = walk('./components');
let replacedCount = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('md:px-8')) {
    fs.writeFileSync(f, content.replace(/md:px-8/g, 'md:px-0'));
    replacedCount++;
    console.log(`Updated ${f}`);
  }
});

console.log(`Finished. Updated ${replacedCount} files.`);
