import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/pages/HelloWorld'
import Sort from '@/pages/sort/index.vue'

Vue.use(Router)

const views = ['Selection', 'Monkey', 'Bubble', 'Qsort', 'Insert', 'Heap', 'Merge', 'Radix']
const desc = ['Selection']

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/sort',
      component: Sort,
      children: views.map(name => ({
        path: name.toLowerCase(),
        name,
        component: require(`@/pages/sort/${name}`).default
      }))
    },
    {
      path: '/desc',
      component: Sort,
      children: desc.map(name => ({
        path: name.toLowerCase(),
        name: 'desc_' + name,
        component: require(`@/pages/desc/${name}`).default
      }))
    }
  ]
})
