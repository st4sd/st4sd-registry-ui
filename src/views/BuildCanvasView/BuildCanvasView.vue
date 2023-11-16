<template>
  <div id="toast-notification-container">
    <bx-toast-notification
      v-for="error in errors"
      :key="error.description"
      kind="error"
      :title="error.description"
      :caption="error.statusText + ' (error ' + error.code + ')'"
      timeout="10000"
    >
    </bx-toast-notification>
  </div>
  <St4sdBreadcrumb :breadcrumbs="getBreadcumbs()" />

  <div v-if="loading">
    <div id="loadingContainer">
      <bx-loading id="loadingWheel" type="overlay"></bx-loading>
    </div>
  </div>
  <div v-else-if="fullPageError.code != null">
    <HttpErrorEmptyState
      class="full-height-empty-state"
      :errorDescription="fullPageError.description"
      :errorStatusText="fullPageError.statusText"
      :errorCode="fullPageError.code"
    />
  </div>

  <BuildCanvas
    @updateLibraryError="onUpdateLibraryError"
    @updateGraphError="updateGraphError"
    v-show="!loading && fullPageError.code == null"
    :pvep="pvep"
    @updateLoading="updateLoading"
  />
</template>

<script>
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import BuildCanvas from "@/canvas/components/canvases/BuildCanvas";
import HttpErrorEmptyState from "@/components/EmptyState/HttpError.vue";

export default {
  components: { St4sdBreadcrumb, BuildCanvas, HttpErrorEmptyState },
  props: {
    pvep: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: true,
      errors: [],
      fullPageError: {
        statusText: "",
        code: null,
        description: "Unable to load graph library",
      },
    };
  },
  methods: {
    updateLoading(loading) {
      this.loading = loading;
    },
    onUpdateLibraryError(error) {
      let libraryError = {
        statusText: error.response.statusText,
        code: error.response.status,
        description: "Unable to load graph library",
      };

      if (error.response.status == 405) {
        this.fullPageError = libraryError;
      }

      this.errors.push(libraryError);
    },
    updateGraphError(error) {
      let graphError = {
        statusText: error.response.statusText,
        code: error.response.status,
        description: "Unable to load graph",
      };

      if (this.fullPageError.code == null) {
        this.fullPageError = graphError;
      }

      this.errors.push(graphError);
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

<style scoped lang="scss">
@use "@carbon/layout";

@import "@/styles/toast-notification-styles.scss";

@import "@/styles/empty_state_styles.scss";

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
