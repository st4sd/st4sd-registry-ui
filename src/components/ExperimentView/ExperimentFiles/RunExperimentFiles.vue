<template>
  <h4>Provide Files</h4>
  <p><strong>Use the table to provide files to the workflow</strong></p>
  <p>
    Click on the rows to disclose additional information for each file.
    Configure and edit files in the disclosed section or use the three-dot menu
    on the right. You must upload input files, while the others are optional.
  </p>
</template>

<script>
export default {
  name: "RunExperimentFiles",
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";

h4 {
  padding-bottom: layout.$spacing-03;
}
</style>
