<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "App",
  methods: {},
  created() {
    this.$store.dispatch("getUserInfo");
  }
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>>
