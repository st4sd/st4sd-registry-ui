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
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/breadcrumb.min.js";

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
