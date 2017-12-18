'use strict';

const fs = require('fs');
const path = require('path');
const Parameters = require('./Parameters');

const execParams = process.argv;
const checkParams = new Parameters();

// инициализация и проверка параметров
const helpParam = checkParams.handleCheckHelpParam('--help', execParams);
if (helpParam.status === true) {
    console.log(helpParam.body);
    process.exit();
}
const inputParam = checkParams.handleCheckWorkParams('--input=', execParams);
const outputParam = checkParams.handleCheckWorkParams('--output=', execParams);
const deleteParam = checkParams.handleCheckWorkParams('--delete', execParams);
if (!inputParam.status || !outputParam.status) {
    console.log(
        'Не указаны обязательные параметры "--input" и "--output". Воспользуйтесь параметром "--help" для справки'
    );
    process.exit();
}
if (outputParam.status) {
    if (fs.readdirSync(outputParam.body).length !== 0) {
        console.log(`Каталог --output=${outputParam.body} должен быть пустым`);
        process.exit();
    }
}
// инициализация и проверка параметров

const inDir = inputParam.body;
const outDir = outputParam.body;
const isDelete = deleteParam.status;

// нужен будет parse
// path.basename(path[, ext])
let dirsArr = [];
const readDir = (base, outBase, level) => {
    const files = fs.readdirSync(base);
    let firstLetterTemp = '';
    let dirTemp;
    files.forEach(item => {
        let localBase = path.join(base, item);
        let state = fs.statSync(localBase);
        if (state.isDirectory()) {
            // console.log('    '.repeat(level) + 'Dir: ' + item);
            readDir(localBase, outBase, level + 1);
        } else {
            if (path.extname(localBase).toUpperCase() === '.MP3') {
                console.log('---------------------------');
                console.log('    '.repeat(level) + 'File: ' + item);
                firstLetterTemp = path
                    .basename(localBase)
                    .slice(0, 1)
                    .toUpperCase();
                if (dirsArr.indexOf(firstLetterTemp) === -1) {
                    dirsArr.push(firstLetterTemp);
                    console.log(dirsArr);
                    console.log(firstLetterTemp);
                    // console.log(path.basename(localBase));
                    // console.log('Такой папки нет, создай ее');
                    // console.log(' '.repeat(level) + 'File: ' + item);
                    // console.log(
                    //     path.resolve('' + outBase, './' + firstLetterTemp)
                    // );
                    dirTemp = path.resolve(
                        '' + outBase,
                        './' + firstLetterTemp
                    );
                    let tempDirFileName = path.resolve(
                        '' + dirTemp,
                        './' + item
                    );
                    fs.mkdirSync(dirTemp);
                    console.log('~~~~');
                    console.log('' + localBase);
                    console.log(tempDirFileName);
                    console.log('~~~~');
                    // fs.copyFileSync(localBase, dirTemp);
                    // let copiedFile = fs.createReadStream(localBase);
                    fs
                        .createReadStream(localBase)
                        .pipe(fs.createWriteStream(dirTemp));
                    // copiedFile.pipe(fs.createWriteStream(dirTemp));
                    // var fs = require('fs');

                    // fs.createReadStream('test.log').pipe(fs.createWriteStream('newLog.log'));
                    // console.log(copiedFile);
                    // let bytesCopied = 0;
                    // let fileSize = statOfDumpFile.size;

                    // copiedFile.on('data', function(buffer) {
                    //     bytesCopied += buffer.length;
                    //     let porcentage = (bytesCopied / fileSize * 100).toFixed(2);
                    //     if (isPrintLogs) console.log(porcentage + '%');
                    // });

                    // copiedFile.on('end', function() {
                    //     /**
                    //      * Отправка почты
                    //      * @param  {[type]} mailOptions письмо
                    //      * @param  {[type]} (error,     info          [description]
                    //      * @return {[type]}             [description]
                    //      */
                    //     mailOptions.subject = 'Backup sucess';
                    //     mailOptions.text = 'Copy of ' + currentFileName + ' to RESERV_PATH sucess. Date: ' + strDateNow;
                    //     mailOptions.html = '<p>Copy of ' + currentFileName + ' to RESERV_PATH sucess. Date: ' + strDateNow + '</p>';
                    //     sendEmail(mailOptions);
                    //     if (isPrintLogs) console.log(`Copy of ${currentFileName} to RESERV_PATH sucess`);
                    // });
                } else {
                    // fs.copyFileSync(item, dirTemp);
                    // console.log('Копируй файл в нужную папку');
                    // console.log(path.basename(localBase));
                    // console.log(' '.repeat(level) + 'File: ' + item);
                    console.log('TEMP');
                }

                console.log('---------------------------');
            } else {
                // continue;
            }
        }
    });
};

readDir(inDir, outDir, 0);
