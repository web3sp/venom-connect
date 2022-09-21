import { ModalState } from "../components";

export type ToggleExtensionWindow = {
  isExtensionWindowOpen: boolean;
  popUpText?: ModalState["popUpText"];
};

export const toggleExtensionWindow = async (params: ToggleExtensionWindow) =>
  await window.updateVenomModal(params);
