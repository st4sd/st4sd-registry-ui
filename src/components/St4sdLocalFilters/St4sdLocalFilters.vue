<template>
  <div class="cds--col-lg-4">
    <dds-filter-panel-composite
      @dds-selection-clear="passSelectedFilters"
      @dds-checkbox-select="passSelectedFilters"
    >
      <dds-filter-panel-heading slot="heading">Filter</dds-filter-panel-heading>
      <dds-filter-group
        v-for="(domainFilter, domainFilterIdx) in domainFilters"
        :key="`domainFilter-${domainFilterIdx}`"
      >
        <dds-filter-group-item
          :filter-for="domainFilter.filterFor"
          :open="domainFilter.isOpen"
          :title-text="domainFilter.displayName"
        >
          <template v-for="(filter, filterIdx) in domainFilter.filters">
            <dds-filter-panel-checkbox
              :value="filter.name"
              :key="`filterPanel-${filterIdx}`"
              >{{ filter.displayName }}</dds-filter-panel-checkbox
            >
          </template>
        </dds-filter-group-item>
      </dds-filter-group>
    </dds-filter-panel-composite>
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
export default {
  props: {
    experiments: Array,
  },
  data() {
    return {
      domainFilters,
      selectedFilters: {},
    };
  },
  methods: {
    handleCheckboxSelect(event) {
      // Handle clear button
      if (event.type == "dds-selection-clear") {
        this.selectedFilters = {};
        return;
      }
      // Find the element the filter belongs to
      let selectedDomainFilter = this.domainFilters.filter((pf) =>
        pf.filters.some((f) => f.name == event.detail.value)
      )[0].filterFor;
      // Create a copy of the filters
      let updatedFilters = JSON.parse(JSON.stringify(this.selectedFilters));
      // This is a new filter
      if (!(selectedDomainFilter in updatedFilters)) {
        updatedFilters[selectedDomainFilter] = [event.detail.value];
        this.selectedFilters = updatedFilters;
        return;
      }
      // We are adding an item to a preexisting filter
      if (!updatedFilters[selectedDomainFilter].includes(event.detail.value)) {
        updatedFilters[selectedDomainFilter].push(event.detail.value);
        console.log(updatedFilters);
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
        updatedFilters[selectedDomainFilter].filter(
          (f) => f != event.detail.value
        )
      );
      this.selectedFilters = updatedFilters;
    },
    passSelectedFilters(event) {
      this.handleCheckboxSelect(event),
        this.$emit("updateSelectedFilters", this.selectedFilters);
    },
  },
};
</script>
