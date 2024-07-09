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
  <div v-if="loading" id="loading-container">
    <cds-loading></cds-loading>
  </div>
  <div v-if="!loading">
    <HttpErrorEmptyState
      :errorDescription="pvepErrorDescription"
      :errorStatusText="pvepErrorStatusText"
      :errorCode="pvepErrorCode"
      v-if="isPvepError"
    >
    </HttpErrorEmptyState>
    <div v-else>
      <ParameterisationContainer
        :openInRead="false"
        :pvep="pvep"
        @cancel="cancel"
        @save="save"
      />
    </div>
  </div>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/notification.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/loading.min.js";

import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import ParameterisationContainer from "@/components/ParameterisationView/ParameterisationContainer.vue";
//Stores
import { canvasStore } from "@/canvas/stores/canvasStore";

import HttpErrorEmptyState from "@/components/EmptyState/HttpError.vue";

import { getDeploymentEndpoint } from "@/functions/public_path";

import axios from "axios";

export default {
  name: "RegisterExperimentView",
  components: {
    St4sdBreadcrumb,
    ParameterisationContainer,
    HttpErrorEmptyState,
  },
  data() {
    return {
      pvep: null,
      dsl: null,
      loading: true,
      isPvepError: false,
      pvepErrorDescription: "",
      pvepErrorStatusText: "",
      pvepErrorCode: 0,
      notifications: [],
    };
  },
  props: {
    name: String,
  },
  watch: {
    name: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler() {
        this.dsl = canvasStore.dsl;
        this.pvep = this.getPvep();
      },
      deep: true,
    },
  },
  methods: {
    getPvep() {
      axios
        .post(
          `${getDeploymentEndpoint()}registry-ui/backend/canvas/pvep/generate`,
          {
            dsl: this.dsl,
            pvep: canvasStore.pvep,
          },
        )
        .then((response) => {
          canvasStore.clearPVEP();
          if (response.status == 200) {
            this.pvep = response.data.pvep;
            this.loading = false;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.pvepErrorDescription = error.response.data?.message;
          this.pvepErrorStatusText = error.response.data?.problems
            ? error.response.data.problems.map((problem) => problem.message)
            : "";
          this.pvepErrorCode = error.response.status;
          let notification = {
            kind: "error",
            title: this.pvepErrorDescription,
            subtitle: this.pvepErrorStatusText,
            caption: "",
            code: this.pvepErrorCode,
          };
          this.notifications.push(notification);
          this.isPvepError = true;
        });
    },
    save(pvep) {
      pvep.metadata.package.name = this.name;
      this.loading = true;
      axios
        .post(
          `${getDeploymentEndpoint()}registry-ui/backend/canvas/internalexperiment/create`,
          { pvep: pvep, workflow: { dsl: this.dsl } },
        )
        .then((response) => {
          this.loading = false;
          if (response.status == 200) {
            this.$router.push({
              name: "view experiment",
              params: {
                id: this.name,
              },
            });
          }
          canvasStore.clearDsl();
        })
        .catch((error) => {
          this.pvep = {};
          this.loading = false;
          let errorStatusText = error.response.data?.problems
            ? error.response.data.problems.map((problem) => problem.message)
            : "";
          let notification = {
            kind: "error",
            title: error.response.data?.message,
            subtitle: errorStatusText,
            caption: "",
            code: error.response.status,
          };
          this.notifications.push(notification);
        });
    },
    cancel() {
      if (this.$route.query.edit == "false") {
        this.$router.push({
          name: "build canvas",
          query: { registrationCancelled: true },
        });
        canvasStore.clearDsl();
      } else {
        this.$router.push({
          name: "edit experiment in canvas",
          params: { pvep: this.name },
          query: { registrationCancelled: true },
        });
        canvasStore.setDsl({});
      }
    },
    getBreadcumbs() {
      let breadcrumbs = [
        { name: "Virtual Experiments", path: "/" },
        {
          name: "Build Canvas",
          path: "/build-canvas",
        },
        {
          name: "Register Experiment",
          path: `/build-canvas/register-experiment/${this.name}`,
        },
      ];

      if (this.$route.query.edit == "true") {
        breadcrumbs.splice(1, 0, {
          name: this.name,
          path: `/experiment/${this.name}`,
        });
        breadcrumbs[2].name = "Edit";
        breadcrumbs[2].path = `/experiment/${this.name}/edit`;
      }

      return breadcrumbs;
    },
  },
};
</script>

<style scoped lang="scss">
#loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70vh;
}
</style>
