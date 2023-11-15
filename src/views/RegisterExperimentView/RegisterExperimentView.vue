<template>
  <St4sdBreadcrumb
    :breadcrumbs="[
      { name: 'Virtual Experiments', path: '/' },
      {
        name: 'Build Canvas',
        path: '/build-canvas',
      },
      {
        name: 'Register Experiment',
        path: `/build-canvas/register-experiment/${this.name}`,
      },
    ]"
  />
  <div v-if="loading" id="loading-container">
    <bx-loading type="overlay"></bx-loading>
  </div>
  <div v-if="!loading">
    <HttpError
      :errorDescription="errorDescription"
      :errorStatusText="errorStatusText"
      :errorCode="errorCode"
      v-if="isPvepError"
    >
    </HttpError>
    <div v-else>
      <bx-toast-notification
        v-if="isSaveError"
        kind="error"
        :title="errorDescription"
        :caption="errorStatusText + ' (error ' + errorCode + ')'"
        timeout="20000"
      >
      </bx-toast-notification>
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
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import ParameterisationContainer from "@/components/ParameterisationView/ParameterisationContainer.vue";
//Stores
import { canvasStore } from "@/canvas/stores/canvasStore";

import HttpError from "@/components/EmptyState/HttpError.vue";

import { getDeploymentEndpoint } from "@/functions/public_path";

import axios from "axios";

export default {
  name: "RegisterExperimentView",
  components: {
    St4sdBreadcrumb,
    ParameterisationContainer,
    HttpError,
  },
  data() {
    return {
      pvep: null,
      dsl: null,
      loading: true,
      isPvepError: false,
      isSaveError: false,
      errorDescription: "",
      errorStatusText: "",
      errorCode: 0,
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
          { dsl: this.dsl },
        )
        .then((response) => {
          if (response.status == 200) {
            this.pvep = response.data.pvep;
            this.loading = false;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.errorDescription = error.response.data.message;
          this.errorStatusText = error.response.data.problems
            .map((problem) => problem.problem)
            .toString();
          this.errorCode = error.response.status;
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
          canvasStore.setDsl({});
        })
        .catch((error) => {
          this.pvep = {};
          this.loading = false;
          this.errorDescription = error.response.data.message;
          this.errorStatusText = error.response.data.problems.map(
            (problem) => problem.message,
          );
          this.errorCode = error.response.status;
          this.isSaveError = true;
        });
    },
    cancel() {
      this.$router.push({
        name: "build canvas",
        query: { registrationCancelled: true },
      });
      canvasStore.setDsl({});
    },
  },
};
</script>

<style scoped>
#loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
