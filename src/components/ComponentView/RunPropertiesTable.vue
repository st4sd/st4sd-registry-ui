<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <div>
    <template v-if="loading">
      <cds-table-toolbar>
        <cds-table-toolbar-search
          expanded
          disabled
          placeholder="Search by input-id"
        ></cds-table-toolbar-search>
        <cds-button disabled type="primary">
          <img
            slot="icon"
            class="white-svg"
            height="18"
            width="18"
            src="../../assets/download.svg"
          />Download</cds-button
        >
      </cds-table-toolbar>
      <cds-table size="lg">
        <cds-table-head>
          <cds-table-header-row
            ><cds-table-header-cell v-for="cellIdx in 5" :key="cellIdx"
              ><cds-skeleton-text
                width="50%"
                type="heading"
              ></cds-skeleton-text></cds-table-header-cell
          ></cds-table-header-row>
        </cds-table-head>
        <cds-table-body
          ><cds-table-row v-for="rowIdx in 5" :key="rowIdx">
            <cds-table-cell v-for="cellIdx in 5" :key="cellIdx"
              ><cds-skeleton-text type="line"></cds-skeleton-text
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
    </template>

    <template v-else>
      <div>
        <cds-table-toolbar
          v-if="properties.length != 0"
          @focusout="setExpandedOnFocusOut"
        >
          <cds-table-toolbar-content>
            <cds-table-toolbar-search
              id="search"
              expanded
              placeholder="Search by input-id"
              @cds-search-input="searchTable"
            ></cds-table-toolbar-search>
            <cds-button
              :disabled="propertiesToDisplay.length == 0"
              v-if="properties != []"
              type="primary"
              @click="download()"
            >
              <img
                slot="icon"
                class="white-svg"
                height="18"
                width="18"
                src="../../assets/download.svg"
              />Download</cds-button
            >
          </cds-table-toolbar-content>
        </cds-table-toolbar>
        <HttpErrorEmptyState
          errorDescription="Unable to fetch properties"
          :errorStatusText="errorStatusText"
          :errorCode="errorCode"
          v-if="isError"
        />

        <NoDataEmptyState
          v-else-if="propertiesToDisplay.length == 0"
          message="This run has no properties available"
        />

        <div class="tableOverflowContainer" v-else>
          <cds-table size="lg">
            <cds-table-head>
              <cds-table-header-row>
                <cds-table-header-cell
                  v-for="header in propertyHeaders"
                  :key="header"
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
            :total-items="propertiesToDisplay.length"
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
import "@carbon/web-components/es/components/pagination/index.js";
import axios from "axios";

import HttpErrorEmptyState from "@/components/EmptyState/HttpError.vue";
import NoDataEmptyState from "@/components/EmptyState/NoDataEmptyState.vue";

export default {
  name: "RunPropertiesTable",
  components: {
    HttpErrorEmptyState,
    NoDataEmptyState,
  },
  props: {
    experiment_id: String,
    rest_uid: String,
  },
  data() {
    return {
      properties: [],
      propertyHeaders: [],
      propertiesToDisplay: [],
      loading: true,
      firstElement: 0,
      elementsToShow: 5,
      searchQuery: "",
      filename: "properties-" + this.rest_uid + ".csv",
      isError: false,
      errorStatusText: "",
      errorCode: 0,
      tablePaginationPageSizeOptions: [5, 10, 25],
    };
  },
  mounted() {
    axios
      .get(
        window.location.origin +
          "/registry-ui/backend/properties/" +
          this.experiment_id +
          "/" +
          this.rest_uid,
      )
      .then((response) => {
        if (Object.keys(response.data).length != 0) {
          //Extract property values into an Array that can be looped through in the HTML
          this.properties = this.getPropertiesArray(
            Object.values(response.data)[0],
          );

          //Extract the property keys into an Array
          this.propertyHeaders = Object.keys(Object.values(response.data)[0]);

          //Move Label and Input ID to front of property and property headers Arrays
          this.moveItemToFrontOfTable("label");
          this.moveItemToFrontOfTable("input-id");
        }
        this.propertiesToDisplay = this.properties;
      })
      .catch((error) => {
        this.errorStatusText = error.response.statusText;
        this.errorCode = error.response.status;
        this.isError = true;
        this.updateErrorHandling(error);
      })
      .finally(() => {
        this.loading = false;
      });
  },
  computed: {
    getTableSlice() {
      return this.propertiesToDisplay.slice(
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
    moveItemToFrontOfTable(item) {
      //Moves a properties header and values to the front of there respective arrays
      if (this.propertyHeaders.includes(item)) {
        let index = this.propertyHeaders.indexOf(item);

        let itemHeader = this.propertyHeaders[index];

        this.propertyHeaders.splice(index, 1);
        this.propertyHeaders.unshift(itemHeader);

        for (let x = 0; x < this.properties.length; x++) {
          let tempData = this.properties[x][index];
          this.properties[x].splice(index, 1);
          this.properties[x].unshift(tempData);
        }
      }
    },
    getPropertiesArray(data) {
      let propertiesArray = [];
      for (let value = 0; value < Object.values(data)[0].length; value++) {
        let rowOfProperties = [];
        for (
          let propertyValues = 0;
          propertyValues < Object.values(data).length;
          propertyValues++
        ) {
          rowOfProperties.push(Object.values(data)[propertyValues][value]);
        }

        propertiesArray.push(rowOfProperties);
      }
      return propertiesArray;
    },
    searchTable(event) {
      this.firstElement = 0;
      this.searchQuery = event.detail.value;
      this.propertiesToDisplay = [];
      for (let i in this.properties) {
        if (this.properties[i][0].includes(this.searchQuery)) {
          this.propertiesToDisplay.push(this.properties[i]);
        }
      }
    },
    setExpandedOnFocusOut() {
      var attr = document.createAttribute("expanded");
      attr.value = "";
      document.getElementById("search").setAttributeNode(attr);
    },
    convertDataToCsv() {
      let csvData = [...this.propertiesToDisplay];
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
      element.setAttribute("download", this.filename);
      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    updateErrorHandling(error) {
      this.$emit("updatePropertyErrorHandling", error);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/svg.scss";

.tableOverflowContainer {
  width: 100%;
  overflow-x: scroll;
}
</style>
