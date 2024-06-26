<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div>
    <div id="toast-notification-container">
      <bx-toast-notification
        v-if="isError"
        kind="error"
        :title="errorDescription"
        :caption="errorStatusText + ' (error ' + errorCode + ')'"
        timeout="5000"
      >
      </bx-toast-notification>
    </div>
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
    <dds-content-block>
      <dds-content-block-heading>{{ id }}</dds-content-block-heading>
      <St4sdStatusIndicator :data="dataToDisplay" />
      <St4sdDateFilter
        :data="data"
        :loading="loading"
        @updateDataToDisplay="updateDataToDisplay"
      />

      <dds-text-cta cta-type="local" :disabled="runs == null">
        <bx-link
          :disabled="runs == null"
          :href="`${getDeploymentEndpoint()}experiment/${id}/runs/properties`"
          >Compare Experiment Run Properties</bx-link
        >
      </dds-text-cta>
    </dds-content-block>
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
              <bx-table-header-cell sort-direction="none"
                >Creation Date</bx-table-header-cell
              >
              <bx-table-header-cell>Logs</bx-table-header-cell>
            </bx-table-header-row>
          </bx-table-head>
          <bx-table-body
            ><bx-table-row v-for="rowIdx in 5" :key="rowIdx">
              <bx-table-cell-skeleton
                v-for="cellIdx in 7"
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
      <div>
        <bx-table-toolbar @focusout="setExpandedOnFocusOut">
          <bx-table-toolbar-search
            id="search"
            expanded
            placeholder="Search by REST UID"
            @bx-search-input="searchTable"
          ></bx-table-toolbar-search>
        </bx-table-toolbar>

        <HttpErrorEmptyState
          :errorDescription="errorDescription"
          :errorStatusText="errorStatusText"
          :errorCode="errorCode"
          v-if="isError"
        />
        <div class="tableOverflowContainer" v-else>
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
                <bx-table-header-cell
                  sort-direction="descending"
                  data-column-id="creationDate"
                  id="creationDateCell"
                  >Creation Date</bx-table-header-cell
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
                  >
                    {{ run.rest_uid }}</bx-link
                  >
                </bx-table-cell>
                <bx-table-cell class="wrap-text">{{
                  run.experiment_state
                }}</bx-table-cell>
                <bx-table-cell>{{ run.exit_status }}</bx-table-cell>
                <bx-table-cell class="wrap-text">{{
                  run.version
                }}</bx-table-cell>
                <bx-table-cell class="wrap-text">{{
                  run.digest
                }}</bx-table-cell>
                <bx-table-cell class="wrap-text">{{
                  run.creationDate
                }}</bx-table-cell>
                <bx-table-cell
                  ><bx-link
                    :href="`${getDeploymentEndpoint()}experiment/${id}/logs/${
                      run.rest_uid
                    }`"
                    :disabled="run.exit_status == null"
                  >
                    Logs
                  </bx-link>
                </bx-table-cell>
              </bx-table-row>
            </bx-table-body>
          </bx-table>
          <NoDataEmptyState
            v-if="data.length == 0"
            message="Run this virtual experiment to see instances here"
          />
          <NoSearchResultsEmptyState v-else-if="dataToDisplay.length == 0" />
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
import "@carbon/web-components/es/components/loading/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import { getDeploymentEndpoint } from "@/functions/public_path";
import {
  get_table_sort_dummy_event,
  get_sorted_elements,
} from "@/functions/table_sort";
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import St4sdStatusIndicator from "@/components/St4sdStatusIndicator/St4sdStatusIndicator.vue";
import St4sdDateFilter from "@/components/St4sdDateFilter/St4sdDateFilter.vue";
import NoSearchResultsEmptyState from "@/components/EmptyState/NoSearchResultsEmptyState.vue";
import HttpErrorEmptyState from "@/components/EmptyState/HttpError.vue";
import NoDataEmptyState from "@/components/EmptyState/NoDataEmptyState.vue";

import axios from "axios";

export default {
  name: "RunView",
  components: {
    St4sdBreadcrumb,
    St4sdStatusIndicator,
    St4sdDateFilter,
    NoSearchResultsEmptyState,
    HttpErrorEmptyState,
    NoDataEmptyState,
  },
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      runs: null,
      noDataAvailable: false,
      dataToDisplay: [],
      data: [],
      filteredData: [],
      loading: true,
      firstElement: 0,
      elementsToShow: 5,
      sortDirection: undefined,
      sortColumnId: "",
      searchQuery: "",
      isError: false,
      errorStatusText: "",
      errorCode: 0,
      errorDescription: "Unable to load runs",
      tableSortInitialized: false,
    };
  },
  mounted() {
    axios
      .get(window.location.origin + "/registry-ui/backend/runs/" + this.id)
      .then((response) => {
        if (response.data.length > 0) {
          this.runs = response.data;
          this.data = this.runs.map((run) => ({
            rest_uid: run.metadata.userMetadata["rest-uid"],
            experiment_state: run.status["experiment-state"],
            exit_status: run.status["exit-status"],
            version: run.metadata.version,
            digest: run.metadata.userMetadata["st4sd-package-digest"],
            creationDate: new Date(Date.parse(run.status["created-on"])),
          }));
          this.filteredData = this.data;
          this.dataToDisplay = this.data;
        } else {
          if (this.dataToDisplay.length == 0) {
            this.noDataAvailable = true;
          }
        }
      })
      .catch((error) => {
        this.errorStatusText = error.response.statusText;
        this.errorCode = error.response.status;
        this.isError = true;
      })
      .finally(() => {
        this.loading = false;
      });
  },
  updated() {
    //Sets the table to be sorted by creation date on page load
    if (
      !this.tableSortInitialized &&
      !this.loading &&
      this.runs != null &&
      !this.isError
    ) {
      this.handleTableHeaderCellSort(
        get_table_sort_dummy_event("creationDateCell", "descending"),
      );
      this.tableSortInitialized = true;
    }
  },
  computed: {
    getTableSlice() {
      return get_sorted_elements(
        this.dataToDisplay,
        this.sortDirection,
        this.sortColumnId,
      ).slice(this.firstElement, this.firstElement + this.elementsToShow);
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
      this.firstElement = 0;
      this.searchQuery = event.detail.value;
      this.dataToDisplay = [];
      for (let i in this.filteredData) {
        if (
          this.filteredData[i].rest_uid
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        ) {
          this.dataToDisplay.push(this.filteredData[i]);
        }
      }
    },
    setExpandedOnFocusOut() {
      var attr = document.createAttribute("expanded");
      attr.value = "";
      document.getElementById("search").setAttributeNode(attr);
    },
    updateDataToDisplay(filteredData) {
      this.filteredData = filteredData;
      this.dataToDisplay = filteredData;
    },
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";

@import "@/styles/toast-notification-styles.scss";

.tableOverflowContainer {
  width: 100%;
  overflow-x: scroll;
}

bx-table-cell {
  text-align: left;
}

.wrap-text {
  overflow-wrap: anywhere;
}

dds-content-block-heading {
  margin: 0;
  padding-bottom: 1rem;
}

dds-text-cta {
  padding-top: 1rem;
  padding-bottom: 2rem;
}

.overlay-error {
  position: fixed; /* Sit on top of the page content */
  margin-bottom: 0.5rem;
  min-width: 20rem;
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  right: 1rem;
}
</style>
