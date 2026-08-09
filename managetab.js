const ICONS = {
    download: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 17l4 4 4-4"></path><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path></svg>',
    save: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
    unsave: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
    cloud_unsave: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>',
    snooze: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h6l-6 8h6"></path><path d="M14 4h6l-6 8h6"></path></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
    globe: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>'
};

var googleTabs = {
    isSavedTabsCollapsed: true,
    isOfflineSavedTabsCollapsed: true,

    toggleSavedTabs: function () {
        if (!document.getElementById('collapseIcon') || document.getElementById('collapseIcon').style.display === 'none') {
            return;
        }
        const dvSavedList = document.getElementById('dvSavedList');
        const collapseIcon = document.getElementById('collapseIcon');
        const savedGroup = document.getElementById('savedTabsGroup');

        googleTabs.isSavedTabsCollapsed = !googleTabs.isSavedTabsCollapsed;

        if (googleTabs.isSavedTabsCollapsed) {
            dvSavedList.style.display = 'none';
            savedGroup.style.borderBottom = 'none';
            savedGroup.style.paddingBottom = '0';
            savedGroup.style.marginBottom = '0';
            collapseIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
        } else {
            dvSavedList.style.display = 'flex';
            savedGroup.style.borderBottom = '1px solid var(--border-color)';
            savedGroup.style.paddingBottom = '8px';
            savedGroup.style.marginBottom = '8px';
            collapseIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
        }
    },

    toggleOfflineSavedTabs: function () {
        const dvOfflineSavedList = document.getElementById('dvOfflineSavedList');
        const collapseIconOffline = document.getElementById('collapseIconOffline');
        const offlineSavedTabsGroup = document.getElementById('offlineSavedTabsGroup');

        googleTabs.isOfflineSavedTabsCollapsed = !googleTabs.isOfflineSavedTabsCollapsed;

        if (googleTabs.isOfflineSavedTabsCollapsed) {
            dvOfflineSavedList.style.display = 'none';
            offlineSavedTabsGroup.style.borderBottom = '1px solid var(--border-color)';
            offlineSavedTabsGroup.style.paddingBottom = '8px';
            offlineSavedTabsGroup.style.marginBottom = '8px';
            if (collapseIconOffline) collapseIconOffline.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
        } else {
            dvOfflineSavedList.style.display = 'flex';
            offlineSavedTabsGroup.style.borderBottom = '1px solid var(--border-color)';
            offlineSavedTabsGroup.style.paddingBottom = '8px';
            offlineSavedTabsGroup.style.marginBottom = '8px';
            if (collapseIconOffline) collapseIconOffline.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
        }
    },

    openSettings: function () {
        document.getElementById('mainView').style.display = 'none';
        document.getElementById('settingsView').style.display = 'block';
    },

    closeSettings: function () {
        document.getElementById('mainView').style.display = 'block';
        document.getElementById('settingsView').style.display = 'none';
    },

    initTheme: function () {
        chrome.storage.local.get(['theme'], function (result) {
            if (result.theme) {
                document.documentElement.setAttribute('data-theme', result.theme);
                googleTabs.updateThemeIcon(result.theme);
            } else {
                googleTabs.updateThemeIcon();
            }
        });

        // Automatically toggle if the OS theme changes while the popup is open, 
        // or sync to the OS preference if the system changes it.
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            chrome.storage.local.set({ theme: newTheme }); // Sync their stored preference with the OS
            googleTabs.updateThemeIcon(newTheme);
        });
    },

    updateThemeIcon: function (theme) {
        if (!theme) {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        if (theme === 'dark') {
            document.getElementById('iconMoon').style.display = 'none';
            document.getElementById('iconSun').style.display = 'block';
        } else {
            document.getElementById('iconMoon').style.display = 'block';
            document.getElementById('iconSun').style.display = 'none';
        }
    },

    toggleTheme: function () {
        let currentTheme = document.documentElement.getAttribute('data-theme');
        if (!currentTheme) {
            currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        chrome.storage.local.set({ theme: newTheme });
        googleTabs.updateThemeIcon(newTheme);
    },
    getSavedTabs: async function () {
        const result = await chrome.storage.local.get(['savedTabs']);
        return result.savedTabs || [];
    },

    setSavedTabs: async function (tabs) {
        await chrome.storage.local.set({ savedTabs: tabs });
    },

    getOfflineSavedTabs: async function () {
        const result = await chrome.storage.local.get(['offlineSavedTabs']);
        return result.offlineSavedTabs || [];
    },

    setOfflineSavedTabs: async function (tabs) {
        await chrome.storage.local.set({ offlineSavedTabs: tabs });
    },

    saveAllTabs: async function () {
        const tabs = await chrome.tabs.query({ currentWindow: true });
        let savedTabs = await googleTabs.getSavedTabs();

        const savedUrls = new Set(savedTabs.map(t => t.url));
        const allSaved = tabs.every(tab => savedUrls.has(tab.url));

        if (allSaved) {
            const openTabUrls = new Set(tabs.map(t => t.url));
            savedTabs = savedTabs.filter(savedTab => !openTabUrls.has(savedTab.url));
        } else {
            tabs.forEach(tab => {
                if (!savedUrls.has(tab.url)) {
                    savedTabs.push({ url: tab.url, title: tab.title, favIconUrl: tab.favIconUrl });
                    savedUrls.add(tab.url);
                }
            });
        }

        await googleTabs.setSavedTabs(savedTabs);
        googleTabs.renderSavedTabs();
    },

    restoreAllTabs: async function () {
        const savedTabs = await googleTabs.getSavedTabs();
        const openTabs = await chrome.tabs.query({});
        const openTabUrls = new Set(openTabs.map(t => t.url));
        
        savedTabs.forEach(tab => {
            if (!openTabUrls.has(tab.url)) {
                chrome.tabs.create({ url: tab.url });
            }
        });
    },

    clearAllSavedTabs: async function () {
        const confirmed = window.confirm("Are you sure you want to clear all bookmarked tabs? This action cannot be undone.");
        if (confirmed) {
            await googleTabs.setSavedTabs([]);
            googleTabs.renderSavedTabs();
        }
    },

    clearAllOfflineSavedTabs: async function () {
        const confirmed = window.confirm("Are you sure you want to clear all offline saved tabs? This action cannot be undone.");
        if (confirmed) {
            let offlineSavedTabs = await googleTabs.getOfflineSavedTabs();
            offlineSavedTabs.forEach(tab => {
                if (tab.downloadId) {
                    try {
                        chrome.downloads.removeFile(tab.downloadId, () => {
                            if (chrome.runtime.lastError) console.warn(chrome.runtime.lastError);
                        });
                    } catch (e) {
                        console.warn(e);
                    }
                }
            });
            await googleTabs.setOfflineSavedTabs([]);
            googleTabs.renderOfflineSavedTabs();
        }
    },

    exportTabs: async function () {
        const savedTabs = await googleTabs.getSavedTabs();
        const offlineSavedTabs = await googleTabs.getOfflineSavedTabs();
        const result = await chrome.storage.local.get(['theme', 'historyRetentionDays']);

        const exportData = {
            savedTabs: savedTabs,
            offlineSavedTabs: offlineSavedTabs,
            settings: {
                theme: result.theme,
                historyRetentionDays: result.historyRetentionDays
            }
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "managetabs-backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },

    triggerImport: function () {
        document.getElementById('fileImport').click();
    },

    importTabs: function (event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async function (e) {
            try {
                const importedData = JSON.parse(e.target.result);
                let importedSaved = [];
                let importedOffline = [];

                if (Array.isArray(importedData)) {
                    // Backwards compatibility with old backups
                    importedSaved = importedData;
                } else if (importedData && typeof importedData === 'object') {
                    if (Array.isArray(importedData.savedTabs)) {
                        importedSaved = importedData.savedTabs;
                    }
                    if (Array.isArray(importedData.offlineSavedTabs)) {
                        importedOffline = importedData.offlineSavedTabs;
                    }
                    if (importedData.settings) {
                        let newSettings = {};
                        if (importedData.settings.theme) {
                            newSettings.theme = importedData.settings.theme;
                            document.documentElement.setAttribute('data-theme', newSettings.theme);
                            googleTabs.updateThemeIcon(newSettings.theme);
                        }
                        if (importedData.settings.historyRetentionDays !== undefined) {
                            newSettings.historyRetentionDays = importedData.settings.historyRetentionDays;
                            const input = document.getElementById('historyDaysInput');
                            if (input) input.value = newSettings.historyRetentionDays;
                        }
                        if (Object.keys(newSettings).length > 0) {
                            await chrome.storage.local.set(newSettings);
                        }
                    }
                }

                if (importedSaved.length > 0) {
                    let savedTabs = await googleTabs.getSavedTabs();
                    importedSaved.forEach(imported => {
                        if (imported.url && imported.title && !savedTabs.some(t => t.url === imported.url)) {
                            savedTabs.push(imported);
                        }
                    });
                    await googleTabs.setSavedTabs(savedTabs);
                    googleTabs.renderSavedTabs();
                }

                if (importedOffline.length > 0) {
                    let offlineSavedTabs = await googleTabs.getOfflineSavedTabs();
                    importedOffline.forEach(imported => {
                        if (imported.url && imported.title && !offlineSavedTabs.some(t => t.url === imported.url)) {
                            const { downloadId, ...rest } = imported;
                            offlineSavedTabs.push(rest);
                        }
                    });
                    await googleTabs.setOfflineSavedTabs(offlineSavedTabs);
                    googleTabs.renderOfflineSavedTabs();
                }
            } catch (error) {
                console.error("Failed to parse backup file", error);
            }
            event.target.value = '';
        };
        reader.readAsText(file);
    },

    toggleSaveTab: async function (e) {
        e.stopPropagation();
        const tabItem = this.parentNode;
        const tabId = parseInt(tabItem.id);
        const tab = await chrome.tabs.get(tabId);
        let savedTabs = await googleTabs.getSavedTabs();

        if (savedTabs.find(t => t.url === tab.url)) {
            savedTabs = savedTabs.filter(t => t.url !== tab.url);
        } else {
            savedTabs.push({ url: tab.url, title: tab.title, favIconUrl: tab.favIconUrl });
        }
        await googleTabs.setSavedTabs(savedTabs);
        googleTabs.renderSavedTabs();
    },

    unsaveTab: async function (e) {
        e.stopPropagation();
        const url = this.getAttribute('data-url');
        let savedTabs = await googleTabs.getSavedTabs();
        savedTabs = savedTabs.filter(t => t.url !== url);
        await googleTabs.setSavedTabs(savedTabs);
        googleTabs.renderSavedTabs();
    },

    openSavedTab: function () {
        const url = this.getAttribute('data-url');
        chrome.tabs.create({ url: url });
    },

    openOfflineSavedTab: function () {
        const url = this.getAttribute('data-url');
        const downloadId = this.getAttribute('data-download-id');
        if (downloadId && downloadId !== 'undefined') {
            chrome.downloads.search({ id: parseInt(downloadId) }, (results) => {
                if (results && results.length > 0 && results[0].state === 'complete') {
                    let fileUrl = 'file://' + results[0].filename;
                    chrome.tabs.create({ url: fileUrl }, () => {
                        if (chrome.runtime.lastError) {
                            console.warn("Could not open local file (please enable 'Allow access to file URLs' in extension settings), falling back to web URL:", chrome.runtime.lastError);
                            chrome.tabs.create({ url: url });
                        }
                    });
                } else {
                    chrome.tabs.create({ url: url });
                }
            });
        } else {
            chrome.tabs.create({ url: url });
        }
    },

    updateActiveTabIcons: async function () {
        const savedTabs = await googleTabs.getSavedTabs();
        const offlineSavedTabs = await googleTabs.getOfflineSavedTabs();
        
        const savedUrls = new Set(savedTabs.map(t => t.url));
        const offlineSavedUrls = new Set(offlineSavedTabs.map(t => t.url));

        const tabItems = document.querySelectorAll('#dvList .tab-item');
        tabItems.forEach(item => {
            const saveSpan = item.querySelector('.tab-save');
            if (saveSpan) {
                const url = saveSpan.getAttribute('data-url');
                if (url) {
                    if (savedUrls.has(url)) {
                        saveSpan.innerHTML = ICONS.unsave;
                        saveSpan.title = 'Unbookmark tab';
                    } else {
                        saveSpan.innerHTML = ICONS.save;
                        saveSpan.title = 'Bookmark tab';
                    }
                }
            }

            const downloadSpan = item.querySelector('.tab-download');
            if (downloadSpan) {
                const url = downloadSpan.getAttribute('data-url');
                if (url) {
                    if (offlineSavedUrls.has(url)) {
                        downloadSpan.innerHTML = ICONS.cloud_unsave;
                        downloadSpan.title = 'Remove from offline saved';
                    } else {
                        downloadSpan.innerHTML = ICONS.download;
                        downloadSpan.title = 'Store offline';
                    }
                }
            }
        });
    },

    renderSavedTabs: async function () {
        const savedTabs = await googleTabs.getSavedTabs();
        googleTabs.updateActiveTabIcons();
        const openTabs = await chrome.tabs.query({});
        const openTabUrls = new Set(openTabs.map(t => t.url));

        const filteredSavedTabs = savedTabs.filter(savedTab => !openTabUrls.has(savedTab.url));

        const savedGroup = document.getElementById('savedTabsGroup');
        const dvSavedList = document.getElementById('dvSavedList');
        const mainLabel = document.getElementById('mainLabel');
        const collapseIcon = document.getElementById('collapseIcon');
        const titleGroup = document.getElementById('titleGroup');
        const btnRestoreAllIcon = document.getElementById('btnRestoreAllIcon');
        const btnClearAllSavedIcon = document.getElementById('btnClearAllSavedIcon');
        const btnExportIcon = document.getElementById('btnExportIcon');
        dvSavedList.innerHTML = '';

        if (savedTabs.length === 0) {
            if (mainLabel) mainLabel.textContent = 'Tabs';
            if (btnRestoreAllIcon) btnRestoreAllIcon.style.display = 'none';
            if (btnClearAllSavedIcon) btnClearAllSavedIcon.style.display = 'none';
            if (btnExportIcon) btnExportIcon.style.display = 'none';
        } else {
            if (mainLabel) mainLabel.textContent = 'Bookmarked Tabs';
            if (btnRestoreAllIcon) btnRestoreAllIcon.style.display = 'flex';
            if (btnClearAllSavedIcon) btnClearAllSavedIcon.style.display = 'flex';
            if (btnExportIcon) btnExportIcon.style.display = 'flex';
        }

        if (filteredSavedTabs.length === 0) {
            savedGroup.style.display = 'none';
            if (collapseIcon) collapseIcon.style.display = 'none';
            if (titleGroup) {
                titleGroup.style.cursor = 'default';
                titleGroup.title = '';
            }
            return;
        }

        savedGroup.style.display = 'block';
        if (collapseIcon) collapseIcon.style.display = 'flex';
        if (titleGroup) {
            titleGroup.style.cursor = 'pointer';
            titleGroup.title = 'Toggle Bookmarked Tabs';
        }

        if (googleTabs.isSavedTabsCollapsed) {
            dvSavedList.style.display = 'none';
            savedGroup.style.borderBottom = 'none';
            savedGroup.style.paddingBottom = '0';
            savedGroup.style.marginBottom = '0';
            if (collapseIcon) collapseIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
        } else {
            dvSavedList.style.display = 'flex';
            savedGroup.style.borderBottom = '1px solid var(--border-color)';
            savedGroup.style.paddingBottom = '8px';
            savedGroup.style.marginBottom = '8px';
            if (collapseIcon) collapseIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
        }

        var fragment = document.createDocumentFragment();

        filteredSavedTabs.forEach(function (tab) {
            var listItem = document.createElement('div');
            listItem.className = 'tab-item discarded';

            var innerImage = document.createElement('img');
            innerImage.src = tab.favIconUrl || ICONS.globe;
            innerImage.className = 'tab-icon';

            var innerSpan = document.createElement('span');
            innerSpan.className = 'tab-title';
            innerSpan.textContent = tab.title;
            innerSpan.title = tab.title;
            innerSpan.setAttribute('data-url', tab.url);
            innerSpan.addEventListener("click", googleTabs.openSavedTab);

            var saveSpan = document.createElement('span');
            saveSpan.innerHTML = ICONS.unsave;
            saveSpan.className = 'tab-save';
            saveSpan.title = 'Unbookmark tab';
            saveSpan.setAttribute('data-url', tab.url);
            saveSpan.addEventListener('click', googleTabs.unsaveTab);

            listItem.appendChild(innerImage);
            listItem.appendChild(innerSpan);
            listItem.appendChild(saveSpan);

            fragment.appendChild(listItem);
        });

        dvSavedList.appendChild(fragment);
    },

    renderOfflineSavedTabs: async function () {
        const offlineSavedTabs = await googleTabs.getOfflineSavedTabs();

        const filteredTabs = offlineSavedTabs;

        const offlineGroup = document.getElementById('offlineSavedTabsGroup');
        const dvOfflineList = document.getElementById('dvOfflineSavedList');
        const btnClearAllOffline = document.getElementById('btnClearAllOfflineSavedIcon');
        const titleGroupOffline = document.getElementById('titleGroupOffline');
        const collapseIconOffline = document.getElementById('collapseIconOffline');

        dvOfflineList.innerHTML = '';

        if (offlineSavedTabs.length === 0) {
            if (btnClearAllOffline) btnClearAllOffline.style.display = 'none';
        } else {
            if (btnClearAllOffline) btnClearAllOffline.style.display = 'flex';
        }

        if (filteredTabs.length === 0) {
            offlineGroup.style.display = 'none';
            return;
        }

        offlineGroup.style.display = 'block';

        if (googleTabs.isOfflineSavedTabsCollapsed) {
            dvOfflineList.style.display = 'none';
            offlineGroup.style.borderBottom = '1px solid var(--border-color)';
            offlineGroup.style.paddingBottom = '8px';
            offlineGroup.style.marginBottom = '8px';
            if (collapseIconOffline) collapseIconOffline.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
        } else {
            dvOfflineList.style.display = 'flex';
            offlineGroup.style.borderBottom = '1px solid var(--border-color)';
            offlineGroup.style.paddingBottom = '8px';
            offlineGroup.style.marginBottom = '8px';
            if (collapseIconOffline) collapseIconOffline.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
        }

        var fragment = document.createDocumentFragment();

        filteredTabs.forEach(function (tab) {
            var listItem = document.createElement('div');
            listItem.className = 'tab-item discarded';

            var innerImage = document.createElement('img');
            innerImage.src = tab.favIconUrl || ICONS.globe;
            innerImage.className = 'tab-icon';

            var innerSpan = document.createElement('span');
            innerSpan.className = 'tab-title';
            innerSpan.textContent = tab.title;
            innerSpan.title = tab.title;
            innerSpan.setAttribute('data-url', tab.url);
            if (tab.downloadId) innerSpan.setAttribute('data-download-id', tab.downloadId);
            innerSpan.addEventListener("click", googleTabs.openOfflineSavedTab);

            var sizeSpan = document.createElement('span');
            sizeSpan.className = 'tab-size';
            sizeSpan.style.fontSize = '10px';
            sizeSpan.style.color = 'var(--icon-color)';
            sizeSpan.style.marginLeft = '8px';
            sizeSpan.style.marginRight = '8px';
            sizeSpan.style.opacity = '0.7';
            sizeSpan.textContent = tab.size ? tab.size : '';

            var removeSpan = document.createElement('span');
            removeSpan.innerHTML = ICONS.cloud_unsave;
            removeSpan.className = 'tab-save';
            removeSpan.title = 'Remove from offline saved';
            removeSpan.setAttribute('data-url', tab.url);
            removeSpan.addEventListener('click', googleTabs.removeOfflineSavedTab);

            listItem.appendChild(innerImage);
            listItem.appendChild(innerSpan);
            listItem.appendChild(sizeSpan);
            listItem.appendChild(removeSpan);

            fragment.appendChild(listItem);
        });

        dvOfflineList.appendChild(fragment);
        googleTabs.updateActiveTabIcons();
    },

    removeOfflineSavedTab: async function (e) {
        e.stopPropagation();
        const url = this.getAttribute('data-url');
        let offlineSavedTabs = await googleTabs.getOfflineSavedTabs();

        const tabToRemove = offlineSavedTabs.find(t => t.url === url);
        if (tabToRemove && tabToRemove.downloadId) {
            try {
                chrome.downloads.removeFile(tabToRemove.downloadId, () => {
                    if (chrome.runtime.lastError) console.warn(chrome.runtime.lastError);
                });
            } catch (e) {
                console.warn(e);
            }
        }

        offlineSavedTabs = offlineSavedTabs.filter(t => t.url !== url);
        await googleTabs.setOfflineSavedTabs(offlineSavedTabs);
        googleTabs.renderOfflineSavedTabs();
    },
    initHistorySettings: function() {
        chrome.storage.local.get(['historyRetentionDays', 'lastHistoryCleanup'], function(result) {
            let days = result.historyRetentionDays;
            if (days === undefined) {
                days = "OFF";
                chrome.storage.local.set({ historyRetentionDays: days });
            }
            const input = document.getElementById('historyDaysInput');
            if (input) {
                input.value = days;
                input.addEventListener('change', function(e) {
                    let newDays = e.target.value;
                    chrome.storage.local.set({ historyRetentionDays: newDays });
                });
            }
            if (days !== "OFF") {
                let now = new Date().getTime();
                let lastCleanup = result.lastHistoryCleanup || 0;
                let oneDayMs = 24 * 60 * 60 * 1000;
                if (now - lastCleanup >= oneDayMs) {
                    googleTabs.deleteOldHistory(parseInt(days));
                    chrome.storage.local.set({ lastHistoryCleanup: now });
                }
            }
        });
    },

    deleteOldHistory: async function(days) {
        if (!days || days === "OFF") return;
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const deleteBeforeTime = (new Date()).getTime() - (days * millisecondsPerDay);
        
        if (chrome.history && chrome.history.deleteRange) {
            return new Promise((resolve) => {
                chrome.history.deleteRange({
                    startTime: 0,
                    endTime: deleteBeforeTime
                }, function() {
                    console.log('Old history deleted up to ' + new Date(deleteBeforeTime).toLocaleString());
                    resolve();
                });
            });
        }
    },

    discardInactiveTabs: async function () {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const tabs = await chrome.tabs.query({ currentWindow: true });
        for (const tab of tabs) {
            if (activeTab && tab.id !== activeTab.id && !tab.discarded) {
                try {
                    const discardedTab = await chrome.tabs.discard(tab.id);
                    var el = document.getElementById(tab.id);
                    if (el) {
                        if (discardedTab && discardedTab.id !== tab.id) {
                            el.id = discardedTab.id; // Update ID if it changed
                        }
                        el.classList.add('discarded');
                    }
                } catch (e) {
                    console.error("Error discarding tab:", e);
                }
            }
        }
    },



    tabListing: async function () {
        const tabs = await chrome.tabs.query({});
        var tabList = document.getElementById('dvList');
        var fragment = document.createDocumentFragment();

        tabs.forEach(function (tab) {
            var listItem = document.createElement('div');
            listItem.className = 'tab-item' + (tab.discarded ? ' discarded' : '');
            listItem.id = tab.id;

            var innerImage = document.createElement('img');
            innerImage.src = tab.favIconUrl || ICONS.globe;
            innerImage.className = 'tab-icon';

            var innerSpan = document.createElement('span');
            innerSpan.className = 'tab-title';
            innerSpan.textContent = tab.title;
            innerSpan.title = tab.title;
            innerSpan.addEventListener("click", googleTabs.tabSelect);

            var closeSpan = document.createElement('span');
            closeSpan.innerHTML = ICONS.close;
            closeSpan.className = 'tab-close';
            closeSpan.title = 'Close tab';
            closeSpan.addEventListener("click", googleTabs.tabClose);

            var snoozeSpan = document.createElement('span');
            snoozeSpan.innerHTML = ICONS.snooze;
            snoozeSpan.className = 'tab-snooze';
            snoozeSpan.title = 'Discard tab';
            snoozeSpan.addEventListener('click', googleTabs.tabDiscard);

            var saveSpan = document.createElement('span');
            saveSpan.innerHTML = ICONS.save;
            saveSpan.className = 'tab-save';
            saveSpan.title = 'Bookmark tab';
            saveSpan.setAttribute('data-url', tab.url);
            saveSpan.addEventListener('click', googleTabs.toggleSaveTab);

            var downloadSpan = document.createElement('span');
            downloadSpan.innerHTML = ICONS.download;
            downloadSpan.className = 'tab-download';
            downloadSpan.title = 'Store offline';
            downloadSpan.setAttribute('data-url', tab.url);
            downloadSpan.addEventListener('click', googleTabs.tabDownload);

            listItem.appendChild(innerImage);
            listItem.appendChild(innerSpan);
            listItem.appendChild(downloadSpan);
            listItem.appendChild(saveSpan);
            listItem.appendChild(snoozeSpan);
            listItem.appendChild(closeSpan);

            fragment.appendChild(listItem);
        });

        tabList.appendChild(fragment);
    },

    tabClose: function () {
        chrome.tabs.remove(parseInt(this.parentNode.id));
        document.getElementById(this.parentNode.id).remove();
    },

    tabDownload: async function (e) {
        e.stopPropagation();
        const url = this.getAttribute('data-url');
        if (!url) return;

        let offlineSavedTabs = await googleTabs.getOfflineSavedTabs();
        const existingTab = offlineSavedTabs.find(t => t.url === url);

        if (existingTab) {
            // Already saved, unsave and delete data
            if (existingTab.downloadId) {
                try {
                    chrome.downloads.removeFile(existingTab.downloadId, () => {
                        if (chrome.runtime.lastError) console.warn(chrome.runtime.lastError);
                    });
                } catch (e) {
                    console.warn(e);
                }
            }
            offlineSavedTabs = offlineSavedTabs.filter(t => t.url !== url);
            await googleTabs.setOfflineSavedTabs(offlineSavedTabs);
            googleTabs.renderOfflineSavedTabs();
            return;
        }

        var tabId = parseInt(this.parentNode.id);
        var titleSpan = this.parentNode.querySelector('.tab-title');
        var title = titleSpan ? titleSpan.textContent : 'webpage';
        var filename = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        chrome.tabs.get(tabId, function (tab) {
            chrome.pageCapture.saveAsMHTML({ tabId: tabId }, function (mhtmlData) {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    return;
                }
                
                // Force the correct MIME type so Chrome doesn't save it as a .txt file
                var mhtmlBlob = new Blob([mhtmlData], { type: 'application/x-mimearchive' });
                var blobUrl = URL.createObjectURL(mhtmlBlob);
                var sizeInMB = (mhtmlBlob.size / (1024 * 1024)).toFixed(1) + ' MB';
                
                chrome.downloads.download({
                    url: blobUrl,
                    filename: 'OfflineWebpages/' + filename + '.mhtml',
                    saveAs: false
                }, async function (downloadId) {
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
                    
                    if (chrome.runtime.lastError || !downloadId) {
                        console.warn("Download canceled or failed", chrome.runtime.lastError);
                        return;
                    }

                    let offlineSavedTabs = await googleTabs.getOfflineSavedTabs();
                    if (!offlineSavedTabs.some(t => t.url === tab.url)) {
                        offlineSavedTabs.push({ url: tab.url, title: tab.title, favIconUrl: tab.favIconUrl, downloadId: downloadId, size: sizeInMB });
                        await googleTabs.setOfflineSavedTabs(offlineSavedTabs);
                        googleTabs.renderOfflineSavedTabs();
                        googleTabs.updateActiveTabIcons();
                    }            
                });
            });
        });
    },

    tabDiscard: async function () {
        var tabId = parseInt(this.parentNode.id);
        if (this.parentNode.classList.contains('discarded')) {
            chrome.tabs.reload(tabId);
            this.parentNode.classList.remove('discarded');
        } else {
            try {
                const discardedTab = await chrome.tabs.discard(tabId);
                if (discardedTab && discardedTab.id !== tabId) {
                    this.parentNode.id = discardedTab.id; // Update ID if it changed
                }
                this.parentNode.classList.add('discarded');
            } catch (e) {
                console.error("Error discarding tab:", e);
            }
        }
    },

    tabSelect: function () {
        var tabId = parseInt(this.parentNode.id);
        chrome.tabs.update(tabId, {
            active: true
        });
        this.parentNode.classList.remove('discarded');
    },
};

document.addEventListener('DOMContentLoaded', function () {
    googleTabs.initTheme();
    googleTabs.initHistorySettings();
    var discardIcon = document.getElementById("btnDiscardIcon");
    var btnDeleteHistory = document.getElementById("btnDeleteHistory");
    if (btnDeleteHistory) {
        btnDeleteHistory.addEventListener("click", function() {
            chrome.storage.local.get(['historyRetentionDays'], async function(result) {
                let days = result.historyRetentionDays || "OFF";
                if (days !== "OFF") {
                    await googleTabs.deleteOldHistory(parseInt(days));
                    var origText = btnDeleteHistory.querySelector('span:nth-child(2)').textContent;
                    btnDeleteHistory.querySelector('span:nth-child(2)').textContent = 'History Deleted!';
                    setTimeout(function() {
                        btnDeleteHistory.querySelector('span:nth-child(2)').textContent = origText;
                    }, 2000);
                } else {
                    var origText = btnDeleteHistory.querySelector('span:nth-child(2)').textContent;
                    btnDeleteHistory.querySelector('span:nth-child(2)').textContent = 'Setting is OFF!';
                    setTimeout(function() {
                        btnDeleteHistory.querySelector('span:nth-child(2)').textContent = origText;
                    }, 2000);
                }
            });
        });
    }
    var saveAllBtn = document.getElementById("btnSaveAllIcon");
    var restoreAllBtn = document.getElementById("btnRestoreAllIcon");
    var clearAllBtn = document.getElementById("btnClearAllSavedIcon");
    var themeToggleBtn = document.getElementById("btnThemeToggle");
    var titleGroup = document.getElementById("titleGroup");
    var exportBtn = document.getElementById("btnExportIcon");
    var importBtn = document.getElementById("btnImportIcon");
    var fileImport = document.getElementById("fileImport");
    var openSettingsBtn = document.getElementById("btnOpenSettings");
    var closeSettingsBtn = document.getElementById("btnCloseSettings");

    googleTabs.tabListing();
    googleTabs.renderSavedTabs();
    googleTabs.renderOfflineSavedTabs();
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", googleTabs.toggleTheme);
    }
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener("click", googleTabs.openSettings);
    }
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener("click", googleTabs.closeSettings);
    }
    if (titleGroup) {
        titleGroup.addEventListener("click", googleTabs.toggleSavedTabs);
    }
    var titleGroupOffline = document.getElementById("titleGroupOffline");
    if (titleGroupOffline) {
        titleGroupOffline.addEventListener("click", googleTabs.toggleOfflineSavedTabs);
    }
    if (saveAllBtn) {
        saveAllBtn.addEventListener("click", googleTabs.saveAllTabs);
    }
    if (restoreAllBtn) {
        restoreAllBtn.addEventListener("click", googleTabs.restoreAllTabs);
    }
    if (clearAllBtn) {
        clearAllBtn.addEventListener("click", googleTabs.clearAllSavedTabs);
    }
    var clearAllOfflineBtn = document.getElementById("btnClearAllOfflineSavedIcon");
    if (clearAllOfflineBtn) {
        clearAllOfflineBtn.addEventListener("click", googleTabs.clearAllOfflineSavedTabs);
    }
    if (exportBtn) {
        exportBtn.addEventListener("click", googleTabs.exportTabs);
    }
    if (importBtn) {
        importBtn.addEventListener("click", googleTabs.triggerImport);
    }
    if (fileImport) {
        fileImport.addEventListener("change", googleTabs.importTabs);
    }
    if (discardIcon) {
        discardIcon.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            googleTabs.discardInactiveTabs();
        });
    }
});