<template>
  <!-- Python oneliner to add package -->
  <cv-row class="pad1">
    <cv-column :sm="4" :md="2" :lg="4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >Get this package</dds-content-block-heading
        >
      </dds-content-block>
    </cv-column>
    <cv-column :sm="4" :md="6" :lg="12">
      <bx-code-snippet language="python">
        api.api_experiment_push({{ exp_python }})
      </bx-code-snippet>
    </cv-column>
  </cv-row>
</template>

<script>
export default {
  name: "AddPackage",
  props: {
    exp_python: String,
  },
};
</script>
