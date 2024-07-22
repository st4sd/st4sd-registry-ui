<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div>
    <div id="toast-notification-container">
      <cds-toast-notification
        v-if="isError"
        kind="error"
        :title="errorDescription"
        :caption="errorStatusText + ' (error ' + errorCode + ')'"
        timeout="5000"
      />
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
    <div id="hero-section">
      <p id="hero-title">{{ id }}</p>
      <St4sdStatusIndicator :data="dataToDisplay" />
      <St4sdDateFilter
        :data="data"
        :loading="loading"
        @updateDataToDisplay="updateDataToDisplay"
      />
      <div id="cta-link">
        <cds-link
          :disabled="runs == null"
          :href="`${getDeploymentEndpoint()}experiment/${id}/runs/properties`"
          >Compare Experiment Run Properties
          <img
            slot="icon"
            src="@/assets/arrow--right.svg"
            width="20"
            height="20"
        /></cds-link>
      </div>
    </div>
    <template v-if="loading">
      <div class="tableOverflowContainer">
        <cds-table-toolbar>
          <cds-table-toolbar-search
            expanded
            placeholder="Search by REST UID"
          ></cds-table-toolbar-search>
        </cds-table-toolbar>
        <cds-table>
          <cds-table-head>
            <cds-table-header-row>
              <cds-table-header-cell sort-direction="none"
                >REST UID</cds-table-header-cell
              >
              <cds-table-header-cell sort-direction="none"
                >State</cds-table-header-cell
              >
              <cds-table-header-cell sort-direction="none"
                >Exit status</cds-table-header-cell
              >
              <cds-table-header-cell sort-direction="none"
                >ST4SD Version</cds-table-header-cell
              >
              <cds-table-header-cell sort-direction="none"
                >Package Digest</cds-table-header-cell
              >
              <cds-table-header-cell sort-direction="none"
                >Creation Date</cds-table-header-cell
              >
              <cds-table-header-cell class="non-sortable-table-header"
                >Logs</cds-table-header-cell
              >
            </cds-table-header-row>
          </cds-table-head>
          <cds-table-body
            ><cds-table-row v-for="rowIdx in 5" :key="rowIdx">
              <cds-table-cell v-for="cellIdx in 7" :key="cellIdx"
                ><cds-skeleton-text></cds-skeleton-text
              ></cds-table-cell> </cds-table-row
          ></cds-table-body>
        </cds-table>
        <cds-pagination page-size="5" total-items="5">
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
      <div>
        <cds-table-toolbar @focusout="setExpandedOnFocusOut">
          <cds-table-toolbar-search
            id="search"
            expanded
            placeholder="Search by REST UID"
            @cds-search-input="searchTable"
          ></cds-table-toolbar-search>
        </cds-table-toolbar>

        <HttpErrorEmptyState
          :errorDescription="errorDescription"
          :errorStatusText="errorStatusText"
          :errorCode="errorCode"
          v-if="isError"
        />
        <div class="tableOverflowContainer" v-else>
          <cds-table
            size="xl"
            sort
            @cds-table-header-cell-sort="handleTableHeaderCellSort"
          >
            <cds-table-head>
              <cds-table-header-row>
                <cds-table-header-cell
                  sort-direction="none"
                  data-column-id="rest_uid"
                  >REST UID</cds-table-header-cell
                >
                <cds-table-header-cell
                  sort-direction="none"
                  data-column-id="experiment_state"
                  >State</cds-table-header-cell
                >
                <cds-table-header-cell
                  sort-direction="none"
                  data-column-id="exit_status"
                  >Exit status</cds-table-header-cell
                >
                <cds-table-header-cell
                  sort-direction="none"
                  data-column-id="version"
                  >ST4SD Version</cds-table-header-cell
                >
                <cds-table-header-cell
                  sort-direction="none"
                  data-column-id="digest"
                  >Package Digest</cds-table-header-cell
                >
                <cds-table-header-cell
                  sort-direction="descending"
                  data-column-id="creationDate"
                  id="creationDateCell"
                  >Creation Date</cds-table-header-cell
                >
                <cds-table-header-cell class="non-sortable-table-header"
                  >Logs</cds-table-header-cell
                >
              </cds-table-header-row>
            </cds-table-head>
            <cds-table-body>
              <!-- Tagged entries -->
              <cds-table-row v-for="(run, idx) in getTableSlice" :key="idx">
                <cds-table-cell>
                  <cds-link
                    :href="`${getDeploymentEndpoint()}experiment/${id}/runs/${
                      run.rest_uid
                    }`"
                  >
                    {{ run.rest_uid }}</cds-link
                  >
                </cds-table-cell>
                <cds-table-cell>{{ run.experiment_state }}</cds-table-cell>
                <cds-table-cell>{{ run.exit_status }}</cds-table-cell>
                <cds-table-cell class="wrap-text">{{
                  run.version
                }}</cds-table-cell>
                <cds-table-cell class="wrap-text">{{
                  run.digest
                }}</cds-table-cell>
                <cds-table-cell class="wrap-text">{{
                  run.creationDate
                }}</cds-table-cell>
                <cds-table-cell
                  ><cds-link
                    :href="`${getDeploymentEndpoint()}experiment/${id}/logs/${
                      run.rest_uid
                    }`"
                    :disabled="run.exit_status == null"
                  >
                    Logs
                  </cds-link>
                </cds-table-cell>
              </cds-table-row>
            </cds-table-body>
          </cds-table>
          <NoDataEmptyState
            v-if="data.length == 0"
            message="Run this virtual experiment to see instances here"
          />
          <NoSearchResultsEmptyState v-else-if="dataToDisplay.length == 0" />
          <cds-pagination
            :page-size="elementsToShow"
            :total-items="dataToDisplay.length"
            @cds-pagination-changed-current="
              handleTablePaginationChangedCurrent
            "
            @cds-select-selected="handleTablePageSizesSelectChanged"
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
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/data-table.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/notification.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/link.min.js";
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
      tablePaginationPageSizeOptions: [5, 10, 25],
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
@import "@/styles/text-cta-styles.scss";

.tableOverflowContainer {
  width: 100%;
  overflow-x: scroll;
}

.wrap-text {
  overflow-wrap: anywhere;
}

.overlay-error {
  position: fixed; /* Sit on top of the page content */
  margin-bottom: 0.5rem;
  min-width: 20rem;
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  right: 1rem;
}

// AP: with xl table, a 16px padding is added to the header
// and it doesn't look good with the search bar at the top
cds-table-header-cell {
  padding: 0;
}

// AP: cells are rendered with a 16px padding on all sides
// except from the bottom, which looks slightly odd. We set
// it to be 16px everywhere
cds-table-cell {
  padding: layout.$spacing-05;
}

// AP: with the xl table, the sortable columns have a button
// rendered which pushes the header content to be centered
// and slightly padded to the left. We emulate it for columns
// that cannot be sorted
.non-sortable-table-header {
  vertical-align: middle;
  padding-left: layout.$spacing-05;
}
</style>
