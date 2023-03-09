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
      <div>
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
        <div id="no-results-message" v-if="dataToDisplay.length == 0">
          <p>No Properties Avaiblable</p>
        </div>
        <div class="tableOverflowContainer" v-else>
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
          <bx-pagination
            :page-size="elementsToShow"
            :start="firstElement"
            :total="dataToDisplay.length"
            @bx-pages-select-changed="handleTablePagesSelectChanged"
            @bx-pagination-changed-current="handleTablePaginationChangedCurrent"
            @bx-page-sizes-select-changed="handleTablePageSizesSelectChanged"
          >
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
export default {
  name: "VEPropertiesTables",
  data() {
    return {
      loading: true,
      filename: "",
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
  },
  watch: {
    propertiesArray() {
      if (this.propertiesArray.length != 0) {
        this.dataToDisplay = this.propertiesArray;
        this.loading = false;
      }
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

        return (
          (this.sortDirection === "ascending" ? 1 : -1) *
          this.collator.compare(lhsValue, rhsValue)
        );
      });
    },
    getTableSlice() {
      return this.getSortedElements.slice(
        this.firstElement,
        this.firstElement + this.elementsToShow
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
