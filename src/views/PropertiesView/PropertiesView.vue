<template>
  <div>
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
        {
          name: 'Properties',
          path: `/experiment/${id}/runs/properties`,
        },
      ]"
    />
    <dds-content-block>
      <dds-content-block-heading class="cds-grid-cols-lg-8">{{
        id
      }}</dds-content-block-heading>
    </dds-content-block>

    <bx-tabs trigger-content="Select an item" value="PropertiesTable">
      <bx-tab
        id="TabForVEPropertiesTable"
        value="PropertiesTable"
        target="VEPropertiesTable"
        >Table</bx-tab
      >
      <bx-tab
        id="TabForVEPropertiesLineChart"
        value="PropertiesLineChart"
        target="VEPropertiesLineChart"
        >Line Chart</bx-tab
      >
    </bx-tabs>

    <div class="bx-ce-demo-devenv--tab-panels">
      <div
        id="VEPropertiesTable"
        aria-labelledby="tab-VEPropertiesTable"
        role="tabpanel"
        hidden
      >
        <VEPropertiesTable
          :id="id"
          :propertiesArray="propertiesArray"
          :propertyHeaders="propertyHeaders"
        />
      </div>
      <div
        id="VEPropertiesLineChart"
        aria-labelledby="tab-VEPropertiesLineChart"
        role="tabpanel"
        hidden
      >
        <VEPropertiesLineChart
          :id="id"
          :data="formattedChartData"
          :propertyHeaders="propertyHeaders"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VEPropertiesTable from "@/components/VEPropertiesTable/VEPropertiesTable.vue";
import VEPropertiesLineChart from "@/components/VEPropertiesTable/VEPropertiesLineChart.vue";
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import { getDeploymentEndpoint } from "@/functions/public_path";

import axios from "axios";

export default {
  name: "PropertiesView",
  components: { VEPropertiesTable, St4sdBreadcrumb, VEPropertiesLineChart },
  props: {
    id: String,
  },
  data() {
    return {
      properties: [],
      propertiesArray: [],
      propertyHeaders: null,
      loading: true,
      formattedChartData: [],
      tempObj: {},
    };
  },
  mounted() {
    axios
      .get(
        window.location.origin + "/registry-ui/backend/properties/" + this.id
      )
      .then((response) => {
        if (Object.keys(response.data).length != 0) {
          //Extract the run rest UIDs into an Array
          this.restUIDs = Object.keys(response.data);

          //Extract property values into an Array that can be looped through in the HTML
          this.propertiesArray = this.getPropertiesArray(
            Object.values(response.data)
          );

          //Extract the property keys into an Array
          this.propertyHeaders = Object.keys(Object.values(response.data)[0]);

          //Add rest UID to the array of headers
          this.propertyHeaders.unshift("REST UID");

          //Move Label, Input ID and rest UID to front of property and property headers Arrays
          this.moveItemToFrontOfTable("label");
          this.moveItemToFrontOfTable("input-id");
          this.moveItemToFrontOfTable("REST UID");

          this.formatChartData();
        }
        this.loading = false;
      });
  },
  methods: {
    getDeploymentEndpoint,
    getPropertiesArray(data) {
      let propertiesArray = [];
      for (let rest_uid = 0; rest_uid < data.length; rest_uid++) {
        for (
          let value = 0;
          value < Object.values(data[rest_uid])[0].length;
          value++
        ) {
          let rowOfProperties = [];
          rowOfProperties.push(this.restUIDs[rest_uid]);
          for (
            let propertyValue = 0;
            propertyValue < Object.values(data[rest_uid]).length;
            propertyValue++
          ) {
            rowOfProperties.push(
              Object.values(data[rest_uid])[propertyValue][value]
            );
          }
          propertiesArray.push(rowOfProperties);
        }
      }
      return propertiesArray;
    },
    moveItemToFrontOfTable(item) {
      //Moves a properties header and values to the front of there respective arrays
      if (this.propertyHeaders.includes(item)) {
        let index = this.propertyHeaders.indexOf(item);

        let itemHeader = this.propertyHeaders[index];

        this.propertyHeaders.splice(index, 1);
        this.propertyHeaders.unshift(itemHeader);

        for (let x = 0; x < this.propertiesArray.length; x++) {
          let tempData = this.propertiesArray[x][index];
          this.propertiesArray[x].splice(index, 1);
          this.propertiesArray[x].unshift(tempData);
        }
      }
    },
    formatChartData() {
      //Creates an array of objects, each object being one property data point.
      //Also ignores any runs containing NaN properties.
      for (let row = 0; row < this.propertiesArray.length; row++) {
        let containsNaN = false;

        for (
          let column = 2;
          column < this.propertiesArray[0].length;
          column++
        ) {
          if (this.propertiesArray[row][column] == "NaN") {
            containsNaN = true;
            break;
          } else {
            Object.assign(this.tempObj, {
              run: `${this.propertiesArray[row][0]}`,
              inputId: `${this.propertiesArray[row][1]}`,
              group: `${this.id}`,
              [this.propertyHeaders[column]]: this.propertiesArray[row][column],
              ["index"]: [row],
            });
          }
        }
        if (!containsNaN) {
          this.formattedChartData.push({ ...this.tempObj });
        }
      }
    },
  },
};
</script>

<style scoped>
dds-content-block-heading {
  margin: 0;
  padding-bottom: 1rem;
}

dds-text-cta {
  padding-bottom: 2rem;
}
</style>
