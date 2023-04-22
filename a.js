let wakeLock = null;

const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Wake Lock acquired');
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
};
requestWakeLock();