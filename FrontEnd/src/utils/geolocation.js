// Getting a usable position out of a browser is not one question with one
// answer -- it's a stream of guesses that get better.
//
// getCurrentPosition() returns the FIRST fix the device can produce, which
// on a phone is the coarse cell/Wi-Fi estimate (often hundreds of metres to
// kilometres out) rather than the GPS fix that lands a few seconds later.
// That is why a single call so often reports the wrong place.
//
// watchPosition() keeps delivering fixes as the hardware narrows things
// down. This helper watches, keeps the most accurate reading seen, and
// stops as soon as the fix is good enough (or the time budget runs out) so
// it isn't holding the GPS open for the whole session.
//
// Hard limit worth knowing: a desktop or laptop with no GPS chip resolves
// position from Wi-Fi networks or the IP address. Wi-Fi lookup is usually
// good to ~100 m; IP lookup can be tens of kilometres off and frequently
// points at the ISP's hub rather than the building. No amount of retrying
// improves that -- only different hardware does.

export function watchBestPosition({
  onUpdate,
  onError,
  targetAccuracyM = 30,
  maxDurationMs = 25000,
}) {
  if (!navigator.geolocation) {
    onError?.(new Error("Geolocation not supported by this browser"));
    return () => {};
  }

  let best = null;
  let watchId = null;
  let timer = null;

  function stop() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const fix = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      // Only surface a fix that beats what we already have, so the pin
      // never jumps back to a worse estimate.
      if (best === null || fix.accuracy < best.accuracy) {
        best = fix;
        onUpdate(fix);
      }

      if (fix.accuracy <= targetAccuracyM) {
        stop();
      }
    },
    (error) => {
      // A later timeout after we already have a fix isn't a failure -- keep
      // the good reading and stop quietly.
      if (best === null) {
        onError?.(error);
      }
      stop();
    },
    {
      enableHighAccuracy: true,
      timeout: maxDurationMs,
      maximumAge: 0,
    }
  );

  timer = setTimeout(stop, maxDurationMs);

  return stop;
}


// Turns a raw accuracy radius in metres into something a person can act on.
export function describeAccuracy(accuracy) {
  if (accuracy == null) return null;

  if (accuracy <= 50) {
    return { text: `Accurate to about ${Math.round(accuracy)} m`, trusted: true };
  }

  if (accuracy < 1000) {
    return {
      text: `Rough fix — accurate to about ${Math.round(accuracy)} m`,
      trusted: false,
    };
  }

  return {
    text: `Very rough fix — could be off by ${(accuracy / 1000).toFixed(1)} km. This is a network estimate, not GPS.`,
    trusted: false,
  };
}
