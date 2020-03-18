Util.ensureSite('amazonmusic', (data) => {
    navigator.mediaSession.metadata = new MediaMetadata();

    const updateInfo = () => {
        navigator.mediaSession.metadata.title = document.querySelector('.trackInfoContainer .trackTitle span').innerText;
        navigator.mediaSession.metadata.artist = document.querySelector('.trackInfoContainer .trackArtist span').innerText;
        navigator.mediaSession.metadata.album = document.querySelector('.trackInfoContainer .trackSourceLink a').innerText;
        navigator.mediaSession.metadata.artwork = [
            {
                src: document.querySelector('.trackAlbumArt .renderImage').getAttribute('data-src'),
                sizes: '256x256',
                type: 'image/jpeg'
            }
        ];
        navigator.mediaSession.setActionHandler('play', function (event) { document.querySelector('.playbackControls .playButton').click() });
        navigator.mediaSession.setActionHandler('pause', function (event) { document.querySelector('.playbackControls .playButton').click() });
        navigator.mediaSession.setActionHandler('previoustrack', function (event) { document.querySelector('#transportPlayPrevious').click() });
        navigator.mediaSession.setActionHandler('nexttrack', function (event) { document.querySelector('#transportPlayNext').click() });
    }

    const onMutation = mutations => {
        mutations.forEach(mutation => {
            if (!mutation.target || !mutation.target.className) return;
            switch (mutation.target.className) {
                case "albumArtWrapper":
                case "trackAlbumArt":
                    updateInfo();
                    break;
                case "listViewDuration":
                    break;
            }
        });
    }

    const observer = new MutationObserver(onMutation);
    observer.observe(document.querySelector('body'), { childList: true, subtree: true });
});