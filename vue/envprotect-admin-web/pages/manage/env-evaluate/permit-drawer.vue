<template>
  <el-drawer
    :title="drawerTitle"
    custom-class="demo-drawer"
    :visible.sync="dialogVisible"
    :before-close="hidePanel"
    width="600px"
    ref="drawer"
    :wrapperClosable="false"
  >
    <div class="drawer-content">
      <el-form :model="initForm" ref="initForm" label-width="150px">
        <el-form-item
          label="纳入排污许可管理："
          prop="ALLOW"
          :rules="[{ required: true, message: '请选择是否纳入排污许可管理', trigger: 'blur'}]"
        >
          <el-radio-group v-model="initForm.ALLOW">
            <el-radio label="是">是</el-radio>
            <el-radio label="否">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="initForm.ALLOW=='是'"
          label="管理级别："
          prop="MANAGELEVEL"
          :rules="[{ required: true, message: '请选择管理级别', trigger: 'blur'}]"
        >
          <el-select v-model="initForm.MANAGELEVEL" placeholder="请选择管理级别">
            <el-option
              v-for="select in options"
              :key="select.label"
              :label="select.label"
              :value="select.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button
          type="primary"
          icon="el-icon-check"
          size="small"
          class="mg-r20"
          @click="save('initForm')"
        >保存</el-button>
        <el-button
          plain
          size="small"
          icon="el-icon-refresh-right"
          @click="handleRest('initForm')"
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
  props: ["dialogVisible", "parentForm", "ENVPATH", "drawerTitle", "company"],
  data() {
    return {
      initForm: {},
      radioItems: ["是", "否"],
      options: [
        { value: "0", label: "重点管理" },
        { value: "1", label: "简化管理" },
        { value: "2", label: "登记管理" }
      ]
    };
  },

  mounted() {
    if (this.parentForm.ID) {
      this.initForm = JSON.parse(JSON.stringify(this.parentForm));
    }
  },
  methods: {
    handleRest() {
      this.$refs["initForm"].resetFields();
    },
    add() {
      let path = `env.${this.ENVPATH}.add`;
      this.initForm.COMPANYID = this.company.ID;
      let params = {
        [this.ENVPATH]: this.initForm
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
      let path = `env.${this.ENVPATH}.update`;
      this.initForm.COMPANYID = this.company.ID;
      let params = {
        [this.ENVPATH]: this.initForm
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
          if (this.initForm && this.initForm.ID) {
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
  margin-top: 10px;
  line-height: normal;
}
</style>

