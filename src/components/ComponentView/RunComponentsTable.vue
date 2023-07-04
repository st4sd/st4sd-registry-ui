<template>
  <div>
    <template v-if="loading">
      <bx-table>
        <bx-table-head>
          <bx-table-header-row
            ><bx-table-header-cell-skeleton
              >Component ID</bx-table-header-cell-skeleton
            >
            <bx-table-header-cell-skeleton>State</bx-table-header-cell-skeleton>
            <bx-table-header-cell-skeleton
              >Log</bx-table-header-cell-skeleton
            ></bx-table-header-row
          >
        </bx-table-head>
        <bx-table-body
          ><bx-table-row v-for="rowIdx in 5" :key="rowIdx">
            <bx-table-cell-skeleton
              v-for="cellIdx in 3"
              :key="cellIdx"
            ></bx-table-cell-skeleton> </bx-table-row
        ></bx-table-body>
      </bx-table>
      <bx-pagination page-size="10" start="0" :total="5">
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <bx-page-sizes-select slot="page-sizes-select">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </bx-page-sizes-select>
        <bx-pages-select></bx-pages-select>
      </bx-pagination>
    </template>

    <template v-else>
      <div class="tableOverflowContainer">
        <bx-table sort @bx-table-header-cell-sort="handleTableHeaderCellSort">
          <bx-table-head>
            <bx-table-header-row>
              <bx-table-header-cell
                data-column-id="identifier"
                sort-direction="none"
                >Component ID</bx-table-header-cell
              >
              <bx-table-header-cell data-column-id="state" sort-direction="none"
                >State</bx-table-header-cell
              >
              <bx-table-header-cell>Log</bx-table-header-cell>
            </bx-table-header-row>
          </bx-table-head>

          <bx-table-body>
            <bx-table-row v-for="(component, idx) in getTableSlice" :key="idx">
              <bx-table-cell>{{ component.identifier }}</bx-table-cell>
              <bx-table-cell>{{ component.state }}</bx-table-cell>
              <bx-table-cell
                ><bx-link
                  :href="`${getDeploymentEndpoint()}experiment/${experiment_id}/logs/${instance_id}/${
                    component.identifier
                  }`"
                  >Logs</bx-link
                >
              </bx-table-cell>
            </bx-table-row>
          </bx-table-body>
        </bx-table>

        <bx-pagination
          :page-size="elementsToShow"
          :start="firstElement"
          :total="instance_components.length"
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
    </template>
  </div>
</template>

<script>
import { getDeploymentEndpoint } from "@/functions/public_path";
import { get_sorted_elements } from "@/functions/table_sort";
import axios from "axios";

export default {
  name: "RunComponentsTable",
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
    };
  },
  mounted() {
    axios
      .get(
        window.location.origin +
          "/registry-ui/backend/runs/" +
          this.experiment_id +
          "/" +
          this.instance_id
      )
      .then((response) => {
        this.instance_components = response.data;
        this.data = this.instance_components.map((component) => ({
          identifier: component["component-identifier"],
          state: component["component-state"],
        }));
        this.loading = false;
      });
  },
  computed: {
    getTableSlice() {
      return get_sorted_elements(
        this.data,
        this.sortDirection,
        this.sortColumnId
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
  },
};
</script>

<style>
.tableOverflowContainer {
  width: 100%;
  overflow-x: scroll;
}
</style>
