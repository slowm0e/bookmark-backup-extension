const toggle = document.getElementById("autoToggle");
const keepCount = document.getElementById("keepCount");
const status = document.getElementById("status");
const modal = document.getElementById("modal");
const fileInput = document.getElementById("fileInput");

let pendingTree = null;

chrome.storage.sync.get({ autoBackup: true, keepCount: 5 }, function(settings) {
  toggle.checked = settings.autoBackup;
  keepCount.value = settings.keepCount;
});

toggle.addEventListener("change", function() {
  chrome.storage.sync.set({ autoBackup: toggle.checked });
  status.textContent = toggle.checked ? "✓ Auto-backup enabled" : "Auto-backup disabled";
});

keepCount.addEventListener("change", function() {
  const val = Math.max(1, Math.min(50, parseInt(keepCount.value) || 5));
  keepCount.value = val;
  chrome.storage.sync.set({ keepCount: val });
  status.textContent = "✓ Saved";
});

document.getElementById("backupBtn").addEventListener("click", function() {
  chrome.runtime.sendMessage({ action: "backupNow" });
  status.textContent = "✓ Backup saved to Downloads!";
});

document.getElementById("restoreBtn").addEventListener("click", function() {
  fileInput.click();
});

fileInput.addEventListener("change", function() {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      pendingTree = JSON.parse(e.target.result);
      modal.classList.add("show");
    } catch {
      status.textContent = "⚠ Invalid backup file";
    }
  };
  reader.readAsText(file);
  fileInput.value = "";
});

document.getElementById("replaceBtn").addEventListener("click", function() {
  modal.classList.remove("show");
  chrome.runtime.sendMessage({ action: "restoreReplace", tree: pendingTree });
  status.textContent = "✓ Bookmarks restored!";
  pendingTree = null;
});

document.getElementById("mergeBtn").addEventListener("click", function() {
  modal.classList.remove("show");
  chrome.runtime.sendMessage({ action: "restoreMerge", tree: pendingTree });
  status.textContent = "✓ Bookmarks merged!";
  pendingTree = null;
});

document.getElementById("cancelBtn").addEventListener("click", function() {
  modal.classList.remove("show");
  pendingTree = null;
});
