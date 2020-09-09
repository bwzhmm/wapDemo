<template>
  <!-- 编辑、新增表单信息抽屉 -->
  <el-drawer
    :title="drawerTitle"
    custom-class="demo-drawer"
    class="drawer"
    v-if="dialogVisible"
    :visible.sync="dialogVisible"
    :before-close="hidePanel"
    width="600px"
    ref="drawer"
    :wrapperClosable="false"
  >
    <div class="drawer-content">
      <el-form
        :model="curForm"
        ref="curForm"
        :labelPosition="drawerCol[0].labelPosition || 'right'"
      >
        <template v-for="item in drawerCol">
          <el-form-item
            v-if="item.type=='input'"
            :key="item.name"
            :label="`${item.title}：`"
            :prop="item.propName"
            :label-width="item.labelWidth ||'120px'"
            :rules="[{ required: item.required, message: `${item.title}不能为空`, trigger: 'blur'}]"
          >
            <el-input v-model="curForm[item.propName]" :placeholder="item.placeholder">
              <span slot="suffix">{{item.suffix || ''}}</span>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="item.type=='number'"
            :key="item.name"
            :label="`${item.title}：`"
            :prop="item.propName"
            :label-width="item.labelWidth ||'120px'"
            :rules="[{ required: item.required, message: `${item.title}不能为空`, trigger: 'blur'},
            ]"
          >
            <el-input
              v-model="curForm[item.propName]"
              :placeholder="item.placeholder"
              oninput="value=value.replace(/[^\d.]/g, '')"
            >
              <span slot="suffix">{{item.suffix || ''}}</span>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="item.type=='date'"
            :key="item.name"
            :label="`${item.title}：`"
            :prop="item.propName"
            :label-width="item.labelWidth ||'120px'"
            :rules="[{ required: item.required, message: `${item.title}不能为空`, trigger: 'blur'}]"
          >
            <el-date-picker
              class="query-datapicker"
              v-model="curForm[item.propName]"
              value-format="yyyyMMdd"
              type="date"
              :placeholder="item.placeholder"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            v-if="item.type=='daterange'"
            :key="item.name"
            :label="`${item.title}：`"
            :prop="item.propName"
            :label-width="item.labelWidth ||'120px'"
            :rules="[{ required: item.required, message: `${item.title}不能为空`, trigger: 'blur'}]"
          >
            <el-date-picker
              class="query-datapicker"
              v-model="curForm[item.propName]"
              value-format="yyyyMMdd"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :placeholder="item.placeholder"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            v-if="item.type=='textarea'"
            :key="item.name"
            :label="`${item.title}：`"
            :prop="item.propName"
            :label-width="item.labelWidth ||'120px'"
            :rules="[{ required: item.required, message: `${item.title}不能为空`, trigger: 'blur'}]"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              v-model="curForm[item.propName]"
              :placeholder="item.placeholder"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="item.type=='upload'"
            :key="item.name"
            :label="`${item.title}：`"
            :prop="item.propName"
            :label-width="item.labelWidth ||'120px'"
            :rules="[{ required: item.required, message: `${item.title}不能为空`, trigger: 'blur'}]"
          >
            <base-upload
              :url="uploadUrl"
              :size="10*1024"
              :lowSize="10"
              :exts="fileType"
              btnText="点击上传"
              :isBtn="true"
              @done="finish"
            ></base-upload>
            <div class="upload-tip">大小不超过10M，支持.rar .zip .doc .docx .pdf .jpg .jpeg .png</div>
            <span v-if="curForm.FILEID">
              <i class="el-icon-paperclip"></i>
              <span :title="fileTitle" class="file-title">{{fileTitle | ellipsis}}</span>
              <i class="el-icon-close del-file" @click="delFile"></i>
            </span>
          </el-form-item>
          <el-form-item
            v-if="item.type=='uploadImg'"
            :key="item.name"
            :label="`${item.title}：`"
            :prop="item.propName"
            :label-width="item.labelWidth ||'120px'"
            :rules="[{ required: item.required, message: `${item.title}不能为空`, trigger: 'blur'}]"
          >
            <base-upload
              :url="uploadUrl"
              :fileId="fileID || curForm.FILEID"
              :size="10*1024"
              :lowSize="10"
              :exts="imgType"
              btnText="上传图片"
              :isBtn="false"
              @done="finish"
              @deleteFile="deleteImg"
            ></base-upload>
            <div class="upload-tip">支持.bmp .jpeg .jpg .gif .png，大小不超过10M</div>
          </el-form-item>
          <el-form-item
            v-if="item.type=='select'"
            :key="item.name"
            :label="`${item.title}：`"
            :prop="item.propName"
            :label-width="item.labelWidth ||'120px'"
            :rules="[{ required: item.required, message: `${item.title}不能为空`, trigger: 'blur'}]"
          >
            <el-select
              v-model="curForm[item.propName]"
              :placeholder="item.placeholder"
              style="width:100%"
            >
              <el-option v-for="value in item.options" :key="value" :label="value" :value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="item.type=='select-remote'"
            :key="item.name"
            :label="`${item.title}：`"
            :prop="item.propName"
            :label-width="item.labelWidth ||'120px'"
            :rules="[{ required: item.required, message: `${item.title}不能为空`, trigger: 'blur'}]"
          >
            <el-select
              filterable
              remote
              reserve-keyword
              :remote-method="(query)=>{querySearchAsync(query,item.DICTID)}"
              v-model="curForm[item.propName]"
              :placeholder="item.placeholder"
              @visible-change="(val)=>{selectChange(val,item.DICTID)}"
              style="width:100%"
            >
              <el-option
                v-for="remote in remoteOptions"
                :key="remote.value"
                :label="remote.label"
                :value="remote.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="item.type=='factor'"
            :key="item.name"
            :label="`${item.title}：`"
            :prop="item.propName"
            :label-width="item.labelWidth ||'120px'"
            :rules="[{ required: item.required, message: `${item.title}不能为空`, trigger: 'blur'}]"
          >
            <factor-tag
              :factorTags="curForm[item.propName]"
              @addFactor="addFactor"
              @delFactor="delFactor"
            />
          </el-form-item>
        </template>
      </el-form>
      <div class="drawer-footer">
        <el-button
          type="primary"
          icon="el-icon-check"
          size="small"
          class="mg-r20"
          @click="save('curForm')"
        >保存</el-button>
        <el-button plain size="small" icon="el-icon-refresh-right" @click="handleRest('curForm')">重置</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { service } from "@env/utils/request.js";
