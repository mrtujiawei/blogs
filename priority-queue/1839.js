/**
 * leetcode 1839
 * See {@link https://leetcode-cn.com/problems/longest-substring-of-all-vowels-in-order/submissions/}
 * @param {string} word
 * @return {number}
 */
var longestBeautifulSubstring = function(word) {
//直接比较字符串大小
    let cLen = 1
    let volOfClass = 1
    let res = 0
    for(let i = 1; i < word.length ;i++){
        if(word[i] >= word[i-1]) cLen++;
        if(word[i] > word[i-1]) volOfClass++;
        if(word[i] < word[i-1]){cLen = 1;volOfClass = 1};
        if(volOfClass === 5){res = Math.max(cLen,res)};
    }
    return res
};
