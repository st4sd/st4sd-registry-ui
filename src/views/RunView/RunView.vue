<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div class="cds--grid cds--grid--full-width">
    <div class="breadcrumb">
      <bx-breadcrumb>
        <bx-breadcrumb-item>
          <router-link to="/">Virtual Experiments</router-link>
        </bx-breadcrumb-item>
        <bx-breadcrumb-item>
          <router-link :to="`/experiment/${id}`">{{ id }}</router-link>
        </bx-breadcrumb-item>
        <bx-breadcrumb-item>
          <bx-breadcrumb-link aria-current="page">Runs</bx-breadcrumb-link>
        </bx-breadcrumb-item>
      </bx-breadcrumb>
    </div>

    <template v-if="loading">
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
      <bx-pagination page-size="10" start="0" :total="5">
        <bx-page-sizes-select slot="page-sizes-select">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </bx-page-sizes-select>
        <bx-pages-select></bx-pages-select>
      </bx-pagination>
    </template>

    <template v-else>
      <bx-table sort @bx-table-header-cell-sort="handleTableHeaderCellSort">
        <bx-table-head>
          <!-- <bx-table-toolbar-search></bx-table-toolbar-search> -->
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
            <bx-table-header-cell sort-direction="none" data-column-id="version"
              >ST4SD Version</bx-table-header-cell
            >
            <bx-table-header-cell sort-direction="none" data-column-id="digest"
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
        :total="runs.length"
        @bx-pages-select-changed="handleTablePagesSelectChanged"
        @bx-pagination-changed-current="handleTablePaginationChangedCurrent"
        @bx-page-sizes-select-changed="handleTablePageSizesSelectChanged"
      >
        <bx-page-sizes-select slot="page-sizes-select">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </bx-page-sizes-select>
        <bx-pages-select></bx-pages-select> </bx-pagination
    ></template>
  </div>
</template>

<script>
import "carbon-web-components/es/components/loading/index.js";
import { getDeploymentEndpoint } from "@/functions/public_path";

//
import axios from "axios";

export default {
  name: "RunView",
  components: {},
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      runs: null,
      data: null,
      loading: true,
      firstElement: 0,
      elementsToShow: 10,
      sortDirection: undefined,
      sortColumnId: "",
      collator: new Intl.Collator("en"),
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
      });
  },
  computed: {
    getSortedElements() {
      if (this.sortDirection == undefined || this.sortDirection == "none")
        return this.data;

      return this.data.slice().sort((lhs, rhs) => {
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
  },
};
</script>
