// Message display function
function showMessage(messageId, substitutions = null, isError = false) {
  const messageEl = document.getElementById("message");
  const text = substitutions
    ? chrome.i18n.getMessage(messageId, substitutions)
    : chrome.i18n.getMessage(messageId);
  messageEl.textContent = text;
  messageEl.classList.toggle("error", isError);
  messageEl.classList.add("show");
  setTimeout(() => {
    messageEl.classList.remove("show");
  }, 3000);
}

// Initialize i18n text
function initializeI18n() {
  // 普通文本
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const messageId = element.getAttribute("data-i18n");
    const message = chrome.i18n.getMessage(messageId);
    if (message) {
      element.textContent = message;
    }
  });

  // 占位符文本
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const messageId = element.getAttribute("data-i18n-placeholder");
    const message = chrome.i18n.getMessage(messageId);
    if (message) {
      element.placeholder = message;
    }
  });

  // 标题提示
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    const messageId = element.getAttribute("data-i18n-title");
    const message = chrome.i18n.getMessage(messageId);
    if (message) {
      element.title = message;
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeI18n();
  getCurrentTabUrlWithoutParams((url) => {
    document.getElementById("whitelistUrl").value = url;
  });
  loadIdleLimit();
});

// 加载闲置时间限制
function loadIdleLimit() {
  chrome.storage.local.get(["idleLimit"], (result) => {
    const idleLimitInput = document.getElementById("idleLimit");
    if (result.idleLimit) {
      idleLimitInput.value = Math.floor(result.idleLimit / 1000);
    } else {
      // 默认30分钟
      idleLimitInput.value = 1800;
    }
  });
}

// discard button
document.getElementById("discardCurrent").addEventListener("click", () => {
  discardTabs("current");
  showMessage("tabDiscarded");
});

document.getElementById("discardHalfHour").addEventListener("click", () => {
  discardTabs("halfHour");
  showMessage("idleTabsDiscarded");
});

document.getElementById("discardOthers").addEventListener("click", () => {
  discardTabs("others");
  showMessage("otherTabsDiscarded");
});

document.getElementById("discardGroup").addEventListener("click", () => {
  discardTabs("group");
  showMessage("tabGroupDiscarded");
});

function discardTabs(option) {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const now = Date.now();
    const activeTabId = tabs.find((tab) => tab.active)?.id;

    tabs.forEach((tab) => {
      let shouldDiscard = false;

      switch (option) {
        case "current":
          shouldDiscard = tab.id === activeTabId;
          break;
        case "halfHour":
          if (tab.id in idleTime) {
            shouldDiscard = now - idleTime[tab.id] > 30 * 60 * 1000; // 30分钟
          }
          break;
        case "others":
          shouldDiscard = tab.id !== activeTabId;
          break;
        case "group":
          const activeGroupId = tabs.find((t) => t.id === activeTabId)?.groupId;
          shouldDiscard = tab.groupId === activeGroupId;
          break;
      }

      if (shouldDiscard) {
        chrome.tabs.discard(tab.id);
      }
    });
  });
}

//=============ignore tabs============

document.getElementById("ignoreTab24Hour").addEventListener("click", () => {
  ignoreTab(24 * 60);
});

document.getElementById("ignoreTab1Week").addEventListener("click", () => {
  ignoreTab(7 * 24 * 60);
});

document.getElementById("resetProtect").addEventListener("click", () => {
  ignoreTab(0);
});

// 获取当前标签页的 URL，并转换为通配符格式
function getCurrentTabUrlWithoutParams(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      const url = new URL(tabs[0].url);
      // 构建通配符格式：domain/*
      const wildcardUrl = `${url.hostname}/*`;
      callback(wildcardUrl);
    }
  });
}

document.getElementById("ignoreTab").addEventListener("click", () => {
  const url = document.getElementById("whitelistUrl").value.trim();
  if (url) {
    chrome.storage.local.get(["whitelist"], (result) => {
      const whitelist = result.whitelist || [];
      if (!whitelist.includes(url)) {
        whitelist.push(url);
        chrome.storage.local.set({ whitelist: whitelist }, () => {
          showMessage("addedToProtectionList", [url]);
        });
      } else {
        showMessage("alreadyProtected", [url], true);
      }
    });
  }
});

document.getElementById("resetIgnoreTab").addEventListener("click", () => {
  const url = document.getElementById("whitelistUrl").value.trim();
  if (url) {
    chrome.storage.local.get(["whitelist"], (result) => {
      const whitelist = result.whitelist || [];
      if (whitelist.includes(url)) {
        whitelist.splice(whitelist.indexOf(url), 1);
        chrome.storage.local.set({ whitelist: whitelist }, () => {
          showMessage("removedFromProtectionList", [url]);
        });
      } else {
        showMessage("notInProtectionList", [url], true);
      }
    });
  }
});

function ignoreTab(minutes) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      const now = Date.now();
      const expirationTime = now + minutes * 60 * 1000;

      chrome.runtime.sendMessage(
        { type: "resetIdleTime", tabId: tabId, time: expirationTime },
        () => {
          if (minutes > 0) {
            showMessage("tabProtectedFor", [minutes / 60]);
          }
        }
      );
    }
  });
}

// 保存闲置时间限制
document.getElementById("save").addEventListener("click", () => {
  const idleLimit = document.getElementById("idleLimit").value;
  const idleLimitInMs = idleLimit * 1000;
  chrome.storage.local.set({ idleLimit: idleLimitInMs }, () => {
    showMessage("idleLimitSaved", [idleLimit]);
  });
});
