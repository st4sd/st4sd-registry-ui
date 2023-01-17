<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div class="cds--grid cds--grid--full-width">
    <St4sdBreadcrumb
      :breadcrumbs="[
        { name: 'Virtual Experiments', path: '/' },
        {
          name: id,
          path: `/experiment/${id}`,
        },
        {
          name: 'Runs',
          path: `/experiment/${id}/runs`,
        },
      ]"
    />

    <template v-if="loading">
      <div class="tableOverflowContainer">
        <bx-table-toolbar>
          <bx-table-toolbar-search
            expanded
            placeholder="Search by REST UID"
          ></bx-table-toolbar-search>
        </bx-table-toolbar>
        <bx-table>
          <bx-table-head>
            <bx-table-header-row>
              <bx-table-header-cell sort-direction="none"
                >REST UID</bx-table-header-cell
              >
              <bx-table-header-cell sort-direction="none"
                >State</bx-table-header-cell
              >
              <bx-table-header-cell sort-direction="none"
                >Exit status</bx-table-header-cell
              >
              <bx-table-header-cell sort-direction="none"
                >ST4SD Version</bx-table-header-cell
              >
              <bx-table-header-cell sort-direction="none"
                >Package Digest</bx-table-header-cell
              >
              <bx-table-header-cell>Logs</bx-table-header-cell>
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
      <div class="tableOverflowContainer">
        <bx-table-toolbar @focusout="setExpandedOnFocusOut">
          <bx-table-toolbar-search
            id="search"
            expanded
            placeholder="Search by REST UID"
            @bx-search-input="searchTable"
          ></bx-table-toolbar-search>
        </bx-table-toolbar>
        <bx-table sort @bx-table-header-cell-sort="handleTableHeaderCellSort">
          <bx-table-head>
            <bx-table-header-row>
              <bx-table-header-cell
                sort-direction="none"
                data-column-id="rest_uid"
                >REST UID</bx-table-header-cell
              >
              <bx-table-header-cell
                sort-direction="none"
                data-column-id="experiment_state"
                >State</bx-table-header-cell
              >
              <bx-table-header-cell
                sort-direction="none"
                data-column-id="exit_status"
                >Exit status</bx-table-header-cell
              >
              <bx-table-header-cell
                sort-direction="none"
                data-column-id="version"
                >ST4SD Version</bx-table-header-cell
              >
              <bx-table-header-cell
                sort-direction="none"
                data-column-id="digest"
                >Package Digest</bx-table-header-cell
              >
              <bx-table-header-cell>Logs</bx-table-header-cell>
            </bx-table-header-row>
          </bx-table-head>
          <bx-table-body>
            <!-- Tagged entries -->
            <bx-table-row v-for="(run, idx) in getTableSlice" :key="idx">
              <bx-table-cell>
                <bx-link
                  :href="`${getDeploymentEndpoint()}experiment/${id}/runs/${
                    run.rest_uid
                  }`"
                  >{{ run.rest_uid }}</bx-link
                >
              </bx-table-cell>
              <bx-table-cell>{{ run.experiment_state }}</bx-table-cell>
              <bx-table-cell>{{ run.exit_status }}</bx-table-cell>
              <bx-table-cell>{{ run.version }}</bx-table-cell>
              <bx-table-cell>{{ run.digest }}</bx-table-cell>
              <bx-table-cell
                ><bx-link
                  :href="`${getDeploymentEndpoint()}experiment/${id}/logs/${
                    run.rest_uid
                  }`"
                  >Logs</bx-link
                ></bx-table-cell
              >
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
    </template>
  </div>
</template>

<script>
import "carbon-web-components/es/components/loading/index.js";
import { getDeploymentEndpoint } from "@/functions/public_path";
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";

//
import axios from "axios";

export default {
  name: "RunView",
  components: { St4sdBreadcrumb },
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      runs: null,
      dataToDisplay: [],
      data: [],
      loading: true,
      firstElement: 0,
      elementsToShow: 5,
      sortDirection: undefined,
      sortColumnId: "",
      collator: new Intl.Collator("en"),
      searchQuery: "",
    };
  },
  mounted() {
    axios
      .get(window.location.origin + "/registry-ui/backend/runs/" + this.id)
      .then((response) => {
        this.runs = response.data;
        this.data = this.runs.map((run) => ({
          rest_uid: run.metadata.userMetadata["rest-uid"],
          experiment_state: run.status["experiment-state"],
          exit_status: run.status["exit-status"],
          version: run.metadata.version,
          digest: run.metadata.userMetadata["st4sd-package-digest"],
        }));
        this.loading = false;
        this.dataToDisplay = this.data;
      });
  },
  computed: {
    getSortedElements() {
      if (this.sortDirection == undefined || this.sortDirection == "none")
        return this.dataToDisplay;

      return this.dataToDisplay.slice().sort((lhs, rhs) => {
        const lhsValue = lhs[this.sortColumnId];
        const rhsValue = rhs[this.sortColumnId];
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
    getDeploymentEndpoint,
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
      this.searchQuery = event.detail.value;
      this.dataToDisplay = [];
      for (let i in this.data) {
        if (
          this.data[i].rest_uid
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        ) {
          this.dataToDisplay.push(this.data[i]);
        }
      }
    },
    setExpandedOnFocusOut() {
      var attr = document.createAttribute("expanded");
      attr.value = "";
      document.getElementById("search").setAttributeNode(attr);
    },
  },
};
</script>

<style>
.tableOverflowContainer {
  width: 100%;
  overflow-x: scroll;
}

bx-table-cell {
  overflow-wrap: anywhere;
}
</style>
