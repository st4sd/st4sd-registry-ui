<template>
  <div class="greyBackgroundColor">
    <div>
      <div>
        <div class="empty-state">
          <div>
            <div v-if="errorCode == 404">
              <img
                class="empty-state-icon"
                src="@/assets/empty-state-bright-magnifying-glass.svg"
              />
              <h3>Whoops! Not found.</h3>
              <br />
              <p>The item you are looking for does not exist.</p>
            </div>
            <div v-else-if="errorCode == 405">
              <img
                class="empty-state-icon"
                src="@/assets/empty-state-bright-error.svg"
              />
              <h3>Uh oh. Maybe some other time.</h3>
              <br />
              <p>
                The registry administrator does not currently allow the features
                in this page.
              </p>
            </div>
            <div v-else-if="errorCode == 400">
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
              <br />
              <p>Click the button to go back</p>
              <bx-btn
                style="margin-top: 1rem; min-width: 150px"
                @click="$router.go(-1)"
                >Back
              </bx-btn>
            </div>
            <div v-else>
              <img
                class="empty-state-icon"
                src="@/assets/empty-state-bright-error.svg"
              />
              <h3>Uh oh. Something went wrong.</h3>
              <br />
              <p>{{ errorDescription }}. {{ errorStatusText }}.</p>
              <p>Click Retry to try again.</p>
              <bx-btn
                style="margin-top: 1rem; min-width: 150px"
                @click="reloadPage"
                >Retry
              </bx-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "HttpErrorEmptyState",
  props: {
    errorHeading: {
      type: String,
      default: "",
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

<style lang="scss" scoped src="../../styles/empty_state_styles.scss"></style>
