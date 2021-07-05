/**
 * See {@link https://leetcode-cn.com/problems/number-of-atoms/}
 * @param {string} formula
 * @return {string}
 */
var countOfAtoms = function(formula) {
    let result = [];
    let atoms = new Map();

};

/**
 * 统计
 * @param {string} formula
 * @param {number} startIndex
 * @returns {{atom: string, number: number}}
 */
function count(formula, startIndex) {
    // 先不考虑括号的问题
    let atom = getAtom(formula, startIndex);
    let number = getNumber(formula, startIndex + atom.length);
    let numberLength = 1 == number ? 0 : number.toString().length;
    
    return {
        atom,
        number,
        nextIndex: startIndex + atom.length + numberLength,
    };
}

/**
 * @param {string} formula
 * @param {number} startIndex
 * @returns {string}
 */
function getAtom(formula, startIndex) {
    let atom = [];
    // 不考虑括号的话，第一个肯定是大写的
    atom[0] = formula[startIndex];
    for (let i = startIndex + 1; i < formula.length; i++) {
        let ch = formula[i];
        // 小写字母
        if (isCapital(ch)) {
            atom.push(ch);
        } else {
            break;
        }
    }

    return atom.join('');
}

/**
 * @param {string} formula
 * @param {number} startIndex
 * @returns {number}
 */
function getNumber(formula, startIndex) {
    let number = 0;

    for (let i = startIndex; i < formula.length; i++) {
        let ch = formula[i];
        if (isNumber(ch)) {
            number = number * 10 + Number(ch);
        } else {
            break;
        }
    }

    return 0 < number ? number : 1;
}

/**
 * 是否是大写字母
 * @param {string} ch
 * @returns {boolean}
 */
function isCapital(ch) {
    return 65 <= ch.charCodeAt(0) && 90 >= ch.charCodeAt(0);
}

/**
 * 是否是小写字母
 * @param {string} ch
 * @returns {boolean}
 */
function isLowerCase(ch) {
    return 97 <= ch.charCodeAt(0) && 122 >= ch.charCodeAt(0);
}

/**
 * 是否是数字
 * @param {string} ch
 * @returns {boolean}
 */
function isNumber(ch) {
    return /^[0-9]$/.test(ch);
}
