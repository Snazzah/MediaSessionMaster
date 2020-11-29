(() => {
  // Get data and remove script
  const self = document.querySelector('#mm-script'),
    data = JSON.parse(self.getAttribute('data'));
  self.remove();

  navigator.mediaSession.metadata = new MediaMetadata();

  function playerSort (a, b) {
    if (a.$container[0].id === 'global-audio-player-container') return 1;
    if (a.$container[0].id === 'waveform') return -1;
    return 0;
  }

  const changeObserver = new MutationObserver(() => {
    const sortedPlayers = NgMediaPlayer.players.sort(playerSort);
    const player = sortedPlayers.find(player => player.isPlaying()) || sortedPlayers[0];
    if(player) {
      if (player.$container[0].id === 'global-audio-player-container') {
        if (!document.querySelector('.ng-apg-media-title')) return;
        navigator.mediaSession.metadata.title = document.querySelector('.ng-apg-media-title').textContent;
        navigator.mediaSession.metadata.artist = document.querySelector('.ng-apg-media-artist').textContent;
        navigator.mediaSession.metadata.artwork = [
          {
            src: document.querySelector('.ng-apg-media-icon').style.backgroundImage.split('"')[1],
            sizes: '90x90',
            type: 'image/png'
          },
        ];
      } else if (player.$container[0].id === 'waveform') {
        const audioID = location.pathname.split('/')[3];
        const artistID = document.querySelector('.user-icon-bordered img').src.split('_')[0].split('/').reverse()[0];
        navigator.mediaSession.metadata.title = document.querySelector('[itemprop="name"]').textContent;
        navigator.mediaSession.metadata.artist = document.querySelector('.item-details-main').textContent.trim();
        navigator.mediaSession.metadata.artwork = [
          {
            src: `https://aicon.ngfiles.com/${audioID.substring(0, 3)}/${audioID}.png`,
            sizes: '90x90',
            type: 'image/png'
          },
          {
            src: `https://uimg.ngfiles.com/profile/${artistID.substring(0, 4)}/${artistID}.png`,
            sizes: '248x248',
            type: 'image/png'
          },
        ];
      }

      navigator.mediaSession.setActionHandler('nexttrack', player.hasNextItem() ? () => player.next() : null);
      navigator.mediaSession.setActionHandler('previoustrack', player.hasPreviousItem() ? () => player.previous() : null);

      navigator.mediaSession.setActionHandler('seekbackward', function(event) {
        const skipTime = event.seekOffset || data.skipTime;
        player.seek(Math.max(player.getProgress() - skipTime, 0));
      });

      navigator.mediaSession.setActionHandler('seekforward', function(event) {
        const skipTime = event.seekOffset || data.skipTime;
        player.seek(Math.min(player.getProgress() + skipTime, player.getDuration()));
      });

      navigator.mediaSession.setActionHandler('seekto', function(event) {
        player.seek(event.seekTime);
      });
    }
  });

  window.addEventListener('load', () => {
    Array.from(document.querySelectorAll('.ui-slider, .ui-slider .overlay'))
      .forEach(el => changeObserver.observe(el, { attributes: true, childList: true }))
  });

  if (location.pathname.startsWith('/portal/view')) {
    const portalID = location.pathname.split('/')[3];
    navigator.mediaSession.metadata.title = document.querySelector('[itemprop="name"]').textContent;
    navigator.mediaSession.metadata.artist = document.querySelector('.item-details-main').textContent.trim();
    navigator.mediaSession.metadata.artwork = [
      {
        src: `https://picon.ngfiles.com/${portalID.substring(0, 3)}000/flash_${portalID}.png`,
        sizes: '140x90',
        type: 'image/png'
      },
      {
        src: `https://picon.ngfiles.com/${portalID.substring(0, 3)}000/flash_${portalID}_card.png`,
        sizes: '720x425',
        type: 'image/png'
      },
    ];
  }
})();