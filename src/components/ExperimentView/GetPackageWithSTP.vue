<template>
  <div class="cds--row pad1">
    <ExperimentViewContentBlock title="Get this package with STP" />
    <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12">
      <cds-code-snippet> stp package import {{ pageURL }} </cds-code-snippet>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/code-snippet/index.js";

import ExperimentViewContentBlock from "./ExperimentViewContentBlock.vue";

export default {
  name: "GetPackageWithSTP",
  components: {
    ExperimentViewContentBlock,
  },
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
