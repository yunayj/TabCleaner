// Message display function
function showMessage(text, isError = false) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.classList.toggle("error", isError);
  messageEl.classList.add("show");
  setTimeout(() => {
    messageEl.classList.remove("show");
  }, 3000);
}

// discard button
document.getElementById("discardCurrent").addEventListener("click", () => {
  discardTabs("current");
  showMessage("Current tab has been discarded");
});

document.getElementById("discardHalfHour").addEventListener("click", () => {
  discardTabs("halfHour");
  showMessage("Idle tabs have been discarded");
});

document.getElementById("discardOthers").addEventListener("click", () => {
  discardTabs("others");
  showMessage("Other tabs have been discarded");
});

document.getElementById("discardGroup").addEventListener("click", () => {
  discardTabs("group");
  showMessage("Tab group has been discarded");
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

// 当弹出窗口加载时，设置输入框的默认值
document.addEventListener("DOMContentLoaded", () => {
  getCurrentTabUrlWithoutParams((url) => {
    document.getElementById("whitelistUrl").value = url; // 设置输入框默认值
  });
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
          showMessage(`Added ${url} to protection list`);
        });
      } else {
        showMessage(`${url} is already protected`, true);
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
          showMessage(`Removed ${url} from protection list`);
        });
      } else {
        showMessage(`${url} is not in protection list`, true);
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
          showMessage(
            `This tab will not be discarded for ${minutes / 60} hours`
          );
        }
      );
    }
  });
}

//设置最大闲置时间
document.getElementById("save").addEventListener("click", () => {
  const idleLimit = document.getElementById("idleLimit").value;
  const idleLimitInMs = idleLimit * 1000; // 转换为毫秒
  chrome.storage.local.set({ idleLimit: idleLimitInMs }, () => {
    showMessage(`Idle time limit saved: ${idleLimit} seconds`);
  });
});

// 在弹出窗口打开时加载当前设置
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["idleLimit"], (result) => {
    if (result.idleLimit) {
      document.getElementById("idleLimit").value = result.idleLimit / 1000; // 转换为秒
    } else {
      //默认的时间
      document.getElementById("idleLimit").value = 10;
    }
  });
});
