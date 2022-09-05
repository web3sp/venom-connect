export const setupNetworkIdTimer = (
  address: any,
  provider: any,
  allowedNetworkIds: number | number[] | undefined
) => {
  if (window && address && window.venomNetworkIntervalId) {
    resetNetworkIdTimer();
  }
  if (provider && address && window && !window.venomNetworkIntervalId) {
    window.venomNetworkIntervalId = window.setInterval(async () => {
      const state = await provider?.getProviderState?.();
      // если есть белый список, то чекаем, иначе можно всем
      let isAllowedId = true;
      if (allowedNetworkIds) {
        if (Array.isArray(allowedNetworkIds)) {
          isAllowedId = !!allowedNetworkIds.find(
            (id) => state.networkId === id
          );
        } else {
          isAllowedId = state.networkId === allowedNetworkIds;
        }
      }
      // console.log('TESING NET', allowedNetworkIds, state)
      // console.log('E SET TO WRONG', state && address && !isAllowedId)
      window.updateVenomModal({
        wrongNetwork: state && address && !isAllowedId,
      });
      // console.log('E SET TO', state && state.permissions?.accountInteraction?.address && state.networkId !== 1000)
    }, 1000);
  }
};

export const resetNetworkIdTimer = () => {
  clearInterval(window.venomNetworkIntervalId);
  window.venomNetworkIntervalId = undefined;
};
