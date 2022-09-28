import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

/* lib */
import vuetify from './plugins/vuetify';
import * as VeeValidate from 'vee-validate';
import vueMoment from 'vue-moment';
import moment from 'moment';

/* style */
import '@/assets/commonStyle.css';

/* use */
Vue.config.productionTip = false;

moment.locale('ko');
Vue.use(vueMoment, { moment });

/* =================================================== */
new Vue({
  router,
  store,
  vuetify,
  VeeValidate,
  vueMoment,
  render: (h) => h(App),
}).$mount('#app');
