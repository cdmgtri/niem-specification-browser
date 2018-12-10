
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue from "bootstrap-vue";

// TODO: Review how best to include these files
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "jquery";
import "bootstrap/dist/js/bootstrap.bundle";
import "./assets/styles/main.css";
import "./assets/styles/main.scss";
import "./assets/styles/navbar.css";

import VueGoodTablePlugin from "vue-good-table";
import "vue-good-table/dist/vue-good-table.css";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueGoodTablePlugin);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
