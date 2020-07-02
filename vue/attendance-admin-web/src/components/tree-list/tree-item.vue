
      <template>
  <li>
    <el-checkbox
      class="title-box"
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
    >{{ treelist.label }}</el-checkbox>
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox
        v-for="city in treelist.children"
        :label="city.label"
        :key="city.id"
      >{{city.label}}</el-checkbox>
    </el-checkbox-group>
  </li>
</template>
<script>
const cityOptions = ["上海", "北京", "广州", "深圳"];
export default {
  name: "tree-item",
  props: ["treelist"],
  data() {
    return {
      checkAll: false,
      checkedCities: [],
      cities: cityOptions,
      isIndeterminate: true,
      checked: false,
      isOpen: false
    };
  },
  mounted() {
    console.log("ss6666", this.treelist);
  },
  computed: {
    isFolder: function() {
      console.log("rrr12222222", this.treelist.children);
      return this.treelist.children && this.treelist.children.length;
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    toggle: function() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      }
    },
    makeFolder: function() {
      if (!this.isFolder) {
        this.$emit("make-folder", this.treelist);
        this.isOpen = true;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.title-box {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 2px;
  margin: 10px auto;
  width: 570px;
  height: 32px;
  line-height: 30px;
}
</style>