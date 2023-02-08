const timeout = 1500;
let isTimeout = true;

export default function stopMutiPress(callback, params) {
  if (isTimeout) {
    callback(params);
    isTimeout = false;
    setTimeout(() => {
      isTimeout = true;
    }, timeout);
  }
}
