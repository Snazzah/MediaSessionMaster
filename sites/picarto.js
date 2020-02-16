Util.ensureSite('picarto', () => {
  if(!document.querySelector('#userbar-name')) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    artist: 'Picarto',
    title: document.querySelector('#userbar-name .text-white').innerText,
    artwork: [
      {
        src: document.querySelector('#userbar-avatar img').src,
        sizes: '100x100',
        type: 'image/jpeg'
      },
    ]
  });
});