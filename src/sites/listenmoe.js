Util.ensureSite('listenmoe', () => {
	navigator.mediaSession.metadata = new MediaMetadata();
	navigator.mediaSession.playbackState = "paused";

  const updateInfo = () => {
		if (!document.querySelector('.marquee-wrapper.titleContainer') || !document.querySelector('.marquee-wrapper.artistContainer')) return;
		const artworkURL = document.querySelector('.pictureContainer img')
		? document.querySelector('.pictureContainer img').src
		: 'https://listen.moe/_nuxt/img/blank-dark.cd1c044.png';

		navigator.mediaSession.metadata.title = document.querySelector('.marquee-wrapper.titleContainer')
			.textContent.trim().replace(/\s+/g, ' ');
		navigator.mediaSession.metadata.artist = document.querySelector('.marquee-wrapper.artistContainer')
			.textContent.trim().replace(/\s+/g, ' ').replace(/ , /g, ', ');
    navigator.mediaSession.metadata.artwork = artworkURL.includes('_nuxt/img/blank') ? [{
			src: 'https://github.com/LISTEN-moe.png',
			sizes: '256x256',
			type: 'image/png'
		}] : [{
			src: artworkURL,
			sizes: '500x500',
			type: 'image/jpeg'
		}];
	};

  const onMutation = mutations => {
    mutations.forEach(mutation => {
			if(!mutation.target || !mutation.target.className) return;
      switch(mutation.target.className) {
        case "playbackContainer":
				case "player shadow":
				case "playerContainer mini shadow":
        case "ja player-song-artist-container":
        case "ja player-song-title":
          updateInfo();
          break;
			}
    });
  };

  const observer = new MutationObserver(onMutation);
  observer.observe(document.querySelector('.layout'), { childList: true, subtree: true });
  observer.observe(document.querySelector('#audio-player'), { attributes: true });
  updateInfo();
});