// Try to ensure autoplay works on restrictive mobile browsers (Edge/Chrome/Safari)
// Force muted + programmatic play on DOMContentLoaded for any autoplay videos.
document.addEventListener("DOMContentLoaded", function () {
  try {
    const autoplayVideos = document.querySelector("#video1");
    // console.log(autoplayVideos);

    autoplayVideos.forEach((v, index) => {
      // Ensure muted attribute is present
      console.log(v);

      v.muted = true;
      // Some browsers require playsinline to be set as property as well
      v.playsInline = true;
      // Try to play programmatically; if blocked, browsers will ignore the error
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    });
  } catch (err) {
    // swallow errors - non-critical
    console.warn("Autoplay helper failed:", err);
  }
  try {
    const autoplayVideos = document.querySelector("#video2");
    // console.log(autoplayVideos);

    autoplayVideos.forEach((v, index) => {
      // Ensure muted attribute is present
      console.log(v);

      v.muted = true;
      // Some browsers require playsinline to be set as property as well
      v.playsInline = true;
      // Try to play programmatically; if blocked, browsers will ignore the error
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    });
  } catch (err) {
    // swallow errors - non-critical
    console.warn("Autoplay helper failed:", err);
  }
  try {
    const autoplayVideos = document.querySelector("#video3");
    // console.log(autoplayVideos);

    autoplayVideos.forEach((v, index) => {
      // Ensure muted attribute is present
      console.log(v);

      v.muted = true;
      // Some browsers require playsinline to be set as property as well
      v.playsInline = true;
      // Try to play programmatically; if blocked, browsers will ignore the error
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    });
  } catch (err) {
    // swallow errors - non-critical
    console.warn("Autoplay helper failed:", err);
  }
});
