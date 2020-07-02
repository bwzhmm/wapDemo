<template>
    <div>
        <div class="docdetail_">
            <div class="docdetail_top">
                <el-button style="float:left;margin-top:15px;" @click="goback">返回</el-button>
                <span class="doc_time">已在线学习<i>{{formatonlineTime.slice(0,1)}}</i><i>{{formatonlineTime.slice(1,2)}}</i>:<i>{{formatonlineTime.slice(3,4)}}</i><i>{{formatonlineTime.slice(4,5)}}</i>:<i>{{formatonlineTime.slice(6,7)}}</i><i>{{formatonlineTime.slice(7,8)}}</i></span>
                <el-button type="primary" style="float:right;margin-top:15px;background:linear-gradient(90deg,rgba(45,171,255,1) 0%,rgba(20,114,255,1) 100%);" icon="mydown" @click="downdoc">
                    <a :href="docdetail.url" style="color: #fff;text-align: left;" download="文档下载">下载</a>
                </el-button>
            </div>
            <iframe :src="docdetail.url" class="iframepdf"></iframe>
        </div>
    </div>
</template>
<script>
// import Pdfh5 from "pdfh5";
import code from '../../util/code'
export default {
    props:{
        id:String
    },
    data () {
        return {
            docdetail:'',
            domain:window.base.sourceurl,
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
                    this.docdetail = res.item;
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
                            this.formatonlineTime = this.util.formatSeconds(this.onlineTime);
                            // console.log('tag', this.formatonlineTime)
                            if(this.singletime == 120){//及时到2分钟，调取type=2的接口
                                this.singletime=0;
                                this.interval();
                            }
                        },1000)
                        // this.$store.commit('setonlinetimer',this.timer)
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
        downdoc(){
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
        this.readadd(this.id);
    }
}
</script>
<style scoped>
    .docdetail_{
        width: 1100px;
        height: 100%;
        background: #fff;
        margin: 0 auto;
        overflow: auto;
    }
    .docdetail_top{
        width: 100%;
        height:70px;
        background:rgba(255,253,243,1);
        border-radius:5px 5px 0px 0px;
        line-height: 70px;
        padding: 0 40px;
        box-sizing: border-box;
        text-align: center;
    }
    .doc_time{
        width:100%;
        height:20px;
        font-size:14px;
        font-weight:400;
        color:rgba(26,119,255,1);
        line-height:20px;
    }
    .doc_time>i{
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
    .doc_time>i:first-of-type{
        margin-left: 10px;
    }
    #demo{
        width: 100%;
    }
    .iframepdf{
        width: 100%;
        height: 800px;
    }
</style>