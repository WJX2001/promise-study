/**
 * util.promisify 方法
 */

// 借助这种方法，不用所有promise都自己封装

const util = require('util')
// 引入fs模块
const fs = require('fs')
// 返回一个新的函数
let myReadFile = util.promisify(fs.readFile);

myReadFile('./resource/content.txt').then(value=>{
    console.log(value.toString())
});
