export const delay = (delayInMS = 1e3) => new Promise((resolve) => {
  setTimeout(resolve, delayInMS);
});
