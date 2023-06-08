/*
    Copyright IBM Inc. All Rights Reserved.
    SPDX-License-Identifier: Apache-2.0

    Author: Alessandro Pomponio
*/
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import isGlobalRegistry from "@/functions/is_global_registry";
import { registryUISharedState } from "@/stores/registryUISharedState";

const app = createApp(App);

//We store the result of this function in a store and then access it
//in multiple other places throughout the app
isGlobalRegistry(window.location.origin)
  .then((result) => {
    registryUISharedState.setIsGlobalRegistry(result);
  })
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    app.use(router).mount("#app");
  });
