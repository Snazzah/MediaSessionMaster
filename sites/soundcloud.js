Util.ensureSite('soundcloud', () => {
  navigator.mediaSession.metadata = new MediaMetadata();

  const updateInfo = () => {
    const artworkURL = document
      .querySelector('.playbackSoundBadge__avatar span')
      .style.backgroundImage.replace(/^url\("(.*)"\)$/, '$1');

    navigator.mediaSession.metadata.title = document.querySelector('.playbackSoundBadge__titleLink span:nth-child(2)').innerText;
    navigator.mediaSession.metadata.artist = document.querySelector('.playbackSoundBadge__lightLink').innerText;
    navigator.mediaSession.metadata.artwork = [
      {
        src: artworkURL,
        sizes: '120x120',
        type: 'image/jpeg'
      },
      {
        src: artworkURL.replace('120x120.', '500x500.'),
        sizes: '500x500',
        type: 'image/jpeg'
      },
    ];
  };

  const updatePosition = () => {
    if ('setPositionState' in navigator.mediaSession) {
      const timelineWrapper = document.querySelector('.playbackTimeline__progressWrapper');

      navigator.mediaSession.setPositionState({
        duration: parseInt(timelineWrapper.getAttribute('aria-valuemax')),
        playbackRate: 1,
        position: parseInt(timelineWrapper.getAttribute('aria-valuenow'))
      });
    }
  };

  const updateForAd = () => {
    const skipButton = document.querySelector('.playControlsPanel__skipButton');
    const adHTML = document.querySelector('.adVisualHtml');
    if(adHTML) updateInfo();
    else if(skipButton) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Advertisement',
        artist: 'SoundCloud',
      });
    } else updateInfo();
  };

  const onMutation = mutations => {
    mutations.forEach(mutation => {
      if(!mutation.target || !mutation.target.className) return;
      switch(mutation.target.className) {
        case "playbackSoundBadge paused":
        case "playbackSoundBadge":
        case "playControl sc-ir playControls__control playControls__play playing":
          updateInfo();
          break;
        case "playbackTimeline__duration":
        case "playbackTimeline__timePassed":
          updatePosition();
          break;
        case "playControlsPanel__body sc-pending-dark m-loading ":
        case "playControlsPanel sc-font-body sc-background-darkgrey is-active m-companionless":
        case "playControlsPanel sc-font-body sc-background-darkgrey is-active":
          updateForAd();
          break;
      }
    });
  };

  const observer = new MutationObserver(onMutation);
  observer.observe(document.querySelector('.playControls__wrapper'), { childList: true, subtree: true });

  // Check if SoundCloud preloaded a song, the observer may not pick this up.
  if(document.querySelector('.playControls').classList.contains('m-visible'))
    updateInfo();
});