export const CONNECT_EVENT = "connect"; // pop-up
export const ERROR_EVENT = "error";
export const CLOSE_EVENT = "close"; // pop-up
export const SELECT_EVENT = "select";

export type Events =
  | typeof SELECT_EVENT
  | typeof CONNECT_EVENT
  | typeof ERROR_EVENT
  | typeof CLOSE_EVENT;
