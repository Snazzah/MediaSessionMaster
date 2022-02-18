Util.ensureSite('picarto', () => {
  let lastPicture = null;
  const updateInfo = () => {
    if(!document.querySelector('[class^="styled__ChannelLeftContent"] [class^="ChannelToolbarTitle"], [class^="MinimizedStream"], .mistvideo-curentTime')) {
      navigator.mediaSession.metadata = null;
      return;
    }

    if(document.querySelector('[class^="styled__ChannelLeftContent"] [class^="ChannelToolbarTitle"]')) {
      lastPicture = document.querySelector('[class^="styled__ChannelLeftContent"] .ant-avatar img').src;
      navigator.mediaSession.metadata = new MediaMetadata({
        artist: 'Picarto',
        album: 'Picarto',
        title: document.querySelector('[class^="styled__ChannelLeftContent"] [class^="ChannelToolbarTitle"]').textContent,
        artwork: [
          {
            src: lastPicture,
            sizes: '100x100',
            type: 'image/jpeg'
          },
        ]
      });
    } else if (document.querySelector('[class^="MinimizedStream"]')) {
      navigator.mediaSession.metadata = new MediaMetadata({
        artist: 'Picarto',
        album: 'Picarto',
        title: document.querySelector('[class^="MinimizedStream"] span').textContent,
        artwork: [
          {
            src: lastPicture,
            sizes: '100x100',
            type: 'image/jpeg'
          },
        ]
      });
    }
  };

  const onMutation = mutations => {
    mutations.forEach(mutation => {
      if(!mutation.target) return;
      updateInfo();
    });
  };

  const observer = new MutationObserver(onMutation);
  observer.observe(document.querySelector('#root'), { subtree: true, attributes: true });
  updateInfo();
});
