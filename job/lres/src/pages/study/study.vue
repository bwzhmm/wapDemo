<template>
    <div>
        <div class="study_content">
            <div class="study_img"></div>
            <h3>学习资料<span>{{total}}个</span></h3>
            <!-- fileType= 1视频2文档3超文本 -->
            <div class="study_list " ref="studys" v-for="(v,i) in studylists" :key="i" @click="godetail(v)" @mouseover="in_study(i)" @mouseout="out_study(i)">
                <div v-if="v.fileType=='1'" class="clearfix" :style="'padding: 20px 43px;box-sizing: border-box;'">
                    <div class="study_list_img" :style="'width:178px;height:119px;float: left;position: relative;'">
                        <video style="width:100%;height:100%;" :src="v.url" @click="godetail(v)">
                            您的浏览器不支持 video 标签。
                        </video>
                        <div class="time_num"><i></i>28:36</div>
                    </div>
                    <div class="study_list_title" :style="'width: calc(100% - 198px);height: 100%;float: right;'">
                        <h3>{{v.name}}<span :style="'background: url(./static/img/vedio.png) no-repeat center center;background-size: cover;color:rgba(113,68,249,1);'">视频</span></h3>
                        <p class="intro">{{v.description}}</p>
                        <div class="pub_time">发布时间：{{v.createTime}} <span class="pub_time_icon"><i class="see_icon"></i>{{v.watchCount}}<i class="down_icon"></i>{{v.downloadCount}}</span></div>
                    </div>
                </div>
                <div v-if="v.fileType=='2'" class="study_list_title" :style="'padding: 20px 43px;box-sizing: border-box;'">
                    <h3>{{v.name}}<span :style="'background: url(./static/img/doc.png) no-repeat center center;background-size: cover;color:rgba(84,205,241,1);'">文档</span></h3>
                    <p class="intro">{{v.description}}</p>
                    <div class="pub_time">发布时间：{{v.createTime}}<span class="pub_time_icon"><i class="see_icon"></i>{{v.watchCount}}<i class="down_icon"></i>{{v.downloadCount}}</span></div>
                </div>
                <div v-if="v.fileType=='3'" class="study_list_title" :style="'padding: 20px 43px;box-sizing: border-box;'">
                    <h3>{{v.name}}<span :style="'width:87px;background: url(./static/img/arc.png) no-repeat center center;background-size: cover;color:rgba(13,207,123,1);'">在线文章</span></h3>
                    <p class="intro">{{v.description}}</p>
                    <div class="pub_time">发布时间：{{v.createTime}} <span class="pub_time_icon"><i class="see_icon"></i>{{v.watchCount}}<i class="down_icon"></i>{{v.downloadCount}}</span></div>
                </div>
            </div>
            <el-pagination class="fenye"
                background
                layout="prev, pager, next"
                @current-change="currentchange"
                :total=total>
            </el-pagination>
        </div>
    </div>
