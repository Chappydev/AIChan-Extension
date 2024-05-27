function googlePageSetup() {
  const picture = document.querySelector("picture");
  const wrapper = document.createElement("div");
  const root = document.createElement("div");
  if (picture) {
    // put the picture in a wrapper
    wrapper.classList.add("aichan-wrapper");
    root.id = "aichan-root";
    picture.insertAdjacentElement("beforebegin", wrapper);
    wrapper.appendChild(picture);
    wrapper.appendChild(root);
  }
}

async function setTabs(tabs) {
  console.log("chrome: ", chrome);
  console.log("storage: ", chrome.storage);
  const previousTabs = await chrome.storage.local.get(["tabs"]);

  if (!Array.isArray(tabs) || !Array.isArray(previousTabs)) {
    throw new Error("'tabs' should be of type array");
  }

  const sameNumberOfTabs = tabs.length === previousTabs.length;
  const allTabsAreEqual = () => {
    return tabs.every((tab) => previousTabs.some((prev) => prev.id === tab.id));
  };
  const tabsHaveChanged = !sameNumberOfTabs || !allTabsAreEqual();
  if (tabsHaveChanged) {
    await chrome.storage.local.set({ tabs }).then(() => {
      console.log("Updated tabs!");
    });
    return true;
  }

  return false;
}

async function getTabs() {
  const tabs = await chrome.tabs.query({ url: "https://www.google.com/*" });
  if (!Array.isArray(tabs)) {
    return {
      changed: true,
      tabs: [],
    };
  }
  const changed = setTabs(tabs);

  return {
    changed,
    tabs,
  };
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log("Getting tabs...");
  const { changed, tabs: googleTabs } = await getTabs();
  console.log("Tabs changed: ", changed);
  console.log("Tabs: ", googleTabs);
  if (!googleTabs || !changed) {
    return;
  }
  for (const tab of googleTabs) {
    console.log("Executing on tab: ", tab);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: googlePageSetup,
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);
});
