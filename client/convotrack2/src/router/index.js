import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    children: [
      {
        path: '',
        redirect: '/dashboard/ai-agent'
      },
      {
        path: 'ai-agent',
        name: 'AIAgent',
        component: () => import('../views/AIAgent.vue')
      },
      {
        path: 'ai-agent/create',
        name: 'AIAgentCreate',
        component: () => import('../views/AIAgentCreate.vue')
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('../views/Chat.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
