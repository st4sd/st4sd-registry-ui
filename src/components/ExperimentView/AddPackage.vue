<template>
  <!-- Python oneliner to add package -->
  <div class="cds--row pad1">
    <div class="cds--col-lg-4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >Get this package</dds-content-block-heading
        >
      </dds-content-block>
    </div>
    <div class="cds--col">
      <div class="cds--row">
        <bx-code-snippet language="python">
          api.api_experiment_push({{ exp_python }})
        </bx-code-snippet>
      </div>
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
