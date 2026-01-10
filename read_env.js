
const fs = require('fs');
try {
    console.log('--- ENV START ---');
    console.log(fs.readFileSync('credentials.txt', 'utf8').substring(0, 500));
    console.log('--- ENV END ---');
} catch (e) {
    console.error(e.message);
}
