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
        <div class="cds--col-lg-4">
          <dds-filter-panel-composite
            @dds-selection-clear="handleCheckboxSelect"
            @dds-checkbox-select="handleCheckboxSelect"
          >
            <dds-filter-panel-heading slot="heading"
              >Filter</dds-filter-panel-heading
            >
            <dds-filter-group
              v-for="(domainFilter, domainFilterIdx) in domainFilters"
              :key="`domainFilter-${domainFilterIdx}`"
            >
              <dds-filter-group-item
                :filter-for="domainFilter.filterFor"
                :open="domainFilter.isOpen"
                :title-text="domainFilter.displayName"
              >
                <template v-for="(filter, filterIdx) in domainFilter.filters">
                  <dds-filter-panel-checkbox
                    :value="filter.name"
                    :key="`filterPanel-${filterIdx}`"
                    >{{ filter.displayName }}</dds-filter-panel-checkbox
                  >
                </template>
              </dds-filter-group-item>
            </dds-filter-group>
          </dds-filter-panel-composite>
        </div>

        <!-- Card rows and columns -->
        <div class="cds--col">
          <div
            class="cds--row card-row"
            v-for="experiment in experimentsToShow"
            :key="experiment.metadata.package.name"
          >
            <dds-card
              border
              logo
              class="card-proportions"
              :href="`experiment/${experiment.metadata.package.name}`"
            >
              <dds-card-eyebrow>{{
                experiment.metadata.package.name
              }}</dds-card-eyebrow>
              <p>
                {{ experiment.metadata.package.description }}
              </p>
              <dds-tag-group>
                <!-- VE interface -->
                <bx-tag
                  v-if="
                    Object.keys(experiment.metadata.registry.interface)
                      .length != 0
                  "
                  type="green"
                >
                  virtual-experiment
                </bx-tag>
                <!-- Platform -->
                <bx-tag
                  v-for="(platform, platformIdx) in getAvailablePlatforms(
                    experiment
                  )"
                  :key="`platform-${platformIdx}`"
                  type="red"
                >
                  platform: {{ platform }}
                </bx-tag>
                <!-- Available tags -->
                <bx-tag
                  v-for="(tag, tagIdx) in findTagsForPackageName(
                    experiment.metadata.package.name
                  )"
                  :key="`tag-${tagIdx}`"
                  type="blue"
                >
                  tag: {{ tag }}
                </bx-tag>
                <!-- User metadata -->
                <bx-tag
                  v-for="label in experiment.metadata.package.keywords"
                  :key="label"
                  type="purple"
                >
                  {{ label }}
                </bx-tag>
              </dds-tag-group>
              <dds-card-footer> </dds-card-footer>
            </dds-card>
          </div>
        </div>
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

//
import { getAvailablePlatforms } from "@/functions/package_utilities";

//
const domainFilters = [
  {
    filterFor: "domain",
    displayName: "Domain",
    isOpen: true,
    filters: [
      {
        name: "computational chemistry",
        displayName: "Computational Chemistry",
      },
      {
        name: "climate",
        displayName: "Climate",
      },
    ],
  },
  {
    filterFor: "platform",
    displayName: "Platform",
    isOpen: true,
    filters: [
      {
        name: "openshift",
        displayName: "OpenShift",
      },
      {
        name: "openshift-kubeflux",
        displayName: "Kubeflux",
      },
    ],
  },
  {
    filterFor: "other",
    displayName: "Other",
    isOpen: true,
    filters: [
      {
        name: "surrogate",
        displayName: "Surrogate",
      },
    ],
  },
];

export default {
  name: "CatalogView",
  components: {},
  data() {
    return {
      domainFilters,
      selectedFilters: {},
      experiments: [],
      loading: true,
    };
  },
  computed: {
    experimentsTaggedLatest() {
      return Array.from(
        this.experiments.filter((experiment) => {
          return experiment.metadata.registry.tags.includes("latest");
        })
      );
    },
    experimentsToShow() {
      let toShow = this.experimentsTaggedLatest;
      for (const filterName in this.selectedFilters) {
        const selectedFilter = this.selectedFilters[filterName];

        // Platform has to be treated differently
        if (filterName == "platform") {
          toShow = toShow.filter(function (element) {
            let platforms = getAvailablePlatforms(element);
            return selectedFilter.every((p) => platforms.includes(p));
          });
          continue;
        }

        //
        toShow = toShow.filter(function (element) {
          return selectedFilter.every((d) =>
            element.metadata.package.keywords.includes(d)
          );
        });
      }

      return toShow;
    },
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
    getAvailablePlatforms,
    handleCheckboxSelect(event) {
      // Handle clear button
      if (event.type == "dds-selection-clear") {
        this.selectedFilters = {};
        return;
      }

      // Find the element the filter belongs to
      let selectedDomainFilter = this.domainFilters.filter((pf) =>
        pf.filters.some((f) => f.name == event.detail.value)
      )[0].filterFor;

      // Create a copy of the filters
      let updatedFilters = JSON.parse(JSON.stringify(this.selectedFilters));

      // This is a new filter
      if (!(selectedDomainFilter in updatedFilters)) {
        updatedFilters[selectedDomainFilter] = [event.detail.value];
        this.selectedFilters = updatedFilters;
        return;
      }

      // We are adding an item to a preexisting filter
      if (!updatedFilters[selectedDomainFilter].includes(event.detail.value)) {
        updatedFilters[selectedDomainFilter].push(event.detail.value);
        console.log(updatedFilters);
        this.selectedFilters = updatedFilters;
        return;
      }

      // We are removing the last filter from the selected domain
      if (updatedFilters[selectedDomainFilter].length == 1) {
        delete updatedFilters[selectedDomainFilter];
        this.selectedFilters = updatedFilters;
        return;
      }

      // We are only removing an item from the list
      updatedFilters[selectedDomainFilter] = Array.from(
        updatedFilters[selectedDomainFilter].filter(
          (f) => f != event.detail.value
        )
      );
      this.selectedFilters = updatedFilters;
    },
    findTagsForPackageName(name) {
      let tags = new Set();
      for (let i = 0; i < this.experiments.length; i++) {
        if (this.experiments[i].metadata.package.name != name) continue;
        this.experiments[i].metadata.package.tags.forEach((tag) => {
          tags.add(tag);
        });
      }
      return Array.from(tags);
    },
  },
};
</script>

<style lang="scss">
@use "@carbon/grid";
@use "@carbon/layout";
@include grid.flex-grid();

.card-row {
  margin-bottom: layout.$spacing-06;
  // max-height: 200px;
}

.card-proportions {
  max-height: 300px;
}

.breadcrumb {
  padding-bottom: layout.$spacing-07;
}
</style>
