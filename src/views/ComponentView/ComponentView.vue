<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div id="toast-notification-container">
    <cds-toast-notification
      v-for="error in errors"
      :key="error.call"
      kind="error"
      :title="error.description"
      :caption="error.statusText + ' (error ' + error.code + ')'"
      timeout="5000"
    />
  </div>
  <div>
    <St4sdBreadcrumb
      :breadcrumbs="[
        { name: 'Virtual Experiments', path: '/' },
        {
          name: experiment_id,
          path: `/experiment/${experiment_id}`,
        },
        {
          name: 'Runs',
          path: `/experiment/${experiment_id}/runs`,
        },
        {
          name: instance_id,
          path: `/experiment/${experiment_id}/runs/${instance_id}`,
        },
      ]"
    />
    <div class="hero-section">
      <p class="cvtitle">{{ instance_id }}</p>
      <cds-link
        :href="`${getDeploymentEndpoint()}experiment/${experiment_id}/logs/${instance_id}`"
        >View Experiment Logs
        <img slot="icon" src="@/assets/arrow--right.svg" width="20" height="20"
      /></cds-link>
    </div>

    <cds-tabs trigger-content="Select an item" value="ComponentTable">
      <cds-tab
        id="TabForRunComponentTable"
        value="ComponentTable"
        target="RunComponentTable"
        >Component</cds-tab
      >
      <cds-tab
        id="TabForRunPropertiesTable"
        value="PropertiesTable"
        target="RunPropertiesTable"
        >Properties</cds-tab
      >
    </cds-tabs>

    <div
      id="RunComponentTable"
      aria-labelledby="tab-ComponentTable"
      role="tabpanel"
      hidden
    >
      <RunComponentsTable
        @updateComponentErrorHandling="updateComponentErrorHandling"
        :experiment_id="experiment_id"
        :instance_id="instance_id"
      />
    </div>
    <div
      id="RunPropertiesTable"
      role="tabpanel"
      aria-labelledby="tab-PropertiesTable"
      hidden
    >
      <RunPropertiesTable
        @updatePropertyErrorHandling="updatePropertyErrorHandling"
        :experiment_id="experiment_id"
        :rest_uid="instance_id"
      />
    </div>
  </div>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/notification.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/tabs.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/link.min.js";

import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import RunComponentsTable from "@/components/ComponentView/RunComponentsTable.vue";
import RunPropertiesTable from "@/components/ComponentView/RunPropertiesTable.vue";

import { getDeploymentEndpoint } from "@/functions/public_path";

export default {
  name: "RunView",
  components: { St4sdBreadcrumb, RunComponentsTable, RunPropertiesTable },
  props: {
    experiment_id: {
      type: String,
      default: "",
    },
    instance_id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      errors: [],
    };
  },
  methods: {
    getDeploymentEndpoint,
    updateComponentErrorHandling(error) {
      this.errors.push({
        call: "Components",
        description: "Unable to fetch components",
        statusText: error.response.statusText,
        code: error.response.status,
      });
    },
    updatePropertyErrorHandling(error) {
      this.errors.push({
        call: "Properties",
        description: "Unable to fetch properties",
        statusText: error.response.statusText,
        code: error.response.status,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@carbon/layout";
@import "@/styles/toast-notification-styles.scss";

.cvtitle {
  font-size: calc(32px + (24 - 16) * ((100vw - 42rem) / (1056 - 672)));
  font-weight: 300;
  padding-bottom: 1rem;
}

.hero-section {
  margin-bottom: layout.$spacing-05;
}
</style>
