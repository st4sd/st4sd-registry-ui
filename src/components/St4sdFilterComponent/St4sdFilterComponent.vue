<template>
  <div class="filter-panel-container">
    <div class="filter-panel-header">
      <h4>Filter</h4>
      <button class="expand-button">
        <img
          class="expand-button-svg"
          width="16"
          height="16"
          src="../../assets/expand-button.svg"
        />
      </button>
      <div
        v-if="Object.keys(selectedFilters).length > 0"
        class="clear-button"
        @click="handleClearButton"
      >
        <p>Clear</p>
        &nbsp;
        <img width="16" height="16" src="../../assets/clear-button.svg" />
      </div>
    </div>
    <div class="content">
      <div
        class="filter-panel-section"
        v-for="(domainFilter, domainFilterIdx) in domainFilters"
        :key="`domainFilter-${domainFilterIdx}`"
      >
        <div class="filter-panel-section-header">
          <h4>{{ domainFilter.displayName }}</h4>
        </div>
        <div class="filter-panel-section-body">
          <div
            class="filter-panel-checkbox"
            v-for="(filter, filterIdx) in domainFilter.filters"
            :key="`filterPanel-${filterIdx}`"
          >
            <bx-checkbox
              @bx-checkbox-changed="onCheckboxSelect"
              :value="filter.name"
              :label-text="filter.displayName"
              class="checkbox"
            ></bx-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const domainFilters = [
  {
    filterFor: "domain",
    displayName: "Domain",
    isOpen: true,
    filters: [
      {
        name: "computational chemistry",
        displayName: "Computational Chemistry",
      },
      {
        name: "climate",
        displayName: "Climate",
      },
    ],
  },
  {
    filterFor: "platform",
    displayName: "Platform",
    isOpen: true,
    filters: [
      {
        name: "openshift",
        displayName: "OpenShift",
      },
      {
        name: "openshift-kubeflux",
        displayName: "Kubeflux",
      },
    ],
  },
  {
    filterFor: "other",
    displayName: "Other",
    isOpen: true,
    filters: [
      {
        name: "surrogate",
        displayName: "Surrogate",
      },
    ],
  },
];

import "@carbon/web-components/es/components/checkbox/index.js";

export default {
  name: "St4sdFilterComponent",
  props: {
    experiments: Array,
  },
  mounted() {
    let coll = document.getElementsByClassName("expand-button");

    for (let i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        let content = document.getElementsByClassName("content")[0];
        let svg = document.getElementsByClassName("expand-button-svg")[0];
        if (content.style.display === "block") {
          content.style.display = "none";
          svg.style.transform = "rotate(90deg)";
        } else {
          content.style.display = "block";
          svg.style.transform = "rotate(-90deg)";
        }
      });
    }

    window.addEventListener("resize", this.onResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  watch: {
    windowWidth(newVal) {
      //Ensures the filter component displays at full size on large screen sizes
      //1055 is the limit for the medium screen size
      if (newVal > 1055) {
        document.getElementsByClassName("content")[0].style.display = "block";
      }
    },
  },
  data() {
    return {
      domainFilters,
      selectedFilters: {},
      id: 0,
    };
  },
  methods: {
    onResize() {
      //Ensures the filter component is fully displayed at large screen size but initially hidden on medium screen size and below
      let width = window.innerWidth;
      if (width > 1055) {
        document.getElementsByClassName("content")[0].style.display = "block";
      } else {
        document.getElementsByClassName("content")[0].style.display = "none";
      }
    },
    handleClearButton() {
      // Handle clear button
      let filterCheckboxes = document.querySelectorAll(".checkbox");

      for (let i = 0; i < filterCheckboxes.length; i++) {
        filterCheckboxes[i].checked = false;
      }

      this.selectedFilters = {};
      this.$emit("updateSelectedFilters", this.selectedFilters);
    },
    handleCheckboxSelect(event) {
      // Find the element the filter belongs to

      let selectedDomainFilter = this.domainFilters.filter((pf) =>
        pf.filters.some((f) => f.name == event)
      )[0].filterFor;
      // Create a copy of the filters
      let updatedFilters = JSON.parse(JSON.stringify(this.selectedFilters));
      // This is a new filter
      if (!(selectedDomainFilter in updatedFilters)) {
        updatedFilters[selectedDomainFilter] = [event];
        this.selectedFilters = updatedFilters;
        return;
      }
      // We are adding an item to a preexisting filter
      if (!updatedFilters[selectedDomainFilter].includes(event)) {
        updatedFilters[selectedDomainFilter].push(event);
        this.selectedFilters = updatedFilters;
        return;
      }
      // We are removing the last filter from the selected domain
      if (updatedFilters[selectedDomainFilter].length == 1) {
        delete updatedFilters[selectedDomainFilter];
        this.selectedFilters = updatedFilters;
        return;
      }
      // We are only removing an item from the list
      updatedFilters[selectedDomainFilter] = Array.from(
        updatedFilters[selectedDomainFilter].filter((f) => f != event)
      );
      this.selectedFilters = updatedFilters;
    },
    onCheckboxSelect(event) {
      this.handleCheckboxSelect(event.target.value),
        this.$emit("updateSelectedFilters", this.selectedFilters);
    },
  },
};
</script>

<style>
.filter-panel-container {
  width: 100%;
  margin-top: 1rem;
  background: #f4f4f4;
}

.filter-panel-container h4 {
  font-size: var(--cds-heading-01-font-size, 0.875rem);
  font-weight: var(--cds-heading-01-font-weight, 600);
  letter-spacing: var(--cds-heading-01-letter-spacing, 0.16px);
  line-height: var(--cds-heading-01-line-height, 1.42857);
}

.filter-panel-header {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.filter-panel-header .clear-button {
  display: flex;
  align-items: center;
  color: #3175ff;
  cursor: pointer;
}

.filter-panel-header .clear-button p {
  font-size: 0.875rem;
}

.expand-button {
  width: 5rem;
  height: 80%;
  border: none;
  background-color: transparent;
  display: none;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.expand-button img {
  transform: rotate(90deg);
}

.expand-button:hover {
  background-color: #e5e5e5;
}

.filter-panel-header .clear-button:hover {
  color: #0043ce;
}

.filter-panel-header,
.filter-panel-section {
  border-bottom: 1px solid var(--cds-ui-03, #e0e0e0);
}

.filter-panel-header,
.filter-panel-section-header,
.filter-panel-section-body {
  padding: var(--cds-spacing-05, 1rem);
}

.filter-panel-section-body {
  padding-top: 0;
}

@media screen and (max-width: 1055px) {
  .filter-panel-container {
    margin: 0;
    margin-top: 3rem;
  }

  .content {
    display: none;
  }

  .expand-button {
    display: flex;
  }
}
</style>
