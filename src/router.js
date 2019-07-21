
import Vue from 'vue';
import Router from 'vue-router';

import Home from  "./views/Home.vue";
import Rules from "./views/Rules.vue";
import Targets from "./views/Targets.vue";
import About from  "./views/About.vue";
import Version from  "./views/Version.vue";

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [

    { path: "/", name: "home", component: Home },

    { path: "/rules", name: "rules", component: Rules },

    { path: "/targets", name: "targets", component: Targets },

    { path: "/about", name: "about", component: About },

    { path: "/version", name: "version", component: Version },

  ]
});
