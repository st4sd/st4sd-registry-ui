<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <div class="right-on-tablet-and-mobile">
    <c4d-filter-panel-composite
      id="c4d-filter-panel"
      @c4d-selection-clear="scrubSelectedFilters"
    >
      <c4d-filter-panel-heading slot="heading">Filter</c4d-filter-panel-heading>
      <c4d-filter-group>
        <c4d-filter-group-item
          v-for="(domain, idx) in this.domainFilters"
          :key="idx"
          open
          :title="domain.displayName"
        >
          <c4d-filter-panel-checkbox
            v-for="(filter, idx2) in domain.filters"
            :key="idx2"
            :value="filter.name"
            @c4d-checkbox-select="
              onUpdateSelectedFilters(domain.filterFor, filter.name)
            "
            >{{ filter.displayName }}</c4d-filter-panel-checkbox
          >
        </c4d-filter-group-item>
      </c4d-filter-group>
    </c4d-filter-panel-composite>
  </div>
</template>

<script>
import "@carbon/ibmdotcom-web-components/es/components/filter-panel/index.js";
const domainFilters = [
  {
    filterFor: "domain",
    displayName: "Domain",
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
    filters: [
      {
        name: "surrogate",
        displayName: "Surrogate",
      },
      {
        name: "internal-experiment",
        displayName: "Internal Experiment",
      },
    ],
  },
];

export default {
  data() {
    return {
      domainFilters: domainFilters,
      selectedFilters: {
        domain: [],
        platform: [],
        other: [],
      },
    };
  },
  props: {
    experiments: Array,
  },
  methods: {
    scrubSelectedFilters() {
      for (let domain in this.selectedFilters) {
        this.selectedFilters[domain] = [];
      }
    },
    onUpdateSelectedFilters(domain, filter) {
      let duplicate = this.selectedFilters[domain].indexOf(filter);
      if (duplicate > -1) {
        this.selectedFilters[domain].splice(duplicate, 1);
      } else {
        this.selectedFilters[domain].push(filter);
      }
      this.$emit("updateSelectedFilters", this.selectedFilters);
    },
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";

.right-on-tablet-and-mobile {
  @media screen and (max-width: 1056px) {
    display: flex;
    justify-content: flex-end;
    margin-top: layout.$spacing-04;
  }
}

</style>