<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
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
    <dds-content-block>
      <dds-content-block-heading class="cds--col-xlg-8">{{
        instance_id
      }}</dds-content-block-heading>
      <dds-text-cta cta-type="local">
        <bx-link
          :href="`${getDeploymentEndpoint()}experiment/${experiment_id}/logs/${instance_id}`"
          >View Experiment Logs</bx-link
        >
      </dds-text-cta>
    </dds-content-block>

    <bx-tabs trigger-content="Select an item" value="ComponentTable">
      <bx-tab
        id="TabForRunComponentTable"
        value="ComponentTable"
        target="RunComponentTable"
        >Component</bx-tab
      >
      <bx-tab
        id="TabForRunPropertiesTable"
        value="PropertiesTable"
        target="RunPropertiesTable"
        >Properties</bx-tab
      >
    </bx-tabs>

    <div class="bx-ce-demo-devenv--tab-panels">
      <div
        id="RunComponentTable"
        aria-labelledby="tab-ComponentTable"
        role="tabpanel"
        hidden
      >
        <RunComponentsTable
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
          :experiment_id="experiment_id"
          :rest_uid="instance_id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/loading/index.js";
import "@carbon/web-components/es/components/tabs/index.js";

import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import RunComponentsTable from "@/components/ComponentView/RunComponentsTable.vue";
import RunPropertiesTable from "@/components/ComponentView/RunPropertiesTable.vue";
import "@carbon/ibmdotcom-web-components/es/components/cta-section/index.js";

import { getDeploymentEndpoint } from "@/functions/public_path";

export default {
  name: "RunView",
  components: { St4sdBreadcrumb, RunComponentsTable, RunPropertiesTable },
  methods: { getDeploymentEndpoint },
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
    return {};
  },
};
</script>

<style lang="scss" scoped>
.tableOverflowContainer {
  width: 100%;
  overflow-x: scroll;
}

dds-content-block-heading {
  margin: 0;
  padding-left: 0;
  padding-bottom: 1rem;
}

dds-text-cta {
  padding-bottom: 2rem;
}
</style>
