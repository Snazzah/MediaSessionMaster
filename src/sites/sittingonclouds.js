Util.ensureSite('sittingonclouds', () => {
  navigator.mediaSession.metadata = new MediaMetadata();

  const updateInfo = () => {
		if (!document.querySelector('.main_cover__3zSiG img')) return;
    navigator.mediaSession.metadata.title = document.querySelector('#premidTitle').textContent;
    navigator.mediaSession.metadata.artist = document.querySelector('#premidArtist').textContent;
    navigator.mediaSession.metadata.album = document.querySelector('#premidAlbum').textContent;
    navigator.mediaSession.metadata.artwork = [{
      src: document.querySelector('.main_cover__3zSiG img').src,
      sizes: '500x500',
      type: 'image/jpeg'
    }];
  };

  const onMutation = mutations => {
    mutations.forEach(mutation => {
			if(!mutation.target) return;
			if (mutation.target.tagName === 'IMG')
				return updateInfo();
      switch(mutation.target.id) {
        case "premidArtist":
        case "premidTitle":
				case "premidAlbum":
          updateInfo();
          break;
      }
    });
  };

  const observer = new MutationObserver(onMutation);
  observer.observe(document.querySelector('.main_songData__3dCZO .col'), { subtree: true, attributes: true });
  observer.observe(document.querySelector('.main_cover__3zSiG img'), { attributes: true });
	updateInfo();
});