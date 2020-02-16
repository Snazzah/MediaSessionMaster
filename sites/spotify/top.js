(() => {
  const Util = window.MMUtil = {
    getReactInstance(element) {
      const reactKey = Object.keys(element).find(key => key.startsWith('__reactInternalInstance'));
      return reactKey ? element[reactKey] : null;
    },
    get player() {
      return document.querySelector('.now-playing-bar');
    },
    get track() {
      return Util.getReactInstance(Util.player).memoizedProps.children[1].props.children.props;
    },
    isTrackAd() {
      return Util.getReactInstance(Util.player).memoizedProps.children[2].props.children.props.children.props.isAd;
    },
    updatePosition() {
      if ('setPositionState' in navigator.mediaSession) {
        const playback = Util.track.playbackState;
        navigator.mediaSession.setPositionState({
          duration: playback.duration / 1000,
          playbackRate: 1,
          position: playback.position / 1000
        });
      }
    },
    onTrackChange() {
      if(Util.isTrackAd()) {
        navigator.mediaSession.setActionHandler('seekbackward', null);
        navigator.mediaSession.setActionHandler('seekforward', null);
        navigator.mediaSession.setActionHandler('seekto', null);
      } else {
        navigator.mediaSession.setActionHandler('seekbackward', function(event) {
          const playback = Util.track.playbackState;
          const skipTime = event.seekOffset || Util.data.skipTime;
          Util.track.seek(Math.max((playback.position / 1000) - skipTime, 0) * 1000);
          Util.updatePosition();
        });
  
        navigator.mediaSession.setActionHandler('seekforward', function(event) {
          const playback = Util.track.playbackState;
          const skipTime = event.seekOffset || Util.data.skipTime;
          Util.track.seek(Math.min((playback.position / 1000) + skipTime, (playback.duration / 1000)) * 1000);
          Util.updatePosition();
        });
  
        navigator.mediaSession.setActionHandler('seekto', function(event) {
          Util.track.seek(event.seekTime * 1000);
          Util.updatePosition();
        });
      }
    }
  };
  
  // Get data and remove script
  const self = document.querySelector('#mm-script');
  Util.data = JSON.parse(self.getAttribute('data'));
  self.remove();
  
  navigator.mediaSession.metadata = new MediaMetadata();
  
  const observer = new MutationObserver(Util.onTrackChange);
  observer.observe(document.querySelector('.now-playing-bar__left'), { childList: true, subtree: true });
  
  const seekObserver = new MutationObserver(Util.updatePosition);
  seekObserver.observe(document.querySelector('.now-playing-bar__center'), { childList: true, subtree: true });
})();