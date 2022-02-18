Util.ensureSite('sittingonclouds', () => {
  const updateInfo = () => {
    if (!document.querySelector('.row:nth-child(1) .marquee_marquee__1MS_n').textContent) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: document.querySelector('.row:nth-child(2) .marquee_marquee__1MS_n').textContent,
      artist: document.querySelector('.row:nth-child(1) .marquee_marquee__1MS_n').textContent,
      album: document.querySelector('.row:nth-child(3) .marquee_marquee__1MS_n').textContent,
      artwork: [{
        src: document.querySelector('.player_background__2a6F5 img').src,
        sizes: '500x500',
        type: 'image/jpeg'
      }]
    });
  };

  const onMutation = mutations => {
    mutations.forEach(mutation => {
			if(!mutation.target) return;
			if (mutation.target.tagName === 'IMG')
				return updateInfo();
      switch(mutation.target.className) {
				case "marquee_marquee__1MS_n":
          updateInfo();
          break;
      }
    });
  };

  const observer = new MutationObserver(onMutation);
  observer.observe(document.querySelector('.player_content__2HaZS:not(.my-2)'), { subtree: true, attributes: true });
  observer.observe(document.querySelector('.player_background__2a6F5 img'), { attributes: true });
	updateInfo();
});