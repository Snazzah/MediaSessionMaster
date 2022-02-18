Util.ensureSite('vine', data => {
  const pageInit = () => {
    if(document.querySelector('[src$="frowny.svg"]')) return;
    const video = document.querySelector('video');

    const updatePosition = () => {
      if ('setPositionState' in navigator.mediaSession) {
        navigator.mediaSession.setPositionState({
          duration: video.duration,
          playbackRate: video.playbackRate,
          position: video.currentTime
        });
      }
    };

    navigator.mediaSession.metadata = new MediaMetadata({
      artist: document.querySelector('#ember470').innerText,
      title: document.querySelector('#ember518').innerText || 'Vine',
      artwork: [
        {
          src: document.querySelector('.video-container').style.backgroundImage.replace(/^url\("(.*)"\)$/, '$1'),
          sizes: '480x480',
          type: 'image/jpeg'
        },
      ]
    });

    navigator.mediaSession.setActionHandler('seekbackward', function(event) {
      const skipTime = event.seekOffset || data.skipTime;
      video.currentTime = Math.max(video.currentTime - skipTime, 0);
      updatePosition();
    });

    navigator.mediaSession.setActionHandler('seekforward', function(event) {
      const skipTime = event.seekOffset || data.skipTime;
      video.currentTime = Math.min(video.currentTime + skipTime, video.duration);
      updatePosition();
    });

    try {
      navigator.mediaSession.setActionHandler('seekto', function(event) {
        if (event.fastSeek && ('fastSeek' in video))
          return video.fastSeek(event.seekTime);
        video.currentTime = event.seekTime;
        updatePosition();
      });
    } catch(e) { }

    updatePosition();
  }

  const verifyObserver = new MutationObserver(() => {
    verifyObserver.disconnect();
    pageInit();
  });
  verifyObserver.observe(document.querySelector('.ember-application'), { childList: true });
});
