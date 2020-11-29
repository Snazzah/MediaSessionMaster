Util.ensureSite('storyfire', () => {
  navigator.mediaSession.metadata = new MediaMetadata();

  const updateInfo = () => {
    if (!document.querySelector('.vjs-poster')) return;
    navigator.mediaSession.metadata.title = document
      .querySelector(".title > div:not(.series)").textContent;
    navigator.mediaSession.metadata.artist = document
      .querySelector(".user-name").textContent;
    navigator.mediaSession.metadata.album = document
      .querySelector(".title > div.series").textContent;
    navigator.mediaSession.metadata.artwork = [{
      src: document
        .querySelector('.vjs-poster')
        .style.backgroundImage.replace(/^url\("(.*)"\)$/, '$1'),
      sizes: '7504x422',
      type: 'image/webp'
    }];
    clearTimeout(checkInterval);
  };

  const checkInterval = setInterval(updateInfo, 50);
});