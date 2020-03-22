const Util = window.Util = {
  get defaultOptions() {
    return {
      enable: true,
      enableExpr: false,
      showNSFWSites: false,
      skipTime: 10,
      sites: {
        soundcloud: { enable: true },
        bandcamp: { enable: true },
        twitch: { enable: true },
        clippit: { enable: true },
        vine: { enable: true },
        picarto: { enable: true },
        spotify: { enable: true },
        amazonmusic: { enable: true },
      },
      darkTheme: document.querySelector('title').computedStyleMap().get('line-height').value === 1,
    };
  },
  getData() {
    return new Promise(resolve => chrome.storage.sync.get(Util.defaultOptions, resolve));
  },
  setData(data) {
    return new Promise(resolve => chrome.storage.sync.set(data, resolve));
  },
  async ensureSite(site, callback) {
    const data = await Util.getData();
    if(data.sites[site].enable && 'mediaSession' in navigator) callback(data);
  },
  async injectScript(file) {
    const script = document.createElement('script');
    script.id = "mm-script";
    script.setAttribute('data', JSON.stringify(await Util.getData()));
    script.src = chrome.extension.getURL(file);
    document.querySelector('html').appendChild(script);
  }
};