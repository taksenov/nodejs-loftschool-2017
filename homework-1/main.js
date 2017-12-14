'use strict';

const fs = require('fs');
const path = require('path');
const Parameters = require('./Parameters');

const execParams = process.argv;
const checkParams = new Parameters();

// инициализация и проверка параметров
let helpParam = checkParams.handleCheckHelpParam('--help', execParams);
if (helpParam.status === true) {
    console.log(helpParam.body);
    process.exit();
}
let inputParam = checkParams.handleCheckWorkParams('--input=', execParams);
let outputParam = checkParams.handleCheckWorkParams('--output=', execParams);
let deleteParam = checkParams.handleCheckWorkParams('--delete', execParams);
if (!inputParam.status || !outputParam.status) {
    console.log(
        'Не указаны обязательные параметры "--input" и "--output". Воспользуйтесь параметром "--help" для справки'
    );
    process.exit();
}
// инициализация и проверка параметров
