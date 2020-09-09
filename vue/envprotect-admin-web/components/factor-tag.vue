<template>
  <!-- 抽屉弹框中的 排放因子tag信息 -->
  <div class="content">
    <el-tag
      :key="tag.NAME"
      v-for="tag in factorTags"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >{{tag.NAME}}</el-tag>
    <el-button class="add-tag" size="small" @click="showDialog" icon="el-icon-plus">排放因子</el-button>

    <el-dialog
      title="添加排放因子"
      class="mini-dialog"
      :visible="miniVisible"
      :before-close="hidePanel"
      :append-to-body="true"
      width="250px"
      center
      :close-on-click-modal="false"
      :modal="false"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="0px">
        <el-form-item
          prop="NAME"
          style="width:220px"
          :rules="[{ required: true, message: `排放因子名称不能为空`, trigger: 'blur'}]"
        >
          <el-input v-model="ruleForm.NAME" autocomplete="off" placeholder="排放因子名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" class="cover-btn" @click="handleSure('ruleForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "factor-tag",
  props: ["factorTags"],
  data() {
    return {
      miniVisible: false,
      ruleForm: { propName: "排放因子", NAME: "" }
    };
  },
  mounted() {},
  methods: {
    showDialog() {
      this.ruleForm.NAME = "";
      this.miniVisible = true;
    },
    handleClose(tag) {
      this.$emit("delFactor", tag);
    },

    handleSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("addFactor", this.ruleForm);
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
.content {
  position: relative;
}
.mini-dialog {
  margin-top: 340px;
  margin-right: -68%;
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
.el-tag .el-tag__close {
  color: #c8c5c6;
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
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  border: 1px solid #f1f1f1;
}
</style>

