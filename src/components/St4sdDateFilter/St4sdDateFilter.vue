<template>
  <div class="date-filter-container">
    <div class="search-dropdown-container">
      <bx-dropdown
        labelText="Filter runs by creation date:"
        :disabled="loading || data.length == 0"
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
    <div v-if="searchSelector == 'custom'" class="date-picker-container">
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
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/date-picker.min.js";

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

<style scoped>
.date-filter-container {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.search-dropdown-container {
  padding: 0;
  border-right: 2px;
  border-color: #ffffff;
}

.date-picker-container {
  padding: 0;
  padding-top: 1.5px;
  padding-left: 1rem;
}

bx-dropdown {
  display: inline-block;
  width: 18rem;
}

@media screen and (max-width: 671px) {
  .date-filter-container {
    flex-direction: column;
  }
  .date-picker-container {
    padding-top: 2rem;
    padding-left: 0;
  }
}
</style>
