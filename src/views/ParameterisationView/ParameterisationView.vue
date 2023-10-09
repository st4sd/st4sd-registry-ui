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
  <div v-if="parameterisationOptionsLoading" id="loading-container">
    <bx-loading type="overlay"></bx-loading>
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

import axios from "axios";

export default {
  name: "ParameterisationView",
  components: {
    St4sdBreadcrumb,
    ParameterisationContainer,
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
          this.parameterisationOptionsLoading = false;
          this.pvep = response.data.entry;
          if (this.initialPvepSet != true) {
            this.initialPvep = JSON.parse(JSON.stringify(response.data.entry));
          }
          this.initialPvepSet = true;
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
          if (error.response.status == 400) {
            alert(`${error.response.data.message}`);
          } else {
            alert(
              "Experiment not found or internal error while creating experiment",
            );
          }
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
#loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
