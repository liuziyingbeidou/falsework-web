<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
			<el-menu-item index="1">首页</el-menu-item>
			<el-submenu index="2">
		    <template slot="title">JSON</template>
		    <el-menu-item index="2-1">格式化校验</el-menu-item>
		    <el-menu-item index="2-2">在线编辑器</el-menu-item>
		    <el-menu-item index="2-3">XML互转</el-menu-item>
		    <el-menu-item index="2-3">excel转json</el-menu-item>
		    <el-menu-item index="2-3">json转excel</el-menu-item>
		  </el-submenu>
    </el-menu>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  methods: {
  	handleSelect(key,keyPath){
  		console.log(key,keyPath);
  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
