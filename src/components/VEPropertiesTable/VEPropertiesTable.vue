<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <div>
    <template v-if="loading">
      <div class="table-overflow-container">
        <cds-table-toolbar>
          <cds-table-toolbar-content>
            <cds-table-toolbar-search
              disabled
              expanded
            ></cds-table-toolbar-search>
            <cds-overflow-menu
              leave-delay-ms="0"
              enter-delay-ms="100000"
              disabled
              toolbar-action
            >
              <img
                slot="icon"
                width="16"
                height="16"
                src="@/assets/settings.svg"
              />
            </cds-overflow-menu>
            <cds-button disabled kind="primary" type="button">
              <img
                slot="icon"
                class="white-svg"
                height="18"
                width="18"
                src="../../assets/download.svg"
              />
              Download
            </cds-button>
          </cds-table-toolbar-content>
        </cds-table-toolbar>
        <cds-table size="xl" sort>
          <cds-table-head>
            <cds-table-header-row>
              <cds-table-header-cell v-for="rowIdx in 6" :key="rowIdx"
                ><cds-skeleton-text width="50%"></cds-skeleton-text
              ></cds-table-header-cell>
            </cds-table-header-row>
          </cds-table-head>
          <cds-table-body
            ><cds-table-row v-for="rowIdx in 5" :key="rowIdx">
              <cds-table-cell v-for="cellIdx in 6" :key="cellIdx">
                <cds-skeleton-text></cds-skeleton-text
              ></cds-table-cell> </cds-table-row
          ></cds-table-body>
        </cds-table>
        <cds-pagination page-size="10" total-items="5">
          <cds-select-item
            v-for="(option, optionIdx) in tablePaginationPageSizeOptions"
            :value="option"
            :key="optionIdx"
            >{{ option }}</cds-select-item
          >
        </cds-pagination>
      </div>
    </template>

    <template v-else>
      <NoDataEmptyState
        v-if="propertiesArray.length == 0"
        message="This experiment did not produce any property or does not have a virtual experiment interface"
      />
      <div v-else>
        <cds-table-toolbar @focusout="setExpandedOnFocusOut">
          <cds-table-toolbar-content>
            <cds-table-toolbar-search
              id="search"
              expanded
              placeholder="Search by input-id"
              @cds-search-input="searchTable($event.detail.value)"
            ></cds-table-toolbar-search>
            <cds-overflow-menu
              leave-delay-ms="0"
              enter-delay-ms="100000"
              toolbar-action
            >
              <img
                slot="icon"
                width="16"
                height="16"
                src="@/assets/settings.svg"
              />
              <cds-overflow-menu-body>
                <cds-overflow-menu-item>
                  <cds-checkbox
                    checked
                    @cds-checkbox-changed="caseSensitive = !caseSensitive"
                    >Case Sensitive</cds-checkbox
                  >
                </cds-overflow-menu-item>
              </cds-overflow-menu-body>
            </cds-overflow-menu>
            <cds-button
              :disabled="propertiesArray.length == 0"
              v-if="propertiesArray.length != 0"
              kind="primary"
              type="button"
              @click="download()"
            >
              <img
                slot="icon"
                class="white-svg"
                height="18"
                width="18"
                src="../../assets/download.svg"
              />
              Download
            </cds-button>
          </cds-table-toolbar-content>
        </cds-table-toolbar>

        <NoSearchResultsEmptyState v-if="dataToDisplay.length == 0" />
        <div v-else class="table-overflow-container">
          <cds-table
            size="xl"
            sort
            cds-table-header-cell-sort="handleTableHeaderCellSort"
          >
            <cds-table-head>
              <cds-table-header-row>
                <cds-table-header-cell
                  sort-direction="none"
                  v-for="(header, idx) in propertyHeaders"
                  :key="idx"
                  :data-column-id="header"
                  >{{ header }}</cds-table-header-cell
                >
              </cds-table-header-row>
            </cds-table-head>
            <cds-table-body>
              <cds-table-row v-for="(values, idx) in getTableSlice" :key="idx">
                <cds-table-cell v-for="(value, idy) in values" :key="idy">{{
                  value
                }}</cds-table-cell>
              </cds-table-row>
            </cds-table-body>
          </cds-table>
          <cds-pagination
            :page-size="elementsToShow"
            :total-items="dataToDisplay.length"
            @cds-select-selected="handleTablePageSizesSelectChanged"
            @cds-pagination-changed-current="
              handleTablePaginationChangedCurrent
            "
          >
            <cds-select-item
              v-for="(option, optionIdx) in tablePaginationPageSizeOptions"
              :value="option"
              :key="optionIdx"
              >{{ option }}</cds-select-item
            >
          </cds-pagination>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/data-table/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/checkbox/index.js";
