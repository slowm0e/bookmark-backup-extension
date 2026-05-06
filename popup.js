const toggle = document.getElementById("autoToggle");
const keepCount = document.getElementById("keepCount");
const status = document.getElementById("status");

// Load saved settings
chrome.storage.sync.get({ autoBackup: true, keepCount: 5 }, function(settings) {
  toggle.checked = settings.autoBackup;
  keepCount.value = settings.keepCount;
});

// Save on toggle
toggle.addEventListener("change", function() {
  chrome.storage.sync.set({ autoBackup: toggle.checked });
  status.textContent = toggle.checked ? "✓ Auto-backup enabled" : "Auto-backup disabled";
});

// Save keep count on change
keepCount.addEventListener("change", function() {
  const val = Math.max(1, Math.min(50, parseInt(keepCount.value) || 5));
  keepCount.value = val;
  chrome.storage.sync.set({ keepCount: val });
  status.textContent = "✓ Saved";
});

// Manual backup
document.getElementById("backupBtn").addEventListener("click", function() {
  chrome.runtime.sendMessage({ action: "backupNow" });
  status.textContent = "✓ Backup saved to Downloads!";
});
