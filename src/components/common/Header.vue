<template>
    <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect" router>
			<el-menu-item index="/">首页</el-menu-item>
			<el-submenu index="json">
			    <template slot="title">JSON</template>
			    <el-menu-item index="jsonformat">格式化校验</el-menu-item>
			    <el-menu-item index="jsoneditor">在线编辑器</el-menu-item>
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
      activeIndex: '/'
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
