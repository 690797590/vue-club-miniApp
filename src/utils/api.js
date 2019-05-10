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
    loadList: params => request('get', '/blog/list', params), //获取博客列表
    loadDetail: params => request('get', '/blog/articles', params), //获取博客详情
    getCommentList: params => request('get', '/blog/comment/list', params), //获取博客评论列表
    search: params => request('get', '/blog/search', params), //搜索博客
    replaySave: params => request('post', '/blog/save', params), //博客评论
    linkList: params => request('get', '/common/link/list', params), //友情链接查询
    blogTypeList: params => request('get', '/common/blog/type/list', params), //博客类别查询
    blogClassified: params => request('get', '/common/blog/type/classified', params), //博客分类信息
}