import { ENV } from "@env/utils/common.js";
import BaseUpload from "@env/components/BaseUpload";
import factorTag from "./factor-tag";

export default {
  name: "update-drawer",
  props: [
    "dialogVisible",
    "parentForm",
    "ENVPATH",
    "drawerTitle",
    "drawerCol",
    "company",
    "wasteID",
    "factorPath"
  ],
  components: { BaseUpload, factorTag },
  data() {
    return {
      fileName: {}, //上传文件
      fileID: "", //上传图片
      fileType: "rar|zip|doc|docx|pdf|jpg|jpeg|png",
      imgType: "bmp|jpeg|jpg|gif|png",
      uploadUrl: `${window.global.ApiUrl}file/fileUpload`,
      remoteOptions: [],
      fileTitle: "",
      curForm: {}
    };
  },
  //监听父组件的数据变化,初始化表单数据为父组件数据，重置表单为初始化状态,id为编辑，Type为污染物有无组织
  watch: {
    parentForm: function(newVal, oldVal) {
      if (this.parentForm.ID || this.parentForm.TYPE) {
        this.curForm = JSON.parse(JSON.stringify(this.parentForm));
        this.$forceUpdate();
        this.fileID = this.parentForm.FILEID || "";
        if (this.parentForm.FILEID) {
          this.getFileDetail(this.parentForm.FILEID);
        }
      } else {
        this.fileID = "";
        this.curForm = {};
      }
    }
  },

  filters: {
    ellipsis(value) {
      if (!value) {
        return "";
      }
      if (value.length > 20) {
        return value.slice(0, 20) + "...";
      } else {
        return value;
      }
    }
  },
  methods: {
    //初次点击展开时调接口
    selectChange(val, DICTID) {
      if (val) {
        this.querySearchAsync("", DICTID);
      }
    },
    // 可查询的下拉搜索框
    querySearchAsync(queryString, DICTID) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        let path = `basic.CM_DICTV.list`;
        let params = {
          FILTER: { KEYWORD: queryString },
          CM_DICTV: { DICTID: DICTID }
        };
        service(params, path).then(res => {
          let tempData = res.data.items.map(item => {
            return {
              label: `${item.CODE} ${item.NAME}`,
              value: item.CODE
            };
          });
          this.remoteOptions = tempData;
        });
      }, 10 * Math.random());
    },

    // 获取文件详情
    getFileDetail(fileId) {
      let path = `fileweb.CM_FILE.detail`;
      let params = {
        CM_FILE: {
          ID: fileId
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.fileTitle = res.data.TITLE;
          this.$forceUpdate();
        }
      });
    },
    // 图片上传完成后 ，新增上传完成后
    finish(res) {
      if (res.success) {
        this.fileID = res.item.ID;
        this.curForm.FILEID = res.item.ID;
        this.fileTitle = res.item.TITLE;
        this.$forceUpdate();
        this.$message({
          type: "success",
          message: "上传成功，并覆盖已上传的文件！"
        });
      }
    },
    deleteImg() {
      this.fileID = "";
      this.curForm.FILEID = "";
    },
    delFile() {
      this.fileTitle = "";
      this.curForm.FILEID = "";
    },
    // 重置图片和文件也都清空
    handleRest() {
      this.curForm = JSON.parse(JSON.stringify(this.parentForm));
      if (!this.curForm.FILEID) {
        this.fileID = "";
        this.fileTitle = "";
        this.curForm.FILEID = "";
      }
    },
    // 参数统一处理  污染物不传企业id，只传对应的污染源ID
    handleParams() {
      if (this.factorPath) {
        this.curForm[`${this.factorPath}`] =
          this.curForm[`${this.factorPath}`] || [];
      }

      if (this.wasteID && this.wasteID.ID) {
        this.curForm[this.wasteID.path] = this.wasteID.ID;
      } else {
        this.curForm.COMPANYID = this.company.ID;
      }
      if (this.curForm.RANGETIME) {
        this.curForm.STARTTIME = this.curForm.RANGETIME[0];
        this.curForm.ENDTIME = this.curForm.RANGETIME[1];
        delete this.curForm.RANGETIME; // 表单展示字段
      }
    },

    add() {
      let path = `env.${this.ENVPATH}.add`;
      this.handleParams();

      let params = {
        [this.ENVPATH]: this.curForm
      };
      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "添加成功"
          });
          this.hidePanel();
          // this.handleRest();
          this.$emit("flushList");
        } else {
          this.$message({
            type: "error",
            message: "添加失败"
          });
        }
      });
    },

    edit() {
      let path = `env.${this.ENVPATH}.update`;
      this.handleParams();
      let params = {
        [this.ENVPATH]: this.curForm
      };
      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "编辑成功"
          });
          this.hidePanel();
          // this.handleRest();
          this.$emit("flushList");
        }
      });
    },

    // 利用sync进行数据双向绑定，子组件修改dialogVisible的值，并响应到父组件
    hidePanel() {
      this.$emit("update:dialogVisible", false);
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.curForm.ID) {
            this.edit();
          } else {
            this.add();
          }
        }
      });
    },
    addFactor(miniForm) {
      this.curForm[`${this.factorPath}`] =
        this.curForm[`${this.factorPath}`] || [];
      let curFactorList = this.curForm[`${this.factorPath}`].map(
        item => item.NAME
      );
      if (curFactorList.includes(miniForm.NAME)) {
        this.$message({
          type: "warning",
          message: "排放因子重复了！"
        });
        return false;
      }
      this.curForm[`${this.factorPath}`].push({
        NAME: miniForm.NAME
      });
      this.$forceUpdate();
    },
    delFactor(factor) {
      let factorTags = this.curForm[`${this.factorPath}`]; // 污染因子对应的地址对象
      let newArr = factorTags.filter(item => item.NAME !== factor.NAME);
      this.curForm[`${this.factorPath}`] = newArr;
      this.$forceUpdate();
    }
  }
};
</script>
<style scoped>
.upload-tip {
  color: #cdcdcd;
  line-height: normal;
  margin-top: 10px;
}
.file-title {
  color: #000;
  opacity: 0.65;
}
.del-file {
  cursor: pointer;
  margin-left: 10px;
}
</style>

