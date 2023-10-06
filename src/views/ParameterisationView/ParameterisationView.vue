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
    <ParameterisationContainer :pvep="pvep" @cancel="resetPvep" />
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
