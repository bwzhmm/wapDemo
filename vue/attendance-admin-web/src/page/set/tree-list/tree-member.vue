<template>
  <el-dialog title="成员维护" :visible.sync="dialogVisible" :before-close="hidePanel" width="600px">
    <div class="title">
      <span class="opacity_65">{{curRole.NAME}}</span>
    </div>
    <ul id="demo" v-for="(treelist, index) in treeData" :key="index">
      <li>
        <el-checkbox
          class="title-box"
          :indeterminate="treelist.isIndeterminate"
          v-model="treelist.isCheckAll"
          @change="(val)=>{handleCheckAllChange(val,treelist)}"
        >{{ treelist.label }}</el-checkbox>
        <el-checkbox-group
          v-model="checkedItems"
          @change="(val)=>{handlecheckedItemsChange(val,treelist)}"
        >
          <el-checkbox
            class="content-label"
            v-for="item in treelist.children"
            :label="item.value"
            :key="item.value"
            :checked="item.checked"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hidePanel">取消</el-button>
      <el-button type="primary" @click="submit()">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveUserRole } from "@/api/auth";
export default {
  name: "tree-member",
  props: ["treeData", "dialogVisible", "curRole"],
  data() {
    return {
      checkedItems: []
    };
  },
  mounted() {
    console.log("tree-member", this.treeData);
  },

  methods: {
    //点击父节点 选中全部
    handleCheckAllChange(val, tree) {
      let childrenIds = tree.children.map(item => item.ID);
      let checkeds = this.checkedItems;
      let curChecked = checkeds.concat(childrenIds);
      const delChecked = [];
      checkeds.forEach(v => {
        if (childrenIds.indexOf(v) === -1) {
          delChecked.push(v);
        }
      });
      this.checkedItems = val ? curChecked : delChecked;
      tree.isIndeterminate = false;
    },

    //判断 子节点全都选中后 父节点也选中 // allChecked 所有勾选的ids
    handlecheckedItemsChange(allChecked, tree) {
      let childrenIds = tree.children.map(item => item.ID); //当前节点下的子节点的所有ids
      if (!Array.prototype.subsetTo) {
        Array.prototype.subsetTo = function(arr) {
          return this.every(v => arr.includes(v));
        };
      }
      if (!Array.prototype.includeTo) {
        Array.prototype.includeTo = function(arr) {
          return this.some(v => arr.includes(v));
        };
      }
      let isAllChecked = childrenIds.subsetTo(allChecked);
      let isIncludes = childrenIds.includeTo(allChecked); //半选
      // console.log("isIncludes", isIncludes);
      // console.log("isAllChecked", isAllChecked);
      // console.log("this.tree", tree);
      tree.isCheckAll = isAllChecked;
      tree.isIndeterminate = !isAllChecked && isIncludes;
    },
    // 利用sync进行数据双向绑定，子组件修改dialogVisible的值，并响应到父组件
    hidePanel() {
      this.$emit("update:dialogVisible", false);
    },
    submit() {
      console.log("this.checkedItems", this.checkedItems);
      let param = {
        data: JSON.stringify({
          ROLEID: this.curRole.ID,
          USERID: this.checkedItems
        })
      };
      saveUserRole(param).then(res => {
        if (res.success) {
          this.$emit("update:dialogVisible", false);
          this.$message({
            message: "提交成功",
            type: "success"
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  border-left: 3px solid #38adff;
  padding: 0 10px;
  margin-bottom: 20px;
}
.title-box {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 2px;
  margin: 10px auto;
  width: 560px;
  height: 32px;
  line-height: 30px;
  padding-left: 10px;
}
.el-checkbox-group {
  padding: 0 20px;
}
.content-label {
  width: 110px;
  margin: 10px;
}
</style>
