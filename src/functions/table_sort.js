/*
    Copyright IBM Inc. All Rights Reserved.
    SPDX-License-Identifier: Apache-2.0

    Author: Philip Burrows
*/
export function get_table_sort_dummy_event(id, sortDirection) {
  let dummyEvent = {};
  dummyEvent["target"] = document.getElementById(id);
  dummyEvent["detail"] = {};
  dummyEvent.detail["sortDirection"] = sortDirection;
  return dummyEvent;
}

export function get_sorted_elements(data, sortDirection, sortColumnId) {
  let collator = new Intl.Collator("en");
  if (sortDirection == undefined || sortDirection == "none") return data;

  return data.slice().sort((lhs, rhs) => {
    const lhsValue = lhs[sortColumnId];
    const rhsValue = rhs[sortColumnId];

    // Always sort NaNs last
    if (
      lhsValue === undefined ||
      (typeof lhsValue !== "string" && isNaN(lhsValue))
    ) {
      return 1;
    }
    if (
      rhsValue === undefined ||
      (typeof rhsValue !== "string" && isNaN(rhsValue))
    )
      return -1;

    // Ensure we don't sort dates by their string value
    // when using the collator
    if (lhsValue instanceof Date && rhsValue instanceof Date) {
      return sortDirection === "ascending"
        ? lhsValue - rhsValue
        : rhsValue - lhsValue;
    }

    return (
      (sortDirection === "ascending" ? 1 : -1) *
      collator.compare(lhsValue, rhsValue)
    );
  });
}
