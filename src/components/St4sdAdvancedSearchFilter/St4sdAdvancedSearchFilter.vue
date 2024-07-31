<template>
  <div class="cds--css-grid cds--css-grid--condensed cds--css-grid--full-width">
    <div
      class="cds--css-grid-column cds--lg:col-span-4 cds--md:col-span-8 cds--sm:col-span-4"
    >
      <cds-dropdown
        size="lg"
        :value="searchSelector"
        @cds-dropdown-selected="updateSearchSelector"
      >
        <cds-dropdown-item
          v-for="(searchSelector, idx) in searchSelectorArray"
          :key="idx"
          :value="searchSelector.Id"
          >{{ searchSelector.Name }}
        </cds-dropdown-item>
      </cds-dropdown>
    </div>
    <div class="cds--css-grid-column cds--col-span-12">
      <cds-search
        size="lg"
        id="advancedSearchBar"
        @cds-search-input="updateSearchQuery"
      ></cds-search>
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

<style scoped lang="scss">
@use "@carbon/layout";

.card-row {
  margin-bottom: layout.$spacing-06;
}

.cds--css-grid--full-width {
  padding: 0;
}

.cds--css-grid--condensed > .cds--css-grid-column {
  margin: 0;
}

/*
   AP:
   The input in the shadow root of the cds-search sets box-sizing to be
   border-box. This causes the input to appear 1px smaller than the
   dropdown. Unsetting it fixes it
   ref: https://github.com/carbon-design-system/carbon-for-ibm-dotcom/issues/11917
*/
cds-search::part(input) {
  box-sizing: unset;
}
</style>
