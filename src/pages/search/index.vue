<template>
    <div class="search">
        <!--header start-->
        <div class="header">
            <div class="search-wrap">
                <div class="search-box">
                    <div class="search-icon">
                        <img src="/static/images/search_icon.png" alt="search">
                    </div>
                    <div class="search-input">
                        <input v-model.trim="searchStr" maxlength="20" name="keyword" type="text"
                               placeholder="请输入想要查询的关键字...">
                    </div>
                </div>
                <div class="search-btn" @click="search">
                    <span>搜索</span>
                </div>
            </div>
        </div>
        <!--header end-->
        <!--main start-->
        <div class="main">
            <div v-if="showHistory==1" class="search-list">
                <div class="recent-search" v-if="searchArr.length>0">
                    <div class="recent-search-head clearfix">
                        <p>最近搜索</p>
                        <div class="ico" @click="clearCache">
                            <img src="../../../static/images/ico_delete.png"/>
                        </div>
                    </div>
                    <div class="history-tags clearfix">
                        <div class="tag" v-for="(item,index) in searchArr" :key="index" @click="quickSearch(item.name)">
                        <span>
                            {{item.name}}
                        </span>
                        </div>
                    </div>
                </div>
                <div class="hot-search" v-if="hotSearchArr.length>0">
                    <div class="hot-search-head clearfix">
                        <p>热门搜索</p>
                    </div>
                    <div class="hot-search-tags clearfix">
                        <div class="tags" v-for="(item,index) in hotSearchArr" :key="index" @click="quickSearch(item)">
                            <span>{{item}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="list"  v-if="showHistory==2">
            <div class="list-header">
                搜索<span>{{reSearchStr}}</span>(总共搜索到<span>{{total}}</span>条记录)
            </div>
            <div class="mt"></div>
            <ul class="result-list">
                <li class="item" v-for="(item,index) in resultData" :key="index" @click="viewDetail(item.id)">
                    <div class="title">
                        <p v-html="item.title"></p>
                    </div>
                    <div class="des">
                        <span v-html="item.content"></span>
                    </div>
                    <div class="date"><i-icon type="activity" size="14" /> {{item.releaseDateStr}}</div>
                </li>
            </ul>
        </div>
        <!--main end-->
        <i-spin size="large" fix v-if="spinShow"></i-spin>
        <div class="footer">
            <div @click="loadMore" class="load-more" v-if="footerLoading==0">
                加载更多
                <i-icon type="unfold" size="16"/>
            </div>
            <i-load-more v-if="footerLoading==1"/>
            <i-load-more i-class="loadEnd" tip="人家是有底线哒～" :loading="false" v-if="footerLoading==2"/>
            <div class="no-data"  v-if="footerLoading==3">
                <img src="../../../static/images/img_empty.png" alt="暂无数据">
                <div class="tip">未查询到结果，要不要换个关键字试试呢～</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                searchStr: '', //搜索内容
                searchArr: [], //历史搜索
                resultData: [], //搜索结果
                reSearchStr:'', //搜索关键词
                total:0, //总条数
                hotSearchArr: ['Java相关', 'MySQL', 'Angular', 'Vue', '小程序', 'redis'],
                spinShow: false,
                current: 1,//当前页
                pageSize: 5,//每页显示条数
                footerLoading: -1, //页底提示状态；0：显示加载更多，1：显示加载中，2：显示到底提示，3：显示无更多数据
                showHistory: 1, //是否显示搜索历史记录；默认1，1：显示历史记录，2：显示搜索结果
            }
        },
        mounted() {
            this.searchStr = '';
            this.searchArr = [];
            this.resultData = [];
            this.footerLoading = -1;
            this.showHistory = 1;
            this.getStorage();
        },
        methods: {
            getStorage() {
                /**
                 * 获取搜索缓存数据
                 **/
                var self = this;
                wx.getStorage({
                    key: 'search',
                    success(res) {
                        self.searchArr = res.data;
                        console.log(self.searchArr)
                    },
                    fail(res) {
                        self.searchArr = [];
                        console.log(res)
                    }
                })
                wx.stopPullDownRefresh();
            },
            clearCache() {
                /**
                 * 清除搜索记录
                 **/
                var self = this;
                wx.removeStorage({
                    key: 'search',
                    success(res) {
                        self.getStorage();
                    }
                })
            },
            quickSearch(str){
              /**
               * 快速搜索
               **/
              this.searchStr = str;
              this.search()
            },
            search() {
                /**
                 * 搜索
                 **/
                var self = this;
                if (self.searchStr != '') {
                    this.resultData = [];
                    self.getSearchResult().catch((e)=>{
                        console.log(e)
                    })

                    for(let i=0;i<self.searchArr.length;i++){
                        if(self.searchArr[i].name==self.searchStr) {
                            self.searchArr.splice(i,1);
                        }
                    }
                    if (self.searchArr.length == 10) {
                        self.searchArr.pop();
                    }
                    self.searchArr.unshift({
                        name: self.searchStr,
                        date: new Date()
                    })
                    wx.setStorage({
                        key: 'search',
                        data: self.searchArr
                    })
                }
            },
            async getSearchResult() {
                /**
                 * 搜索请求
                 **/
                let self = this;
                self.spinShow = true;
                try {
                    const result = await self.$Api.search({
                        searchStr: self.searchStr,
                        pageSize: self.pageSize,
                        page: self.current,
                    })
                    if (result.code == 0) {
                        console.log("搜索结果数据>>>>>>", result);
                        for(let i=0;i<result.data.list.length;i++){
                            result.data.list[i].title = result.data.list[i].title.replace(/font/g, 'span');
                            result.data.list[i].title = result.data.list[i].title.replace(/b/, 'b style="color: #f66;"');
                            result.data.list[i].content = result.data.list[i].content.replace(/font/g, 'span');
                            result.data.list[i].content = "摘要：" + result.data.list[i].content.replace(/b/, 'b style="color: #f66;"');
                        }
                        self.reSearchStr = result.data.searchStr;
                        self.total = result.data.total;
                        self.resultData.push.apply(self.resultData,result.data.list);
                        this.showHistory = 2;
                        if (self.resultData.length > 0) {
                            self.footerLoading = 0;
                        } else {
                            self.footerLoading = 3;
                        }
                        if (result.data.page == result.data.pageTotal) {
                            self.footerLoading = 2;
                        }
                        self.spinShow = false;
                        wx.stopPullDownRefresh();
                    }
                } catch (e) {
                    console.log(e);
                    self.spinShow = false;
                    wx.stopPullDownRefresh();
                }
            },
            loadMore() {
                /**
                 * 加载更多
                 **/
                this.footerLoading = 1;
                this.current += 1;
                this.getSearchResult();
            },
            viewDetail(id) {
                /**
                 * 查看详情
                 **/
                const jumpUrl = "/pages/detail/main?id=" + id;
                wx.navigateTo({
                    url: jumpUrl
                });
            },
        },
        onPullDownRefresh() {
            /**
             * 下拉刷新
             **/
            this.current = 1;
            this.searchStr = '';
            this.searchArr = [];
            this.resultData = [];
            this.footerLoading = -1;
            this.showHistory = 1;
            this.getStorage();
        },
        onShareAppMessage() {
            return this.Util.normalShare
        }
    }
