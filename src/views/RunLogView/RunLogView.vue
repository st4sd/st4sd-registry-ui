<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div class="cds--grid cds--grid--full-width">
    <St4sdBreadcrumb
      :breadcrumbs="[
        { name: 'Virtual Experiments', path: '/' },
        {
          name: experimentId,
          path: `/experiment/${experimentId}`,
        },
        {
          name: 'Runs',
          path: `/experiment/${experimentId}/runs`,
        },
        {
          name: instanceId,
          path: `/experiment/${experimentId}/runs/${instanceId}`,
        },
        {
          name: 'Logs',
          path: `/experiment/${experimentId}/logs/${instanceId}`,
        },
      ]"
    />

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
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";

//
import axios from "axios";

export default {
  name: "RunLogView",
  components: { St4sdLogView, St4sdBreadcrumb },
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
  min-width: 400px;
}
</style>
