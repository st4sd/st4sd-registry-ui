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
          {{ componentId }}
        </bx-breadcrumb-item>
        <bx-breadcrumb-item>
          <bx-breadcrumb-link aria-current="page">Logs</bx-breadcrumb-link>
        </bx-breadcrumb-item>
      </bx-breadcrumb>
    </div>

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
//
import axios from "axios";

export default {
  name: "ComponentLogView",
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
