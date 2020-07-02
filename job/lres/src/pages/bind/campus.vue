<template>
<div class="campus_content clearfix">
    <div class="campus_left"></div>
    <div class="campus_right">
        <div class="campus_right_">
            <h3>绑定</h3>
            <p>选择校区</p>
            <el-select v-model="campus" placeholder="请选择">
                <i slot="prefix" class="el-input__icon el-icon-campus"></i>
                <el-option
                    class="seloption"
                    v-for="item in list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-button type="primary" id="bind" class="campusloginbtn" @click="gobind">绑 定</el-button>
        </div>
        <div class="campusbottom_fix">Copyright © 2020 南京昂克软件 All Rights Reserved</div>
    </div>
</div>
</template>

<script>
import code from '../../util/code'
export default {
    data() {
        return {
            campus: '',
            show:false,
            list: [],
        }
    },
    methods: {
        //绑定
        gobind(){
            if(this.campus){
                document.getElementById('bind').setAttribute('disabled',true);
                this.util.postAjax({
                    code:code.base,
                    url:code.bindUserCampus,
                    data:{campusId:this.campus}
                }).then(res => {
                    this.$router.push('study');
                    window.sessionStorage.setItem('activeIndex','2')
                })
            }else{
                this.$message({
                    message: '警告哦，请选择校区',
                    type: 'warning'
                });
            }
        }
    },
    created () {
        //获取个人信息
        this.util.postAjax({
            code:code.base,
            url:code.personinfo,
        }).then(res => {
            if(res.item.campusId){
                this.show = false;
                this.$router.push('study');
                window.sessionStorage.setItem('activeIndex','2')
            }else{
                this.show = true;
                this.util.postAjax({
                    code:code.base,
                    url:code.campuslist,
                }).then(response => {
                    this.list = response.items;
                })
            }
        }).catch(res=>{
            this.$message.error('登陆异常');
        })
    }

}
</script>

<style scoped>
.campus_content {
    position: fixed;
    width: 100%;
    height: 100% !important;
    top: 0;
    left: 0;
    padding: 0 !important;
}
.el-select{
    width: 100%;
    height: 49px;
}
.seloption{
    width: 100%;
}
.campus_left {
    width: 65%;
    height: 100%;
    background: url(../../../static/img/login.png) no-repeat center center;
    background-size: cover;
    float: left;
}

.campus_right {
    width: 35%;
    height: 100%;
    float: left;
    position: relative;
}

.campus_right_ {
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
.campus_right_>h3 {
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

.campus_right_>p {
    width: 100%;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(98, 101, 109, 1);
    line-height: 20px;
    margin: 10px 0;
}
.el-icon-campus{
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url(../../../static/img/campus.png) no-repeat center center;
    background-size: cover;
    margin-top: 13px;
    margin-left: 5px;
}
.campusloginbtn{
    width: 100%;
    margin-top: 70px;
    background:linear-gradient(90deg,rgba(45,171,255,1) 0%,rgba(20,114,255,1) 100%);
    box-shadow:0px 0px 10px 0px rgba(205,226,255,1);
}
.campusbottom_fix{
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
