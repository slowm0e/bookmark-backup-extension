// Run backup and clean old ones
function doBackup() {
  chrome.bookmarks.getTree(function(tree) {
    const json = JSON.stringify(tree, null, 2);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    const url = "data:application/json;base64," + base64;
    const date = new Date().toISOString().slice(0, 10);

    chrome.downloads.download({
      url: url,
      filename: "Bookmark Backups/Bookmarks_" + date + ".json",
      saveAs: false
    }, function() {
      setTimeout(cleanOldBackups, 2000);
    });
  });
}

// Delete oldest backups, keep only N most recent
function cleanOldBackups() {
  chrome.storage.sync.get({ keepCount: 5 }, function(settings) {
    chrome.downloads.search({
      filenameRegex: "Bookmark Backups.Bookmarks_",
      orderBy: ["-startTime"]
    }, function(items) {
      // Only count completed files
      const completed = items.filter(function(i) { return i.state === "complete"; });
      const toDelete = completed.slice(settings.keepCount);
      toDelete.forEach(function(item) {
        chrome.downloads.removeFile(item.id, function() {
          chrome.downloads.erase({ id: item.id });
        });
      });
    });
  });
}

// Debounce timer
let debounceTimer = null;

function onBookmarkChange() {
  chrome.storage.sync.get({ autoBackup: true }, function(settings) {
    if (!settings.autoBackup) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doBackup, 5000);
  });
}

chrome.bookmarks.onCreated.addListener(onBookmarkChange);
chrome.bookmarks.onRemoved.addListener(onBookmarkChange);
chrome.bookmarks.onChanged.addListener(onBookmarkChange);
chrome.bookmarks.onMoved.addListener(onBookmarkChange);

chrome.runtime.onMessage.addListener(function(message) {
  if (message.action === "backupNow") doBackup();
});
