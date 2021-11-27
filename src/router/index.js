import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SignUp from '../views/SignUp.vue';
import SignIn from '../views/SignIn.vue';
import Dashboard from '../views/Dashboard.vue';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
   {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
         authReq: true,
      },
   },
   {
      path: '/register',
      name: 'Register',
      component: SignUp,
      meta: {
         authReq: false,
      },
   },
   {
      path: '/login',
      name: 'Login',
      component: SignIn,
      meta: {
         authReq: false,
      },
   },
   {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
         authReq: true,
      },
   },
];

const router = new VueRouter({
   mode: 'history',
   base: process.env.BASE_URL,
   routes,
});

router.beforeEach((to, from, next) => {
   const noUser = store.getters['user'] == null;
   if (noUser && to.meta.authReq) {
      next({ name: 'Login' });
   } else {
      next();
   }
});

export default router;
