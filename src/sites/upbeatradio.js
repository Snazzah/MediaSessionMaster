Util.ensureSite('upbeatradio', () => {
	navigator.mediaSession.metadata = new MediaMetadata();

  const updateInfo = () => {
		if (!document.querySelector('.stats-artist') || !document.querySelector('.stats-song')) return;
		navigator.mediaSession.metadata.title = document.querySelector('.stats-song').textContent;
		navigator.mediaSession.metadata.artist = document.querySelector('.stats-artist').textContent;
    navigator.mediaSession.metadata.artwork = [{
			src: document.querySelector('.stats-songImage').src,
			sizes: '300x300',
			type: 'image/jpeg'
		}];
	};

  const onMutation = mutations => {
    mutations.forEach(mutation => {
			if(!mutation.target || !mutation.target.className) return;
      switch(mutation.target.className) {
        case "stats-artist":
				case "stats-song":
          updateInfo();
          break;
			}
    });
  };

  const observer = new MutationObserver(onMutation);
  observer.observe(document.querySelector('.statsPadding'), { childList: true, subtree: true });
  updateInfo();
});