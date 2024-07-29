<template>
  <div style="padding-left: 1rem">
    <div id="experimentLoadingContainer" v-if="loading">
      <cds-loading></cds-loading>
    </div>

    <div v-else class="cds--row">
      <div>
        <cds-dropdown
          label="Y-Axis Data Selector"
          :value="graphHeader"
          @cds-dropdown-selected="graphHeader = $event.target.value"
        >
          <cds-dropdown-item
            v-for="(header, idx) in dynamicDataHeaders"
            v-bind:key="idx"
            v-bind:value="header"
            >{{ header }}</cds-dropdown-item
          >
        </cds-dropdown>
      </div>
    </div>
    <div id="chart-area" class="cds--row"></div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/loading/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/charts/styles.css";
import "@carbon/styles/css/styles.css";
import { LineChart } from "@carbon/charts";

export default {
  name: "VEPropertiesLineChart",
  data() {
    return {
      loading: true,
      dynamicDataHeaders: null,
      graphHeader: "",
      propertyLineChart: null,
    };
  },
  props: {
    id: String,
    data: Array,
    propertyHeaders: Array,
  },
  watch: {
    propertyHeaders: {
      handler() {
        if (this.data.length != 0) {
          this.dynamicDataHeaders = [...this.propertyHeaders];
          this.removeHeadersFromOptions();
          this.graphHeader = this.dynamicDataHeaders[0];
          this.createChart();
        }
        this.loading = false;
      },
      deep: true,
    },
    graphHeader() {
      this.updateChart();
    },
  },
  methods: {
    removeHeadersFromOptions() {
      //Removes non property headers that shouldn't be selectable for the y-axis
      this.removeHeaderFromOptions("Run Index");
      this.removeHeaderFromOptions("input-id");
      this.removeHeaderFromOptions("REST UID");
      this.removeHeaderFromOptions("label");
    },
    removeHeaderFromOptions(item) {
      if (this.dynamicDataHeaders.includes(item)) {
        let index = this.dynamicDataHeaders.indexOf(item);
        this.dynamicDataHeaders.splice(index, 1);
      }
    },
    createChart() {
      let options = this.getChartOptions();

      options["tooltip"] = {
        customHTML: (data) => {
          let runHTML = `<li><div class="datapoint-tooltip "><div class="label"><p>Run</p></div><p class="value">${data[0]["run"]}</p></div></li>`;

          let inputIdHTML = `<li><div class="datapoint-tooltip "><div class="label"><p>Input ID</p></div><p class="value">${data[0]["inputId"]}</p></div></li>`;

          let yAxisHTML = `<li><div class="datapoint-tooltip "><div class="label"><p>${
            this.graphHeader
          }</p></div><p class="value">${
            data[0][`${this.graphHeader}`]
          }</p></div></li>`;

          let xAxisHTML = `<li><div class="datapoint-tooltip "><div class="label"><p>Run Index</p></div><p class="value">${data[0]["index"]}</p></div></li>`;

          return `<ul class="multi-tooltip">${runHTML}${inputIdHTML}${yAxisHTML}${xAxisHTML}</ul>`;
        },
      };

      const data = this.data;
      const chartArea = document.getElementById("chart-area");
      this.propertyLineChart = new LineChart(chartArea, { data, options });
    },
    updateChart() {
      let options = this.getChartOptions();
      this.propertyLineChart.model.setOptions(options);
    },
    getChartOptions() {
      let options = {
        title: "Line ",
        axes: {
          bottom: {
            title: "Run Index",
            mapsTo: "index",
            scaleType: "linear",
          },
          left: {
            mapsTo: `${this.graphHeader}`,
            title: `${this.graphHeader}`,
            scaleType: "linear",
          },
        },
        curve: "curveMonotoneX",
        height: "400px",
      };
      return options;
    },
  },
};
</script>

<style scoped>
#experimentLoadingContainer {
  width: 100%;
  height: 300px;
}

cv-dropdown {
  width: 20rem;
  padding: 1rem 0;
}
</style>
