<template>
  <St4sdBreadcrumb
    :breadcrumbs="[
      { name: 'Virtual Experiments', path: '/' },
      {
        name: id,
        path: `/experiment/${id}`,
      },
      {
        name: 'Parameterisation Options',
        path: `/experiment/${id}/parameterisation-options`,
      },
    ]"
  />
  <div id="toast-notification-container">
    <cds-toast-notification
      v-for="error in errors"
      :key="error.description"
      kind="error"
      :title="error.description"
      :caption="error.statusText + ' (error ' + error.code + ')'"
      timeout="5000"
      lowContrast
    />
  </div>
  <div v-if="parameterisationOptionsLoading" id="loading-container">
    <cds-loading></cds-loading>
  </div>
  <div v-else-if="fullPageHttpError.isError">
    <HttpErrorEmptyState
      class="full-height-empty-state"
      :errorStatusText="fullPageHttpError.statusText"
      :errorCode="fullPageHttpError.status"
    />
  </div>

  <div v-else>
    <ParameterisationContainer
      :openInRead="true"
      :pvep="pvep"
      @cancel="resetPvep"
      @save="postNewParameterisation"
    />
  </div>
</template>

<script>
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import ParameterisationContainer from "@/components/ParameterisationView/ParameterisationContainer.vue";
import HttpErrorEmptyState from "@/components/EmptyState/HttpError.vue";

import "@carbon/web-components/es/components/loading/index.js";
import "@carbon/web-components/es/components/notification/index.js";

import axios from "axios";

export default {
  name: "ParameterisationView",
  components: {
    St4sdBreadcrumb,
    ParameterisationContainer,
    HttpErrorEmptyState,
  },
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      parameterisationOptionsLoading: true,
      fullPageHttpError: { isError: false },
      errors: [],
      pvep: null,
      initialPvepSet: false,
      initialPvep: null,
    };
  },
  methods: {
    getParameterisationOptions() {
      axios
        .get(
          window.location.origin +
            "/registry-ui/backend/experiments/" +
            this.id +
            "/parameterisation",
        )
        .then((response) => {
          this.pvep = response.data.entry;
          if (this.initialPvepSet != true) {
            this.initialPvep = JSON.parse(JSON.stringify(response.data.entry));
          }
          this.initialPvepSet = true;
        })
        .catch((error) => {
          this.errors.push({
            description: "Unable to fetch parameterisation",
            statusText: error.response.statusText,
            code: error.response.status,
          });
          this.fullPageHttpError = {
            statusText: error.response.statusText,
            status: error.response.status,
            isError: true,
          };
        })
        .finally(() => {
          this.parameterisationOptionsLoading = false;
        });
    },
    postNewParameterisation(pvep) {
      for (let variable in pvep.parameterisation.executionOptions.variables) {
        delete pvep.parameterisation.executionOptions.variables[variable].type;
        if (
          pvep.parameterisation.executionOptions.variables[variable].value == ""
        ) {
          delete pvep.parameterisation.executionOptions.variables[variable]
            .value;
        }
      }
      for (let variable in pvep.parameterisation.presets.variables) {
        delete pvep.parameterisation.presets.variables[variable].type;
      }
      for (let file in pvep.metadata.registry.data) {
        delete pvep.metadata.registry.data[file].type;
      }
      let newPayload = pvep;
      this.parameterisationOptionsLoading = true;
      axios
        .post(
          window.location.origin +
            `/registry-ui/backend/experiments/${this.id}`,
          newPayload,
        )
        .then((response) => {
          if (response.status == 200) {
            location.reload();
            this.optionsLoading = false;
          }
        })
        .catch((error) => {
          this.errors.push({
            description: error.response.data.message,
            statusText: error.response.statusText,
            code: error.response.status,
          });
        });
    },
    resetPvep() {
      this.pvep = JSON.parse(JSON.stringify(this.initialPvep));
    },
  },
  mounted() {
    this.getParameterisationOptions();
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/empty_state_styles.scss";
@import "@/styles/toast-notification-styles.scss";

#loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70vh;
}
</style>
