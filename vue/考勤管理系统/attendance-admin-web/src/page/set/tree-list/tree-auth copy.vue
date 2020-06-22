<template>
  <el-dialog title="权限维护" :visible.sync="dialogVisible" :before-close="hidePanel" width="600px">
    <div class="title">
      <span class="opacity_65">普通员工</span>
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
            v-for="item in treelist.children"
            :label="item.value"
            :key="item.value"
            :checked="item.checked"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="submit()">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveAuth, getRole } from "@/api/auth";
export default {
  name: "tree-auth",
  props: ["treeData", "dialogVisible"],
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
      console.log("val", val);
      console.log("tree", tree);
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
      console.log("this.checkedItems", this.checkedItems);
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
      let isAllChecked = childrenIds.subsetTo(allChecked);
      console.log("hello", isAllChecked); //ture
      tree.isCheckAll = isAllChecked ? true : false;
      tree.isIndeterminate = isAllChecked ? false : true;
      console.log("allChecked", allChecked);
      console.log("tree", tree);
    },

    // 利用sync进行数据双向绑定，子组件修改dialogVisible的值，并响应到父组件
    hidePanel() {
      this.$emit("update:dialogVisible", false);
    },

    submit() {
      console.log("this.checkedItems", this.checkedItems);
      //      let tempArry = JSON.parse(JSON.stringify(this.checkedItems));
      //   this.treeData.forEach(item => {

      //   });
      let param = {
        data: JSON.stringify({
          ROLEID: "role1",
          RESID: this.checkedItems
        })
      };
      //   saveAuth(param).then(res => {
      //     if (res.success) {
      //       this.$message({
      //         message: "提交成功",
      //         type: "success"
      //       });
      //     } else {
      //       this.$message.error("提交失败，请重试！");
      //     }
      //   });
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
  width: 570px;
  height: 32px;
  line-height: 30px;
}
</style>
