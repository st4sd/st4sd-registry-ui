<template>
  <div>
    <template v-if="loading">
      <div class="card-row" v-for="i in 3" :key="i">
        <St4sdSkeletonVirtualExperimentCard />
      </div>
      <div>
        <cds-pagination page-size="5" total-items="3"> </cds-pagination>
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
        <St4sdVirtualExperimentCard
          :experiment="experiment"
          :tags="findTagsForPackageName(experiment.metadata.package.name)"
        />
      </div>
      <div>
        <cds-pagination
          page-size="10"
          :total-items="experimentsToShow.length"
          @cds-select-selected="handleTablePageSizesSelectChanged"
          @cds-pagination-changed-current="handleTablePaginationChangedCurrent"
        >
          <cds-select-item
            v-for="(option, optionIdx) in tablePaginationPageSizeOptions"
            :value="option"
            :key="optionIdx"
            >{{ option }}</cds-select-item
          >
        </cds-pagination>
      </div>
    </template>
  </div>
</template>

<script>
import { getAvailablePlatforms } from "@/functions/package_utilities";
import St4sdSkeletonVirtualExperimentCard from "@/components/St4sdExperimentCards/St4sdSkeletonVirtualExperimentCard.vue";
import St4sdVirtualExperimentCard from "@/components/St4sdExperimentCards/St4sdVirtualExperimentCard.vue";
import NoSearchResultsEmptyState from "@/components/EmptyState/NoSearchResultsEmptyState.vue";
import NoDataEmptyState from "@/components/EmptyState/NoDataEmptyState.vue";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/pagination.min.js";

export default {
  components: {
    NoSearchResultsEmptyState,
    NoDataEmptyState,
    St4sdVirtualExperimentCard,
    St4sdSkeletonVirtualExperimentCard,
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
      tablePaginationPageSizeOptions: [10, 25, 50],
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
      this.firstElement = event.target.start;
    },
    // AP: TODO FIXME:
    // This is a hack required because CDS 2.8/2.10 pagination raises
    // this event even when selecting the dropdown on the right side
    // of the pagination component.
    // https://github.com/carbon-design-system/carbon-for-ibm-dotcom/issues/11923
    handleTablePageSizesSelectChanged(event) {
      let newPageSize = Number(event.detail.value);

      if (this.tablePaginationPageSizeOptions.includes(newPageSize)) {
        this.elementsToShow = newPageSize;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
@import "@/styles/empty_state_styles.scss";

.card-row {
  margin-top: layout.$spacing-05;
}
</style>
