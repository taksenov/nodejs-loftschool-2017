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
    if (!fs.existsSync()) {
        fs.mkdirSync(outputParam.body);
    } else if (fs.readdirSync(outputParam.body).length !== 0) {
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
const handleCombineMusicCollection = (base, outBase) => {
    return new Promise((resolve, reject) => {
        try {
            const recurFunc = (base, outBase) => {
                const files = fs.readdirSync(base);
                let firstLetterTemp = '';
                let dirTemp;
                let tempDirFileName;
                files.forEach(item => {
                    let localBase = path.join(base, item);
                    let state = fs.statSync(localBase);
                    if (state.isDirectory()) {
                        recurFunc(localBase, outBase);
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
                                    .pipe(
                                        fs.createWriteStream(tempDirFileName)
                                    );
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
                                    .pipe(
                                        fs.createWriteStream(tempDirFileName)
                                    );
                            }
                        }
                    }
                });
            };
            recurFunc(base, outBase);
            resolve(base);
        } catch (err) {
            console.error(err);
            reject(new Error('HANDLE_COMBINE_MUSIC_COLLECTION_ERROR'));
        }
    });
}; //handleCombineMusicCollection

const handleDeleteFilesInInputDir = (base, deleteFlag) => {
    return new Promise((resolve, reject) => {
        try {
            if (!deleteFlag) {
                resolve();
                return;
            }
            const recurFunc = base => {
                let files = fs.readdirSync(base);
                files.forEach(item => {
                    let localBase = path.join(base, item);
                    let state = fs.statSync(localBase);
                    if (state.isFile()) {
                        fs.unlinkSync(localBase);
                    } else if (state.isDirectory()) {
                        console.log('files', files);
                        recurFunc(localBase);
                    }
                });
            };
            recurFunc(base);

            let newBase = base;
            resolve(base);
        } catch (err) {
            console.error(err);
            reject(new Error('HANDLE_DELETE_FILES_IN_INPUT_DIR_ERROR'));
        }
    });
}; //handleDeleteFilesInInputDir

// const handleDeleteInputDir = base => {
//     return new Promise((resolve, reject) => {
//         try {
//             if (!base) {
//                 resolve();
//                 return;
//             }
//             const cleanEmptyFoldersRecursively = folder => {
//                 // var isDir = fs.statSync(folder).isDirectory();
//                 // if (!isDir) {
//                 //     return;
//                 // }
//                 // console.log('folder', folder);
//                 var files = fs.readdirSync(folder);
//                 if (files.length > 0) {
//                     files.forEach(function(file) {
//                         var fullPath = path.join(folder, file);
//                         cleanEmptyFoldersRecursively(fullPath);
//                     });

//                     // re-evaluate files; after deleting subfolder
//                     // we may have parent folder empty now
//                     files = fs.readdirSync(folder);
//                 }

//                 if (files.length === 0) {
//                     // console.log('removing: ', folder);
//                     fs.rmdirSync(folder);
//                     return;
//                 }
//             }; //cleanEmptyFoldersRecursively
//             cleanEmptyFoldersRecursively(base);
//             resolve();
//         } catch (err) {
//             console.error(err);
//             reject(new Error('HANDLE_DELETE_INPUT_DIR_ERROR'));
//         }
//     });
// }; //handleDeleteInputDir
// handlers for file sorting programs ============================================================

handleCombineMusicCollection(inDir, outDir)
    .then(inDir => {
        handleDeleteFilesInInputDir(inDir, isDelete).then(inDir => {
            console.log('Return inDir', inDir);
            // handleDeleteInputDir(inDir);
            // fs.rmdirSync(inDir);
        });
    })
    .catch(error => {
        console.error(error);
    });
