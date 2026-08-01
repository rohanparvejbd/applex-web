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
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let match = content.match(/export default function \w+.*\{\n\s*return \(\n\s*<(?:section|div)[^>]*className=\"([^\"]*bg-[a-zA-Z0-9#\-\/]+[^\"]*)\"/);
  if (match) {
    console.log(f, '->', match[1]);
  }
});
