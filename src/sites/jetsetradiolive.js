Util.ensureSite('jetsetradiolive', () => {
  navigator.mediaSession.metadata = new MediaMetadata();

  const siteName = location.host === 'jetsetradiofuture.live' ? 'Jet Set Radio Future Live' : 'Jet Set Radio Live';
  const stationIDMap = {
    olliolliworld: "OlliOlli World",
    spacechannel5: "Space Channel 5",
    live: "Jet Set Radio Live",
    outerspace: "Outer Space",
    classic: "Classic",
    future: "Future",
    ultraremixes: "Ultra Remixes",
    garage: "The Garage",
    ggs: "GG's",
    noisetanks: "Noise Tanks",
    poisonjam: "Poison Jam",
    rapid99: "Rapid 99",
    loveshockers: "Love Shockers",
    immortals: "The Immortals",
    doomriders: "Doom Riders",
    goldenrhinos: "Golden Rhinos",
    ganjah: "Ganjah",
    lofi: "Lo-Fi",
    chiptunes: "Chiptunes",
    retroremix: "Retro Remix",
    classical: "Classical Remix",
    revolution: "Revolution",
    endofdays: "End of Days",
    silvagunner: "SilvaGunner x JSR",
    futuregeneration: "Future Generation",
    jetmashradio: "Jet Mash Radio",
    memoriesoftokyoto: "Memories of Tokyo-to",
    tokyotofuture: "Sounds of Tokyo-to Future",
    crazytaxi: "Crazy Taxi",
    ollieking: "Ollie King",
    toejamandearl: "Toe Jam & Earl",
    hover: "Hover",
    butterflies: "Butterflies",
    lethalleagueblaze: "Lethal League Blace",
    bonafidebloom: "BonafideBloom",
    djchidow: "DJ Chidow",
    verafx: "VeraFX",
    summer: "Summer",
    halloween: "Halloween",
    christmas: "Christmas",
    snowfi: "Snow-Fi"
  };

  const updateInfo = () => {
    const songName = document.querySelector("#programInformationText");
    const stationID = document.querySelector('#graffitiSoul').src.split('/')[5];
    if (!songName || songName.textContent.length < 1 || document.querySelector('#loadingTrackCircle:not([style*="hidden"])')) return;
    navigator.mediaSession.metadata.title = songName.textContent;
    navigator.mediaSession.metadata.artist = stationIDMap[stationID] ?  `${stationIDMap[stationID]} - ${siteName}` : siteName;
    navigator.mediaSession.metadata.artwork = [{
      src: document.querySelector('#graffitiSoul').src,
      sizes: '700x700',
      type: 'image/png'
    }];
  };

  navigator.mediaSession.setActionHandler('nexttrack', () => {
    document.querySelector('#nextTrackButton').dispatchEvent(new MouseEvent('mousedown'));
  });

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