import "@carbon/web-components/es/components/overflow-menu/index.js";
import NoSearchResultsEmptyState from "@/components/EmptyState/NoSearchResultsEmptyState.vue";
import NoDataEmptyState from "@/components/EmptyState/NoDataEmptyState.vue";

export default {
  name: "VEPropertiesTables",
  components: {
    NoSearchResultsEmptyState,
    NoDataEmptyState,
  },
  data() {
    return {
      filename: "",
      noDataAvailable: false,
      dataToDisplay: [],
      firstElement: 0,
      elementsToShow: 5,
      sortDirection: undefined,
      sortColumnId: "",
      collator: new Intl.Collator("en"),
      tablePaginationPageSizeOptions: [5, 10, 25],
      caseSensitive: true,
    };
  },
  props: {
    id: {
      type: String,
      default: "",
    },
    propertiesArray: {
      type: Array,
      default: () => [],
    },
    propertyHeaders: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    loading: {
      handler() {
        if (this.propertiesArray.length != 0) {
          this.dataToDisplay = this.propertiesArray;
        } else {
          this.noDataAvailable = true;
        }
      },
      deep: true,
    },
    caseSensitive() {
      this.searchTable();
    },
  },
  computed: {
    getSortedElements() {
      if (this.sortDirection == undefined || this.sortDirection == "none")
        return this.dataToDisplay;

      return this.dataToDisplay.slice().sort((lhs, rhs) => {
        let index = this.propertyHeaders.indexOf(this.sortColumnId);

        const lhsValue = lhs[index];
        const rhsValue = rhs[index];

        // Always sort NaNs last
        if (
          lhsValue === undefined ||
          (typeof lhsValue !== "string" && isNaN(lhsValue))
        ) {
          return 1;
        }
        if (
          rhsValue === undefined ||
          (typeof rhsValue !== "string" && isNaN(rhsValue))
        ) {
          return -1;
        }

        // Ensure we don't sort dates by their string value
        // when using the collator
        if (lhsValue instanceof Date && rhsValue instanceof Date) {
          return this.sortDirection === "ascending"
            ? lhsValue - rhsValue
            : rhsValue - lhsValue;
        }

        return (
          (this.sortDirection === "ascending" ? 1 : -1) *
          this.collator.compare(lhsValue, rhsValue)
        );
      });
    },
    getTableSlice() {
      return this.getSortedElements.slice(
        this.firstElement,
        this.firstElement + this.elementsToShow,
      );
    },
  },
  methods: {
    handleTablePaginationChangedCurrent(event) {
      this.firstElement = event.target.start;
    },
    handleTablePagesSelectChanged(event) {
      this.firstElement = event.detail.value * this.elementsToShow;
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
    handleTableHeaderCellSort(event) {
      this.sortColumnId = event.target.getAttribute("data-column-id");
      this.sortDirection = event.detail.sortDirection;

      // Reset sorting state for others
      let headers = document.getElementsByTagName("cds-table-header-cell");
      for (let i = 0; i < headers.length; i++) {
        if (
          headers[i].getAttribute("data-column-id") !=
            event.target.getAttribute("data-column-id") &&
          headers[i].sortDirection != undefined
        )
          headers[i].sortDirection = "none";
      }
    },
    searchTable(query) {
      this.firstElement = 0;
      if (query != undefined) this.searchQuery = query;
      this.dataToDisplay = [];
      query = this.caseSensitive
        ? this.searchQuery
        : this.searchQuery.toLowerCase();
      for (let i in this.propertiesArray) {
        let inputID = this.caseSensitive
          ? this.propertiesArray[i][1]
          : this.propertiesArray[i][1].toLowerCase();

        if (inputID.includes(query))
          this.dataToDisplay.push(this.propertiesArray[i]);
      }
    },
    setExpandedOnFocusOut() {
      var attr = document.createAttribute("expanded");
      attr.value = "";
      document.getElementById("search").setAttributeNode(attr);
    },
    convertDataToCsv() {
      let csvData = [...this.propertiesArray];
      csvData.unshift(this.propertyHeaders);

      let csv = csvData
        .map(function (row) {
          return row.join();
        })
        .join("\n");

      return csv;
    },
    download() {
      let csv = encodeURIComponent(this.convertDataToCsv());

      var element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8," + csv);
      this.filename = `properties-${this.id}.csv`;
      element.setAttribute("download", this.filename);
      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/styles/svg.scss";
@use "@/styles/overflow-menu-checkbox-styles.scss";
@use "@/styles/cds-table-styles.scss";

// AP: with xl table, a 16px padding is added to the header
// and it doesn't look good with the search bar at the top
cds-table-header-cell:not(:has(cds-skeleton-text)) {
  padding: 0;
}
</style>
