<template>
    <div class="search">
        <!--header start-->
        <div class="header">
            <div class="search-wrap" @click="search">
                <div class="search-box">
                    <div class="search-icon">
                        <img src="/static/images/search_icon.png" alt="search">
                    </div>
                    <div class="search-input">
                        <input maxlength="20" name="keyword" type="text"
                               placeholder="请输入想要查询的关键字...">
                    </div>
                </div>
                <div class="search-btn">
                    <span>搜索</span>
                </div>
            </div>
        </div>
        <!--header end-->
        <!--main start-->
        <div class="main">
            <div class="history">
                <div class="recent-search-head">
                    <p>最近搜索<i-icon size="15" type="trash" /></p>

                </div>
            </div>
        </div>
        <!--main end-->
    </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped lang="scss">
    @import "../../utils/base.scss";
    .header {
        border-bottom: 1px solid #e5e5e5;
    }
    /*main start*/
    .main {
        .history {
            padding-left: 13px;
            margin-top: 15px;
            .recent-search-head {
                padding: 0 15px 11px 0;
                p {
                    font-size: 15px;
                    line-height: 15px;
                    color: #232326;
                    float: left;
                    width: 100px;
                    padding-left: 1px;
                }
            }
        }
    }

    /*main end*/
</style>