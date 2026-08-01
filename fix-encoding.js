const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            const buf = fs.readFileSync(fullPath);
            let content;
            let isUtf16 = false;
            // Check for UTF-16 LE BOM or null bytes indicating UTF-16
            if (buf[0] === 0xFF && buf[1] === 0xFE) {
                content = buf.toString('utf16le');
                isUtf16 = true;
            } else if (buf.includes(0x00)) {
                content = buf.toString('utf16le');
                isUtf16 = true;
            } else {
                content = buf.toString('utf8');
            }
            
            let changed = false;
            if (content.includes('max-w-[1550px]')) {
                content = content.replace(/max-w-\[1550px\]/g, 'max-w-[1248px]');
                changed = true;
            }
            
            if (changed || isUtf16) {
                // write back as utf8
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed encoding and updated ${fullPath}`);
            }
        }
    }
}

processDir(path.join(__dirname, 'app'));
processDir(path.join(__dirname, 'components'));
console.log('Done');
