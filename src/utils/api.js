import Util from './util.js';
const ip = 'https://blog.dulaoshi.club' //新接口地址
// const ip = 'https://dulaoshi.club' //旧接口地址
const getRequest = Util.httpsPromisify(wx.request)

const request = (method, url, data = {}) => { // method为请求方法，url为接口路径，data为传参
    return getRequest({
        url: ip + url,
        data: data,
        method: method,
        header: {
            'content-type': 'application/json'
        }
    })
}
/**
 * @Author WangYaming
 * @Class 接口请求
 * @Description //TODO
 * @Date 17:45 2019-05-07
 * @Param [自定义名字]: params => request([请求方法], [接口路径], params)
 * @return loadMenu: params => request('post', '/menu/loadMainMenu.do', params)
 **/
export default {
    loadList: params => request('post', '/blog/list', params),
    loadDetail: params => request('get', '/blog/articles', params),
    getCommentList: params => request('get', '/blog/commentList', params),
}