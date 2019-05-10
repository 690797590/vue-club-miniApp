<template>
    <div class="detail">
        <div class="main">
            <h1 class="title">{{detail.title}}</h1>
            <div class="content" v-html="detail.content"></div>
            <div class="keyword" v-if="detail.keyWord">关键词：<span class="keys">{{detail.keyWord}}</span></div>
            <div class="info">
                <span><i-icon size="14" type="activity"/> {{detail.releaseDate.time}}</span>
                <span><i-icon size="14" type="browse"/> {{detail.clickHit}}</span>
                <span><i-icon size="14" type="message"/> {{detail.replyHit}}</span>
                <span class="type">{{detail.blogType.typeName}}</span>
            </div>
            <div class="more">
                <div class="more-item">
                    <span>上一篇：</span>
                    <span @click="viewDetail(lastBlog.id)" class="more-title">{{lastBlog.title}}</span>
                    <span class="no-more" v-if="!lastBlog.id&&showMore">已经是第一篇啦～</span>
                </div>
                <div class="more-item">
                    <span>下一篇：</span>
                    <span @click="viewDetail(nextBlog.id)">{{nextBlog.title}}</span>
                    <span v-if="!nextBlog.id&&showMore">已经是最后一篇啦～</span>
                </div>
            </div>
            <i-spin size="large" fix v-if="spinShow"></i-spin>
        </div>
        <!--评论 start-->
        <div class="comment">
            <div class="mt"></div>
            <div class="top-title">
                <span v-if="!hasReply">暂无评论</span>
                <span v-if="hasReply">{{replyInfo.total}}条评论</span>
                <div class="write-comment" @click="reply">
                    <i-icon type="brush" size="16"/>
                    写评论
                </div>
            </div>
            <div class="no-content" v-if="!hasReply">
                <img src="/static/images/img_no_comment.png">
                <div>
                    智慧如你，不想
                    <span class="reply-btn" @click="reply">
                        发表一点想法
                    </span>
                    咩~
                </div>
            </div>

            <div class="reply-list" v-if="hasReply">
                <div class="reply-item" v-for="(item,index) in replyList" :key="index">
                    <span class="item-title">{{item.floor}}楼 {{item.userIp}}</span>
                    <span class="sub-title">网友：</span>
                    <span class="des">{{item.content}}</span>
                    <div class="date">
                        <i-icon size="16" type="activity"/>
                        {{item.commentDateStr}}
                    </div>
                </div>
            </div>
        </div>
        <!--评论 end-->
        <div class="footer">
            <div @click="loadMore" class="load-more" v-if="footerLoading==0">
                加载更多
                <i-icon type="unfold" size="16"/>
            </div>
            <i-load-more v-if="footerLoading==1"/>
            <i-load-more i-class="loadEnd" tip="人家是有底线哒～" :loading="false" v-if="footerLoading==2"/>
        </div>
        <i-modal title="提示" :actions="action1" :visible="visibleModal" @click="handleClose1">
            <view>此功能暂未开放</view>
        </i-modal>
    </div>
</template>

