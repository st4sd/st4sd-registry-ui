<template>
  <div>
    <template v-if="experimentsLoading">
      <div class="card-row" id="experimentLoadingContainer">
        <bx-loading id="experimentLoadingWheel" type="overlay"></bx-loading>
      </div>
    </template>
    <template v-else>
      <div
        class="card-row"
        v-for="experiment in getPageSlice"
        :key="experiment.metadata.package.name"
      >
        <dds-card
          color-scheme="light"
          border="true"
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
                Object.keys(experiment.metadata.registry.interface).length != 0
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
      <div v-if="experimentsToShow.length != 0">
        <bx-pagination
          :page-size="elementsToShow"
          :start="firstElement"
          :total="experimentsToShow.length"
          @bx-pages-select-changed="handleTablePagesSelectChanged"
          @bx-pagination-changed-current="handleTablePaginationChangedCurrent"
          @bx-page-sizes-select-changed="handleTablePageSizesSelectChanged"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <bx-page-sizes-select slot="page-sizes-select">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </bx-page-sizes-select>
          <bx-pages-select></bx-pages-select>
        </bx-pagination>
      </div>
      <div id="no-results-message" v-else>
        <p>No matching experiments</p>
      </div>
    </template>
  </div>
</template>

<script>
import { getAvailablePlatforms } from "@/functions/package_utilities";
import "@carbon/web-components/es/components/pagination/index.js";

export default {
  props: {
    searchedExperiments: Array,
    selectedFilters: Object,
    experiments: Array,
    experimentsLoading: Boolean,
  },
  data() {
    return {
      firstElement: 0,
      elementsToShow: 5,
    };
  },
  computed: {
    //--------
    getPageSlice() {
      return this.experimentsToShow.slice(
        this.firstElement,
        this.firstElement + this.elementsToShow
      );
    },
    //--------
    experimentsTaggedLatest() {
      return Array.from(
        this.searchedExperiments.filter((experiment) => {
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
      this.handleFilterSelect();
      return toShow;
    },
  },
  methods: {
    getAvailablePlatforms,
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
    handleFilterSelect() {
      this.firstElement = 0;
    },
    handleTablePaginationChangedCurrent(event) {
      this.firstElement = event.detail.start;
    },
    handleTablePagesSelectChanged(event) {
      this.firstElement = event.detail.value * this.elementsToShow;
    },
    handleTablePageSizesSelectChanged(event) {
      this.firstElement = 0;
      this.elementsToShow = event.detail.value;
    },
  },
};
</script>

<style lang="scss">
@use "@carbon/grid";
@use "@carbon/layout";
.card-row {
  margin-top: layout.$spacing-05;
  // max-height: 200px;
}

.card-proportions {
  max-height: 300px;
}

@media screen and (max-width: 750px) {
  .card-proportions {
    max-height: 350px;
  }
}

@media screen and (max-width: 672px) {
  .card-proportions {
    max-height: none;
  }
  .bx--link {
    overflow-wrap: anywhere;
  }
}

#no-results-message {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  text-decoration: underline 1px;
  text-underline-offset: 5px;
  text-align: center;
}

#experimentLoadingContainer {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  padding-top: 100px;
}

#experimentLoadingWheel {
  display: inline-block;
  animation: none;
}
</style>
