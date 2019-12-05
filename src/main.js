import Vue from "vue";
import App from "./App.vue";
import VueNumberInput from "@chenfengyuan/vue-number-input";

Vue.use(VueNumberInput);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
