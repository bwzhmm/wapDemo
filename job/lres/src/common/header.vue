<template>
    <div class="myheader clearfix">
        <div class="myheader_title"><i></i>读者教育考试系统</div>
        <ul class="myheader_ clearfix">
            <li :class="{'act':num==v.id}" v-for="(v,i) in mymenu" :key="i" @click="gomenu(v.id)">{{v.name}}</li>
        </ul>
        <div class="myheader_exit"><span>{{personinfo.name}}</span><i @click="exit"></i>退出</div>
    </div>
</template>
<script>
import code from '../util/code'
export default {
    data() {
        return {
            mymenu:[{
                name:'在线学习',
                id:'2',
                DISPLAYURL:'study'
            },{
                name:'在线考试',
                id:'1',
                DISPLAYURL:'exam'
            },{
                name:'个人中心',
                id:'3',
                DISPLAYURL:'person'
            }],
            num:'',//当前点击的num
            domain:'',
            personinfo:'',
        }
    },
    methods: {
        gomenu(id){
            switch (id) {
                // case '0':
                //     this.$router.push({path:'shouye'})
                //     break;
                case '1':
                    this.$router.push('exam')
                    break;
                case '2':
                    this.$router.push('study')
                    break;
                case '3':
                    this.$router.push('person')
                    break;
            }
            window.sessionStorage.setItem('activeIndex',id)
        },
        exit(){
            this.util.postAjax({
                code:code.base3,
                url:code.exit,
          }).then((res) => {
            if(res.success == true){
              location.href=location.protocol+'//'+location.host+"/appportalweb/rest/Idsclient/reqLogout?reqUrl="+this.domain+"/lres/web/index.jsp?authType=lrespc";
            }
          })
        },
        //获取个人信息接口
        getuserinfo(){
            this.util.postAjax({
                code:code.base,
                url:code.personindexinfo,
            }).then(res => {
                if(res.success){
                    // console.log(res)
                    this.personinfo = res.item
                }
            });
        },
    },
    created () {
        this.getuserinfo();
        this.num = window.sessionStorage.getItem('activeIndex');
        this.domain = window.location.protocol+'//'+window.location.host;
    }
    
}
</script>
<style scoped>
.el-menu{
    background:rgba(26,119,255,1);
    
}
.el-menu--horizontal>.el-menu-item{
    color: #fff;
}
.myheader{
    width:100%;
    height:60px;
    background:rgba(26,119,255,1);
    box-shadow:0px 2px 5px 0px rgba(191,197,216,0.2);
}
.myheader>div{
    float: left;
}
.myheader_title,.myheader_exit{
    width: calc(calc(100% - 600px) / 2);
    height:100%;
    font-size:22px;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:60px;
    letter-spacing:1px;
    text-indent: 20px;
}
.myheader_title>i{
    display: inline-block;
    width:40px;
    height:36px;
    background:url(../../static/img/logo.png) no-repeat center center;
    background-size: cover;
    float: left;
    margin-left: 100px;
    margin-top: 10px;
    cursor: pointer;
}
.myheader_exit{
    float: right;
    padding-right: 100px;
    box-sizing: border-box;
    text-align: right;
    font-size:14px;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:60px;
    position: relative;
    cursor: pointer;
}
.myheader_exit>i{
    display: inline-block;
    width:40px;
    height:40px;
    background: url(../../static/img/person_title.png) no-repeat center center;
    background-size: cover;
    position: absolute;
    right: 140px;
    top: 10px;
}
.myheader_exit>span{
    display: inline-block;
    width: calc(100% - 100px);
    float: left;
    text-align: right;
}
.myheader_{
    width: 600px;
    height: 100%;
    float: left;
    padding-left: 75px;
    box-sizing: border-box;
}
.myheader_>li{
    display: inline-block;
    float: left;
    width: calc(100% / 4);
    height: 100%;
    line-height: 60px;
    font-size:16px;
    font-weight:400;
    color:rgba(255,255,255,1);
    text-align: center;
    cursor: pointer;
}
.myheader_>li.act{
    background:rgba(205,225,255,1);
    color:rgba(26,119,255,1);
}
</style>