<template>
  <div>
    <template v-if="loading">
      <bx-table-toolbar>
        <bx-table-toolbar-search
          expanded
          placeholder="Search by input-id"
        ></bx-table-toolbar-search>
        <bx-btn-skeleton></bx-btn-skeleton>
      </bx-table-toolbar>
      <bx-table>
        <bx-table-head>
          <bx-table-header-row
            ><bx-table-header-cell-skeleton></bx-table-header-cell-skeleton>
            <bx-table-header-cell-skeleton></bx-table-header-cell-skeleton>
            <bx-table-header-cell-skeleton></bx-table-header-cell-skeleton
          ></bx-table-header-row>
        </bx-table-head>
        <bx-table-body
          ><bx-table-row v-for="rowIdx in 5" :key="rowIdx">
            <bx-table-cell-skeleton
              v-for="cellIdx in 3"
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
    </template>

    <template v-else>
      <div>
        <bx-table-toolbar
          v-if="properties.length != 0"
          @focusout="setExpandedOnFocusOut"
        >
          <bx-table-toolbar-content>
            <bx-table-toolbar-search
              id="search"
              expanded
              placeholder="Search by input-id"
              @bx-search-input="searchTable"
            ></bx-table-toolbar-search>
            <bx-btn
              :disabled="propertiesToDisplay.length == 0"
              v-if="properties != []"
              class="bx--btn--primary"
              type="button"
              @click="download()"
            >
              <p class="download-text">Download&nbsp;</p>

              <img class="download-icon" src="../../assets/download.svg"
            /></bx-btn>
          </bx-table-toolbar-content>
        </bx-table-toolbar>
        <div id="no-results-message" v-if="propertiesToDisplay.length == 0">
          <p>No Properties Available</p>
        </div>
        <div class="tableOverflowContainer" v-else>
          <bx-table>
            <bx-table-head>
              <bx-table-header-row>
                <bx-table-header-cell
                  v-for="header in propertyHeaders"
                  :key="header"
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
            :total="propertiesToDisplay.length"
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
import axios from "axios";

export default {
  name: "RunPropertiesTable",
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
    };
  },
  mounted() {
    axios
      .get(
        window.location.origin +
          "/registry-ui/backend/properties/" +
          this.experiment_id +
          "/" +
          this.rest_uid
      )
      .then((response) => {
        if (Object.keys(response.data).length != 0) {
          //Extract property values into an Array that can be looped through in the HTML
          this.properties = this.getPropertiesArray(
            Object.values(response.data)[0]
          );

          //Extract the property keys into an Array
          this.propertyHeaders = Object.keys(Object.values(response.data)[0]);

          //Move Label and Input ID to front of property and property headers Arrays
          this.moveItemToFrontOfTable("label");
          this.moveItemToFrontOfTable("input-id");
        }
        this.propertiesToDisplay = this.properties;
        this.loading = false;
      });
  },
  computed: {
    getTableSlice() {
      return this.propertiesToDisplay.slice(
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
  },
};
</script>

<style scoped>
.tableOverflowContainer {
  width: 100%;
  overflow-x: scroll;
}

bx-table-cell,
bx-table-header-cell {
  text-align: center;
}

#no-results-message {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  text-decoration: underline 1px;
  text-underline-offset: 5px;
  text-align: center;
}

.bx--btn--primary {
  margin-top: 0;
}

@media screen and (max-width: 672px) {
  .download-text {
    display: none;
  }
  bx-btn {
    padding: 0;
    width: 3rem;
  }
}
</style>
