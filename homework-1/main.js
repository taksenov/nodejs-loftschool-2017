'use strict';

const fs = require('fs');
const path = require('path');
const Parameters = require('./Parameters');

const execParams = process.argv;
const checkParams = new Parameters();

// console.log(execParams);

checkParams.handleCheckHelpParam('--help', execParams);
checkParams.handleCheckWorkParams('--input=', execParams);
checkParams.handleCheckWorkParams('--output=', execParams);
checkParams.handleCheckWorkParams('--delete', execParams);
