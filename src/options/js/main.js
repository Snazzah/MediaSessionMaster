const MainUtil = window.MainUtil = {
  makeNode(html){
    return document.createRange().createContextualFragment(html).childNodes[0];
  },
  createFlagCell(flagStatus){
    const cell = document.createElement('td');
    cell.className = `flag-${flagStatus}`;
    cell.innerText = flagStatus;
    return cell;
  },
};

const SiteData = [{
  title: 'SoundCloud',
  url: 'https://soundcloud.com',
  flags: {
    metadata: 'supported',
    actions: 'native',
    seeking: 'unsupported',
  },
  hasExperiments: false,
  nsfw: false,
  key: 'soundcloud',
}, {
  title: 'Bandcamp',
  url: 'https://bandcamp.com',
  flags: {
    metadata: 'supported',
    actions: 'supported',
    seeking: 'supported',
  },
  hasExperiments: false,
  nsfw: false,
  key: 'bandcamp',
}, {
  title: 'Twitch',
  url: 'https://twitch.tv',
  flags: {
    metadata: 'supported',
    actions: 'native',
    seeking: 'unsupported',
  },
  hasExperiments: false,
  nsfw: false,
  key: 'twitch',
}, {
  title: 'Clippit',
  url: 'https://clippit.tv',
  flags: {
    metadata: 'supported',
    actions: 'native',
    seeking: 'supported',
  },
  hasExperiments: false,
  nsfw: false,
  key: 'clippit',
}, {
  title: 'Vine',
  url: 'https://vine.co',
  flags: {
    metadata: 'supported',
    actions: 'native',
    seeking: 'supported',
  },
  hasExperiments: false,
  nsfw: false,
  key: 'vine',
}, {
  title: 'Picarto',
  url: 'https://picarto.tv',
  flags: {
    metadata: 'supported',
    actions: 'native',
    seeking: 'unsupported',
  },
  hasExperiments: false,
  nsfw: false,
  key: 'picarto',
}, {
  title: 'Amazon Music',
  url: 'https://music.amazon.com',
  flags: {
    metadata: 'supported',
    actions: 'supported',
    seeking: 'unsupported',
  },
  hasExperiments: false,
  nsfw: false,
  key: 'amazonmusic',
}, {
  title: 'Spotify',
  url: 'https://spotify.com',
  flags: {
    metadata: 'native',
    actions: 'native',
    seeking: 'supported',
  },
  hasExperiments: true,
  nsfw: false,
  key: 'spotify',
}, {
  title: 'Newgrounds',
  url: 'https://www.newgrounds.com',
  flags: {
    metadata: 'supported',
    actions: 'supported',
    seeking: 'supported',
  },
  hasExperiments: false,
  nsfw: false,
  key: 'newgrounds',
}, {
  title: 'LISTEN.moe',
  url: 'https://listen.moe',
  flags: {
    metadata: 'supported',
    actions: 'native',
    seeking: 'unsupported',
  },
  hasExperiments: false,
  nsfw: false,
  key: 'listenmoe',
}, {
  title: 'UpBeatRadio',
  url: 'https://upbeatradio.net',
  flags: {
    metadata: 'supported',
    actions: 'native',
    seeking: 'unsupported',
  },
  hasExperiments: false,
  nsfw: false,
  key: 'upbeatradio',
}, {
  title: 'Jet Set Radio Live',
  url: 'https://jetsetradio.live',
  flags: {
    metadata: 'supported',
    actions: 'native',
    seeking: 'unsupported',
  },
  hasExperiments: false,
  nsfw: false,
  key: 'jetsetradiolive',
}];

window.addEventListener('load', async () => {
  document.querySelector('.version').innerText = `v${Util.root.runtime.getManifest().version}`;
  const data = await Util.getData();

  // Dark Theme
  if(data.darkTheme)
    document.body.classList.add('dark-theme');
  
  document.querySelector('#dark-theme').addEventListener('click', e => {
    document.querySelector('.chrome-bootstrap').classList[e.target.checked ? 'add' : 'remove']('dark-theme');
  });

  // Sites
  let sites = SiteData;
  if(!data.showNSFWSites)
    sites = sites.filter(site => !site.nsfw);
  sites.forEach(site => {
    const row = document.createElement('tr');
    row.id = site.key;
    document.querySelector('#site-list tbody').append(row);

    const enableBoxCell = document.createElement('td');
    row.append(enableBoxCell);
    const enableBoxWrapper = document.createElement('div');
    enableBoxWrapper.className = "checkbox";
    enableBoxCell.append(enableBoxWrapper);
    const enableBox = MainUtil.makeNode(`<input auto-option="bool:sites.${site.key}.enable" id="${site.key}-enable-mm" type="checkbox">`);
    AutoOptionUtil.loadElement(enableBox);
    enableBoxWrapper.append(enableBox);
    const enableLabel = MainUtil.makeNode(`<label for="${site.key}-enable"><span></span></label>`);
    enableBoxWrapper.append(enableLabel);

    const nameCell = document.createElement('td');
    row.append(nameCell);
    const favicon = document.createElement('img');
    favicon.className = "site-favicon";
    favicon.src = `https://www.google.com/s2/favicons?domain=${site.url}`;
    nameCell.append(favicon);

    const nameTitle = document.createElement('a');
    nameTitle.className = "site-name";
    nameTitle.innerText = site.title;
    nameTitle.href = site.url;
    nameCell.append(nameTitle);

    if(site.hasExperiments) {
      const exprTag = document.createElement('span');
      exprTag.className = "expr-tag";
      nameTitle.append(exprTag);
    }

    if(site.nsfw) {
      const nsfwTag = document.createElement('span');
      nsfwTag.className = "nsfw-tag";
      nameTitle.append(nsfwTag);
    }

    row.append(MainUtil.createFlagCell(site.flags.metadata));
    row.append(MainUtil.createFlagCell(site.flags.actions));
    row.append(MainUtil.createFlagCell(site.flags.seeking));
  });
});
