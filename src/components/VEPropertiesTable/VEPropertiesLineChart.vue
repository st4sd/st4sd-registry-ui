<template>
  <div class="cds--grid">
    <div>
      <div class="card-row" id="experimentLoadingContainer" v-if="loading">
        <bx-loading id="experimentLoadingWheel" type="overlay"></bx-loading>
      </div>

      <div v-else class="cds--row">
        <div v-if="data.length != 0">
          <cv-dropdown label="Y-Axis Data Selector" v-model="graphHeader">
            <cv-dropdown-item
              v-for="(header, idx) in dynamicDataHeaders"
              v-bind:key="idx"
              v-bind:value="header"
              >{{ header }}</cv-dropdown-item
            >
          </cv-dropdown>
        </div>
        <div id="no-results-message" v-else>
          <p>No Graphs Available</p>
        </div>
      </div>
    </div>
    <div id="chart-area" class="cds--row"></div>
  </div>
</template>

<script>
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
    propertyHeaders() {
      if (this.data.length != 0) {
        this.dynamicDataHeaders = [...this.propertyHeaders];
        this.removeHeadersFromOptions();
        this.graphHeader = this.dynamicDataHeaders[0];
        this.createChart();
      }
      this.loading = false;
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
#no-results-message {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  text-decoration: underline 1px;
  text-underline-offset: 5px;
  text-align: center;
}

#experimentLoadingContainer {
  width: 100%;
  height: 300px;
}

#experimentLoadingWheel {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  background-color: white;
}

cv-dropdown {
  width: 20rem;
  padding: 1rem 0;
}
</style>
