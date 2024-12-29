let idleTime = {};
const IDLE_LIMIT = 1 * 60 * 1000; // default idle time: 1 minutes

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    resetIdleTime(tabId);
  }
});

// 监听标签页激活事件
// chrome.tabs.onActivated.addListener((activeInfo) => {
//   resetIdleTime(activeInfo.tabId);
//   activeTabId = activeInfo.tabId;
//   console.log("active tab ", activeInfo.url);
// });

// 监听新标签页的创建事件
chrome.tabs.onCreated.addListener((tab) => {
  resetIdleTime(tab.id);
});

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "resetIdleTime") {
    resetIdleTime(message.tabId, message.time);
    sendResponse();
  }
});

// 重置闲置时间
function resetIdleTime(tabId, time) {
  if (time) {
    idleTime[tabId] = time;
  } else {
    idleTime[tabId] = Date.now();
  }
}

// 检查闲置时间
setInterval(async () => {
  console.log("# start check idle time=================================");

  //如果加载插件前,其他标签页已经打开,则初始化idleTime
  if (isEmptyObject(idleTime)) {
    const tabs = await queryTabs({});
    for (const tab of tabs) {
      idleTime[tab.id] = Date.now();
    }
    console.log("init idleTime");
    return;
  }

  //准备数据
  let idleLimit = (await getFromLocalStorage("idleLimit")) || IDLE_LIMIT;
  const whitelist = (await getFromLocalStorage("whitelist")) || [];
  const activeTabs = await queryTabs({ active: true });
  console.log("==get all avtive tab");
  const activeTabIds = activeTabs.map((tab) => {
    console.log("active tab ", tab.url);
    return tab.id;
  });

  console.log("==whitelist", whitelist);
  const now = Date.now();

  for (const tabId in idleTime) {
    try {
      const tab = await chrome.tabs.get(parseInt(tabId));
      if (!tab) {
        continue;
      }

      const tabUrl = tab?.url;
      console.log("check ", tabId, tabUrl);

      if (tab.discarded) {
        console.log("discarded, skip");
        continue;
      }
      // 如果当前标签是激活的，跳过
      if (activeTabIds.includes(parseInt(tabId))) {
        console.log("active tab, skip");
        continue;
      }

      // 如果当前标签在白名单中，跳过
      if (isWhitelisted(tabUrl, whitelist)) {
        console.log("whitelisted, skip");
        continue;
      }

      //discard
      if (now - idleTime[tabId] > idleLimit) {
        // 在丢弃之前修改标题
        try {
          // 检查URL是否可以访问
          const tab = await chrome.tabs.get(parseInt(tabId));
          if (
            !tab.url.startsWith("chrome:") &&
            !tab.url.startsWith("chrome-extension:")
          ) {
            await chrome.scripting.executeScript({
              target: { tabId: parseInt(tabId) },
              func: () => {
                document.title = "💤 " + document.title;
              },
            });
          }
        } catch (e) {
          console.log("Skip updating title for restricted page:", e);
        }

        chrome.tabs.discard(parseInt(tabId));
        console.log("discard tab");
        delete idleTime[tabId]; // 移除已丢弃的标签页的闲置记录
      } else {
        console.log("存活时间为", now - idleTime[tabId], "低于", idleLimit);
      }
    } catch (e) {
      console.log(e);
    }
  }
}, 10000); // 每分钟检查一次

function isWhitelisted(url, whitelist) {
  return whitelist.some((pattern) => {
    const regex = new RegExp("^" + pattern + ".*$");
    return regex.test(url);
  });
}

function getFromLocalStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
}

function queryTabs(options) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(options, (tabs) => {
      resolve(tabs);
    });
  });
}

function isEmptyObject(obj) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}
