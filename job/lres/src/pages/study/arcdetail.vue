<template>
    <div>
        <div class="arcdetail_">
            <div class="arcdetail_auto">
                <div class="arcdetail_top">
                    <h3>{{arcdetail.name}}</h3>
                    <p>作者: [美] 贾雷德·戴蒙德<span>已在线学习<i>{{formatonlineTime.slice(0,1)}}</i><i>{{formatonlineTime.slice(1,2)}}</i>:<i>{{formatonlineTime.slice(3,4)}}</i><i>{{formatonlineTime.slice(4,5)}}</i>:<i>{{formatonlineTime.slice(6,7)}}</i><i>{{formatonlineTime.slice(7,8)}}</i></span></p>
                </div>
                <div class="arcdetail_bottom">
                    <p class="pub_time">发布: {{arcdetail.createTime}} <span><i></i> {{arcdetail.watchCount}}</span> <span><i class="down"></i> {{arcdetail.downloadCount}}</span></p>
                    <p class="arcdetail_text">{{arcdetail.description}}</p>
                </div>
            </div>
            <div class="arcdetail_btn">
                <el-button @click="goback">返回</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import code from '../../util/code'
export default {
    props:{
        id:String
    },
    data() {
        return {
            arcdetail:'',
            domain:window.base.baseURL,
            timer:null,
            formatonlineTime:'',
            singletime:0,//刚进来恢复0,用于计时2分钟的
        }
    },
    methods: {
        //视频详情
        gostudydetail(id){
            this.util.postAjax({
                code:code.base,
                url:code.getstudydetail,
                data:{id:id}
            }).then(res => {
                if(res.success){
                    this.arcdetail = res.item;
                }
            });
        },
        //隔2分钟调取一次接口
        interval(){
            this.util.postAjax({
                code:code.base,
                url:code.onlineadd,
                data:{type:2}
            }).then(res => {
                console.log('加1',res);
            });
        },
        //刚进来查看+1
        readadd(id){
            this.util.postAjax({
                code:code.base,
                url:code.readnum,
                data:{resId:id}
            }).then(res => {
                this.singletime = 0;//刚进来恢复0,用于计时2分钟的
                //刚进来调取已经学习的分钟数
                this.util.postAjax({
                    code:code.base,
                    url:code.onlineadd,
                    data:{type:1}
                }).then(res => {
                    if(res.success){
                        this.onlineTime = parseInt(res.item.time) * 60;
                        this.formatonlineTime = this.util.formatSeconds(this.onlineTime);
                        this.timer = setInterval(()=>{
                            this.onlineTime++;
                            this.singletime++;
                            // console.log('tag', this.onlineTime)
                            this.formatonlineTime = this.util.formatSeconds(this.onlineTime);
                            if(this.singletime == 120){//及时到2分钟，调取type=2的接口
                                this.singletime=0;
                                this.interval();
                            }
                        },1000)
                    }else{
                        this.$message.error(res.message);
                    }
                });
            });
        },
        //返回
        goback(){
            this.$router.push('study');
            clearInterval(this.timer)
        },
    },
    beforeDestroy(){
        clearInterval(this.timer)
    },
    created () {
        // console.log(this.id)
        this.gostudydetail(this.id);
        this.readadd(this.id);
    }
}
</script>
<style scoped>
    .arcdetail_{
        width: 1100px;
        height: 100%;
        margin: 0 auto;
        position: relative;
        background: #fff;
    }
    .arcdetail_auto{
        width: 1100px;
        height: calc(100% - 60px);
        background: #fff;
        margin: 0 auto;
        overflow: auto;
    }
    .arcdetail_top{
        width: calc(100% - 60px);
        margin: 0 auto;
        padding: 20px 0;
        box-sizing: border-box;
        border-bottom: 1px solid #E8EBEF;
    }
    .arcdetail_top>h3{
        width:100%;
        height:30px;
        font-size:22px;
        font-weight:500;
        color:rgba(31,35,47,1);
        line-height:30px;
    }
    .arcdetail_top>p{
        width:100%;
        height:22px;
        font-size:14px;
        font-weight:400;
        color:rgba(98,101,109,1);
        line-height:22px;
        margin-top: 10px;
    }
    .arcdetail_top>p>span{
        float: right;
        color:rgba(26,119,255,1);
    }
    .arcdetail_top>p>span>i{
        display: inline-block;
        width:17px;
        height:20px;
        background:rgba(205,225,255,1);
        border-radius:3px;
        line-height: 20px;
        text-align: center;
        margin: 0 2px;
        font-style: normal;
    }
    .arcdetail_top>p>span>i:first-of-type{
        margin-left: 10px;
    }
    .arcdetail_bottom{
        width: 100%;
        padding: 0 30px;
        box-sizing: border-box;
    }
    .arcdetail_bottom>.pub_time{
        width:100%;
        height:22px;
        font-size:12px;
        font-weight:400;
        color:rgba(184,187,190,1);
        line-height:22px;
        margin: 10px 0;
    }
    .arcdetail_bottom>.pub_time>span>i{
        display: inline-block;
        width:15px;
        height:11px;
        background:url(../../../static/img/see.png) no-repeat center center;
        background-size: cover;
        margin-right: 5px;
        margin-top: 3px;
        margin-left: 30px;
    }
    .arcdetail_bottom>.pub_time>span>i.down{
        background:url(../../../static/img/down.png) no-repeat center center;
        background-size: contain;
    }
    .arcdetail_text{
        width:100%;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        line-height:30px;
        text-align: justify;
    }
    .arcdetail_btn{
        margin: 10px;
    }
</style>