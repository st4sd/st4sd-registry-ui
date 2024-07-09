<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div>
    <div id="toast-notification-container">
      <cds-toast-notification
        v-if="isError"
        kind="error"
        :title="errorDescription"
        :caption="errorStatusText + ' (error ' + errorCode + ')'"
        timeout="5000"
      />
    </div>
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
    <div>
      <HttpErrorEmptyState
        :errorDescription="errorDescription"
        :errorStatusText="errorStatusText"
        :errorCode="errorCode"
        v-if="isError"
      />

      <st4sd-log-view
        :log="log"
        :filename="`log-${instanceId}.log`"
        :loading="loading"
        v-else
      ></st4sd-log-view>
    </div>
  </div>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/notification.min.js";
import St4sdLogView from "@/components/St4sdLogView";
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";

import HttpErrorEmptyState from "@/components/EmptyState/HttpError.vue";

//
import axios from "axios";

export default {
  name: "RunLogView",
  components: { St4sdLogView, St4sdBreadcrumb, HttpErrorEmptyState },
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
      isError: false,
      errorStatusText: "",
      errorCode: 0,
      errorDescription: "Unable to load logs",
    };
  },
  mounted() {
    axios
      .get(
        window.location.origin + "/registry-ui/backend/logs/" + this.instanceId,
      )
      .then((response) => {
        this.log = response.data;
      })
      .catch((error) => {
        this.errorStatusText = error.response.statusText;
        this.errorCode = error.response.status;
        this.isError = true;
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";

@import "@/styles/toast-notification-styles.scss";

pre {
  white-space: pre-wrap;
  font-size: small;
  background-color: #f4f4f4;
  padding: 20px;
  min-width: 400px;
}
</style>
