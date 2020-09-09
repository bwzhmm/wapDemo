<template>
  <div class="tree-wrapper">
    <span class="blue-title-line">{{curRole.NAME}}</span>
    <ul id="demo" v-for="(tree, index) in treeData" :key="index">
      <li>
        <el-checkbox
          class="title-box"
          :indeterminate="tree.isIndeterminate"
          v-model="tree.isCheckAll"
          @change="(val)=>{handleCheckAllChange(val,tree)}"
        >{{ tree.NAME }}</el-checkbox>
        <el-checkbox-group
          v-model="checkedItems"
          @change="(val)=>{handlecheckedItemsChange(val,tree)}"
        >
          <el-checkbox
            class="content-label"
            v-for="item in tree.children"
            :label="item.ID"
            :key="item.ID"
            :checked="item.checked"
          >{{item.NAME}}</el-checkbox>
        </el-checkbox-group>
      </li>
    </ul>
    <div class="tree-footer">
      <el-button type="primary" @click="save()" icon="el-icon-check" size="small">保存</el-button>
      <el-button @click="handleReset()" icon="el-icon-refresh-right" size="small">重置</el-button>
    </div>
  </div>
</template>

<script>
import { service, logService } from "@env/utils/request.js";
export default {
  name: "tree-auth",
  props: [
    "treeData",
    "initCheckeds",
    "initHalfChecked",
    "initAllChecked",
    "curRole"
  ],
  data() {
    return {
      checkedItems: []
    };
  },
  mounted() {},

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
      this.$set(tree, "isIndeterminate", false);
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
      let isAllChecked = childrenIds.subsetTo(allChecked); //全选
      let isIncludes = childrenIds.includeTo(allChecked);
      let isIndeterminate = !isAllChecked && isIncludes; //半选
      this.$set(tree, "isCheckAll", isAllChecked);
      this.$set(tree, "isIndeterminate", isIndeterminate);
      this.$forceUpdate();
    },

    // 重置到初始化状态，checked重置，半选 和全选判断重置
    handleReset(tree) {
      this.checkedItems = JSON.parse(JSON.stringify(this.initCheckeds));
      this.treeData.forEach(tree => {
        if (this.initAllChecked.includes(tree.ID)) {
          this.$set(tree, "isCheckAll", true);
        } else {
          this.$set(tree, "isCheckAll", false);
        }
        if (this.initHalfChecked.includes(tree.ID)) {
          this.$set(tree, "isIndeterminate", true);
        } else {
          this.$set(tree, "isIndeterminate", false);
        }
      });
      this.$forceUpdate();
    },

    save() {
      let parentItem = [];
      // 循环树中父节点的状态是半选或全选时，即有子节点勾选的父节点都要传
      this.treeData.forEach(item => {
        if (item.isCheckAll || item.isIndeterminate) {
          parentItem.push(item.ID);
        }
      });
      let allCheckedIDs = this.checkedItems.concat(parentItem);
      let uniqueCheckedIDs = [...new Set(allCheckedIDs)];
      let resIDList = uniqueCheckedIDs.map(item => {
        return { ROLEID: "", RESID: item };
      });
      let path = "authweb.AU_ROLERES.SAVEROLERES";
      let params = {
        AU_ROLE: {
          ID: this.curRole.ID,
          "AU_ROLERES#ROLEID": resIDList
        }
      };
      service(params, path).then(res => {
        if (res.success) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          //1登录 2新增 3删除 4修改
          let logparams = {
            ENV_LOG: {
              TYPE: "4",
              MODULE: "设置中心>角色权限>权限分配",
              CONTENT: `修改权限：${this.curRole.NAME}`
            }
          };
          logService(logparams);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.tree-wrapper {
  background: #fff;
  padding: 0 20px;
  min-height: 750px;
}
.title-box {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 2px;
  margin: 10px auto;
  width: 100%;
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
.tree-footer {
  margin: 20px 0px;
}
</style>
