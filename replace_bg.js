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
  let originalContent = content;

  // Replace bg-white, bg-gray-50, etc. on <section> and main <div> wrappers
  content = content.replace(/<section className=\"w-full bg-white/g, '<section className=\"w-full bg-transparent');
  content = content.replace(/<section className=\"w-full py-4 md:py-6 bg-white/g, '<section className=\"w-full py-4 md:py-6 bg-transparent');
  content = content.replace(/<div className=\"w-full bg-blue-50\/40/g, '<div className=\"w-full bg-transparent');
  content = content.replace(/<section className=\"w-full bg-gray-50/g, '<section className=\"w-full bg-transparent');
  content = content.replace(/<div className=\"w-full bg-gray-50\/50/g, '<div className=\"w-full bg-transparent');
  content = content.replace(/<section className=\"w-full bg-\[\#f9f9f8\]/g, '<section className=\"w-full bg-transparent');

  if (content !== originalContent) {
    fs.writeFileSync(f, content);
    replacedCount++;
    console.log(`Updated ${f}`);
  }
});

console.log(`Finished. Updated ${replacedCount} files.`);
