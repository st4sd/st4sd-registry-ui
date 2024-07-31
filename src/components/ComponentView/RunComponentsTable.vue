<template>
  <div>
    <template v-if="loading">
      <cds-table-skeleton
        row-count="5"
        column-count="3"
        :showToolbar="false"
        :showHeader="false"
      />
      <cds-pagination page-size="10" total-items="5">
        <cds-select-item
          v-for="(option, optionIdx) in tablePaginationPageSizeOptions"
          :value="option"
          :key="optionIdx"
          >{{ option }}</cds-select-item
        >
      </cds-pagination>
    </template>

    <template v-if="!loading">
      <HttpErrorEmptyState
        errorDescription="Unable to fetch components"
        :errorStatusText="errorStatusText"
        :errorCode="errorCode"
        v-if="isError"
      />
      <NoDataEmptyState
        v-else-if="data.length == 0"
        message="This run has no properties available"
      />
      <div v-else class="table-overflow-container">
        <cds-table sort @cds-table-header-cell-sort="handleTableHeaderCellSort">
          <cds-table-head>
            <cds-table-header-row>
              <cds-table-header-cell
                data-column-id="identifier"
                sort-direction="none"
                >Component ID</cds-table-header-cell
              >
              <cds-table-header-cell
                data-column-id="state"
                sort-direction="none"
                >State</cds-table-header-cell
              >
              <cds-table-header-cell>Log</cds-table-header-cell>
            </cds-table-header-row>
          </cds-table-head>

          <cds-table-body>
            <cds-table-row v-for="(component, idx) in getTableSlice" :key="idx">
              <cds-table-cell>{{ component.identifier }}</cds-table-cell>
              <cds-table-cell>{{ component.state }}</cds-table-cell>
              <cds-table-cell
                ><cds-link
                  :href="`${getDeploymentEndpoint()}experiment/${experiment_id}/logs/${instance_id}/${
                    component.identifier
                  }`"
                  >Logs</cds-link
                >
              </cds-table-cell>
            </cds-table-row>
          </cds-table-body>
        </cds-table>
        <cds-pagination
          page-size="10"
          :total-items="instance_components.length"
          @cds-select-selected="handleTablePageSizesSelectChanged"
          @cds-pagination-changed-current="handleTablePaginationChangedCurrent"
        >
          <cds-select-item
            v-for="(option, optionIdx) in tablePaginationPageSizeOptions"
            :value="option"
            :key="optionIdx"
            >{{ option }}</cds-select-item
          >
        </cds-pagination>
      </div>
    </template>
  </div>
</template>

<script>
import HttpErrorEmptyState from "@/components/EmptyState/HttpError.vue";
import NoDataEmptyState from "@/components/EmptyState/NoDataEmptyState.vue";

import "@carbon/web-components/es/components/data-table/index.js";
import "@carbon/web-components/es/components/list/index.js";

import { getDeploymentEndpoint } from "@/functions/public_path";
import { get_sorted_elements } from "@/functions/table_sort";
import axios from "axios";

export default {
  name: "RunComponentsTable",
  components: {
    HttpErrorEmptyState,
    NoDataEmptyState,
  },
  props: {
    experiment_id: {
      type: String,
      default: "",
    },
    instance_id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      instance_components: null,
      firstElement: 0,
      loading: true,
      data: null,
      elementsToShow: 10,
      sortDirection: undefined,
      sortColumnId: "",
      collator: new Intl.Collator("en"),
      isError: false,
      errorStatusText: "",
      errorCode: 0,
      tablePaginationPageSizeOptions: [10, 25, 50],
    };
  },
  mounted() {
    axios
      .get(
        window.location.origin +
          "/registry-ui/backend/runs/" +
          this.experiment_id +
          "/" +
          this.instance_id,
      )
      .then((response) => {
        this.instance_components = response.data;
        this.data = this.instance_components.map((component) => ({
          identifier: component["component-identifier"],
          state: component["component-state"],
        }));
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
      return get_sorted_elements(
        this.data,
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
    updateErrorHandling(error) {
      this.$emit("updateComponentErrorHandling", error);
    },
  },
};
</script>

<style scoped>
@import "@/styles/cds-table-styles.scss";
</style>
