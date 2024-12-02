<template>
  <cds-tile :class="theme">
    <div class="empty-state">
      <div class="cds--subgrid cds--subgrid--narrow" v-if="errorCode == 404">
        <div class="cds--css-grid-column cds--col-span-5">
          <img
            class="empty-state-icon"
            src="@/assets/empty-state-bright-magnifying-glass.svg"
          />
          <h3>Whoops! Not found.</h3>
          <br />
          <p>The item you are looking for does not exist.</p>
        </div>
      </div>
      <div
        class="cds--subgrid cds--subgrid--narrow"
        v-else-if="errorCode == 405"
      >
        <div class="cds--css-grid-column cds--col-span-5">
          <img
            class="empty-state-icon"
            src="@/assets/empty-state-bright-error.svg"
          />
          <h3>Uh oh. Maybe some other time.</h3>
          <br />
          <p>
            The registry administrator does not currently allow the features in
            this page.
          </p>
        </div>
      </div>
      <div
        class="cds--subgrid cds--subgrid--narrow"
        v-else-if="errorCode == 400"
      >
        <div class="cds--css-grid-column cds--col-span-5">
          <img
            class="empty-state-icon"
            src="@/assets/empty-state-bright-error.svg"
          />
          <h3>Something's wrong.</h3>
          <br />
          <p>
            The request was rejected.
            {{ errorDescription }}. {{ errorStatusText }}
          </p>
          <p>Click the button to go back</p>
          <br />
          <cds-button @click="$router.go(-1)">Back </cds-button>
        </div>
      </div>
      <div
        class="cds--subgrid cds--subgrid--narrow"
        v-else-if="errorCode == 425"
      >
        <div class="cds--css-grid-column cds--col-span-5">
          <img
            class="empty-state-icon"
            src="@/assets/empty-state-bright-magnifying-glass.svg"
          />
          <h3>Whoops! Not found... yet?</h3>
          <br />
          <p>The item you are looking for does not exist.</p>
          <p>
            It's possible it hasn't been registered to the database yet. Refresh
            the page in a few seconds or go back.
          </p>
          <br />
          <cds-button @click="reloadPage">Reload </cds-button>
          <br />
          <br />
          <cds-link @click="$router.go(-1)"> Go back </cds-link>
        </div>
      </div>
      <div class="cds--subgrid cds--subgrid--narrow" v-else>
        <div class="cds--css-grid-column cds--col-span-5">
          <img
            class="empty-state-icon"
            src="@/assets/empty-state-bright-error.svg"
          />
          <h3>Uh oh. Something went wrong.</h3>
          <br />
          <p>{{ errorDescription }}. {{ errorStatusText }}.</p>
          <p>Click Retry to try again.</p>
          <br />
          <cds-button @click="reloadPage">Retry </cds-button>
        </div>
      </div>
    </div>
  </cds-tile>
</template>
<script>
import "@carbon/web-components/es/components/tile/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/link/index.js";

export default {
  name: "HttpErrorEmptyState",
  props: {
    errorHeading: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      default: "cds-theme-zone-white",
    },
    errorStatusText: String,
    errorCode: Number,
    errorDescription: String,
  },
  methods: {
    reloadPage() {
      window.location.reload();
    },
  },
};
</script>

<style lang="scss" scoped src="@/styles/empty_state_styles.scss">
@use "@carbon/grid";
</style>
