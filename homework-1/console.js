const fs = require('fs');
const { Console } = require('console');

let output = fs.createWriteStream('./stdout.log');
let outerror = fs.createWriteStream('./stderr.log');

var console = new Console(output, outerror);
let count = 5;

console.log(count);
console.error('Error send');
