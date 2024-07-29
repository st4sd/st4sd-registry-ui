<template>
  <div id="toast-notification-container">
    <cds-toast-notification
      v-for="(notification, idx) in notifications"
      :key="idx"
      :kind="notification.kind"
      :title="notification.title"
      :subtitle="notification.subtitle"
      :caption="
        ('caption' in notification ? notification.caption : '') +
        (notification.code == 0 ? '' : ` (code ${notification.code})`)
      "
      timeout="5000"
    />
  </div>
  <St4sdBreadcrumb :breadcrumbs="getBreadcumbs()" />

  <div v-if="loading">
    <div id="loadingContainer">
      <cds-loading></cds-loading>
    </div>
  </div>
  <div v-else-if="fullPageError.code != null">
    <HttpErrorEmptyState
      class="full-height-empty-state"
      :errorDescription="fullPageError.title"
      :errorStatusText="fullPageError.caption"
      :errorCode="fullPageError.code"
    />
  </div>

  <BuildCanvas
    @updateLibraryNotification="onUpdateLibraryNotification"
    @updateBuildCanvasNotification="onUpdateBuildCanvasNotification"
    @updateFatalError="onFatalError"
    v-show="!loading && fullPageError.code == null"
    :pvep="pvep"
    @updateLoading="updateLoading"
  />
</template>

<script>
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/loading/index.js";

import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import BuildCanvas from "@/canvas/components/canvases/BuildCanvas.vue";
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
    onUpdateBuildCanvasNotification(notification) {
      this.notifications.push(notification);
    },
    onFatalError(notification) {
      this.notifications.push(notification);

      if (this.fullPageError.code == null) {
        this.fullPageError = notification;
      }
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
</style>
