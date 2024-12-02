<template>
  <div>
    <div class="cds--row pad1">
      <ExperimentViewContentBlock title="Inputs" />
      <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12">
        <cds-structured-list>
          <cds-structured-list-head>
            <cds-structured-list-header-row>
              <cds-structured-list-header-cell
                >Names</cds-structured-list-header-cell
              >
            </cds-structured-list-header-row>
          </cds-structured-list-head>
          <cds-structured-list-body>
            <cds-structured-list-row>
              <cds-structured-list-cell>
                <cds-unordered-list>
                  <cds-list-item
                    v-if="experiment.metadata.registry.inputs.length == 0"
                  >
                    No inputs
                  </cds-list-item>
                  <cds-list-item
                    v-else
                    v-for="(input, idx) in experiment.metadata.registry.inputs"
                    :key="idx"
                  >
                    <code>{{ input.name }}</code>
                  </cds-list-item>
                </cds-unordered-list>
              </cds-structured-list-cell>
            </cds-structured-list-row>
          </cds-structured-list-body>
        </cds-structured-list>
      </div>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/structured-list/index.js";
import "@carbon/web-components/es/components/list/index.js";

import ExperimentViewContentBlock from "./ExperimentViewContentBlock.vue";

export default {
  name: "ExperimentInputs",
  props: {
    experiment: Object,
  },
  components: {
    ExperimentViewContentBlock,
  },
};
</script>
<style lang="scss" scoped>
@use "@/styles/structured-list-grid-column-styles.css";
</style>
