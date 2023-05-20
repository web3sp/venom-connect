export const setupNetworkIdTimer = (
  address: any, // Address / string
  provider: any, // ProviderRpcClient
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
      if (allowedNetworkIds !== undefined) {
        if (Array.isArray(allowedNetworkIds)) {
          isAllowedId = !!allowedNetworkIds.find(
            (id) => state.networkId === id
          );
        } else {
          isAllowedId = state.networkId === allowedNetworkIds;
        }
      }
      const isAuth = !!state?.permissions?.accountInteraction?.address;

      // console.log('TESING NET', allowedNetworkIds, state)
      // console.log('E SET TO WRONG', state && address && !isAllowedId)
      window.updateVenomModal({
        wrongNetwork: isAuth ? state && address && !isAllowedId : undefined,
      });
      // console.log('E SET TO', state && state.permissions?.accountInteraction?.address && state.networkId !== 1000)
    }, 1000);
  }
};

export const resetNetworkIdTimer = () => {
  clearInterval(window.venomNetworkIntervalId);
  window.venomNetworkIntervalId = undefined;
};
