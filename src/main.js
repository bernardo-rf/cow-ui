import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store.js";
import { isAfter } from "date-fns";
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize,
} from "vee-validate";
import en from "vee-validate/dist/locale/en.json";
import * as rules from "vee-validate/dist/rules";
Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});
localize("en", en);
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);

window._ = require("lodash");
window.axios = require("axios");
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
window.axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
window.axios.defaults.headers.common["Access-Control-Allow-Methods"] =
  "GET,PUT,POST,DELETE,PATCH,OPTIONS";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faUserSecret,
  faTractor,
  faCoins,
  faMoneyBillTransfer,
  faExclamationCircle,
  faEye,
  faEyeSlash,
  faAngleLeft,
  faAngleRight,
  faUpload,
  faExclamationTriangle,
  faArrowUp,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faRotate,
  faPlus,
  faMinus,
  faMars,
  faVenus
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faUserSecret,
  faTractor,
  faCoins,
  faMoneyBillTransfer,
  faExclamationCircle,
  faEye,
  faEyeSlash,
  faAngleLeft,
  faAngleRight,
  faUpload,
  faExclamationTriangle,
  faArrowUp,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faRotate,
  faPlus,
  faMinus,
  faMars,
  faVenus
);

Vue.component("font-awesome-icon", FontAwesomeIcon);

import 'leaflet/dist/leaflet.css';

import Buefy from "buefy";
import "buefy/dist/buefy.css";
Vue.use(Buefy, {
  defaultIconComponent: "font-awesome-icon",
  defaultIconPack: "fas",
});

import VueTimeline from "@growthbunker/vuetimeline";
Vue.use(VueTimeline, {theme: "light",});

Vue.config.productionTip = false;

const app = new Vue({
  router,
  store,
  data: {},
  methods: {},
  created() {
    if (localStorage.getItem("accessToken") !== null) {
      if (isAfter(new Date(), new Date(localStorage.getItem("tokensExpiry")))) {
        this.$store.commit("logout");
        return this.$router.push("/login");
      }
      window.axios.defaults.headers.common.Authorization =
        "Bearer " + localStorage.getItem("accessToken");
    }
  },
  render: (h) => h(App),
}).$mount("#app");

window.axios.interceptors.response.use(
  function (response) {
    return response;
  },
  (error) => {
    switch (error.response.status) {
      case 401:
        if (
          error.config.url != `http://${process.env.VUE_APP_API_URL}users/auth/`
        ) {
          app.$store.commit("logout");
          app.$router.push("/login");
          app.$buefy.toast.open({
            duration: 3000,
            message: "Your session expired.",
            type: "is-warning",
          });
        }
        break;
      case 403:
        app.$router.push("/start");
        app.$buefy.toast.open({
          duration: 3000,
          message: "You don't have permission to make this action.",
          type: "is-warning",
        });
        break;
    }
    return Promise.reject(error);
  }
);