<script>

    export default {
        name: "detail",
        computed: {},
        data() {
            return {
                id: "",
                action1: [{name: '我知道了'}],
                detail: {
                    releaseDate: '',
                    blogType: '',
                },
                showMore: false, //是否显示上下篇，默认false不显示
                lastBlog: '', //上一篇
                nextBlog: '', //下一篇
                replyInfo:'',//回复信息
                replyList: [],
                current: 1,//当前页
                pageSize: 3,//每页显示条数
                spinShow: false, //是否显示加载中，默认false不显示
                hasReply: false, //是否有回复，默认false无回复
                visibleModal: false, //提示弹窗
                footerLoading: -1, //页底提示状态；0：显示加载更多，1：显示加载中，2：显示到底提示
            }
        },
        components: {},
        mounted() {
            this.replyInfo = '';
            this.replyList = [];
            this.current = 1;
            this.footerLoading = -1;
            this.id = this.$mp.query.id;
            this.hasReply = false;
            this.init();
        },
        methods: {
            async init() {
                /**
                 * 初始化
                 **/
                let self = this;
                self.spinShow = true;
                let api1 = this.getDetail();
                let api2 = this.getComment();
                await Promise.all([api1, api2]);
                self.spinShow = false;
                wx.stopPullDownRefresh();
            },
            async getDetail() {
                /**
                 * 获取博客详情
                 **/
                let self = this;
                try {
                    this.lastBlog = "";
                    this.nextBlog = "";
                    this.showMore = false;
                    const result = await self.$Api.loadDetail({
                        id: self.id
                    })
                    console.log("详情数据>>>>>>", result);
                    if (result.code == 0) {
                        self.detail = result.data.blog;
                        if (result.data.lastBlog) {
                            self.lastBlog = result.data.lastBlog;
                        }
                        if (result.data.nextBlog) {
                            self.nextBlog = result.data.nextBlog;
                        }
                        this.showMore = true;
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            async getComment() {
                /**
                 * 获取评论
                 **/
                let self = this;
                try {
                    const result = await self.$Api.getCommentList({
                        id: self.id,
                        page: self.current,
                        pageSize: self.pageSize
                    })
                    if (result.code == 0) {
                        console.log("回复数据>>>>>>", result);
                        self.replyInfo = result.data;
                        self.replyList.push.apply(self.replyList,result.data.list);
                        if (self.replyList.length > 0) {
                            self.footerLoading = 0;
                            self.hasReply = true;
                        }
                        if (result.data.page == result.data.pageTotal) {
                            self.footerLoading = 2;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            viewDetail(id) {
                /**
                 * 查看详情
                 **/
                this.replyInfo = '';
                this.replyList = [];
                this.current = 1;
                this.footerLoading = -1;
                this.id = this.$mp.query.id;
                this.hasReply = false;
                this.id = id;
                this.current =1;
                this.init();
            },
            loadMore() {
                /**
                 * 加载更多
                 **/
                this.replyList.list = [];
                this.footerLoading = 1;
                this.current += 1;
                this.getComment();
            },
            reply() {
                /**
                 * 点击回复
                 **/
                this.visibleModal = true;

            },
            handleClose1() {
                this.visibleModal = false;
            }
        }
        ,
        onPullDownRefresh() {
            /**
             * 下拉刷新
             **/
            this.current = 1;
            this.init();
        },
        onShareAppMessage() {
            /**
             * 小程序转发
             **/
            return {
                title: '我发现了一篇好文章，快来看看吧！',
                path: '/pages/detail/main?id=' + this.id,
                imageUrl: "/static/images/img_article_share.jpg"
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../utils/base.scss";

    .detail {
        word-break: break-word !important;
        word-break: break-all;

        .main {
            padding: 0 18px;

            .title {
                margin: 15px 0;
                font-size: 30px;
                font-weight: 700;
                font-family: -apple-system, SF UI Display, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif;
                line-height: 1.4;
                color: #2f2f2f;
            }

            .content {
                font-size: 16px;
                font-weight: 400;
                line-height: 1.7;
                color: #2f2f2f;
            }

            .keyword {
                margin-bottom: 10px;
                font-size: 16px;
                line-height: 1.5;

                .keys {
                    color: #f66;
                }
            }

            .info {
                font-size: 14px;
                color: #969696;

                .type {
                    padding: 0 5px;
                    color: #fff;
                    background: #42b983;
                    border-radius: 3px;
                }
            }

            .more {
                margin: 10px 0 0;
                padding: 10px 0;
                border-top: 1px dashed #555;

                .more-item {
                    margin-bottom: 10px;
                    line-height: 20px;
                    color: #444;
                    font-size: 14px;

                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }

        .comment {
            .top-title {
                border-bottom: none;
                padding: 15px 18px 10px;
                font-size: 16px;
                font-weight: 700;
                color: #545454;
            }

            .write-comment {
                float: right;
                color: $baseColor;
                line-height: 22px;
                font-size: 14px;
            }

            .no-content {
                padding: 40px 0;
                font-size: 14px;
                color: #969696;
                text-align: center;
                background-color: #fff;

                img {
                    padding-bottom: 10px;
                    width: 140px;
                    height: 57px;
                }

                .reply-btn {
                    color: #3194d0;
                }
            }

            .reply-list {
                padding: 0 10px;

                .reply-item {
                    padding: 10px 0;
                    line-height: 1.5;
                    font-size: 16px;
                    word-break: break-word !important;
                    word-break: break-all;
                    border-bottom: 1px dashed #dfdfdf;

                    &:last-child {
                        border-bottom: 0;
                    }

                    .reply-title {
                        color: #101010;
                        font-weight: 700;
                    }

                    .sub-title {
                        color: #969696;
                    }

                    .date {
                        font-size: 14px;
                        color: #969696;
                    }
                }
            }
        }

        .page-container {
            margin: 10px 0;
            font-size: 14px;
        }
    }


</style>