export const CONNECT_EVENT = "connect";
export const ERROR_EVENT = "error";
export const CLOSE_EVENT = "close";

export const SELECT_EVENT = "select";

export const EXTENSION_AUTH_EVENT = "extension-auth";
export const EXTENSION_WINDOW_CLOSED_EVENT = "extension-window-closed";

export type Events =
  | typeof CONNECT_EVENT
  | typeof ERROR_EVENT
  | typeof CLOSE_EVENT
  | typeof SELECT_EVENT
  | typeof EXTENSION_AUTH_EVENT
  | typeof EXTENSION_WINDOW_CLOSED_EVENT;
