<template>
  <div>
    <cv-row class="pad1">
      <cv-column :sm="4" :md="2" :lg="4">
        <dds-content-block class="ve-content-block">
          <dds-content-block-heading class="ve-heading"
            >Inputs</dds-content-block-heading
          >
        </dds-content-block>
      </cv-column>
      <cv-column :sm="4" :md="6" :lg="12">
        <dds-structured-list>
          <dds-structured-list-head>
            <dds-structured-list-header-row>
              <dds-structured-list-header-cell
                >Names</dds-structured-list-header-cell
              >
            </dds-structured-list-header-row>
          </dds-structured-list-head>
          <dds-structured-list-body>
            <dds-structured-list-row>
              <dds-structured-list-cell>
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
              </dds-structured-list-cell>
            </dds-structured-list-row>
          </dds-structured-list-body>
        </dds-structured-list>
      </cv-column>
    </cv-row>
  </div>
</template>

<script>
export default {
  name: "ExperimentInputs",
  props: {
    experiment: Object,
  },
};
</script>
