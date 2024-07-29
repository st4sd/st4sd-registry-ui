<template>
  <div class="breadcrumb">
    <cds-breadcrumb>
      <cds-breadcrumb-item :key="crumb.name" v-for="crumb in breadcrumbs">
        <router-link :to="crumb.path">{{ crumb.name }}</router-link>
      </cds-breadcrumb-item>
    </cds-breadcrumb>
  </div>
</template>
<script>
import "@carbon/web-components/es/components/breadcrumb/index.js";

export default {
  name: "St4sdBreadcrumb",
  props: {
    breadcrumbs: Array,
  },
};
</script>
<style lang="scss">
@use "@carbon/grid";
@use "@carbon/layout";
@include grid.flex-grid();
.breadcrumb {
  padding-bottom: layout.$spacing-07;
}
</style>
