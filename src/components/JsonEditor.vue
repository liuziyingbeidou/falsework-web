<template>

  <div>
    <p>vue-json-editor使用</p>
    <!--在模板中使用vue-json-editor-->
    <vue-json-editor v-model="json" :showBtns="true" @json-change="onJsonChange"></vue-json-editor>
  </div>
</template>

<script>

// 引入vue-json-editor模块
import vueJsonEditor from 'vue-json-editor'
export default {
  name: 'JsonEditor',
	data () {
	  json: {
	    msg: 'demo of jsoneditor'
	  }
	},

	// 注入vueJsonEditor组件
	components: {
	  vueJsonEditor
	},

	methods: {
	  onJsonChange (value) {
	    console.log('value:', value)
	  }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
