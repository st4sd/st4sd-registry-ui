<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <div class="cds--row pad1">
    <ExperimentViewContentBlock title="History" />
    <div
      class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12"
      v-if="error.code != 0"
    >
      <HttpErrorEmptyState
        :errorDescription="error.description"
        :errorStatusText="error.statusText"
        :errorCode="error.code"
      />
    </div>
    <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12" v-else>
      <div class="table-overflow-container">
        <cds-table sort @cds-table-header-cell-sort="handleTableHeaderCellSort">
          <cds-table-head>
            <cds-table-header-row>
              <cds-table-header-cell
                sort-direction="ascending"
                data-column-id="tag"
                id="tagCell"
                >Tag</cds-table-header-cell
              >
              <cds-table-header-cell
                sort-direction="none"
                data-column-id="digest"
                >Digest</cds-table-header-cell
              >
              <cds-table-header-cell
                sort-direction="none"
                data-column-id="originalTag"
                >Previous tag</cds-table-header-cell
              >
              <cds-table-header-cell
                sort-direction="none"
                data-column-id="createdOn"
                >Creation date</cds-table-header-cell
              >
            </cds-table-header-row>
          </cds-table-head>
          <cds-table-body>
            <!-- Tagged entries -->
            <cds-table-row
              v-for="(entry, entryIdx) in getTableSlice"
              :key="entryIdx"
            >
              <cds-table-cell
                ><cds-link
                  :href="`${getDeploymentEndpoint()}experiment/${getPackageName(
                    id,
                  )}:${entry.tag}`"
                >
                  {{ entry.tag }}
                </cds-link></cds-table-cell
              >
              <cds-table-cell
                ><cds-link
                  :href="`${getDeploymentEndpoint()}experiment/${getPackageName(
                    id,
                  )}@${entry.digest}`"
                >
                  {{ entry.digest }}
                </cds-link></cds-table-cell
              >
              <cds-table-cell>{{ entry.originalTag }}</cds-table-cell>
              <cds-table-cell>{{
                new Date(Date.parse(entry.createdOn))
              }}</cds-table-cell>
            </cds-table-row>
          </cds-table-body>
        </cds-table>
        <cds-pagination
          page-size="10"
          :total-items="history.tags.length + history.untagged.length"
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
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/pagination/index.js";
import "@carbon/web-components/es/components/select/index.js";
import "@carbon/web-components/es/components/data-table/index.js";
import "@carbon/web-components/es/components/link/index.js";

import { getDeploymentEndpoint } from "@/functions/public_path";
import {
  get_table_sort_dummy_event,
  get_sorted_elements,
} from "@/functions/table_sort";

import HttpErrorEmptyState from "@/components/EmptyState/HttpError.vue";
import ExperimentViewContentBlock from "./ExperimentViewContentBlock.vue";

export default {
  name: "ExperimentHistory",
  components: {
    ExperimentViewContentBlock,
    HttpErrorEmptyState,
  },
  props: {
    history: Object,
    data: Array,
    id: String,
    error: Object,
  },
  data() {
    return {
      elementsToShow: 10,
      firstElement: 0,
      decrement: 1,
      sortDirection: undefined,
      sortColumnId: "",
      tableSortInitialized: false,
      tablePaginationPageSizeOptions: [10, 25, 50],
    };
  },
  mounted() {
    if (this.data != null && !this.tableSortInitialized) {
      this.handleTableHeaderCellSort(
        get_table_sort_dummy_event("tagCell", "ascending"),
      );
      this.tableSortInitialized = true;
    }
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
    getPackageName(id) {
      var index = -1;
      if (id.includes(":")) {
        index = id.indexOf(":");
      } else if (id.includes("@")) {
        index = id.indexOf("@");
      }

      if (index == -1) return id;

      return id.substring(0, index);
    },
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
    passAPICallLoadingDecrement() {
      this.$emit("loadingDecrement", this.decrement);
    },
    getDeploymentEndpoint,
  },
};
</script>

<style lang="scss" scoped>
@use "@/styles/cds-table-styles.scss";
</style>
