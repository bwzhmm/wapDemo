<template>
<div class="bind_content clearfix">
    <div class="bind_left"></div>
    <div class="bind_right">
        <div class="bind_right_">
            <h3>登 录</h3>
            <p>账号</p>
            <el-input placeholder="请输入账号" v-model="username">
                <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
            <p class="pwd">密码</p>
            <el-input placeholder="请输入密码" v-model="password" show-password>
                <i slot="prefix" class="el-input__icon el-icon-pwd"></i>
            </el-input>
            <el-button type="primary" class="loginbtn" id="bindlogin" @click="bind">登 录</el-button>
        </div>
        <div class="bottom_fix">Copyright © 2020 南京昂克软件 All Rights Reserved </div>
    </div>
</div>
</template>

<script>
import code from '../../util/code'
import Base from 'js-base64'
import qs from 'qs'
export default {
    data() {
        return {
            Domain:window.base.mainDomain,
            TID:'',
            username:'',//用户名
            password:'',//密码
        }
    },
    methods: {
        bind(){
            if(this.username==''){
                this.$message({
                    message: '请输入证件号！！',
                    type: 'warning'
                });
            }else if(this.password==''){
                this.$message({
                    message: '请输入密码！！',
                    type: 'warning'
                });
            }else{
                document.getElementById('bindlogin').setAttribute('disabled',true);
                document.getElementById('bindlogin').style.background = '#ccc';
                this.util.postAjax({
                    code:code.base2,
                    url:code.login,
                    isRep:true,
                    headers: {
                        'Content-type': 'application/json;charset=UTF-8'
                    },
                    data:{
                        name:this.username,
                        password:this.password,
                    }
                })
                .then(res => {
                    if(res.success){
                        res.item.TID = this.TID;//在返回数据的基础上加TID
                        var params = Base.Base64.encode(encodeURI(JSON.stringify(res.item)));
                        window.location.href = window.location.protocol+'//'+window.location.host+'/lres/web/index.jsp?authType=lrespc&param='+params;
                        document.getElementById('bindlogin').removeAttribute('disabled');
                        document.getElementById('bindlogin').style.background = 'rgba(0,109,255,1)';
                    }else{
                        // console.log('tag', res.message)
                        if(res.state=='1'){//state:1表示用户账号或密码有误，2表示已经绑定
                            this.$message.error('用户账号或密码有误');
                        }else{
                            this.$message.error('用户账号已绑定');
                        }
                        document.getElementById('bindlogin').removeAttribute('disabled');
                        document.getElementById('bindlogin').style.background = 'rgba(0,109,255,1)';
                    }
                })
                .catch(error => {
                    this.$message.error('用户名或密码错误！');
                    document.getElementById('bindlogin').removeAttribute('disabled');
                    document.getElementById('bindlogin').style.background = 'rgba(0,109,255,1)';
                });
            }
        },
        
    },
    created() {
        this.util.postAjax({
            code:code.base2,
            url:code.detailByUrl,
            data:{INDEXURL:this.Domain}
        }).then(res => {
            this.TID = res.item.ID;
        }).catch(res=>{
            this.$message.error('登陆异常');
            location.reload() 
        })
    },
}
</script>

<style scoped>
.bind_content {
    position: fixed;
    width: 100%;
    height: 100% !important;
    top: 0;
    left: 0;
    padding: 0 !important;
}

.bind_left {
    width: 65%;
    height: 100%;
    background: url(../../../static/img/login.png) no-repeat center center;
    background-size: cover;
    float: left;
}

.bind_right {
    width: 35%;
    height: 100%;
    float: left;
    position: relative;
    background: #fff;
}
.bind_right_ {
    width: 70%;
    height: 60%;
    margin-top: 20%;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}

.bind_right_>h3 {
    width: 100%;
    height: 59px;
    font-size: 42px;
    font-weight: 500;
    color: rgba(31, 35, 47, 1);
    line-height: 59px;
    letter-spacing: 10px;
    text-align: center;
    margin-bottom: 73px;
}

.bind_right_>p {
    width: 100%;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(98, 101, 109, 1);
    line-height: 20px;
    margin: 10px 0;
}
.bind_right_>p.pwd{
    margin-top: 30px;
}
.el-icon-user,.el-icon-pwd{
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url(../../../static/img/user_icon.png) no-repeat center center;
    background-size: cover;
    margin-top: 17.5px;
    margin-left: 5px;
}
.el-icon-pwd{
    background: url(../../../static/img/lock_icon.png) no-repeat center center;
    background-size: contain;
}
.loginbtn{
    width: 100%;
    margin-top: 70px;
    background:linear-gradient(90deg,rgba(45,171,255,1) 0%,rgba(20,114,255,1) 100%);
    box-shadow:0px 0px 10px 0px rgba(205,226,255,1);
}
.bottom_fix{
    width: 100%;
    position: absolute;
    bottom: 70px;
    text-align: center;
    left: 0;
    font-size:12px;
    font-weight:500;
    color:rgba(165,173,186,1);
    line-height:17px;
}
</style>
