<template>
  <el-dialog
    :title="`添加${ruleForm.propName}`"
    :visible.sync="dialogVisible"
    :before-close="hidePanel"
    center
    :close-on-click-modal="false"
    :modal="false"
    width="245px"
  >
    <el-form :model="ruleForm" ref="ruleForm" label-width="0px">
      <el-form-item
        prop="NAME"
        style="width:226px"
        :rules="[{ required: true, message: `${ruleForm.propName}名称不能为空`, trigger: 'blur'}]"
      >
        <el-input
          v-model="ruleForm.NAME"
          autocomplete="off"
          :placeholder="ruleForm.propName + '名称'"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" class="cover-btn" @click="handleBtn('ruleForm')">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { service } from "@env/utils/request.js";
export default {
  name: "miniDialog",
  props: ["dialogVisible", "ruleForm"],
  data() {
    return {};
  },

  methods: {
    hidePanel() {
      this.$emit("update:dialogVisible", false);
    },
    handleBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("handleSure", this.ruleForm);
          this.$refs[formName].resetFields();
          this.hidePanel();
        }
      });
    }
  }
};
</script>

