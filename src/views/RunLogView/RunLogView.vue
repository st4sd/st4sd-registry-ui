<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div class="cds--grid cds--grid--full-width">
    <div class="breadcrumb">
      <bx-breadcrumb>
        <bx-breadcrumb-item>
          <router-link to="/">Virtual Experiments</router-link>
        </bx-breadcrumb-item>
        <bx-breadcrumb-item>
          <router-link :to="`/experiment/${experimentId}`">{{
            experimentId
          }}</router-link>
        </bx-breadcrumb-item>
        <bx-breadcrumb-item>
          <router-link :to="`/experiment/${experimentId}/runs`"
            >Runs</router-link
          >
        </bx-breadcrumb-item>
        <bx-breadcrumb-item>
          <router-link :to="`/experiment/${experimentId}/runs/${instanceId}`">{{
            instanceId
          }}</router-link>
        </bx-breadcrumb-item>
        <bx-breadcrumb-item>
          <bx-breadcrumb-link aria-current="page">Logs</bx-breadcrumb-link>
        </bx-breadcrumb-item>
      </bx-breadcrumb>
    </div>

    <!-- <template v-if="loading">
      <bx-loading type="overlay"></bx-loading>
    </template> -->

    <template>
      <st4sd-log-view
        :log="log"
        :filename="`log-${instanceId}.log`"
        :loading="loading"
      ></st4sd-log-view>
    </template>
  </div>
</template>

<script>
import "carbon-web-components/es/components/loading/index.js";
import "carbon-web-components/es/components/toggle/index.js";
import "carbon-web-components/es/components/code-snippet/index.js";
import St4sdLogView from "@/components/St4sdLogView";
//
import axios from "axios";

export default {
  name: "RunLogView",
  components: { St4sdLogView },
  props: {
    experimentId: {
      type: String,
      default: "",
    },
    instanceId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      log: null,
      loading: true,
    };
  },
  mounted() {
    axios
      .get(
        window.location.origin + "/registry-ui/backend/logs/" + this.instanceId
      )
      .then((response) => {
        this.log = response.data;
        this.loading = false;
      });
  },
  methods: {},
};
</script>

<style>
pre {
  white-space: pre-wrap;
  font-size: small;
  background-color: #f4f4f4;
  padding: 20px;
}
</style>
