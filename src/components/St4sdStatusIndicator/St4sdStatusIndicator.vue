<template>
  <div id="statusChart"></div>
</template>

<script>
import { MeterChart } from "@carbon/charts";

export default {
  name: "St4sdStatusIndicator",
  props: {
    data: Array,
  },
  data() {
    return {
      statusIndicator: null,
    };
  },
  mounted() {
    this.createStatusChart();
  },
  watch: {
    data: {
      handler() {
        if (this.data.length != 0) {
          this.populateStatusChart();
        } else {
          this.populateEmptyStatusChart();
        }
      },
      deep: true,
    },
  },
  methods: {
    getChartDataArray() {
      let success = 0;
      let failure = 0;

      for (let runIndex in this.data) {
        if (this.data[runIndex].exit_status == "Success") {
          success++;
        } else {
          failure++;
        }
      }

      let successObject = this.getDataObject("Success", success);
      let failureObject = this.getDataObject("Failure", failure);

      return [successObject, failureObject];
    },
    getDataObject(status, amount) {
      return {
        group: status,
        value: amount,
      };
    },
    getChartTitle(successfulRuns, totalRuns) {
      let successPercentage = Math.round((successfulRuns / totalRuns) * 100);
      return "Success rate: " + successPercentage + "%";
    },
    populateStatusChart() {
      const data = this.getChartDataArray();

      const title = this.getChartTitle(data[0].value, this.data.length);

      const colors = {
        scale: {
          Success: "#198038",
          Failure: "#da1e28",
        },
      };

      const options = this.getOptions(this.data.length, title, colors);

      this.statusIndicator.model.setData(data);
      this.statusIndicator.model.setOptions(options);

      document.getElementsByClassName("cds--cc--legend")[0].style.visibility =
        "visible";
    },
    populateEmptyStatusChart() {
      const data = [
        {
          group: "NaN",
          value: 0,
        },
      ];

      const colors = {
        pairing: {
          option: 0,
        },
      };

      const options = this.getOptions(1, "Success rate: N/A", colors);

      this.statusIndicator.model.setData(data);
      this.statusIndicator.model.setOptions(options);

      document.getElementsByClassName("cds--cc--legend")[0].style.visibility =
        "hidden";
    },
    createStatusChart() {
      const data = [
        {
          group: "NaN",
          value: 0,
        },
      ];

      const colors = {
        pairing: {
          option: 0,
        },
      };

      const options = this.getOptions(1, "Success rate: N/A", colors);
      const chartHolder = document.getElementById("statusChart");
      this.statusIndicator = new MeterChart(chartHolder, {
        data,
        options,
      });
    },
    getOptions(totalRuns, title, colors) {
      return {
        title: title,
        height: "100px",
        meter: {
          showLabels: false,
          proportional: {
            total: totalRuns,
            unit: "runs",
          },
        },
        color: colors,
        toolbar: {
          enabled: false,
        },
      };
    },
  },
};
</script>

<style scoped>
#statusChart {
  width: 25%;
  margin: 1rem 0 2rem;
}

@media screen and (max-width: 1056px) {
  #statusChart {
    width: 50%;
  }
}

@media screen and (max-width: 671px) {
  #statusChart {
    width: 75%;
  }
}

@media screen and (max-width: 320px) {
  #statusChart {
    width: 100%;
  }
}
</style>
