<template>
  <div>
    <template v-if="loading">
      <div class="card-row" id="experimentLoadingContainer">
        <bx-loading id="experimentLoadingWheel" type="overlay"></bx-loading>
      </div>
    </template>
    <template v-else>
      <NoDataEmptyState
        class="full-height-empty-state"
        v-if="experiments.length == 0"
        message="Add some virtual experiments to see them here"
      />
      <NoSearchResultsEmptyState
        class="full-height-empty-state"
        v-else-if="experimentsToShow.length == 0"
      />
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
          <div class="tag-group-container">
            <!-- VE interface -->
            <cds-tag
              v-if="
                Object.keys(experiment.metadata.registry.interface).length != 0
              "
              type="green"
            >
              virtual-experiment
            </cds-tag>
            <!-- Platform -->
            <cds-tag
              v-for="(platform, platformIdx) in getAvailablePlatforms(
                experiment,
              )"
              :key="`platform-${platformIdx}`"
              type="red"
            >
              platform: {{ platform }}
            </cds-tag>
            <!-- Available tags -->
            <cds-tag
              v-for="(tag, tagIdx) in findTagsForPackageName(
                experiment.metadata.package.name,
              )"
              :key="`tag-${tagIdx}`"
              type="blue"
            >
              tag: {{ tag }}
            </cds-tag>
            <!-- User metadata -->
            <cds-tag
              v-for="label in experiment.metadata.package.keywords"
              :key="label"
              type="purple"
            >
              {{ label }}
            </cds-tag>
          </div>
          <dds-card-footer> </dds-card-footer>
        </dds-card>
      </div>

      <div>
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
    </template>
  </div>
</template>

<script>
import { getAvailablePlatforms } from "@/functions/package_utilities";
import NoSearchResultsEmptyState from "@/components/EmptyState/NoSearchResultsEmptyState.vue";
import NoDataEmptyState from "@/components/EmptyState/NoDataEmptyState.vue";
import "@carbon/web-components/es/components/pagination/index.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/tag.min.js";

export default {
  components: {
    NoSearchResultsEmptyState,
    NoDataEmptyState,
  },
  props: {
    searchedExperiments: Array,
    selectedFilters: Object,
    experiments: Array,
    loading: Boolean,
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
        this.firstElement + this.elementsToShow,
      );
    },
    //--------
    experimentsTaggedLatest() {
      return Array.from(
        this.searchedExperiments.filter((experiment) => {
          return experiment.metadata.registry.tags.includes("latest");
        }),
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
            element.metadata.package.keywords.includes(d),
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

@import "@/styles/empty_state_styles.scss";
@import "@/styles/cds-tag-styles.scss";

.card-row {
  margin-top: layout.$spacing-05;
}

.card-proportions {
  max-height: 300px;
}

@media screen and (max-width: 750px) {
  .card-proportions {
    max-height: 350px;
  }
}

@media screen and (max-width: 671px) {
  .card-proportions {
    max-height: none;
  }
  .bx--link {
    overflow-wrap: anywhere;
  }
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
