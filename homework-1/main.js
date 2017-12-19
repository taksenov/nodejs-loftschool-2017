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

// установка переменных из параметров
const inDir = inputParam.body;
const outDir = outputParam.body;
const isDelete = deleteParam.status;
// установка переменных из параметров

// handlers for file sorting programs ============================================================
let dirsArr = [];
const handleCombineMusicCollection = (base, outBase, level) => {
    return new Promise((resolve, reject) => {
        try {
            const files = fs.readdirSync(base);
            let firstLetterTemp = '';
            let dirTemp;
            let tempDirFileName;
            files.forEach(item => {
                let localBase = path.join(base, item);
                let state = fs.statSync(localBase);
                if (state.isDirectory()) {
                    handleCombineMusicCollection(localBase, outBase, level + 1);
                } else {
                    if (path.extname(localBase).toUpperCase() === '.MP3') {
                        firstLetterTemp = path
                            .basename(localBase)
                            .slice(0, 1)
                            .toUpperCase();
                        if (dirsArr.indexOf(firstLetterTemp) === -1) {
                            dirsArr.push(firstLetterTemp);
                            dirTemp = path.resolve(
                                '' + outBase,
                                './' + firstLetterTemp
                            );
                            tempDirFileName = path.resolve(
                                '' + dirTemp,
                                './' + item
                            );
                            fs.mkdirSync(dirTemp);
                            fs
                                .createReadStream(localBase)
                                .pipe(fs.createWriteStream(tempDirFileName));
                        } else {
                            dirTemp = path.resolve(
                                '' + outBase,
                                './' + firstLetterTemp
                            );
                            tempDirFileName = path.resolve(
                                '' + dirTemp,
                                './' + item
                            );
                            fs
                                .createReadStream(localBase)
                                .pipe(fs.createWriteStream(tempDirFileName));
                        }
                    }
                }
            });
            resolve();
        } catch (err) {
            console.error(err);
            reject(new Error('HANDLE_COMBINE_MUSIC_COLLECTION_ERROR'));
        }
    });
}; //handleCombineMusicCollection

const handleDeleteInputDir = (base, level) => {
    return new Promise((resolve, reject) => {
        try {
            const files = fs.readdirSync(base);
            files.forEach(item => {
                let localBase = path.join(base, item);
                let state = fs.statSync(localBase);
                if (state.isDirectory()) {
                    fs.readdir(state, function(err, files) {
                        if (err) {
                            // some sort of error
                        } else {
                            if (!files.length) {
                                fs.rmdirSync(item);
                                // directory appears to be empty
                            }
                        }
                    });
                    console.log(' '.repeat(level) + 'Dir: ' + item);
                    handleDeleteInputDir(localBase, level + 1);
                } else {
                    console.log(' '.repeat(level) + 'File: ' + it__em);
                    fs.unlinkSync(item);
                }
            });
            resolve();
        } catch (err) {
            console.error(err);
            reject(new Error('HANDLE_DELETE_INPUT_DIR_ERROR'));
        }
    });
}; //handleDeleteInputDir;
// handlers for file sorting programs ============================================================

handleCombineMusicCollection(inDir, outDir, 0)
    .then(inDir => {
        if (isDelete) {
            handleDeleteInputDir(inDir, 0);
        } else {
            process.exit();
        }
    })
    .catch(error => {
        console.error(error);
    });

// fs.readdir(dirname, function(err, files) {
//     if (err) {
//         // some sort of error
//     } else {
//         if (!files.length) {
//             // directory appears to be empty
//         }
//     }
// });

// var deleteFolderRecursive = function(path) {
//   if (fs.existsSync(path)) {
//     fs.readdirSync(path).forEach(function(file, index){
//       var curPath = path + "/" + file;
//       if (fs.lstatSync(curPath).isDirectory()) { // recurse
//         deleteFolderRecursive(curPath);
//       } else { // delete file
//         fs.unlinkSync(curPath);
//       }
//     });
//     fs.rmdirSync(path);
//   }
// };
