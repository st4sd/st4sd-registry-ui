<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div class="cds--grid cds--grid--full-width">
    <!-- Navigation breadcrumb -->
    <div class="breadcrumb">
      <bx-breadcrumb>
        <bx-breadcrumb-item>
          <bx-breadcrumb-link aria-current="page"
            >Virtual Experiments</bx-breadcrumb-link
          >
        </bx-breadcrumb-item>
      </bx-breadcrumb>
    </div>

    <!-- Overlay during loading -->
    <template v-if="loading">
      <bx-loading type="overlay"></bx-loading>
    </template>
    <template v-else>
      <!-- Filter column -->
      <div class="cds--row">
        <St4sdLocalFilters
          :experiments="this.experiments"
          @updateSelectedFilters="updateSelectedFilters($event)"
        />

        <!-- Card rows and columns -->
        <St4sdExperimentCards
          :experiments="this.experiments"
          :selectedFilters="this.selectedFilters"
        />
      </div>
    </template>
  </div>
</template>

<script>
//
import "@carbon/ibmdotcom-web-components/es/components/card/index.js";
import "@carbon/ibmdotcom-web-components/es/components/carousel/index.js";
import "@carbon/ibmdotcom-web-components/es/components/filter-panel/index.js";

import "carbon-web-components/es/components/modal/index.js";
import "carbon-web-components/es/components/code-snippet/index.js";
import "carbon-web-components/es/components/button/index.js";
import "carbon-web-components/es/components/tag/tag";
import "carbon-web-components/es/components/breadcrumb/index.js";
import "carbon-web-components/es/components/loading/index.js";

//
import axios from "axios";

import St4sdLocalFilters from "@/components/St4sdLocalFilters/St4sdLocalFilters.vue";
import St4sdExperimentCards from "@/components/St4sdExperimentCards/St4sdExperimentCards.vue";

export default {
  name: "CatalogView",
  components: {
    St4sdLocalFilters,
    St4sdExperimentCards,
  },
  data() {
    return {
      selectedFilters: {},
      experiments: [],
      loading: true,
    };
  },
  mounted() {
    axios
      .get(window.location.origin + "/registry-ui/backend/experiments/")
      .then((response) => {
        this.experiments = response.data.entries;
        this.loading = false;
      });
  },
  methods: {
    updateSelectedFilters(selectedFilters) {
      this.selectedFilters = selectedFilters;
    },
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
