<template>
  <el-drawer
    :title="drawerTitle"
    custom-class="demo-drawer"
    :visible.sync="dialogVisible"
    :before-close="hidePanel"
    width="600px"
    ref="drawer"
  >
    <div class="drawer-content">
      <el-form :model="parentForm" ref="parentForm" label-width="150px">
        <template v-for="item in drawerCol">
          <el-form-item
            v-if="item.type=='radio'"
            :key="item.name"
            :label="`${item.title}：`"
            :prop="item.propName"
            :rules="[{ required: item.required, message: `${item.title}不能为空`, trigger: 'blur'}]"
          >
            <el-radio-group v-model="parentForm[item.propName]">
              <template v-for="(radio,index) in item.radioItems">
                <el-radio :label="radio" :key="index">{{radio}}</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="item.type=='select'"
            :key="item.name"
            :label="`${item.title}：`"
            :prop="item.propName"
            :rules="[{ required: item.required, message: `${item.title}不能为空`, trigger: 'blur'}]"
          >
            <el-select v-model="parentForm[item.propName]" :placeholder="item.placeholder">
              <el-option
                v-for="select in item.options"
                :key="select.value"
                :label="select.label"
                :value="select.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <div class="drawer-footer">
        <el-button
          type="primary"
          icon="el-icon-check"
          size="small"
          class="mg-r20"
          @click="save('parentForm')"
        >保存</el-button>
        <el-button
          plain
          size="small"
          icon="el-icon-refresh-right"
          @click="handleRest('parentForm')"
        >重置</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { service } from "@env/utils/request.js";
import { ENV } from "@env/utils/common.js";
export default {
  name: "permit-drawer",
  props: ["dialogVisible", "parentForm", "ENVPATH", "drawerTitle", "drawerCol"],
  data() {
    return {
      initForm: {}
    };
  },
  mounted() {},
  methods: {
    handleRest() {
      console.log("ENVPATH", this.ENVPATH);
      this.$refs["parentForm"].resetFields();
    },
    add() {
      let path = `env.${this.ENVPATH}.add`;
      let params = {
        [this.ENVPATH]: this.parentForm
      };
      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "添加成功"
          });
          this.hidePanel();
          this.handleRest();
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
      let path = `env.${this.ENVPATH}.edit`;
      let params = {
        [this.ENVPATH]: this.parentForm
      };
      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "编辑成功"
          });
          this.hidePanel();
          this.handleRest();
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
          if (this.parentForm.ID) {
            this.edit();
          } else {
            this.add();
          }
        }
      });
    }
  }
};
</script>
<style scoped>
.upload-tip {
  color: #cdcdcd;
}
</style>

