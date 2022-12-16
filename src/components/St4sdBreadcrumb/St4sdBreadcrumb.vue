<template>
  <div class="breadcrumb">
    <bx-breadcrumb>
      <bx-breadcrumb-item :key="crumb.name" v-for="crumb in breadcrumbs">
        <router-link :to="crumb.path">{{ crumb.name }}</router-link>
      </bx-breadcrumb-item>
    </bx-breadcrumb>
  </div>
</template>
<script>
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
