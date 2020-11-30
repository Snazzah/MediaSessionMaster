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
        newgrounds: { enable: true },
        listenmoe: { enable: true },
        upbeatradio: { enable: true },
        jetsetradiolive: { enable: true },
        storyfire: { enable: true },
        sittingonclouds: { enable: true },
      },
      darkTheme: window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false,
    };
  },
  get root() {
    return chrome || browser
  },
  getData() {
    if (chrome)
      return new Promise(resolve => chrome.storage.sync.get(Util.defaultOptions, resolve));
    return Promise.resolve(browser.storage.sync.get(Util.defaultOptions));
  },
  setData(data) {
    if (chrome)
      return new Promise(resolve => Util.root.storage.sync.set(data, resolve));
    return Promise.resolve(browser.storage.sync.set(data));
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