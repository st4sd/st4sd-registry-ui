import { getDeploymentEndpoint } from "@/functions/public_path";
import { highlightCanvasErrors } from "@/canvas/functions/canvasFunctions";
import { canvasStore } from "@/canvas/stores/canvasStore";
import { setFormErrors } from "@/canvas/functions/dslErrors";
import axios from "axios";

export function postDslForValidation(saveResultToCanvasStore = false) {
  if (this.dsl != null) {
    axios
      .post(
        `${getDeploymentEndpoint()}registry-ui/backend/canvas/dsl/validate`,
        this.dsl,
      )
      .then((response) => {
        if (response.status == 200) {
          highlightCanvasErrors(this.allNodes, []);
          setFormErrors(this.allNodes, []);
          this.dslBeingValidated = "finished";
          this.dslInvalid = false;
          if (saveResultToCanvasStore) {
            canvasStore.setDsl(this.dsl);
            canvasStore.setGraph({
              nodes: this.allNodes,
              edges: this.allEdges,
            });
          }
        }
        this.$emit("dslValidationError", []);
      })
      .catch((error) => {
        this.dslBeingValidated = "error";
        this.dslInvalid = true;
        this.dslInvalidBackend = true;
        this.dslInvalidTitle = error.response.data.message;
        this.dslMessage =
          "There are errors in the DSL validation, click the show errors button to see them";
        this.dslErrorsData = error.response.data.problems;
        highlightCanvasErrors(this.allNodes, this.dslErrorsData);
        setFormErrors(this.allNodes, this.dslErrorsData);
        this.$emit("dslValidationError", this.dslErrorsData);
      });
  }
}
