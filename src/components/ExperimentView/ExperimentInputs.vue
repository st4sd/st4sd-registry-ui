<template>
  <div class="cds--row pad1">
    <div class="cds--col-lg-4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >Inputs</dds-content-block-heading
        >
      </dds-content-block>
    </div>
    <div class="cds--col">
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
    </div>
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
