import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Budget from '../views/Budget.vue'
import Buckets from '../views/Buckets.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/budget',
    name: 'Budget',
    component: Budget
  },
  {
    path: '/buckets',
    name: 'buckets',
    component: Buckets
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
