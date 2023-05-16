<template>
  <!-- Python oneliner to add package -->
  <div class="cds--row pad1">
    <div class="cds--col-sm-4 cds--col-md-2 cds--col-lg-4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >Get this package</dds-content-block-heading
        >
      </dds-content-block>
    </div>
    <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12" id="padding-fix">
      <bx-code-snippet language="python">
        api.api_experiment_push({{ exp_python }})
      </bx-code-snippet>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddPackage",
  props: {
    exp_python: String,
  },
};
</script>

<style scoped>
#padding-fix {
  padding-left: 0;
}
</style>
