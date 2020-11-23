const root = (chrome || browser);

root.browserAction.onClicked.addListener(() => {
  root.tabs.create({
    url: root.extension.getURL('options/index.html')
  });
});