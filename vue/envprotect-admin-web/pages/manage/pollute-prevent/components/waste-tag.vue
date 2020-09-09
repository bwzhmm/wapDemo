<template>
  <!-- 污染物信息 -->
  <div class="content">
    <span class="blue-title-line mg-tp20">污染物信息</span>
    <el-tag
      :key="tag.ID"
      v-for="tag in wasteTags"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >{{tag.NAME}}</el-tag>
    <el-button class="add-tag" size="small" @click="showDialog" icon="el-icon-plus">污染物</el-button>
    <el-dialog
      class="mini-dialog"
      title="添加污染物"
      :visible="miniVisible"
      :before-close="hidePanel"
      :append-to-body="true"
      width="250px"
      center
      :close-on-click-modal="false"
      :modal="false"
    >
      <el-form :model="miniForm" ref="miniForm" label-width="0px">
        <el-form-item
          prop="NAME"
          style="width:220px"
          :rules="[{ required: true, message: `污染物名称不能为空`, trigger: 'blur'}]"
        >
          <el-input v-model="miniForm.NAME" autocomplete="off" placeholder="污染物名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" class="cover-btn" @click="handleSure('miniForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { service } from "@env/utils/request.js";
export default {
  name: "waste-tag",
  props: ["wasteTags", "wasteActive"],
  data() {
    return {
      active: 0,
      miniVisible: false,
      miniForm: { propName: "污染物", NAME: "" }
    };
  },
  mounted() {},
  methods: {
    showDialog() {
      this.miniForm.NAME = "";
      this.miniVisible = true;
    },
    //点击某项时
    handleClose(tag) {
      this.$emit("delTag", tag);
    },
    handleSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("addTag", this.miniForm);
          this.hidePanel();
        }
      });
    },
    hidePanel() {
      this.miniVisible = false;
    }
  }
};
</script>
<style scoped>
.mini-dialog {
  position: absolute;
  margin-top: 25vh;
}
.el-tag {
  background-color: #fffdff;
  border-color: #f1f1f1;
  display: inline-block;
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 14px;
  color: #333;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.el-tag::before {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: #1890ff;
  display: inline-block;
  margin-right: 10px;
}
.add-tag {
  color: #999;
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  border: 1px solid #f1f1f1;
}
</style>

