import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import JsonFormat from '@/components/JsonFormat'
import First from '@/components/First'

Vue.use(Router)

export default new Router({
	mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
    	path: '/first',
    	name: 'First',
    	component: First
    },
    {
    	path: '/jsonformat',
    	name: 'JsonFormat',
    	component: JsonFormat
    }
  ]
})