</script>

<style>
    page {
        background: #f6f6f6;
    }
</style>
<style scoped lang="scss">
    @import "../../utils/base.scss";

    .search {
        background: $white;
    }

    .header {
        border-bottom: 1px solid #e5e5e5;
    }

    /*main start*/
    .main {
        .recent-search {
            padding-left: 13px;
            margin-top: 15px;

            .recent-search-head {
                padding: 0 15px 11px 0;
                line-height: 20px;

                p {
                    font-size: 15px;
                    color: #232326;
                    float: left;
                    width: 100px;
                    padding-left: 1px;
                }

                .ico {
                    float: right;
                    width: 15px;
                    height: 15px;

                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
            }

            .history-tags {
                padding-right: 2px;
                overflow: hidden;
                font-size: 12px;
                text-align: center;

                .tag {
                    display: block;
                    max-width: 100%;
                    overflow: hidden;
                    padding-right: 10px;
                    padding-bottom: 10px;
                    float: left;

                    span {
                        height: 23px;
                        line-height: 24px;
                        border-radius: 3px;
                        display: block;
                        width: 100%;
                        color: #686868;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        background-color: #f0f2f5;
                        padding-left: 13px;
                        padding-right: 13px;
                        overflow: hidden;
                        box-sizing: border-box
                    }
                }
            }

        }

        .hot-search {
            margin-bottom: 0;
            padding-left: 13px;
            margin-top: 15px;

            .hot-search-head {
                padding: 0 15px 11px 0;
                padding-top: 3px;

                p {
                    font-size: 15px;
                    line-height: 15px;
                    color: #232326;
                    float: left;
                    width: 100px;
                    padding-left: 1px;
                }
            }

            .hot-search-tags {
                padding-right: 2px;
                overflow: hidden;
                font-size: 12px;
                text-align: center;

                .tags {
                    display: block;
                    max-width: 100%;
                    overflow: hidden;
                    padding-right: 10px;
                    padding-bottom: 10px;
                    float: left;

                    span {
                        height: 23px;
                        line-height: 24px;
                        border-radius: 3px;
                        display: block;
                        width: 100%;
                        color: #686868;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        background-color: #f0f2f5;
                        padding-left: 13px;
                        padding-right: 13px;
                        overflow: hidden;
                        box-sizing: border-box;
                    }
                }
            }
        }
    }

    .list {
        margin-top: 15px;

        .list-header {
            padding: 0 13px 11px;
            line-height: 20px;
            font-size: 15px;
            color: #232326;

            span {
                color: $baseColor;
            }
        }

        .result-list {
            li {
                padding: 10px;
                border-bottom: 1px solid #f0f0f0;

                .title {
                    position: relative;
                    padding: 10px 0 10px 10px;
                    font-size: 16px;
                    line-height: 1.5;
                    overflow: hidden;
                    -ms-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    &:before {
                        content: "";
                        position: absolute;
                        left: 0;
                        top: 50%;
                        margin-top: -12px;
                        width: 3px;
                        height: 24px;
                        background: #888;
                    }
                }
                .des {
                    margin-bottom: 7px;
                    font-size: 14px;
                    line-height: 1.5;
                }
                .date {
                    font-size: 14px;
                }
            }
        }
    }
    .footer {
        .no-data {
            padding: 100px 0;
            img {
                display: block;
                margin: 0 auto 40px;
                width: 100px;
                height: 100px;
            }
            .tip {
                font-size: 16px;
                line-height: 20px;
                color: #999;
                text-align: center;
            }
        }
    }

    /*main end*/
</style>