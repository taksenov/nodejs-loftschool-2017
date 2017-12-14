'use strict';
/**
 * Проверка параметров запуска
 * @type {Class}
 */
class Parameters {
    _setParameter(checkParam, params) {
        let checkLength, thisParam;
        checkLength = checkParam.length;
        thisParam = params.slice(checkLength);
        return thisParam;
    } //_setParameter

    _checkParams(checkParam, params, message) {
        for (let i = 0, maxLength = params.length; i < maxLength; i++) {
            if (params[i].indexOf(checkParam) !== -1) {
                switch (checkParam) {
                    case '--help':
                        return console.log(message);
                        break;
                    case '--input=':
                        return console.log(
                            this._setParameter(checkParam, params[i])
                        );
                        break;
                    case '--output=':
                        return console.log(
                            this._setParameter(checkParam, params[i])
                        );
                        break;
                    case '--delete':
                        return console.log(true);
                        break;
                    default:
                        break;
                }
            }
        }
    } //_checkParams

    handleCheckHelpParam(checkParam, execParams) {
        this._checkParams(
            checkParam,
            execParams,
            `Правила использования:
    --input=DIR_NAME    -- указывается каталог, который требует сортировки;
    --output=DIR_NAME   -- указывается каталог, в котором будет отсортированная музыка;
    --delete            -- удалить каталог input;
    --help              -- справка.
    
    Последовательность установки параметров любая. 
    Не документированные параметры игнорируются. 
    Сортируются файлы с расширением MP3.`
        );
    }

    handleCheckWorkParams(checkParam, execParams) {
        this._checkParams(checkParam, execParams, '');
    }
}

module.exports = Parameters;
