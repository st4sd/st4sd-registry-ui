<template>
  <div>
    <template v-if="loading">
      <div class="tableOverflowContainer">
        <bx-table sort>
          <bx-table-head>
            <bx-table-header-row>
              <bx-table-header-cell
                sort-direction="none"
                v-for="cellIdx in 6"
                :key="cellIdx"
              ></bx-table-header-cell>
            </bx-table-header-row>
          </bx-table-head>
          <bx-table-body
            ><bx-table-row v-for="rowIdx in 5" :key="rowIdx">
              <bx-table-cell-skeleton
                v-for="cellIdx in 6"
                :key="cellIdx"
              ></bx-table-cell-skeleton> </bx-table-row
          ></bx-table-body>
        </bx-table>
        <bx-pagination page-size="5" start="0" :total="5">
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

    <template v-else>
      <div id="no-results-message" v-if="noDataAvailable">
        <p>No Properties Avaiblable</p>
      </div>
      <div v-else>
        <bx-table-toolbar @focusout="setExpandedOnFocusOut">
          <bx-table-toolbar-content>
            <bx-table-toolbar-search
              id="search"
              expanded
              placeholder="Search by input-id"
              @bx-search-input="searchTable"
            ></bx-table-toolbar-search>
            <bx-btn
              :disabled="propertiesArray.length == 0"
              v-if="propertiesArray.length != 0"
              class="bx--btn--primary"
              type="button"
              @click="download()"
            >
              <p class="download-text">Download&nbsp;</p>

              <img class="download-icon" src="../../assets/download.svg"
            /></bx-btn>
          </bx-table-toolbar-content>
        </bx-table-toolbar>
        <div class="tableOverflowContainer">
          <bx-table sort @bx-table-header-cell-sort="handleTableHeaderCellSort">
            <bx-table-head>
              <bx-table-header-row>
                <bx-table-header-cell
                  sort-direction="none"
                  v-for="(header, idx) in propertyHeaders"
                  :key="idx"
                  :data-column-id="header"
                  >{{ header }}</bx-table-header-cell
                >
              </bx-table-header-row>
            </bx-table-head>
            <bx-table-body>
              <bx-table-row v-for="(values, idx) in getTableSlice" :key="idx">
                <bx-table-cell v-for="(value, idy) in values" :key="idy">{{
                  value
                }}</bx-table-cell>
              </bx-table-row>
            </bx-table-body>
          </bx-table>
          <NoSearchResultsEmptyState v-if="dataToDisplay.length == 0" />
          <bx-pagination
            :page-size="elementsToShow"
            :start="firstElement"
            :total="dataToDisplay.length"
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
      </div>
    </template>
  </div>
</template>

<script>
import NoSearchResultsEmptyState from "@/components/EmptyState/NoSearchResultsEmptyState.vue";

export default {
  name: "VEPropertiesTables",
  components: {
    NoSearchResultsEmptyState,
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
        )
          return -1;

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
      this.firstElement = event.detail.start;
    },
    handleTablePagesSelectChanged(event) {
      this.firstElement = event.detail.value * this.elementsToShow;
    },
    handleTablePageSizesSelectChanged(event) {
      this.firstElement = 0;
      this.elementsToShow = event.detail.value;
    },
    handleTableHeaderCellSort(event) {
      this.sortColumnId = event.target.getAttribute("data-column-id");
      this.sortDirection = event.detail.sortDirection;

      // Reset sorting state for others
      let headers = document.getElementsByTagName("bx-table-header-cell");
      for (let i = 0; i < headers.length; i++) {
        if (
          headers[i].getAttribute("data-column-id") !=
            event.target.getAttribute("data-column-id") &&
          headers[i].sortDirection != undefined
        )
          headers[i].sortDirection = "none";
      }
    },
    searchTable(event) {
      this.firstElement = 0;
      this.searchQuery = event.detail.value;
      this.dataToDisplay = [];
      for (let i in this.propertiesArray) {
        if (this.propertiesArray[i][1].includes(this.searchQuery)) {
          this.dataToDisplay.push(this.propertiesArray[i]);
        }
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

<style>
bx-table-cell,
bx-table-header-cell {
  text-align: center;
}

.bx--btn--primary {
  margin-top: 0;
}

.tableOverflowContainer {
  width: 100%;
  overflow-x: scroll;
}

#no-results-message {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  text-decoration: underline 1px;
  text-underline-offset: 5px;
  text-align: center;
}

.download-icon {
  height: 16px;
  width: 16px;
  filter: invert(100);
}
</style>
