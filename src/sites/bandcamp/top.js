(() => {
  // Get data and remove script
  const self = document.querySelector('#mm-script'),
    data = JSON.parse(self.getAttribute('data'));
  self.remove();

  navigator.mediaSession.metadata = new MediaMetadata();
  const path = new URL(location.href).pathname;

  const setUpAlbum = () => {
    navigator.mediaSession.metadata = new MediaMetadata({
      album: EmbedData.album_title,
      artist: EmbedData.artist,
      artwork: [
        {
          src: document.querySelector('#tralbumArt img').src,
          sizes: '1200x1200',
          type: 'image/jpeg'
        },
        {
          src: document.querySelector('#tralbumArt .popupImage').href,
          sizes: '700x700',
          type: 'image/jpeg'
        },
      ]
    });
  };

  const updatePosition = (selector = 'audio') => {
    if ('setPositionState' in navigator.mediaSession) {
      const audio = document.querySelector(selector);

      navigator.mediaSession.setPositionState({
        duration: audio.duration,
        playbackRate: audio.playbackRate,
        position: audio.currentTime
      });
    }
  };

  setUpAlbum();

  if(path.startsWith('/track/')) {
    const setToMain = () => {
      if(EmbedData.album_title !== navigator.mediaSession.metadata.album) setUpAlbum();
    };

    const updateInfo = () => {
      setToMain();
      const track = TralbumData.trackinfo.find(track => track.title_link === document.querySelector('a.title_link').getAttribute('href'));
      navigator.mediaSession.metadata.title = track.title;
      const audio = document.querySelector('audio');

      navigator.mediaSession.setActionHandler('seekbackward', function(event) {
        const skipTime = event.seekOffset || data.skipTime;
        audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
        updatePosition();
      });

      navigator.mediaSession.setActionHandler('seekforward', function(event) {
        const skipTime = event.seekOffset || data.skipTime;
        audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
        updatePosition();
      });

      navigator.mediaSession.setActionHandler('seekto', function(event) {
        if (event.fastSeek && ('fastSeek' in audio))
          return audio.fastSeek(event.seekTime);
        audio.currentTime = event.seekTime;
        updatePosition();
      });

      updatePosition();
    };

    navigator.mediaSession.metadata.title = TralbumData.trackinfo[0].title;
    document.querySelector('.inline_player .playbutton').addEventListener('click', updateInfo);
  } else if(path.startsWith('/album/')) {
    const setToMain = () => {
      if(EmbedData.album_title !== navigator.mediaSession.metadata.album) setUpAlbum();
    };

    const updateInfo = () => {
      setToMain();
      const track = TralbumData.trackinfo.find(track => track.title_link === document.querySelector('a.title_link').getAttribute('href'));
      navigator.mediaSession.metadata.title = track.title;
      const audio = document.querySelector('audio');

      const index = TralbumData.trackinfo.indexOf(track);
      navigator.mediaSession.setActionHandler('nexttrack', (index + 1) !== TralbumData.trackinfo.length ? () => document.querySelector('.nextbutton').click() : null);
      navigator.mediaSession.setActionHandler('previoustrack', index !== 0 ? () => document.querySelector('.prevbutton').click() : null);

      navigator.mediaSession.setActionHandler('seekbackward', function(event) {
        const skipTime = event.seekOffset || data.skipTime;
        audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
        updatePosition();
      });

      navigator.mediaSession.setActionHandler('seekforward', function(event) {
        const skipTime = event.seekOffset || data.skipTime;
        audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
        updatePosition();
      });

      navigator.mediaSession.setActionHandler('seekto', function(event) {
        if (event.fastSeek && ('fastSeek' in audio))
          return audio.fastSeek(event.seekTime);
        audio.currentTime = event.seekTime;
        updatePosition();
      });

      updatePosition();
    };

    const onMutation = mutations => {
      mutations.forEach(mutation => {
        if(!mutation.target || !mutation.target.className) return;
        switch(mutation.target.className) {
          case "title":
            updateInfo();
            break;
        }
      });
    };

    const observer = new MutationObserver(onMutation);
    observer.observe(document.querySelector('.inline_player'), { childList: true, subtree: true });
    updateInfo();

    // Reset album to main album if play button is clicked
    document.querySelector('.inline_player .playbutton').addEventListener('click', setToMain);
    Array.prototype.forEach.call(
      document.querySelectorAll('.track_list .play_status'),
      playButton => playButton.addEventListener('click', setToMain)
    );
  }

  // Change album metadata to the recommended album clicked
  Array.prototype.forEach.call(document.querySelectorAll('.recommended-album'), albumElem => {
    const onPlay = () => {
      const audio = document.querySelector('audio:nth-of-type(2)');
      navigator.mediaSession.metadata = new MediaMetadata({
        title: albumElem.querySelector('.release-title').innerText,
        artist: albumElem.querySelector('.by-artist').innerText.slice(3),
        artwork: [
          {
            src: albumElem.querySelector('img').src,
            sizes: '210x210',
            type: 'image/jpeg'
          },
        ]
      });
      
      navigator.mediaSession.setActionHandler('nexttrack', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);

      navigator.mediaSession.setActionHandler('seekbackward', function(event) {
        const skipTime = event.seekOffset || data.skipTime;
        audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
        updatePosition('audio:nth-of-type(2)');
      });

      navigator.mediaSession.setActionHandler('seekforward', function(event) {
        const skipTime = event.seekOffset || data.skipTime;
        audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
        updatePosition('audio:nth-of-type(2)');
      });

      navigator.mediaSession.setActionHandler('seekto', function(event) {
        if (event.fastSeek && ('fastSeek' in audio))
          return audio.fastSeek(event.seekTime);
        audio.currentTime = event.seekTime;
        updatePosition('audio:nth-of-type(2)');
      });

      updatePosition('audio:nth-of-type(2)');
    };

    albumElem.querySelector('img').addEventListener('click', onPlay);
  });
})();