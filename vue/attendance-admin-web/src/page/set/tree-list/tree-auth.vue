<template>
  <el-dialog title="权限维护" :visible.sync="dialogVisible" :before-close="hidePanel" width="600px">
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
import { saveAuth } from "@/api/auth";
export default {
  name: "tree-auth",
  props: ["treeData", "dialogVisible", "curRole"],
  data() {
    return {
      checkedItems: []
    };
  },
  mounted() {
    console.log("treeData111", this.treeData);
  },

  methods: {
    //点击父节点 选中全部
    handleCheckAllChange(val, tree) {
      // console.log("val", val);
      // console.log("tree", tree);
      let childrenIds = tree.children.map(item => item.RESID);
      let checkeds = this.checkedItems;
      let curChecked = checkeds.concat(childrenIds);
      const delChecked = [];
      checkeds.forEach(v => {
        if (childrenIds.indexOf(v) === -1) {
          delChecked.push(v);
        }
      });
      this.checkedItems = val ? curChecked : delChecked;
      // console.log("this.checkedItems", this.checkedItems);
      tree.isIndeterminate = false;
    },

    //判断 子节点全都选中后 父节点也选中 // allChecked 所有勾选的ids
    handlecheckedItemsChange(allChecked, tree) {
      let childrenIds = tree.children.map(item => item.RESID); //当前节点下的子节点的所有ids
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
      let isAllChecked = childrenIds.subsetTo(allChecked); //全选
      let isIncludes = childrenIds.includeTo(allChecked); //半选
      tree.isCheckAll = isAllChecked;
      tree.isIndeterminate = !isAllChecked && isIncludes;
    },

    // 利用sync进行数据双向绑定，子组件修改dialogVisible的值，并响应到父组件
    hidePanel() {
      this.$emit("update:dialogVisible", false);
    },

    submit() {
      console.log("this.treeData", this.treeData);
      console.log("this.checkedItems", this.checkedItems);
      let parentItem = [];
      // 循环树中父节点的状态是半选或全选时，即有子节点勾选的父节点都要传
      this.treeData.forEach(item => {
        if (item.isCheckAll || item.isIndeterminate) {
          parentItem.push(item.RESID);
        }
      });
      let allCheckedIDs = this.checkedItems.concat(parentItem);
      console.log("allCheckedIDs", allCheckedIDs);
      let param = {
        data: JSON.stringify({
          ROLEID: this.curRole.ID,
          RESID: allCheckedIDs
        })
      };
      saveAuth(param).then(res => {
        if (res.success) {
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
