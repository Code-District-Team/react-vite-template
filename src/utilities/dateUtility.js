import dayjs from "dayjs";

// * Can not select days before today and today
export const disabledPastDate = (current) =>
  current && current < dayjs().startOf("day");

export const disableFutureDate = (current) =>
  current && current > dayjs().endOf("day");

export const disabledDatesBeforeLastMonth = (current) =>
  current && current < dayjs().subtract(1, "month").startOf("month");

export const disabledDatesLastMonth = (current) =>
  current && current < dayjs().subtract(1, "month").endOf("month");
