Util.ensureSite('twitch', () => {
  navigator.mediaSession.metadata = new MediaMetadata();
  let observingAvatar = false;

  const updateChannel = () => {
    const avatar = document.querySelector('.channel-root__info .tw-image-avatar');
    const username = document.querySelector('.channel-root__info .tw-title');
    if (!username || !avatar) return;
    if (!observingAvatar) {
      observingAvatar = true;
      verifyObserver.observe(avatar, { attributes: true });
    }
    navigator.mediaSession.metadata.title = username.textContent;
    navigator.mediaSession.metadata.artist = 'Twitch';
    navigator.mediaSession.metadata.album = 'Twitch';
    navigator.mediaSession.metadata.artwork = [
      {
        src: avatar.src,
        sizes: '70x70',
        type: 'image/jpeg'
      },
      {
        src: avatar.src.replace('70x70.', '300x300.'),
        sizes: '300x300',
        type: 'image/jpeg'
      },
      {
        src: avatar.src.replace('70x70.', '600x600.'),
        sizes: '600x600',
        type: 'image/jpeg'
      },
    ];
  };

  const verifyObserver = new MutationObserver(mutations => {
    const nameMutation = mutations.find(mutation => mutation.attributeName === 'data-a-page-loaded-name');
    if(!nameMutation) return;
    else {
      switch(document.querySelector('#root').getAttribute('data-a-page-loaded-name')) {
        case 'ChannelWatchPage':
        case 'ChannelPage':
          verifyObserver.disconnect();
          const observer = new MutationObserver(updateChannel);
          observer.observe(document.querySelector('.channel-root__info'), { attributes: true, childList: true });
          updateChannel();
          break;
      }
    }
  });
  verifyObserver.observe(document.querySelector('#root'), { attributes: true });
});
