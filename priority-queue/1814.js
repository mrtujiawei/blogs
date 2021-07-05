/**
 * leetcode 1814
 * See {@link https://leetcode-cn.com/problems/count-nice-pairs-in-an-array/}
 */
var countNicePairs = function(nums) {
    // num - rev(num)
    for (let i=0, len=nums.length; i<len; i++) {
        nums[i] = nums[i] - rev(nums[i]) // 注意这里不用 Math.abs...
    }
    let map = new Map() // 用于计数
    nums.forEach (num => {
        map.set(num, map.has(num)? (map.get(num)+1): 1)        
    })
    let res = 0
    for (let [key, value] of map) {
        // 大于 1 时都可以组合，组合数量 = val*(val-1) / (2*1)
        if (value !== 1) res += (value*(value-1))/2
    }
    return res % (Math.pow(10, 9) + 7)
};

function rev (num) {
    let res = 0
    while (num) {
        res = res * 10 + (num % 10)
        num = Math.floor(num/10)
    }
    return res
}
