<template>
    <div class="not-found">
        <div class="error-main">
            <img class="pic" src="/static/images/404.jpeg" alt="error-404">
            <h3>您要找的页面不存在</h3>
            <div class="subtitle">
                可能是因为您的链接地址有误，该页面已经被作者删除或转为私密状态。
            </div>
            <div class="back" @click="back">返回「博客」首页</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data(){
          return {
          }
        },
        methods:{
            back(){
                /**
                 * 跳转小程序首页
                 **/
                wx.reLaunch({
                    url:'/pages/index/main'
                })
            }
        }
    }
</script>

<style lang="scss">
    @import "../../utils/base.scss";
    page {
        background: $white;
    }
    .not-found {
        .error-main {
            @include borderBox;
            position: absolute;
            text-align: center;
            width: 100%;
            padding: 0 10%;
            top: 50%;
            margin-top: -220px;
            .pic {
                width: 180px;
                height: 180px;
            }
            h3 {
                margin: 20px 0;
                font-weight: 700;
                color: #333;
            }
            .subtitle {
                margin-bottom: 20px;
                font-size: 14px;
                color: #333;
            }
            .back {
                @include borderBox;
                display: inline-block;
                text-align: center;
                padding: 10px 0;
                width: 60%;
                margin: 12px 0;
                background: $baseColor;
                border-radius: 50px;
                color: #fff;
                border: 1px solid $baseColor;
            }
        }

    }
</style>