</template>
<script>
import code from '../../util/code'
export default {
    data () {
        return {
            page:1,
            limit:10,
            total:0,
            searchkeyword:'',
            studylists:[],
            domain:window.base.baseURL
        }
    },
    methods: {
        in_study(i){
            this.$refs.studys[i].setAttribute('class','study_act')
        },
        out_study(i){
            this.$refs.studys[i].setAttribute('class','study_list')
        },
        //获取学习列表
        loadstudylists(){
            this.util.postAjax({
                code:code.base,
                url:code.getstudy,
                data:{
                    page:this.page,
                    limit:this.limit,
                    filter:JSON.stringify({
                        name: this.searchkeyword
                    })
                }
            }).then(res => {
                this.studylists = res.items;
                this.total = res.total;
            })
        },
        //分页
        currentchange(curr){
            this.page = curr;
            this.loadstudylists();
        },
        //详情<!-- fileType= 1视频2文档3超文本 -->
        godetail(obj){
            switch (obj.fileType) {
                case 1:
                    this.$router.push({
                        path:'vediodetail',
                        query:{
                            id:obj.id
                        }
                    })
                    break;
                case 2:
                    this.$router.push({
                        path:'docdetail',
                        query:{
                            id:obj.id
                        }
                    })
                    break;
                case 3:
                    this.$router.push({
                        path:'arcdetail',
                        query:{
                            id:obj.id
                        }
                    })
                    break;
            }
        }
    },
    created () {
        this.loadstudylists();
    }
}
</script>
<style scoped>
    .fenye{
        text-align: right;
        margin-top: 20px;
    }
    .study_content{
        width: 1100px;
        /* height: 100%; */
        background: #fff;
        margin: 0 auto;
        padding: 20px;
        box-sizing: border-box;
        overflow: auto;
    }
    .study_img{
        width:100%;
        height:232px;
        background:url(../../../static/img/study.png) no-repeat center center;
        background-size: cover;
    }
    .study_content>h3{
        width:100%;
        height:25px;
        font-size:18px;
        font-weight:500;
        color:rgba(31,35,47,1);
        line-height:25px;
        margin: 40px 0 20px 0;
    }
    .study_content>h3>span{
        width:22px;
        height:20px;
        font-size:14px;
        font-weight:400;
        color:rgba(98,101,109,1);
        line-height:20px;
        margin-left: 10px;
    }
    .study_list{
        width: 100%;
        border-bottom: 1px solid #E8EBEF;
    }
    .study_act{
        background:rgba(205,225,255,.39);
        border-bottom: 1px solid #fff;
    }
    .time_num{
        width:66px;
        height:21px;
        background:rgba(31,35,47,1);
        opacity:0.49;
        position: absolute;
        bottom: 10px;
        right: 10px;
        font-size:12px;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:21px;
        text-shadow:0px 0px 5px rgba(0,0,0,0.1);
        text-align: center;
    }
    .time_num>i{
        display: inline-block;
        width:9px;
        height:10px;
        background:url(../../../static/img/timenum.png) no-repeat center center;
        background-size: cover;
        box-shadow:0px 0px 5px 0px rgba(0,0,0,0.1);
        margin-right: 5px;
    }
    .study_list_title{
        /* width: calc(100% - 243px);
        height: 100%;
        float: right; */
    }
    .study_list_title>h3{
        width:100%;
        height:25px;
        font-size:18px;
        font-weight:500;
        color:rgba(31,35,47,1);
        line-height:25px;
    }
    .study_list_title>h3>span{
        display: inline-block;
        width:63px;
        height:25px;
        /* background: url(../../../static/img/vedio.png) no-repeat center center;
        background-size: cover; */
        font-size:12px;
        font-weight:400;
        color:rgba(113,68,249,1);
        line-height:25px;
        margin-left: 20px;
        text-indent: 15px;
        /* text-align: center; */
    }
    .intro{
        width:100%;
        font-size:14px;
        font-weight:400;
        color:rgba(98,101,109,1);
        line-height:20px;
        margin-top: 15px;
    }
    .pub_time{
        width:100%;
        height:17px;
        font-size:12px;
        font-weight:400;
        color:rgba(98,101,109,1);
        line-height:17px;
        margin-top: 22px;
    }
    .pub_time_icon{
        float: right;
    }
    .see_icon{
        display: inline-block;
        width:15px;
        height:11px;
        background:url(../../../static/img/see.png) no-repeat center center;
        background-size: cover;
        margin-right: 5px;
        /* float: left; */
        margin-top: 3px;
    }
    .down_icon{
        display: inline-block;
        width:15px;
        height:11px;
        background:url(../../../static/img/down.png) no-repeat center center;
        background-size: contain;
        margin-right: 5px;
        /* float: left; */
        margin-top: 3px;
        margin-left: 20px;
    }
 
</style>