<template>
  <el-dialog title="成员维护" :visible.sync="dialogVisible" :before-close="hidePanel" width="600px">
    <div class="title">
      <span class="opacity_65">人事</span>
    </div>
    <ul id="demo" v-for="(treelist, index) in treeData" :key="index">
      <li>
        <el-checkbox
          class="title-box"
          :indeterminate="isIndeterminate"
          v-model="checkAll"
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
import { saveUserRole, getRole } from "@/api/auth";
export default {
  name: "tree-auth",
  props: ["treeData", "dialogVisible"],
  data() {
    return {
      checkAll: false,
      checkedItems: [],
      // checkedItems: ["res1-1", "res2-1"],
      isIndeterminate: false
    };
  },
  mounted() {
    console.log("ss6666", this.treeData);
  },
  computed: {
    // isFolder: function() {
    //   console.log("rrr12222222", this.treelist.children);
    //   return this.treelist.children && this.treelist.children.length;
    // }
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
      // let nochecked  = this.checkedItems.concat(childrenIds);
      this.checkedItems = val ? curChecked : delChecked;
      console.log("this.checkedItems", this.checkedItems);
      this.isIndeterminate = false;
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
      this.checkAll = isAllChecked ? true : false;
      this.isIndeterminate = isAllChecked ? false : true;
      console.log("allChecked", allChecked);
      // console.log('tree', tree)
    },
    // 利用sync进行数据双向绑定，子组件修改dialogVisible的值，并响应到父组件
    hidePanel() {
      this.$emit("update:dialogVisible", false);
    },
    submit() {
      let param = {
        data: JSON.stringify({
          ROLEID: "role2",
          USERID: this.checkedItems
        })
      };
      saveUserRole(param).then(res => {
        if (res.success) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
        } else {
          this.$message.error("提交失败，请重试！");
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
  width: 570px;
  height: 32px;
  line-height: 30px;
}
</style>
