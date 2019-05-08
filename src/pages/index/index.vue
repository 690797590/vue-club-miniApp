<template>
    <div class="index">
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
            <!--分页 start-->
            <div class="page-container">
                <i-page i-class="page-inner" :current="current" :total="pageTotal" @change="handleChange">
                    <view slot="prev">
                        <i-icon type="return"></i-icon>
                        上一页
                    </view>
                    <view slot="next">
                        下一页
                        <i-icon type="enter"></i-icon>
                    </view>
                </i-page>
            </div>
            <!--分页 end-->
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
                pageTotal: '', //总页数
                notice: "本小程序仅供学习交流使用，禁止用于其他用途！",
                spinShow: false, //是否显示加载中，默认false不显示
            }
        },
        components: {},
        mounted() {
            wx.showShareMenu();
            this.getPageList();
        },
        methods: {
            async getPageList(){
                let self = this;
                self.spinShow = true;
                try{
                    const result = await self.$Api.loadList({
                        typeId: self.typeId,
                        pageSize: self.pageSize,
                        page: self.current,
                        releaseDateStr: ""
                    })
                    if(result.code==0){
                        console.log("列表数据>>>>>>",result);
                        self.pageTotal = result.data.pageTotal;
                        self.list = result.data.list;
                        self.spinShow = false;
                        wx.stopPullDownRefresh();
                    }
                }catch (e) {
                    console.log(e);
                    self.spinShow = false;
                    wx.stopPullDownRefresh();
                }
            },
            handleChange(e) {
                if (this.spinShow) return;
                const type = e.mp.detail.type;
                if (type === 'next') {
                    this.current += 1;
                } else if (type === 'prev') {
                    this.current -= 1;
                }
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
            }
        }
        ,
        onPullDownRefresh() {
            /**
             * 下拉刷新
             **/
            this.current = 1;
            this.getPageList();
        },
        onShareAppMessage: function () {
            return {
                title: '我发现了一个优秀的博客，快来看看吧！',
            }
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