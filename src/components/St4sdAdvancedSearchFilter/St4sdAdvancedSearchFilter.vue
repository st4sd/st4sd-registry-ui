<template>
  <cv-grid>
    <cv-row kind="condensed">
      <cv-column :lg="4" :xlg="4" :max="4">
        <cv-dropdown v-model="searchSelector">
          <cv-dropdown-item
            v-for="searchSelector in searchSelectorArray"
            v-bind:key="searchSelector.Id"
            v-bind:value="searchSelector.Id"
            >{{ searchSelector.Name }}</cv-dropdown-item
          >
        </cv-dropdown>
      </cv-column>
      <cv-column :lg="12" :xlg="12" :max="12">
        <cv-search id="advancedSearchBar" v-model="searchQuery"></cv-search>
      </cv-column>
    </cv-row>
  </cv-grid>
</template>

<script>
import axios from "axios";

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
      ],
      searchSelector: "",
      clearButtonToggle: true,
      debounceDelay: 1000,
    };
  },
  watch: {
    searchQuery(...args) {
      this.startLoadingWheel();
      this.debouncedHandler(...args);
    },
    searchSelector() {
      this.startLoadingWheel();
      this.getSearchedExperiments();
    },
  },
  created() {
    this.debouncedHandler = debounce(() => {
      this.handleSearchQueryChanges();
    }, this.debounceDelay);
  },
  mounted() {
    this.searchSelector = "name";
  },
  beforeUnmount() {
    this.debouncedHandler.cancel();
  },
  methods: {
    handleSearchQueryChanges() {
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
      let response = await axios.get(
        window.location.origin +
          `/registry-ui/backend/experiments/?searchSelector=${this.searchSelector}&searchQuery=${this.searchQuery}`
      );
      this.searchedExperiments = response.data;
      this.$emit("updateSearchedExperiments", this.searchedExperiments);
      this.$emit("LoadingWheelStatusChanged", false);
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
</style>
