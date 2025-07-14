// Глобальный мок window.matchMedia для тестовой среды
if (!window.matchMedia) {
  window.matchMedia = function () {
    return {
      matches: false,
      addEventListener: () => { },
      removeEventListener: () => { },
      addListener: () => { },
      removeListener: () => { },
      dispatchEvent: () => { }
    };
  };
}
