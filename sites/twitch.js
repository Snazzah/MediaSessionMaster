Util.ensureSite('twitch', () => {
  navigator.mediaSession.metadata = new MediaMetadata();

  const updateChannel = () => {
    const avatar = document.querySelector('.channel-header__user-avatar img');
    const username = document.querySelector('.channel-header__user-avatar + p');
    navigator.mediaSession.metadata.title = username.innerText;
    navigator.mediaSession.metadata.artist = 'Twitch';
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
    const nameMutation = mutations.find(mutation => mutation.attributeName === "data-a-page-loaded-name");
    if(!nameMutation) return;
    else {
      switch(document.querySelector('#root').getAttribute('data-a-page-loaded-name')) {
        case 'ChannelPage':
          verifyObserver.disconnect();
          const observer = new MutationObserver(updateChannel);
          observer.observe(document.querySelector('.channel-header__user-avatar img'), { attributes: true });
          updateChannel();
          break;
      }
    }
  });
  verifyObserver.observe(document.querySelector('#root'), { attributes: true });
});