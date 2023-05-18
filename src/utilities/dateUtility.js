import moment from "moment";

// * Can not select days before today and today
export const disabledPastDate = (current) =>
  current && current < moment().startOf("day");

export const disableFutureDate = (current) =>
  current && current > moment().endOf("day");

export const disabledDatesPriorMonth = (current) =>
  current && current < moment().subtract(1, "month").startOf("month");
