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
                <bx-unordered-list>
                  <bx-list-item
                    v-if="experiment.metadata.registry.inputs.length == 0"
                  >
                    No inputs
                  </bx-list-item>
                  <bx-list-item
                    v-else
                    v-for="(input, idx) in experiment.metadata.registry.inputs"
                    :key="idx"
                  >
                    <code>{{ input.name }}</code>
                  </bx-list-item>
                </bx-unordered-list>
              </cds-structured-list-cell>
            </cds-structured-list-row>
          </cds-structured-list-body>
        </cds-structured-list>
      </div>
    </div>
  </div>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/structured-list.min.js";

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
<style
  lang="css"
  scoped
  src="../../styles/structured-list-grid-column-styles.css"
></style>
