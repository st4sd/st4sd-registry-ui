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
          name: componentId,
          path: `/experiment/${experimentId}/logs/${instanceId}/${componentId}`,
        },
      ]"
    />

    <st4sd-log-view
      :log="log"
      :filename="`log-${instanceId}-${componentId}.log`"
      :loading="loading"
    ></st4sd-log-view>
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
  name: "ComponentLogView",
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
    componentId: {
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
        window.location.origin +
          "/registry-ui/backend/logs/" +
          this.instanceId +
          "/" +
          this.componentId
      )
      .then((response) => {
        this.log = response.data;
        this.loading = false;
      });
  },
  methods: {},
};
</script>

<style></style>
