<template>
  <div class="cds--css-grid cds--css-grid--narrow cds--css-grid--full-width">
    <div class="cds--css-grid-column cds--col-span-4 top-row-on-mobile">
      <cds-dropdown
        titleText="Filter runs by creation date:"
        :disabled="loading || data.length == 0"
        :value="searchSelector"
        @cds-dropdown-selected="searchSelector = $event.target.value"
      >
        <cds-dropdown-item
          v-for="(searchSelector, idx) in searchSelectorArray"
          :key="idx"
          :value="searchSelector.Id"
          :disabled="loading || data.length == 0"
          >{{ searchSelector.Name }}
        </cds-dropdown-item>
      </cds-dropdown>
    </div>
    <div
      v-if="searchSelector == 'custom'"
      class="cds--css-grid-column cds--col-span-4"
    >
      <cds-date-picker
        date-format="d/m/y"
        @cds-date-picker-changed="handleDatePickerChange"
      >
        <cds-date-picker-input
          kind="from"
          label-text="From:"
          placeholder="dd/mm/yy"
        >
        </cds-date-picker-input>
        <cds-date-picker-input
          kind="to"
          label-text="To:"
          placeholder="dd/mm/yy"
        >
        </cds-date-picker-input>
      </cds-date-picker>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/date-picker/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";

export default {
  name: "St4sdDateFilter",
  emits: ["updateDataToDisplay"],
  props: {
    data: Array,
    loading: Boolean,
  },
  data() {
    return {
      filteredData: [],
      searchSelector: "",
      searchSelectorArray: [
        { Id: "all time", Name: "All time" },
        { Id: 30, Name: "Past 30 days" },
        { Id: 60, Name: "Past 60 Days" },
        { Id: 90, Name: "Past 90 Days" },
        { Id: "custom", Name: "Custom" },
      ],
    };
  },
  mounted() {
    this.searchSelector = this.searchSelectorArray[0].Id;
  },
  watch: {
    loading() {
      this.handleDateFilterSelected();
      this.emitFilteredData();
    },
    searchSelector() {
      this.handleDateFilterSelected();
      this.emitFilteredData();
    },
  },
  methods: {
    handleDatePickerChange(event) {
      let customDates = this.getUserSelectedDates(event);

      if (customDates != null) {
        this.filterRunsByDate(customDates[0], customDates[1]);
        this.emitFilteredData();
      }
    },
    handleDateFilterSelected() {
      if (typeof this.searchSelector != "string") {
        let toDate = new Date();
        let fromDate = new Date();
        fromDate.setDate(toDate.getDate() - this.searchSelector);

        this.filterRunsByDate(fromDate, toDate);
      } else {
        this.filteredData = this.data;
      }
    },
    getUserSelectedDates(event) {
      // The event fires each time a value is entered, so we need to wait until both values have been entered
      if (event.detail.selectedDates.length != 2) {
        return null;
      }

      return event.detail.selectedDates;
    },
    filterRunsByDate(fromDateFilter, toDateFilter) {
      this.filteredData = [];

      for (let i = 0; i < this.data.length; i++) {
        if (isNaN(this.data[i].creationDate)) {
          continue;
        }

        if (
          this.data[i].creationDate >= fromDateFilter &&
          this.data[i].creationDate <= toDateFilter
        ) {
          this.filteredData.push(this.data[i]);
        }
      }
    },
    emitFilteredData() {
      this.$emit("updateDataToDisplay", this.filteredData);
    },
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";

.cds--css-grid--full-width {
  padding: 0;
}

@media screen and (max-width: 671px) {
  .cds--css-grid-column {
    margin: 0;
  }

  /* AP: add some spacing between the rows on mobile*/
  .cds--css-grid-column.top-row-on-mobile {
    margin-bottom: layout.$spacing-05;
  }
}
</style>
