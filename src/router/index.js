import Vue from 'vue';
import VueRouter from 'vue-router';
import NavBar from '@/components/NavBar.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      NavBar,
      default: () => import('@/views/Home.vue'),
    },
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('@/views/Auth/SignIn.vue'),
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('@/views/Auth/SignUp.vue'),
  },
  {
    path: '/category',
    name: 'Category',
    components: {
      NavBar,
      default: () => import('@/views/Category.vue'),
    },
  },
  {
    path: '/watch/:id',
    components: {
      NavBar,
      default: () => import('@/views/Watch.vue'),
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
