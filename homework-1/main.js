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
// const readDir = (base, outBase, level) => {
//     const files = fs.readdirSync(base);
//     let firstLetterTemp = '';
//     let dirTemp;
//     let tempDirFileName;
//     files.forEach(item => {
//         let localBase = path.join(base, item);
//         let state = fs.statSync(localBase);
//         if (state.isDirectory()) {
//             readDir(localBase, outBase, level + 1);
//         } else {
//             if (path.extname(localBase).toUpperCase() === '.MP3') {
//                 firstLetterTemp = path
//                     .basename(localBase)
//                     .slice(0, 1)
//                     .toUpperCase();
//                 if (dirsArr.indexOf(firstLetterTemp) === -1) {
//                     dirsArr.push(firstLetterTemp);
//                     dirTemp = path.resolve(
//                         '' + outBase,
//                         './' + firstLetterTemp
//                     );
//                     tempDirFileName = path.resolve('' + dirTemp, './' + item);
//                     fs.mkdirSync(dirTemp);
//                     fs
//                         .createReadStream(localBase)
//                         .pipe(fs.createWriteStream(tempDirFileName));
//                 } else {
//                     dirTemp = path.resolve(
//                         '' + outBase,
//                         './' + firstLetterTemp
//                     );
//                     tempDirFileName = path.resolve('' + dirTemp, './' + item);
//                     fs
//                         .createReadStream(localBase)
//                         .pipe(fs.createWriteStream(tempDirFileName));

//                     // console.log('TEMP');
//                 }
//             }
//         }
//     });
// };

// readDir(inDir, outDir, 0);

const combineMusicCollection = (base, outBase, level) => {
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
                    readDir(localBase, outBase, level + 1);
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

                            // console.log('TEMP');
                        }
                    }
                }
            });
            resolve();
        } catch (err) {
            () => {
                reject();
            };
        }
    });
}; //combineMusicCollection

combineMusicCollection(inDir, outDir, 0).then(() => {
    console.log('all files are sorted');
});

// httpGet('/page-not-exists')
//     .then(response => JSON.parse(response))
//     .then(user => httpGet(`https://api.github.com/users/${user.name}`))
//     .then(githubUser => {
//         githubUser = JSON.parse(githubUser);

//         let img = new Image();
//         img.src = githubUser.avatar_url;
//         img.className = 'promise-avatar-example';
//         document.body.appendChild(img);

//         return new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 img.remove();
//                 resolve();
//             }, 3000);
//         });
//     })
//     .catch(error => {
//         alert(error); // Error: Not Found
//     });
