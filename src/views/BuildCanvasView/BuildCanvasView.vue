<template>
  <St4sdBreadcrumb :breadcrumbs="getBreadcumbs()" />

  <div v-if="loading">
    <div id="loadingContainer">
      <bx-loading id="loadingWheel" type="overlay"></bx-loading>
    </div>
  </div>
  <BuildCanvas v-show="!loading" :pvep="pvep" @updateLoading="updateLoading" />
</template>

<script>
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import BuildCanvas from "@/Canvas/BuildCanvas";

export default {
  components: { St4sdBreadcrumb, BuildCanvas },
  props: {
    pvep: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    updateLoading(loading) {
      this.loading = loading;
    },
    getBreadcumbs() {
      let breadcrumbs = [
        { name: "Virtual Experiments", path: "/" },
        {
          name: "Build Canvas",
          path: "/build-canvas",
        },
      ];

      if (this.pvep != "") {
        breadcrumbs.splice(1, 0, {
          name: this.pvep,
          path: `/experiment/${this.pvep}`,
        });
      }

      return breadcrumbs;
    },
  },
};
</script>

<style scoped>
#loadingContainer {
  width: 100%;
  height: calc(100vh - 12rem);
  display: flex;
  justify-content: center;
  align-items: center;
}

#loadingWheel {
  display: inline-block;
  animation: none;
}
</style>
