export const CONNECT_EVENT = "connect";
export const ERROR_EVENT = "error";
export const CLOSE_EVENT = "close";
export const SELECT_EVENT = "select";

export type Events =
  | typeof SELECT_EVENT
  | typeof CONNECT_EVENT
  | typeof ERROR_EVENT
  | typeof CLOSE_EVENT;
