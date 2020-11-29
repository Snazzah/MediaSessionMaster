Util.ensureSite('upbeatradio', () => {
  navigator.mediaSession.metadata = new MediaMetadata();

  const stationIDMap = {
    classic: 'Classic',
    future: 'Future',
    ultraremixes: 'Ultra Remixes',
    ggs: 'GG\'s',
    noisetanks: 'Noise Tanks',
    poisonjam: 'Poison Jam',
    rapid99: 'Rapid 99',
    loveshockers: 'Love Shockers',
    immortals: 'The Immortals',
    doomriders: 'Doom Riders',
    goldenrhinos: 'Golden Rhinos',
    ganjah: 'Ganjah',
    lofi: 'Lo-Fi',
    silvagunner: 'SilvaGunner x JSR',
    futuregeneration: 'Future Generation',
    jetmashradio: 'Jet Mash Radio',
    djchidow: 'DJ Chidow',
    hover: 'Hover',
    butterflies: 'Butterflies',
    toejamandearl: 'Toe Jam & Earl',
    ollieking: 'Ollie King',
    crazytaxi: 'Crazy Taxi',
    revolution: 'Revolution',
    endofdays: 'End of Days'
  };

  const updateInfo = () => {
    const songName = document.querySelector("#programInformationText");
    const stationID = document.querySelector('#graffitiSoul').src.split('/')[5];
    if (!songName || songName.textContent.length < 1 || document.querySelector('#loadingTrackCircle:not([style*="hidden"])')) return;
    navigator.mediaSession.metadata.title = songName.textContent;
    navigator.mediaSession.metadata.artist = stationIDMap[stationID] + ' - Jet Set Radio Live';
    navigator.mediaSession.metadata.artwork = [{
      src: document.querySelector('#graffitiSoul').src,
      sizes: '700x700',
      type: 'image/png'
    }];
  };

  const onMutation = mutations => {
    mutations.forEach(mutation => {
      if(!mutation.target || !mutation.target.id) return;
      switch(mutation.target.id) {
        case "loadingTrackCircle":
        case "programInformationText":
          updateInfo();
          break;
      }
    });
  };

  const observer = new MutationObserver(onMutation);
  observer.observe(document.querySelector('#information'), { childList: true, subtree: true });
});