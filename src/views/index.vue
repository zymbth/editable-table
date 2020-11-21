<!-- 主页 -->
<template>
  <div>
  	<router-link :to="{name:'editable'}">可编辑表格v1</router-link>
    <br />
    <router-link :to="{name:'editable_v2'}">可编辑表格v2</router-link>
    <br />
    <router-link :to="{name:'editable_v2_process'}">可编辑表格v2过程</router-link>
  	<br />
  	<router-link :to="{name:'excel'}">Excel数据导入</router-link>
  </div>
</template>

<script>

export default {
  components: {},
  data() {
    return {
    };
  },
  mounted() {},
  methods: {},
  watch: {},
  computed: {},
};
</script>

<style scoped>
</style>
