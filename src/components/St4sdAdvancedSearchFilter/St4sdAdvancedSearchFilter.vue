<template>
  <div class="cds--grid search-container">
    <div class="cds--row cds--grid--condensed">
      <div
        class="cds--col-lg-4 cds--col-xlg-4 cds--col-max-4 search-dropdown-container"
      >
        <bx-dropdown
          size="xl"
          :value="searchSelector"
          @bx-dropdown-selected="searchSelector = $event.target.value"
        >
          <bx-dropdown-item
            v-for="(searchSelector, idx) in searchSelectorArray"
            :key="idx"
            :value="searchSelector.Id"
            >{{ searchSelector.Name }}
          </bx-dropdown-item>
        </bx-dropdown>
      </div>
      <div
        class="cds--col-lg-12 cds--col-xlg-12 cds--col-max-12 search-bar-container"
      >
        <bx-search
          size="xl"
          id="advancedSearchBar"
          @bx-search-input="handleSearchQueryChanges"
        ></bx-search>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/search/index.js";
import debounce from "lodash.debounce";

export default {
  name: "AdvancedSearchFilter",
  props: {
    experiments: Array,
  },
  data() {
    return {
      searchQuery: "",
      searchedExperiments: [],
      searchSelectorArray: [
        { Id: "name", Name: "Experiment Name" },
        { Id: "description", Name: "Experiment Description" },
        { Id: "maintainer", Name: "Experiment Maintainer" },
        { Id: "property_name", Name: "Property Name" },
      ],
      searchSelector: "",
      clearButtonToggle: true,
      debounceDelay: 1000,
    };
  },
  watch: {
    searchSelector() {
      this.startLoadingWheel();
      this.getSearchedExperiments();
    },
  },
  created() {
    this.debouncedHandler = debounce(() => {
      this.updateSearchedExperiments();
    }, this.debounceDelay);
  },
  mounted() {
    this.searchSelector = this.searchSelectorArray[0].Id;
  },
  beforeUnmount() {
    this.debouncedHandler.cancel();
  },
  methods: {
    handleSearchQueryChanges(event, ...args) {
      this.searchQuery = event.detail.value;
      this.startLoadingWheel();
      this.debouncedHandler(...args);
    },
    updateSearchedExperiments() {
      if (this.searchQuery == "") {
        this.searchedExperiments = this.experiments;
        this.$emit("updateSearchedExperiments", this.searchedExperiments);
        this.$emit("LoadingWheelStatusChanged", false);
      } else {
        this.getSearchedExperiments();
      }
    },
    startLoadingWheel() {
      this.$emit("LoadingWheelStatusChanged", true);
    },
    async getSearchedExperiments() {
      let response = await axios
        .get(
          window.location.origin +
            `/registry-ui/backend/experiments/?searchSelector=${this.searchSelector}&searchQuery=${this.searchQuery}`,
        )
        .catch((error) => {
          this.updateErrorHandling(error);
        });
      this.searchedExperiments = response.data.entries;
      this.$emit("updateSearchedExperiments", this.searchedExperiments);
      this.$emit("LoadingWheelStatusChanged", false);
    },
    updateErrorHandling(error) {
      this.$emit("updateErrorHandling", error);
    },
  },
};
</script>

<style lang="scss">
@use "@carbon/grid";
@use "@carbon/layout";
@media (min-width: 42rem) {
  .bx--grid {
    padding: 0 1rem;
  }
}

.bx--grid {
  max-width: none;
}

.bx--list-box {
  max-height: 3rem;
  height: 3rem;
}
.card-row {
  margin-bottom: layout.$spacing-06;
}
bx-search {
  border-left: 1px solid #ffffff;
}

.search-bar-container {
  padding: 0;
}

.search-dropdown-container {
  padding: 0;
  border-right: 2px;
  border-color: #ffffff;
}

.search-container {
  padding: 0 1rem !important;
  max-width: none !important;
  height: 3rem !important;
}
</style>
