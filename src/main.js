import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'vuetify/dist/vuetify.css';
import login from './components/login';
import inicio from './components/inicio';
import config from './components/configuracionA'
import '@mdi/font/css/materialdesignicons.css';


Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(Vuetify)


const router = new VueRouter ({
  mode: 'history',
  routes: [
    { path: '/', component: login},
    { path: '/inicio', component: inicio},
    { path: '/configuracion', component: config}

  ]

});

router.beforeEach((to, from, next) => {
  let mostrarIcono = false;
  
  if (to.path === '/inicio') {
    mostrarIcono = true;
  } if (to.path === '/configuracion') {
    mostrarIcono = true;
  }
  Vue.prototype.$mostrarIcono = mostrarIcono;
  next();
});

export default router;


const vuetify = new Vuetify();

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')
