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

function cleanOldBackups() {
  chrome.storage.sync.get({ keepCount: 5 }, function(settings) {
    chrome.downloads.search({
      filenameRegex: "Bookmark Backups.Bookmarks_",
      orderBy: ["-startTime"]
    }, function(items) {
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

function restoreIntoFolder(rootId, children) {
  children.forEach(function(node) {
    if (node.url) {
      chrome.bookmarks.create({ parentId: rootId, title: node.title, url: node.url });
    } else if (node.children) {
      chrome.bookmarks.create({ parentId: rootId, title: node.title }, function(newFolder) {
        restoreIntoFolder(newFolder.id, node.children);
      });
    }
  });
}

function doRestore(tree) {
  const backupRoots = tree[0].children;
  chrome.bookmarks.getTree(function(current) {
    const currentRoots = current[0].children;
    backupRoots.forEach(function(backupFolder) {
      const match = currentRoots.find(function(f) { return f.title === backupFolder.title; });
      if (match && backupFolder.children) {
        restoreIntoFolder(match.id, backupFolder.children);
      }
    });
  });
}

function restoreReplace(tree) {
  chrome.bookmarks.getTree(function(current) {
    const rootFolders = current[0].children;
    let cleared = 0;
    rootFolders.forEach(function(folder) {
      chrome.bookmarks.getChildren(folder.id, function(children) {
        let removed = 0;
        if (children.length === 0) {
          cleared++;
          if (cleared === rootFolders.length) doRestore(tree);
          return;
        }
        children.forEach(function(child) {
          chrome.bookmarks.removeTree(child.id, function() {
            removed++;
            if (removed === children.length) {
              cleared++;
              if (cleared === rootFolders.length) doRestore(tree);
            }
          });
        });
      });
    });
  });
}

function restoreMerge(tree) {
  const backupRoots = tree[0].children;
  chrome.bookmarks.getTree(function(current) {
    const currentRoots = current[0].children;
    backupRoots.forEach(function(backupFolder) {
      const match = currentRoots.find(function(f) { return f.title === backupFolder.title; });
      if (match && backupFolder.children) {
        restoreIntoFolder(match.id, backupFolder.children);
      }
    });
  });
}

let debounceTimer = null;

function onBookmarkChange() {
  chrome.storage.sync.get({ autoBackup: true }, function(settings) {
    if (!settings.autoBackup) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doBackup, 30000);
  });
}

chrome.bookmarks.onCreated.addListener(onBookmarkChange);
chrome.bookmarks.onRemoved.addListener(onBookmarkChange);
chrome.bookmarks.onChanged.addListener(onBookmarkChange);
chrome.bookmarks.onMoved.addListener(onBookmarkChange);

chrome.runtime.onMessage.addListener(function(message) {
  if (message.action === "backupNow") doBackup();
  if (message.action === "restoreReplace") restoreReplace(message.tree);
  if (message.action === "restoreMerge") restoreMerge(message.tree);
});
