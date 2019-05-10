<template>
    <div class="index">
        <!--search start-->
        <div class="search-wrap" @click="search">
            <div class="search-box">
                <div class="search-icon">
                    <img src="/static/images/search_icon.png" alt="search">
                </div>
                <div class="search-input">
                    <input disabled maxlength="20" name="keyword" type="text"
                           placeholder="请输入想要查询的关键字...">
                </div>
            </div>
            <div class="search-btn">
                <span>搜索</span>
            </div>
        </div>
        <!--search end-->
        <!--通知栏 start-->
        <i-notice-bar icon="systemprompt" closable loop>
            {{notice}}
        </i-notice-bar>
        <!--通知栏 end-->
        <div class="main">
            <div class="list">
                <div class="note-flow" :class="{'have-img':item.imageList.length>0}" v-for="(item,index) in list"
                     :key="index" @click="viewDetail(item.id)">
                    <div class="content">
                        <div class="wrap-img">
                            <img :src="item.imageList[0]" alt="">
                        </div>
                        <h6 class="name">
                            {{item.title}}
                        </h6>
                        <div class="description">
                            {{item.summary}}...
                        </div>
                        <div class="meta oneline">
                            <span>
                                <i-icon class="icon" size="12" type="browse"/>{{item.clickHit}}
                            </span>
                            <span>
                                <i-icon class="icon" size="12" type="message"/>{{item.replyHit}}
                            </span>
                            <span class="date">{{item.releaseDateStr}}</span>
                            <span class="type">{{item.blogType.typeName}}</span>
                        </div>
                    </div>
                </div>
                <i-spin size="large" fix v-if="spinShow"></i-spin>
            </div>
            <div class="footer">
                <div @click="loadMore" class="load-more" v-if="footerLoading==0">
                    加载更多
                    <i-icon type="unfold" size="16"/>
                </div>
                <i-load-more v-if="footerLoading==1"/>
                <i-load-more i-class="loadEnd" tip="人家是有底线哒～" :loading="false" v-if="footerLoading==2"/>
                <i-load-more tip="暂无数据" :loading="false" v-if="footerLoading==3"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        props: {
            typeId: {
                type: String,
                default: ""
            },
            releaseDateStr: {
                type: String,
                default: ""
            }
        },
        computed: {},
        data() {
            return {
                typeId: this.typeId,
                releaseDateStr: this.releaseDateStr,
                current: 1,//当前页
                pageSize: 10,//每页显示条数
                list: [],
                notice: "本小程序由笨蛋小明开发，仅供学习交流使用，禁止用于其他用途！",
                spinShow: false, //是否显示加载中，默认false不显示
                footerLoading: -1, //页底提示状态；0：显示加载更多，1：显示加载中，2：显示到底提示，3：显示无更多数据
            }
        },
        components: {},
        mounted() {
            this.getPageList();
        },
        methods: {
            async getPageList() {
                let self = this;
                self.spinShow = true;
                try {
                    const result = await self.$Api.loadList({
                        typeId: self.typeId,
                        pageSize: self.pageSize,
                        page: self.current,
                        releaseDateStr: ""
                    })
                    if (result.code == 0) {
                        console.log("列表数据>>>>>>", result);
                        self.pageTotal = result.data.pageTotal;
                        self.list.push.apply(self.list,result.data.list);
                        if (self.list.length > 0) {
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
                this.getPageList();
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
            search() {
                /**
                 * 跳转搜索
                 **/
                const searchUrl = "/pages/search/main";
                wx.navigateTo({
                    url: searchUrl
                });
            }
        }
        ,
        onPullDownRefresh() {
            /**
             * 下拉刷新
             **/
            this.list = [];
            this.current = 1;
            this.getPageList();
        },
        onShareAppMessage() {
            return this.Util.normalShare
        }
    }
</script>

<style scoped lang="scss">
    @import "../../utils/base.scss";

    .list {
        position: relative;
        min-height: 10rem;
        background: $white;

        .note-flow {
            position: relative;
            padding: 15px 18px;
            border-bottom: 1px solid #f0f0f0;
            word-wrap: break-word;

            .content {
                .wrap-img {
                    position: absolute;
                    top: 50%;
                    right: 15px;
                    margin-top: -40px;
                    border-radius: 3px;
                    width: 80px;
                    height: 80px;

                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }

                .name {
                    font-size: 18px;
                    font-weight: 700;
                    color: #333;
                    overflow: hidden;
                    -o-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    line-height: 25px;
                    max-height: 50px;
                    -webkit-box-sizing: content-box;
                    box-sizing: content-box;
                    white-space: normal;
                }

                .description {
                    margin-top: 6px;
                    font-size: 13px;
                    line-height: 1.5;
                    color: #999;
                    overflow: hidden;
                    -o-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    line-height: 19px;
                    max-height: 38px;
                    -webkit-box-sizing: content-box;
                    box-sizing: content-box;
                    white-space: normal;
                }

                .meta {
                    margin-top: 8px;
                    line-height: 22px;

                    span {
                        margin-right: 8px;
                        font-size: 12px;
                        color: #b1b1b1;
                    }

                    .type {
                        padding: 0 5px;
                        color: #fff;
                        background: #42b983;
                        border-radius: 3px;
                    }
                }

                .oneline {
                    overflow: hidden;
                    -o-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }

        .have-img {
            .content {
                padding-right: 95px;
            }
        }

    }

    .page-container {
        margin: 10px 0;
        font-size: 14px;
    }

</style>