<template>
  <div class="cds--row pad1">
    <div class="cds--col-sm-4 cds--col-md-2 cds--col-lg-4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >History</dds-content-block-heading
        >
      </dds-content-block>
    </div>
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
      <div class="tableOverflowContainer">
        <bx-table sort @bx-table-header-cell-sort="handleTableHeaderCellSort">
          <bx-table-head>
            <!-- <bx-table-toolbar-search></bx-table-toolbar-search> -->
            <bx-table-header-row>
              <bx-table-header-cell
                sort-direction="ascending"
                data-column-id="tag"
                id="tagCell"
                >Tag</bx-table-header-cell
              >
              <bx-table-header-cell
                sort-direction="none"
                data-column-id="digest"
                >Digest</bx-table-header-cell
              >
              <!-- <bx-table-header-cell>Times executed</bx-table-header-cell> -->
              <bx-table-header-cell
                sort-direction="none"
                data-column-id="originalTag"
                >Previous tag</bx-table-header-cell
              >
              <bx-table-header-cell
                sort-direction="none"
                data-column-id="createdOn"
                >Creation date</bx-table-header-cell
              >
            </bx-table-header-row>
          </bx-table-head>
          <bx-table-body>
            <!-- Tagged entries -->
            <bx-table-row
              v-for="(entry, entryIdx) in getTableSlice"
              :key="entryIdx"
            >
              <bx-table-cell
                ><bx-link
                  :href="`${getDeploymentEndpoint()}experiment/${getPackageName(
                    id,
                  )}:${entry.tag}`"
                >
                  {{ entry.tag }}
                </bx-link></bx-table-cell
              >
              <bx-table-cell
                ><bx-link
                  :href="`${getDeploymentEndpoint()}experiment/${getPackageName(
                    id,
                  )}@${entry.digest}`"
                >
                  {{ entry.digest }}
                </bx-link></bx-table-cell
              >
              <!-- <bx-table-cell>Placeholder</bx-table-cell> -->
              <bx-table-cell>{{ entry.originalTag }}</bx-table-cell>
              <bx-table-cell>{{
                new Date(Date.parse(entry.createdOn))
              }}</bx-table-cell>
            </bx-table-row>
          </bx-table-body>
        </bx-table>
        <bx-pagination
          :page-size="elementsToShow"
          :start="firstElement"
          :total="history.tags.length + history.untagged.length"
          @bx-pages-select-changed="handleTablePagesSelectChanged"
          @bx-pagination-changed-current="handleTablePaginationChangedCurrent"
          @bx-page-sizes-select-changed="handleTablePageSizesSelectChanged"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <bx-page-sizes-select slot="page-sizes-select">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </bx-page-sizes-select>
          <bx-pages-select></bx-pages-select>
        </bx-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getDeploymentEndpoint } from "@/functions/public_path";
import {
  get_table_sort_dummy_event,
  get_sorted_elements,
} from "@/functions/table_sort";

import HttpErrorEmptyState from "@/components/EmptyState/HttpError.vue";

export default {
  name: "ExperimentHistory",
  components: {
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
    passAPICallLoadingDecrement() {
      this.$emit("loadingDecrement", this.decrement);
    },
    getDeploymentEndpoint,
  },
};
</script>

<style scoped>
bx-link {
  overflow-wrap: anywhere;
}

bx-table-cell {
  padding-right: 0;
}

.tableOverflowContainer {
  width: 100%;
  overflow-x: scroll;
}
</style>
