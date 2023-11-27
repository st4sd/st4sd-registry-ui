<template>
  <div id="toast-notification-container">
    <bx-toast-notification
      v-for="notifcation in notifications"
      :key="notifcation.description"
      :kind="notifcation.type"
      :title="notifcation.description"
      :caption="notifcation.statusText + ' (code ' + notifcation.code + ')'"
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
    @updateLibraryNotification="onUpdateLibraryNotification"
    @updateGraphError="updateGraphError"
    v-show="!loading && fullPageError.code == null"
    :pvep="pvep"
    @pvepFetchFailed="onPvepFetchFailed"
    @updateLoading="updateLoading"
    @experimentTypeUnsupported="onExperimentTypeUnsupported"
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
      notifications: [],
      fullPageError: {},
    };
  },
  methods: {
    updateLoading(loading) {
      this.loading = loading;
    },
    onUpdateLibraryNotification(notification) {
      if (notification.code == 405) {
        this.fullPageError = notification;
      }

      this.notifications.push(notification);
    },
    updateGraphError(error) {
      let graphError = {
        statusText: error.response.statusText,
        code: error.response.status,
        description: "Unable to load graph",
        type: "error",
      };

      if (this.fullPageError.code == null) {
        this.fullPageError = graphError;
      }

      this.notifications.push(graphError);
    },
    onPvepFetchFailed(error) {
      let pvepError = {
        statusText: error.response.statusText,
        code: error.response.status,
        description: "Unable to load PVEP",
      };

      this.errors.push(pvepError);
    },
    onExperimentTypeUnsupported(error) {
      if (this.fullPageError.code == null) {
        this.fullPageError = error;
      }

      this.errors.push(error);
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
        breadcrumbs[2].name = "Edit";
        breadcrumbs[2].path = `/experiment/${this.pvep}/edit`;
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
