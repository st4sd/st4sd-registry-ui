<template>
  <div v-if="type == 'success'">
    Set
    <img
      title="The file has been provided"
      src="@/assets/checkmark--filled.svg"
      class="success-green"
      width="20"
      height="20"
    />
  </div>
  <div v-else-if="type == 'fail'">
    Missing

    <img
      title="The file is required and has not been provided"
      src="@/assets/misuse.svg"
      class="fail-red"
      width="20"
      height="20"
    />
  </div>
  <div v-else>
    Unset
    <img
      title="The file is optional and has not been provided"
      src="@/assets/warning--filled.svg"
      class="warning-yellow"
      width="20"
      height="20"
    />
  </div>
</template>

<script>
export default {
  name: "FilesTableStatus",
  props: {
    type: String,
  },
};
</script>

<style scoped lang="scss">
@use "@/styles/svg.scss";

img {
  vertical-align: middle;
}
</style>
