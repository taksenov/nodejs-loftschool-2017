'use strict';
/**
 * Проверка параметров запуска
 * @type {Class}
 * return {Object} = {status:@boolean, body:@string}
 */
class Parameters {
    _setParameter(checkParam, params) {
        let checkLength, thisParam;
        checkLength = checkParam.length;
        thisParam = params.slice(checkLength);
        return thisParam;
    } //_setParameter

    _checkParams(checkParam, params, message) {
        let unknownResult;
        for (let i = 0, maxLength = params.length; i < maxLength; i++) {
            if (params[i].indexOf(checkParam) !== -1) {
                switch (checkParam) {
                    case '--help':
                        return {
                            status: true,
                            body: message
                        };
                    // break;
                    case '--input=':
                        return {
                            status: true,
                            body: this._setParameter(checkParam, params[i])
                        };
                    // break;
                    case '--output=':
                        return {
                            status: true,
                            body: this._setParameter(checkParam, params[i])
                        };
                    // break;
                    case '--delete':
                        return { status: true, body: 'DELETE_INPUT_FOLDER' };
                    // break;
                    default:
                        return { status: false, body: undefined };
                    // break;
                }
            } else if (params[i].indexOf(checkParam) === -1) {
                unknownResult = { status: false, body: undefined };
            }
        }
        return unknownResult;
    } //_checkParams

    handleCheckHelpParam(checkParam, execParams) {
        let obj = this._checkParams(
            checkParam,
            execParams,
            `Правила использования:
    --input=DIR_NAME    -- указывается каталог, который требует сортировки;
    --output=DIR_NAME   -- указывается каталог, в котором будет отсортированная музыка;
    --delete            -- удалить каталог input;
    --help              -- справка.
    
    Последовательность установки параметров любая. 
    Параметр '--help' имеет максимальный приоритет.
    Не документированные параметры игнорируются. 
    Сортируются файлы с расширением MP3.`
        );
        return obj;
    }

    handleCheckWorkParams(checkParam, execParams) {
        let obj = this._checkParams(checkParam, execParams, '');
        return obj;
    }
}

module.exports = Parameters;
