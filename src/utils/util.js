/**
 * @Author WangYaming
 * @Class formatDate
 * @Description //TODO 时间日期格式化
 * @Date 13:51 2019-05-08
 * @Param date,'yyyy-MM-dd hh:mm'
 * @return "2019-05-08 13:51"
 **/
const formatDate = (date,fmt) =>{
    if(/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1, (date.getFullYear()+'').substr(4-RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth()+1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for(let k in o){
        let str = o[k]+'';
        if(new RegExp(`(${k})`).test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1)?str:padLeftZero(str));
        }
    }
    return fmt;
}
function padLeftZero(str){
    return ('00'+str).substr(str.length);
}

/**
 * @Author WangYaming
 * @Class httpsPromisify
 * @Description //TODO 封装promise处理函数返回值
 * @Date 13:50 2019-05-08
 * @Param fn
 * @return promise
 **/
const Promise = require('es6-promise').Promise;

function httpsPromisify (fn) {
    return function (obj = {}) {
        return new Promise((resolve, reject) => {
            obj.success = function (res) {
                resolve(res.data)
            }
            obj.fail = function (res) {
                reject(res)
            }
            fn(obj)
        })
    }
}


/**
 * @Author WangYaming
 * @Class ShareApp
 * @Description //TODO 分享小程序
 * @Date 18:16 2019-05-08
 * @Param
 * @return
 **/
const ShareApp = () =>{
    return {
        title: '我发现了一个优秀的博客，快来看看吧！',
    }
}

module.exports = {
    formatDate,
    httpsPromisify,
    ShareApp
}

