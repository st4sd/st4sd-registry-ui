<template>
  <div class="search-container cds--row">
    <div
      class="cds--col-lg-4 cds--col-xlg-4 cds--col-max-4 search-dropdown-container"
    >
      <bx-dropdown
        size="xl"
        :value="searchSelector"
        @bx-dropdown-selected="updateSearchSelector"
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
        @bx-search-input="updateSearchQuery"
      ></bx-search>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/search/index.js";

export default {
  name: "AdvancedSearchFilter",
  props: {
    searchSelectorArray: Array,
  },
  data() {
    return {
      searchSelector: "",
      clearButtonToggle: true,
    };
  },
  mounted() {
    this.searchSelector = this.searchSelectorArray[0].Id;
  },
  methods: {
    updateSearchQuery(event) {
      this.$emit("st4sd-search-query-changed", event.detail.value);
    },
    updateSearchSelector(event) {
      this.$emit("st4sd-search-selector-changed", event.target.value);
    },
  },
};
</script>

<style lang="scss">
@use "@carbon/grid";
@use "@carbon/layout";
.bx--list-box {
  max-height: 3rem;
  height: 3rem;
}
.card-row {
  margin-bottom: layout.$spacing-06;
}

@media screen and (min-width: 1056px) {
  .search-bar-container {
    padding-left: 0 !important;
  }

  .search-dropdown-container {
    padding-right: 0 !important;
  }
}
</style>
