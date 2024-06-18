<template>
  <div class="cds--row pad1">
    <div class="cds--col-sm-4 cds--col-md-2 cds--col-lg-4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >Get this package with STP</dds-content-block-heading
        >
      </dds-content-block>
    </div>
    <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12 no-left-padding">
      <cds-code-snippet> stp package import {{ pageURL }} </cds-code-snippet>
    </div>
  </div>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/code-snippet.min.js";
export default {
  name: "GetPackageWithSTP",
  computed: {
    /* 
      if we try to use window.location.href directly in the template, 
      we will get an exception saying it's not defined so for now we
      will use a computed method.
    */
    pageURL() {
      return window.location.href;
    },
  },
};
</script>

<style scoped>
.no-left-padding {
  padding-left: 0;
}
</style>
