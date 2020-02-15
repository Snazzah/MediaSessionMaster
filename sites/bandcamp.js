Util.ensureSite('bandcamp', () => {
  navigator.mediaSession.metadata = new MediaMetadata();
  const variables = document.querySelector("#pgBd > script:nth-of-type(2)").text.split('var ');
  const path = new URL(location.href).pathname;
  eval(variables.find(line => line.startsWith('EmbedData')).trim());

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
  setUpAlbum();

  if(path.startsWith('/track/')) {
    eval(variables.find(line => line.startsWith('TralbumData')).trim());
    navigator.mediaSession.metadata.title = TralbumData.trackinfo[0].title;
  } else if(path.startsWith('/album/')) {
    eval(variables.find(line => line.startsWith('TralbumData')).split('if ( window.FacebookData ) {')[0].trim());

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

      let defaultSkipTime = 10; /* Time to skip in seconds by default */

      navigator.mediaSession.setActionHandler('seekbackward', function(event) {
        const skipTime = event.seekOffset || defaultSkipTime;
        audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
        updatePosition();
      });

      navigator.mediaSession.setActionHandler('seekforward', function(event) {
        const skipTime = event.seekOffset || defaultSkipTime;
        audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
        updatePosition();
      });

      try {
        navigator.mediaSession.setActionHandler('seekto', function(event) {
          if (event.fastSeek && ('fastSeek' in audio))
            return audio.fastSeek(event.seekTime);
          audio.currentTime = event.seekTime;
          updatePosition();
        });
      } catch(e) { }

      updatePosition();
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

        let defaultSkipTime = 10; /* Time to skip in seconds by default */
  
        navigator.mediaSession.setActionHandler('seekbackward', function(event) {
          const skipTime = event.seekOffset || defaultSkipTime;
          audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
          updatePosition('audio:nth-of-type(2)');
        });
  
        navigator.mediaSession.setActionHandler('seekforward', function(event) {
          const skipTime = event.seekOffset || defaultSkipTime;
          audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
          updatePosition('audio:nth-of-type(2)');
        });
  
        try {
          navigator.mediaSession.setActionHandler('seekto', function(event) {
            if (event.fastSeek && ('fastSeek' in audio))
              return audio.fastSeek(event.seekTime);
            audio.currentTime = event.seekTime;
            updatePosition('audio:nth-of-type(2)');
          });
        } catch(e) { }
  
        updatePosition('audio:nth-of-type(2)');
      };

      albumElem.querySelector('img').addEventListener('click', onPlay);
    });
  }
});