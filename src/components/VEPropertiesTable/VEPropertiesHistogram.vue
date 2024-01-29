<template>
  <div>
    <div id="experimentLoadingContainer" v-if="loading">
      <bx-loading id="experimentLoadingWheel" type="overlay"></bx-loading>
    </div>

    <div v-else class="cds--row">
      <div v-if="data.length != 0">
        <bx-dropdown
          label="Y-Axis Data Selector"
          :value="graphHeader"
          @bx-dropdown-selected="graphHeader = $event.target.value"
        >
          <bx-dropdown-item
            v-for="(header, idx) in dynamicDataHeaders"
            v-bind:key="idx"
            v-bind:value="header"
            >{{ header }}</bx-dropdown-item
          >
        </bx-dropdown>
      </div>
      <div id="no-results-message" v-else>
        <p>No Graphs Available</p>
      </div>
    </div>
    <div id="histogram" class="cds--row"></div>
  </div>
</template>

<script>
import "@carbon/charts/styles.css";
import "@carbon/styles/css/styles.css";
import { HistogramChart } from "@carbon/charts";

export default {
  name: "VEPropertiesHistogram",
  data() {
    return {
      loading: true,
      dynamicDataHeaders: null,
      graphHeader: "",
      propertyHistogram: null,
      dataToDisplay: [],
      tempObj: {},
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
        this.graphHeader = this.dynamicDataHeaders[3];
        this.sortPropertyContents();
        this.createHistogramDataObject();
        this.createChart();
      }
      this.loading = false;
    },
    graphHeader() {
      let options = {
        title: "Histogram ",
        axes: {
          bottom: {
            title: `${this.graphHeader}`,
            mapsTo: `${this.graphHeader}`,
            bins: 15,
            limitDomainToBins: true,
          },
          left: {
            title: "Frequency",
            scaleType: "linear",
            binned: true,
          },
        },
        height: "400px",
      };
      this.createHistogramDataObject();
      let data = this.dataToDisplay;
      this.propertyHistogram.model.setData(data);
      this.propertyHistogram.model.setOptions(options);
    },
  },
  methods: {
    sortPropertyContents() {
      this.removeItem("Run Index");
      this.removeItem("input-id");
      this.removeItem("REST UID");
      this.removeItem("label");
    },
    removeItem(item) {
      if (this.dynamicDataHeaders.includes(item)) {
        let index = this.dynamicDataHeaders.indexOf(item);
        this.dynamicDataHeaders.splice(index, 1);
      }
    },
    createHistogramDataObject() {
      this.dataToDisplay = [];
      for (let i in this.data) {
        Object.assign(this.tempObj, {
          ["group"]: this.data[i]["group"],
          [this.graphHeader]: this.data[i][`${this.graphHeader}`],
        });
        this.dataToDisplay.push({ ...this.tempObj });
      }
    },
    createChart() {
      const options = {
        title: "Histogram ",
        axes: {
          bottom: {
            title: `${this.graphHeader}`,
            mapsTo: `${this.graphHeader}`,
            bins: 15,
            limitDomainToBins: true,
          },
          left: {
            title: "Frequency",
            scaleType: "linear",
            binned: true,
          },
        },
        height: "400px",
      };

      const chartArea = document.getElementById("histogram");
      let data = this.dataToDisplay;
      this.propertyHistogram = new HistogramChart(chartArea, { data, options });
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
</style>
