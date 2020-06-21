<template>
    <div>
        <div class="vediodetail_">
            <div class="vediodetail_auto">
                <div class="vediodetail_vedio">
                    <video controls :src="vediodetail.url" autoplay style="width:100%;height:100%;object-fit: fill;">
                        <!-- <source :src="vediodetail.url" type="video/mp4">
                        您的浏览器不支持 video 标签。 -->
                    </video>
                </div>
                <div class="vediodetail_title">
                    <div class="vediodetail_title_">
                        <h3>{{vediodetail.name}}</h3>
                        <p>发布: {{vediodetail.createTime}} <span class="down">下载: {{vediodetail.downloadCount}}</span><span class="study_time">已在线学习<i>{{formatonlineTime.slice(0,1)}}</i><i>{{formatonlineTime.slice(1,2)}}</i>:<i>{{formatonlineTime.slice(3,4)}}</i><i>{{formatonlineTime.slice(4,5)}}</i>:<i>{{formatonlineTime.slice(6,7)}}</i><i>{{formatonlineTime.slice(7,8)}}</i></span></p>
                    </div>
                    <h4>视频简介:</h4>
                    <p>{{vediodetail.description}}</p>
                </div>
            </div>
            <div class="vediodetail_btns">
                <el-button @click="goback">返回</el-button>
                <el-button type="primary" style="float:right;background:linear-gradient(90deg,rgba(45,171,255,1) 0%,rgba(20,114,255,1) 100%);" icon="mydown" @click="downvedio">
                    <a ref="aa" :href="vediodetail.url" style="color: #fff;text-align: left;" download="视频下载">下载</a>
                </el-button>
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
    data () {
        return {
            vediodetail:'',
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
                    this.vediodetail = res.item;
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
        //下载
        downvedio(){
            this.util.postAjax({
                code:code.base,
                url:code.downloadnum,
                data:{
                    resId:this.id
                }
            }).then( () => {
                // console.log("下载次数+1");
                this.util.postAjax({
                    code:code.base,
                    url: code.onlineadd,
                    data:{
                        type:1
                    }
                }).then(()=>{
                    // console.log("刷新本页面！");
                })
            })
        }

    },
    beforeDestroy(){
        clearInterval(this.timer)
    },
    created () {
        // console.log(this.id)
        this.gostudydetail(this.id);
        this.readadd(this.id)
    }
}
</script>
<style scoped>
    .vediodetail_auto,.vediodetail_{
        width: 1100px;
        height: 100%;
        background: #fff;
        margin: 0 auto;
    }
    .vediodetail_auto{
        height: calc(100% - 60px);
        overflow-y: scroll;
    }
    .vediodetail_vedio{
        width:100%;
        height:567px;
        background:rgba(132,147,168,1);
    }
    .vediodetail_title{
        width:1100px;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 10px 0px rgba(164,201,255,0.22);
        border-radius:5px;
        padding: 30px 20px;
        box-sizing: border-box;

    }
    .vediodetail_title>h4{
        width:100%;
        height:20px;
        font-size:14px;
        font-weight:500;
        color:rgba(31,35,47,1);
        line-height:20px;
        margin-top: 20px;
    }
    .vediodetail_title>p{
        width:1040px;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        line-height:20px;
        margin-top: 10px;
    }
    .vediodetail_title_{
        width: 100%;
        margin: 0 auto;
        border-bottom: 1px solid #E8EBEF;
        padding-bottom: 20px;
        box-sizing: border-box;
    }
    .vediodetail_title_>h3{
        width: 100%;
        height:25px;
        font-size:18px;
        font-weight:500;
        color:rgba(31,35,47,1);
        line-height:25px;
    }
    .vediodetail_title_>p{
        width:100%;
        height:20px;
        font-size:14px;
        font-weight:400;
        color:rgba(184,187,190,1);
        line-height:20px;
        margin-top: 10px;
    }
    .study_time{
        float: right;
        font-size:14px;
        font-weight:400;
        color:rgba(26,119,255,1);
    }
    .study_time>i{
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
    .study_time>i:first-of-type{
        margin-left: 10px;
    }
    .vediodetail_title_>p>.down{
        margin-left: 16px;
    }
    .vediodetail_btns{
        margin: 10px;
    }
</style>