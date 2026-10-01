// Synchronously apply cached theme from localStorage to prevent FOUC
(function() {
    try {
        const theme = localStorage.getItem('theme');
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }
        localStorage.removeItem('lastPopupHeight');
    } catch (e) {}
})();

const FAVICON_BASE = chrome.runtime.getURL("/_favicon/?size=32&pageUrl=");

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const ICONS = {
    download: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 17l4 4 4-4"></path><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path></svg>',
    save: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
    unsave: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
    cloud_unsave: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>',
    snooze: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h6l-6 8h6"></path><path d="M14 4h6l-6 8h6"></path></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
    drag_handle: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>',
    globe: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%3E%3C%2Fcircle%3E%3Cline%20x1%3D%222%22%20y1%3D%2212%22%20x2%3D%2222%22%20y2%3D%2212%22%3E%3C%2Fline%3E%3Cpath%20d%3D%22M12%202a15.3%2015.3%200%200%201%204%2010%2015.3%2015.3%200%200%201-4%2010%2015.3%2015.3%200%200%201-4-10%2015.3%2015.3%200%200%201%204-10z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E'
};

// Fallback for broken tab icons (capture phase handles non-bubbling error events on images)
document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG' && e.target.classList && e.target.classList.contains('tab-icon')) {
        if (e.target.src !== ICONS.globe) {
            e.target.src = ICONS.globe;
        }
    }
}, true);

// Start pre-fetching tabs and all storage data immediately at the earliest possible instant
const initialDataPromise = Promise.all([
    chrome.tabs.query({}),
    chrome.storage.local.get([
        'theme',
        'isOrderable',
        'isSavedTabsCollapsed',
        'isOfflineSavedTabsCollapsed',
        'historyRetentionDays',
        'lastHistoryCleanup',
        'savedTabs',
        'offlineSavedTabs'
    ])
]);

var googleTabs = {
    isSavedTabsCollapsed: (function() {
        try {
            const v = localStorage.getItem('isSavedTabsCollapsed');
            return v !== null ? v === '1' : true;
        } catch(e) { return true; }
    })(),
    isOfflineSavedTabsCollapsed: (function() {
        try {
            const v = localStorage.getItem('isOfflineSavedTabsCollapsed');
            return v !== null ? v === '1' : true;
        } catch(e) { return true; }
    })(),
    isOrderable: (function() {
        try {
            return localStorage.getItem('isOrderable') === '1';
        } catch(e) { return false; }
    })(),
    dragSourceItem: null,
    dragSourceContainer: null,
    _cachedSavedTabs: null,
    _cachedOfflineSavedTabs: null,
    cachedFilteredSavedTabs: null,
    cachedOfflineSavedTabs: null,

    getFaviconUrl: function (url, fallbackFavIconUrl) {
        if (fallbackFavIconUrl && fallbackFavIconUrl.startsWith('data:image/')) {
            return fallbackFavIconUrl;
        }
        if (url) {
            return FAVICON_BASE + encodeURIComponent(url);
        }
        return fallbackFavIconUrl || ICONS.globe;
    },

    toggleSavedTabs: function () {
        googleTabs.isSavedTabsCollapsed = !googleTabs.isSavedTabsCollapsed;
        try {
            localStorage.setItem('isSavedTabsCollapsed', googleTabs.isSavedTabsCollapsed ? '1' : '0');
        } catch (e) {}
        chrome.storage.local.set({ isSavedTabsCollapsed: googleTabs.isSavedTabsCollapsed });
        googleTabs.updateSavedTabsCollapseUI();

        if (!googleTabs.isSavedTabsCollapsed) {
            const dvSavedList = document.getElementById('dvSavedList');
            if (dvSavedList && dvSavedList.dataset.rendered !== "true" && googleTabs.cachedFilteredSavedTabs) {
                googleTabs.renderSavedTabRows(googleTabs.cachedFilteredSavedTabs);
            }
        }
    },

    updateSavedTabsCollapseUI: function () {
        const dvSavedList = document.getElementById('dvSavedList');
        const collapseIcon = document.getElementById('collapseIcon');
        const savedGroup = document.getElementById('savedTabsGroup');
        const lblSetting = document.getElementById('lblToggleSavedTabsSetting');
        const iconSetting = document.getElementById('iconToggleSavedTabsSetting');

        if (lblSetting) {
            lblSetting.textContent = googleTabs.isSavedTabsCollapsed ? 'Expand Bookmarked Tabs' : 'Collapse Bookmarked Tabs';
        }
        if (iconSetting) {
            iconSetting.innerHTML = googleTabs.isSavedTabsCollapsed
                ? '<polyline points="9 18 15 12 9 6"></polyline>'
                : '<polyline points="6 9 12 15 18 9"></polyline>';
        }

        if (dvSavedList && savedGroup) {
            if (googleTabs.isSavedTabsCollapsed) {
                dvSavedList.style.display = 'none';
                savedGroup.style.borderBottom = 'none';
                savedGroup.style.paddingBottom = '0';
                savedGroup.style.marginBottom = '0';
                if (collapseIcon) {
                    collapseIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
                }
            } else {
                dvSavedList.style.display = 'flex';
                savedGroup.style.borderBottom = '1px solid var(--border-color)';
                savedGroup.style.paddingBottom = '8px';
                savedGroup.style.marginBottom = '8px';
                if (collapseIcon) {
                    collapseIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
                }
            }
        }
    },

    toggleOfflineSavedTabs: function () {
        googleTabs.isOfflineSavedTabsCollapsed = !googleTabs.isOfflineSavedTabsCollapsed;
        try {
            localStorage.setItem('isOfflineSavedTabsCollapsed', googleTabs.isOfflineSavedTabsCollapsed ? '1' : '0');
        } catch (e) {}
        chrome.storage.local.set({ isOfflineSavedTabsCollapsed: googleTabs.isOfflineSavedTabsCollapsed });
        googleTabs.updateOfflineSavedTabsCollapseUI();

        if (!googleTabs.isOfflineSavedTabsCollapsed) {
            const dvOfflineList = document.getElementById('dvOfflineSavedList');
            if (dvOfflineList && dvOfflineList.dataset.rendered !== "true" && googleTabs.cachedOfflineSavedTabs) {
                googleTabs.renderOfflineSavedTabRows(googleTabs.cachedOfflineSavedTabs);
            }
        }
    },

    updateOfflineSavedTabsCollapseUI: function () {
        const dvOfflineSavedList = document.getElementById('dvOfflineSavedList');
        const collapseIconOffline = document.getElementById('collapseIconOffline');
        const offlineSavedTabsGroup = document.getElementById('offlineSavedTabsGroup');

        if (dvOfflineSavedList && offlineSavedTabsGroup) {
            if (googleTabs.isOfflineSavedTabsCollapsed) {
                dvOfflineSavedList.style.display = 'none';
                offlineSavedTabsGroup.style.borderBottom = '1px solid var(--border-color)';
                offlineSavedTabsGroup.style.paddingBottom = '8px';
                offlineSavedTabsGroup.style.marginBottom = '8px';
                if (collapseIconOffline) {
                    collapseIconOffline.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
                }
            } else {
                dvOfflineSavedList.style.display = 'flex';
                offlineSavedTabsGroup.style.borderBottom = '1px solid var(--border-color)';
                offlineSavedTabsGroup.style.paddingBottom = '8px';
                offlineSavedTabsGroup.style.marginBottom = '8px';
                if (collapseIconOffline) {
                    collapseIconOffline.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
                }
            }
        }
    },

    initOrderable: function () {
        chrome.storage.local.get(['isOrderable'], function (result) {
            googleTabs.isOrderable = !!result.isOrderable;
            try {
                localStorage.setItem('isOrderable', googleTabs.isOrderable ? '1' : '0');
            } catch (e) {}
            googleTabs.updateOrderableUI();
        });
    },

    toggleOrderable: function () {
        googleTabs.isOrderable = !googleTabs.isOrderable;
        try {
            localStorage.setItem('isOrderable', googleTabs.isOrderable ? '1' : '0');
        } catch (e) {}
        chrome.storage.local.set({ isOrderable: googleTabs.isOrderable });
        googleTabs.updateOrderableUI();
    },

    updateOrderableUI: function () {
        const btnToggle = document.getElementById('btnToggleOrder');
        if (googleTabs.isOrderable) {
            document.body.classList.add('orderable-mode');
            if (btnToggle) {
                btnToggle.classList.add('active');
                btnToggle.title = 'Disable row reordering (Reorder ON)';
            }
        } else {
            document.body.classList.remove('orderable-mode');
            if (btnToggle) {
                btnToggle.classList.remove('active');
                btnToggle.title = 'Enable row reordering (Reorder OFF)';
            }
        }

        document.querySelectorAll('.tab-item').forEach(item => {
            item.setAttribute('draggable', googleTabs.isOrderable ? 'true' : 'false');
        });
    },

    makeRowOrderable: function (listItem) {
        if (listItem) {
            listItem.setAttribute('draggable', googleTabs.isOrderable ? 'true' : 'false');
        }
    },

    initContainerDragAndDrop: function (container) {
        if (!container) return;
        container.addEventListener('dragstart', function (e) {
            if (!googleTabs.isOrderable) {
                e.preventDefault();
                return;
            }
            const item = e.target.closest('.tab-item');
            if (!item || e.target.closest('.tab-close, .tab-snooze, .tab-save, .tab-download')) {
                e.preventDefault();
                return;
            }
            googleTabs.dragSourceItem = item;
            googleTabs.dragSourceContainer = container;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', item.id || item.getAttribute('data-url') || '');
            item.classList.add('dragging');
        });

        container.addEventListener('dragover', function (e) {
            if (!googleTabs.isOrderable || !googleTabs.dragSourceItem) return;
            if (container !== googleTabs.dragSourceContainer) return;
            const targetItem = e.target.closest('.tab-item');
            if (!targetItem || targetItem === googleTabs.dragSourceItem) return;

            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const rect = targetItem.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            if (e.clientY < midY) {
                targetItem.classList.add('drag-over-top');
                targetItem.classList.remove('drag-over-bottom');
            } else {
                targetItem.classList.add('drag-over-bottom');
                targetItem.classList.remove('drag-over-top');
            }
        });

        container.addEventListener('dragleave', function (e) {
            const targetItem = e.target.closest('.tab-item');
            if (targetItem && !targetItem.contains(e.relatedTarget)) {
                targetItem.classList.remove('drag-over-top');
                targetItem.classList.remove('drag-over-bottom');
            }
        });

        container.addEventListener('drop', async function (e) {
            if (!googleTabs.isOrderable || !googleTabs.dragSourceItem) return;
            if (container !== googleTabs.dragSourceContainer) return;
            const targetItem = e.target.closest('.tab-item');
            if (!targetItem || targetItem === googleTabs.dragSourceItem) return;

            e.preventDefault();
            e.stopPropagation();

            const isAbove = targetItem.classList.contains('drag-over-top');
            targetItem.classList.remove('drag-over-top');
            targetItem.classList.remove('drag-over-bottom');

            const source = googleTabs.dragSourceItem;
            if (isAbove) {
                container.insertBefore(source, targetItem);
            } else {
                container.insertBefore(source, targetItem.nextSibling);
            }

            if (container.id === 'dvList') {
                await googleTabs.syncActiveTabsOrder(container, source);
            } else if (container.id === 'dvSavedList') {
                await googleTabs.syncSavedTabsOrder(container);
            } else if (container.id === 'dvOfflineSavedList') {
                await googleTabs.syncOfflineSavedTabsOrder(container);
            }
        });

        container.addEventListener('dragend', function () {
            if (googleTabs.dragSourceItem) {
                googleTabs.dragSourceItem.classList.remove('dragging');
            }
            container.querySelectorAll('.tab-item').forEach(el => {
                el.classList.remove('drag-over-top');
                el.classList.remove('drag-over-bottom');
            });
            googleTabs.dragSourceItem = null;
            googleTabs.dragSourceContainer = null;
        });
    },

    syncActiveTabsOrder: async function (container, movedItem) {
        if (!chrome.tabs || !chrome.tabs.move) return;
        try {
            const tabElements = Array.from(container.querySelectorAll('.tab-item'));
            const tabId = parseInt(movedItem.id);
            const windowIdAttr = movedItem.getAttribute('data-window-id');
            const windowId = windowIdAttr ? parseInt(windowIdAttr) : null;

            const sameWindowTabs = windowId !== null
                ? tabElements.filter(el => parseInt(el.getAttribute('data-window-id')) === windowId)
                : tabElements;

            const targetIndex = sameWindowTabs.indexOf(movedItem);
            if (targetIndex !== -1 && !isNaN(tabId)) {
                await chrome.tabs.move(tabId, { index: targetIndex });
            }
        } catch (err) {
            console.warn("Could not sync active tab move:", err);
        }
    },

    syncSavedTabsOrder: async function (container) {
        try {
            let savedTabs = await googleTabs.getSavedTabs();
            const visibleItems = Array.from(container.querySelectorAll('.tab-item'));
            const visibleUrls = visibleItems.map(el => el.getAttribute('data-url')).filter(Boolean);

            const visibleIndicesInSaved = [];
            savedTabs.forEach((tab, idx) => {
                if (visibleUrls.includes(tab.url)) {
                    visibleIndicesInSaved.push(idx);
                }
            });

            const tabMap = new Map(savedTabs.map(t => [t.url, t]));
            const reorderedVisible = visibleUrls.map(url => tabMap.get(url)).filter(Boolean);

            visibleIndicesInSaved.forEach((savedIdx, i) => {
                if (reorderedVisible[i]) {
                    savedTabs[savedIdx] = reorderedVisible[i];
                }
            });

            await googleTabs.setSavedTabs(savedTabs);
        } catch (err) {
            console.warn("Could not sync saved tabs order:", err);
        }
    },

    syncOfflineSavedTabsOrder: async function (container) {
        try {
            let offlineSavedTabs = await googleTabs.getOfflineSavedTabs();
            const visibleItems = Array.from(container.querySelectorAll('.tab-item'));
            const visibleUrls = visibleItems.map(el => el.getAttribute('data-url')).filter(Boolean);

            const tabMap = new Map(offlineSavedTabs.map(t => [t.url, t]));
            const newOffline = visibleUrls.map(url => tabMap.get(url)).filter(Boolean);

            offlineSavedTabs.forEach(t => {
                if (!visibleUrls.includes(t.url)) {
                    newOffline.push(t);
                }
            });

            await googleTabs.setOfflineSavedTabs(newOffline);
        } catch (err) {
            console.warn("Could not sync offline saved tabs order:", err);
        }
    },

    openSettings: function () {
        document.getElementById('mainView').style.display = 'none';
        document.getElementById('settingsView').style.display = 'flex';
    },

    closeSettings: function () {
        document.getElementById('mainView').style.display = 'flex';
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
        const iconMoon = document.getElementById('iconMoon');
        const iconSun = document.getElementById('iconSun');
        if (!iconMoon || !iconSun) return;
        if (theme === 'dark') {
            iconMoon.style.display = 'none';
            iconSun.style.display = 'block';
        } else {
            iconMoon.style.display = 'block';
            iconSun.style.display = 'none';
        }
    },

    toggleTheme: function () {
        let currentTheme = document.documentElement.getAttribute('data-theme');
        if (!currentTheme) {
            currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {}
        chrome.storage.local.set({ theme: newTheme });
        googleTabs.updateThemeIcon(newTheme);
    },

    getSavedTabs: async function () {
        if (googleTabs._cachedSavedTabs) return googleTabs._cachedSavedTabs;
        const result = await chrome.storage.local.get(['savedTabs']);
        googleTabs._cachedSavedTabs = result.savedTabs || [];
        return googleTabs._cachedSavedTabs;
    },

    setSavedTabs: async function (tabs) {
        googleTabs._cachedSavedTabs = tabs;
        await chrome.storage.local.set({ savedTabs: tabs });
    },

    getOfflineSavedTabs: async function () {
        if (googleTabs._cachedOfflineSavedTabs) return googleTabs._cachedOfflineSavedTabs;
        const result = await chrome.storage.local.get(['offlineSavedTabs']);
        googleTabs._cachedOfflineSavedTabs = result.offlineSavedTabs || [];
        return googleTabs._cachedOfflineSavedTabs;
    },

    setOfflineSavedTabs: async function (tabs) {
        googleTabs._cachedOfflineSavedTabs = tabs;
        await chrome.storage.local.set({ offlineSavedTabs: tabs });
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
            await googleTabs.updateActiveTabIcons();
            googleTabs.renderOfflineSavedTabs();
        }
    },

    exportTabs: async function () {
        const [savedTabs, offlineSavedTabs, result] = await Promise.all([
            googleTabs.getSavedTabs(),
            googleTabs.getOfflineSavedTabs(),
            chrome.storage.local.get(['theme', 'historyRetentionDays', 'isOrderable', 'isSavedTabsCollapsed', 'isOfflineSavedTabsCollapsed'])
        ]);

        const exportedSaved = savedTabs.map((tab, idx) => ({ ...tab, order: idx }));
        const exportedOffline = offlineSavedTabs.map((tab, idx) => ({ ...tab, order: idx }));

        const exportData = {
            savedTabs: exportedSaved,
            offlineSavedTabs: exportedOffline,
            settings: {
                theme: result.theme,
                historyRetentionDays: result.historyRetentionDays,
                isOrderable: result.isOrderable || false,
                isSavedTabsCollapsed: result.isSavedTabsCollapsed !== undefined ? result.isSavedTabsCollapsed : true,
                isOfflineSavedTabsCollapsed: result.isOfflineSavedTabsCollapsed !== undefined ? result.isOfflineSavedTabsCollapsed : true
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
                        if (importedData.settings.isOrderable !== undefined) {
                            newSettings.isOrderable = importedData.settings.isOrderable;
                            googleTabs.isOrderable = newSettings.isOrderable;
                            googleTabs.updateOrderableUI();
                        }
                        if (importedData.settings.isSavedTabsCollapsed !== undefined) {
                            newSettings.isSavedTabsCollapsed = importedData.settings.isSavedTabsCollapsed;
                            googleTabs.isSavedTabsCollapsed = importedData.settings.isSavedTabsCollapsed;
                            googleTabs.updateSavedTabsCollapseUI();
                        }
                        if (importedData.settings.isOfflineSavedTabsCollapsed !== undefined) {
                            newSettings.isOfflineSavedTabsCollapsed = importedData.settings.isOfflineSavedTabsCollapsed;
                            googleTabs.isOfflineSavedTabsCollapsed = importedData.settings.isOfflineSavedTabsCollapsed;
                            googleTabs.updateOfflineSavedTabsCollapseUI();
                        }
                        if (Object.keys(newSettings).length > 0) {
                            await chrome.storage.local.set(newSettings);
                        }
                    }
                }

                if (importedSaved.length > 0) {
                    importedSaved.sort((a, b) => {
                        if (a.order !== undefined && b.order !== undefined) {
                            return a.order - b.order;
                        }
                        return 0;
                    });
                    let savedTabs = await googleTabs.getSavedTabs();
                    importedSaved.forEach(imported => {
                        if (imported.url && imported.title && !savedTabs.some(t => t.url === imported.url)) {
                            const { order, ...rest } = imported;
                            savedTabs.push(rest);
                        }
                    });
                    await googleTabs.setSavedTabs(savedTabs);
                    googleTabs.renderSavedTabs();
                }

                if (importedOffline.length > 0) {
                    importedOffline.sort((a, b) => {
                        if (a.order !== undefined && b.order !== undefined) {
                            return a.order - b.order;
                        }
                        return 0;
                    });
                    let offlineSavedTabs = await googleTabs.getOfflineSavedTabs();
                    importedOffline.forEach(imported => {
                        if (imported.url && imported.title && !offlineSavedTabs.some(t => t.url === imported.url)) {
                            const { order, downloadId, ...rest } = imported;
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

    toggleSaveTab: async function (item, saveBtn) {
        let el = item;
        let btn = saveBtn;
        if (item && item.target) {
            item.stopPropagation();
            el = item.currentTarget ? item.currentTarget.parentNode : this.parentNode;
            btn = item.currentTarget || this;
        } else if (!el) {
            el = this && this.parentNode;
            btn = this;
        }
        if (!el) return;
        const tabId = parseInt(el.id);
        if (isNaN(tabId)) return;
        const tab = await chrome.tabs.get(tabId);
        let savedTabs = await googleTabs.getSavedTabs();

        if (savedTabs.find(t => t.url === tab.url)) {
            savedTabs = savedTabs.filter(t => t.url !== tab.url);
            if (btn) {
                btn.innerHTML = ICONS.save;
                btn.title = 'Bookmark tab';
            }
        } else {
            savedTabs.push({ url: tab.url, title: tab.title, favIconUrl: tab.favIconUrl });
            if (btn) {
                btn.innerHTML = ICONS.unsave;
                btn.title = 'Unbookmark tab';
            }
        }
        await googleTabs.setSavedTabs(savedTabs);
        await googleTabs.updateActiveTabIcons();
        googleTabs.renderSavedTabs();
    },

    unsaveTab: async function (item) {
        let el = item;
        if (item && item.target) {
            item.stopPropagation();
            el = item.currentTarget || this;
        } else if (!el) {
            el = this;
        }
        const url = el.getAttribute('data-url') || (el.parentNode && el.parentNode.getAttribute('data-url'));
        if (!url) return;
        let savedTabs = await googleTabs.getSavedTabs();
        savedTabs = savedTabs.filter(t => t.url !== url);
        await googleTabs.setSavedTabs(savedTabs);
        await googleTabs.updateActiveTabIcons();
        googleTabs.renderSavedTabs();
    },

    openSavedTab: function (item) {
        let el = item;
        if (item && item.target) {
            el = item.currentTarget || this;
        } else if (!el) {
            el = this;
        }
        const url = el.getAttribute('data-url') || (el.querySelector && el.querySelector('.tab-title') && el.querySelector('.tab-title').getAttribute('data-url'));
        if (url) {
            chrome.tabs.create({ url: url });
        }
    },

    openOfflineSavedTab: function (item) {
        let el = item;
        if (item && item.target) {
            el = item.currentTarget || this;
        } else if (!el) {
            el = this;
        }
        const titleSpan = el.classList && el.classList.contains('tab-title') ? el : (el.querySelector ? el.querySelector('.tab-title') : null);
        const url = el.getAttribute('data-url') || (titleSpan && titleSpan.getAttribute('data-url'));
        const downloadId = (titleSpan && titleSpan.getAttribute('data-download-id')) || el.getAttribute('data-download-id');
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
        } else if (url) {
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

    renderSavedTabs: async function (savedTabs, openTabs) {
        if (!savedTabs) savedTabs = await googleTabs.getSavedTabs();
        if (!openTabs) openTabs = await chrome.tabs.query({});
        const openTabUrls = new Set(openTabs.map(t => t.url));

        const filteredSavedTabs = savedTabs.filter(savedTab => !openTabUrls.has(savedTab.url));
        googleTabs.cachedFilteredSavedTabs = filteredSavedTabs;

        const savedGroup = document.getElementById('savedTabsGroup');
        const dvSavedList = document.getElementById('dvSavedList');
        const mainLabel = document.getElementById('mainLabel');
        const collapseIcon = document.getElementById('collapseIcon');
        const titleGroup = document.getElementById('titleGroup');
        const btnExportIcon = document.getElementById('btnExportIcon');

        if (savedTabs.length === 0) {
            if (mainLabel) mainLabel.textContent = 'Tabs';
            if (btnExportIcon) btnExportIcon.style.display = 'none';
        } else {
            if (mainLabel) mainLabel.textContent = 'Bookmarked Tabs';
            if (btnExportIcon) btnExportIcon.style.display = 'flex';
        }

        if (filteredSavedTabs.length === 0) {
            if (savedGroup) savedGroup.style.display = 'none';
            if (collapseIcon) collapseIcon.style.display = 'none';
            if (titleGroup) {
                titleGroup.style.cursor = 'default';
                titleGroup.title = '';
            }
            if (dvSavedList) dvSavedList.innerHTML = '';
            return;
        }

        if (savedGroup) savedGroup.style.display = 'block';
        if (collapseIcon) collapseIcon.style.display = 'flex';
        if (titleGroup) {
            titleGroup.style.cursor = 'pointer';
            titleGroup.title = 'Toggle Bookmarked Tabs';
        }

        googleTabs.updateSavedTabsCollapseUI();

        if (googleTabs.isSavedTabsCollapsed) {
            if (dvSavedList) dvSavedList.dataset.rendered = "false";
            return;
        }

        googleTabs.renderSavedTabRows(filteredSavedTabs);
    },

    renderSavedTabRows: function (filteredSavedTabs) {
        const dvSavedList = document.getElementById('dvSavedList');
        if (!dvSavedList) return;
        const isOrderable = googleTabs.isOrderable;

        let html = '';
        for (let i = 0; i < filteredSavedTabs.length; i++) {
            const tab = filteredSavedTabs[i];
            const favicon = googleTabs.getFaviconUrl(tab.url, tab.favIconUrl);
            const titleEsc = escapeHtml(tab.title || 'Untitled');
            const urlEsc = escapeHtml(tab.url || '');

            html += `<div class="tab-item discarded" data-url="${urlEsc}" draggable="${isOrderable}">`
                + `<span class="tab-drag-handle" title="Drag to reorder">${ICONS.drag_handle}</span>`
                + `<img src="${favicon}" class="tab-icon" decoding="async" loading="lazy">`
                + `<span class="tab-title" title="${titleEsc}" data-url="${urlEsc}">${titleEsc}</span>`
                + `<span class="tab-save" title="Unbookmark tab" data-url="${urlEsc}">${ICONS.unsave}</span>`
                + `</div>`;
        }
        dvSavedList.innerHTML = html;
        dvSavedList.dataset.rendered = "true";
    },

    renderOfflineSavedTabs: async function (offlineSavedTabs, openTabs) {
        if (!offlineSavedTabs) offlineSavedTabs = await googleTabs.getOfflineSavedTabs();
        const filteredTabs = offlineSavedTabs;
        googleTabs.cachedOfflineSavedTabs = filteredTabs;

        const offlineGroup = document.getElementById('offlineSavedTabsGroup');
        const dvOfflineList = document.getElementById('dvOfflineSavedList');
        const btnClearAllOffline = document.getElementById('btnClearAllOfflineSavedIcon');

        if (offlineSavedTabs.length === 0) {
            if (btnClearAllOffline) btnClearAllOffline.style.display = 'none';
        } else {
            if (btnClearAllOffline) btnClearAllOffline.style.display = 'flex';
        }

        if (filteredTabs.length === 0) {
            if (offlineGroup) offlineGroup.style.display = 'none';
            if (dvOfflineList) dvOfflineList.innerHTML = '';
            return;
        }

        if (offlineGroup) offlineGroup.style.display = 'block';
        googleTabs.updateOfflineSavedTabsCollapseUI();

        if (googleTabs.isOfflineSavedTabsCollapsed) {
            if (dvOfflineList) dvOfflineList.dataset.rendered = "false";
            return;
        }

        googleTabs.renderOfflineSavedTabRows(filteredTabs);
    },

    renderOfflineSavedTabRows: function (filteredTabs) {
        const dvOfflineList = document.getElementById('dvOfflineSavedList');
        if (!dvOfflineList) return;
        const isOrderable = googleTabs.isOrderable;

        let html = '';
        for (let i = 0; i < filteredTabs.length; i++) {
            const tab = filteredTabs[i];
            const favicon = googleTabs.getFaviconUrl(tab.url, tab.favIconUrl);
            const titleEsc = escapeHtml(tab.title || 'Untitled');
            const urlEsc = escapeHtml(tab.url || '');
            const downloadIdEsc = escapeHtml(tab.downloadId ? String(tab.downloadId) : '');
            const sizeEsc = escapeHtml(tab.size || '');

            html += `<div class="tab-item discarded" data-url="${urlEsc}" draggable="${isOrderable}">`
                + `<span class="tab-drag-handle" title="Drag to reorder">${ICONS.drag_handle}</span>`
                + `<img src="${favicon}" class="tab-icon" decoding="async" loading="lazy">`
                + `<span class="tab-title" title="${titleEsc}" data-url="${urlEsc}" data-download-id="${downloadIdEsc}">${titleEsc}</span>`
                + `<span class="tab-size" style="font-size: 10px; color: var(--icon-color); margin-left: 8px; margin-right: 8px; opacity: 0.7;">${sizeEsc}</span>`
                + `<span class="tab-save" title="Remove from offline saved" data-url="${urlEsc}">${ICONS.cloud_unsave}</span>`
                + `</div>`;
        }
        dvOfflineList.innerHTML = html;
        dvOfflineList.dataset.rendered = "true";
    },

    removeOfflineSavedTab: async function (item) {
        let el = item;
        if (item && item.target) {
            item.stopPropagation();
            el = item.currentTarget || this;
        } else if (!el) {
            el = this;
        }
        const url = el.getAttribute('data-url') || (el.parentNode && el.parentNode.getAttribute('data-url'));
        if (!url) return;
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
        await googleTabs.updateActiveTabIcons();
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
                    setTimeout(async function () {
                        await googleTabs.deleteOldHistory(parseInt(days));
                        chrome.storage.local.set({ lastHistoryCleanup: now });
                    }, 1500);
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
        const [activeTabs, tabs] = await Promise.all([
            chrome.tabs.query({ active: true, currentWindow: true }),
            chrome.tabs.query({ currentWindow: true })
        ]);
        const activeTab = activeTabs[0];
        const discardPromises = tabs
            .filter(tab => activeTab && tab.id !== activeTab.id && !tab.discarded)
            .map(async tab => {
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
            });
        await Promise.all(discardPromises);
    },



    tabListing: async function (tabs, savedTabs, offlineSavedTabs) {
        if (!tabs) tabs = await chrome.tabs.query({});
        if (!savedTabs) savedTabs = await googleTabs.getSavedTabs();
        if (!offlineSavedTabs) offlineSavedTabs = await googleTabs.getOfflineSavedTabs();

        const tabList = document.getElementById('dvList');
        if (!tabList) return;

        const savedUrls = new Set(savedTabs.map(t => t.url));
        const offlineSavedUrls = new Set(offlineSavedTabs.map(t => t.url));
        const isOrderable = googleTabs.isOrderable;

        let html = '';
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            const isSaved = savedUrls.has(tab.url);
            const isOffline = offlineSavedUrls.has(tab.url);
            const discardedClass = tab.discarded ? ' discarded' : '';
            const favicon = googleTabs.getFaviconUrl(tab.url, tab.favIconUrl);
            const titleEsc = escapeHtml(tab.title || 'Untitled');
            const urlEsc = escapeHtml(tab.url || '');

            html += `<div class="tab-item${discardedClass}" id="${tab.id}" data-window-id="${tab.windowId}" draggable="${isOrderable}">`
                + `<span class="tab-drag-handle" title="Drag to reorder">${ICONS.drag_handle}</span>`
                + `<img src="${favicon}" class="tab-icon" decoding="async" loading="lazy">`
                + `<span class="tab-title" title="${titleEsc}">${titleEsc}</span>`
                + `<span class="tab-download" title="${isOffline ? 'Remove from offline saved' : 'Store offline'}" data-url="${urlEsc}">${isOffline ? ICONS.cloud_unsave : ICONS.download}</span>`
                + `<span class="tab-save" title="${isSaved ? 'Unbookmark tab' : 'Bookmark tab'}" data-url="${urlEsc}">${isSaved ? ICONS.unsave : ICONS.save}</span>`
                + `<span class="tab-snooze" title="Discard tab">${ICONS.snooze}</span>`
                + `<span class="tab-close" title="Close tab">${ICONS.close}</span>`
                + `</div>`;
        }

        tabList.innerHTML = html;
    },

    tabClose: function (item) {
        const el = item || (this && this.parentNode);
        if (!el) return;
        const tabId = parseInt(el.id);
        if (!isNaN(tabId)) {
            chrome.tabs.remove(tabId);
            el.remove();
        }
    },

    tabDownload: async function (item, downloadBtn) {
        let el = item;
        let btn = downloadBtn;
        if (item && item.target) {
            item.stopPropagation();
            el = item.currentTarget ? item.currentTarget.parentNode : this.parentNode;
            btn = item.currentTarget || this;
        } else if (!el) {
            el = this && this.parentNode;
            btn = this;
        }
        if (!el) return;
        const url = (btn && btn.getAttribute('data-url')) || el.getAttribute('data-url');
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
            await googleTabs.updateActiveTabIcons();
            return;
        }

        const tabId = parseInt(el.id);
        if (isNaN(tabId)) return;
        const titleSpan = el.querySelector('.tab-title');
        const title = titleSpan ? titleSpan.textContent : 'webpage';
        const filename = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        chrome.tabs.get(tabId, function (tab) {
            chrome.pageCapture.saveAsMHTML({ tabId: tabId }, function (mhtmlData) {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    return;
                }
                
                // Force the correct MIME type so Chrome doesn't save it as a .txt file
                const mhtmlBlob = new Blob([mhtmlData], { type: 'application/x-mimearchive' });
                const blobUrl = URL.createObjectURL(mhtmlBlob);
                const sizeInMB = (mhtmlBlob.size / (1024 * 1024)).toFixed(1) + ' MB';
                
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

    tabDiscard: async function (item) {
        const el = item || (this && this.parentNode);
        if (!el) return;
        const tabId = parseInt(el.id);
        if (isNaN(tabId)) return;
        if (el.classList.contains('discarded')) {
            chrome.tabs.reload(tabId);
            el.classList.remove('discarded');
        } else {
            try {
                const discardedTab = await chrome.tabs.discard(tabId);
                if (discardedTab && discardedTab.id !== tabId) {
                    el.id = discardedTab.id; // Update ID if it changed
                }
                el.classList.add('discarded');
            } catch (e) {
                console.error("Error discarding tab:", e);
            }
        }
    },

    tabSelect: function (item) {
        const el = item || (this && this.parentNode);
        if (!el) return;
        const tabId = parseInt(el.id);
        if (!isNaN(tabId)) {
            chrome.tabs.update(tabId, {
                active: true
            });
            el.classList.remove('discarded');
        }
    },

    init: async function () {
        // Fast synchronous preview/hydration
        googleTabs.updateOrderableUI();
        googleTabs.updateSavedTabsCollapseUI();
        googleTabs.updateOfflineSavedTabsCollapseUI();

        const [openTabs, storage] = await initialDataPromise;

        // 1. Sync theme if storage has different value
        if (storage && storage.theme) {
            document.documentElement.setAttribute('data-theme', storage.theme);
            googleTabs.updateThemeIcon(storage.theme);
            try { localStorage.setItem('theme', storage.theme); } catch (e) {}
        } else {
            googleTabs.updateThemeIcon();
        }

        // 2. Set orderable state
        if (storage && storage.isOrderable !== undefined) {
            googleTabs.isOrderable = !!storage.isOrderable;
            try { localStorage.setItem('isOrderable', googleTabs.isOrderable ? '1' : '0'); } catch (e) {}
            googleTabs.updateOrderableUI();
        }

        // 3. Set saved tabs collapse state
        if (storage && storage.isSavedTabsCollapsed !== undefined) {
            googleTabs.isSavedTabsCollapsed = !!storage.isSavedTabsCollapsed;
            try { localStorage.setItem('isSavedTabsCollapsed', googleTabs.isSavedTabsCollapsed ? '1' : '0'); } catch (e) {}
            googleTabs.updateSavedTabsCollapseUI();
        }

        // 4. Set offline saved tabs collapse state
        if (storage && storage.isOfflineSavedTabsCollapsed !== undefined) {
            googleTabs.isOfflineSavedTabsCollapsed = !!storage.isOfflineSavedTabsCollapsed;
            try { localStorage.setItem('isOfflineSavedTabsCollapsed', googleTabs.isOfflineSavedTabsCollapsed ? '1' : '0'); } catch (e) {}
            googleTabs.updateOfflineSavedTabsCollapseUI();
        }

        // 5. Set history settings
        let days = storage ? storage.historyRetentionDays : undefined;
        if (days === undefined) {
            days = "OFF";
            chrome.storage.local.set({ historyRetentionDays: days });
        }
        const input = document.getElementById('historyDaysInput');
        if (input) {
            input.value = days;
            input.addEventListener('change', function(e) {
                chrome.storage.local.set({ historyRetentionDays: e.target.value });
            });
        }
        if (days !== "OFF") {
            let now = new Date().getTime();
            let lastCleanup = (storage && storage.lastHistoryCleanup) || 0;
            let oneDayMs = 24 * 60 * 60 * 1000;
            if (now - lastCleanup >= oneDayMs) {
                setTimeout(async function () {
                    await googleTabs.deleteOldHistory(parseInt(days));
                    chrome.storage.local.set({ lastHistoryCleanup: now });
                }, 3000);
            }
        }

        // 6. Render lists concurrently with pre-fetched data
        const savedTabs = (storage && storage.savedTabs) || [];
        const offlineSavedTabs = (storage && storage.offlineSavedTabs) || [];

        await googleTabs.tabListing(openTabs, savedTabs, offlineSavedTabs);
        await googleTabs.renderSavedTabs(savedTabs, openTabs);
        await googleTabs.renderOfflineSavedTabs(offlineSavedTabs, openTabs);
    }
};

function setupPopup() {
    googleTabs.init();

    // Container event delegation for high-speed click handling
    const dvList = document.getElementById('dvList');
    if (dvList) {
        dvList.addEventListener('click', async function (e) {
            const item = e.target.closest('.tab-item');
            if (!item) return;

            const closeBtn = e.target.closest('.tab-close');
            if (closeBtn) {
                e.stopPropagation();
                googleTabs.tabClose(item);
                return;
            }

            const snoozeBtn = e.target.closest('.tab-snooze');
            if (snoozeBtn) {
                e.stopPropagation();
                await googleTabs.tabDiscard(item);
                return;
            }

            const saveBtn = e.target.closest('.tab-save');
            if (saveBtn) {
                e.stopPropagation();
                await googleTabs.toggleSaveTab(item, saveBtn);
                return;
            }

            const downloadBtn = e.target.closest('.tab-download');
            if (downloadBtn) {
                e.stopPropagation();
                await googleTabs.tabDownload(item, downloadBtn);
                return;
            }

            const titleSpan = e.target.closest('.tab-title');
            if (titleSpan) {
                googleTabs.tabSelect(item);
                return;
            }
        });
        googleTabs.initContainerDragAndDrop(dvList);
    }

    const dvSavedList = document.getElementById('dvSavedList');
    if (dvSavedList) {
        dvSavedList.addEventListener('click', async function (e) {
            const item = e.target.closest('.tab-item');
            if (!item) return;

            const saveBtn = e.target.closest('.tab-save');
            if (saveBtn) {
                e.stopPropagation();
                await googleTabs.unsaveTab(item);
                return;
            }

            const titleSpan = e.target.closest('.tab-title');
            if (titleSpan) {
                googleTabs.openSavedTab(item);
                return;
            }
        });
        googleTabs.initContainerDragAndDrop(dvSavedList);
    }

    const dvOfflineSavedList = document.getElementById('dvOfflineSavedList');
    if (dvOfflineSavedList) {
        dvOfflineSavedList.addEventListener('click', async function (e) {
            const item = e.target.closest('.tab-item');
            if (!item) return;

            const removeBtn = e.target.closest('.tab-save');
            if (removeBtn) {
                e.stopPropagation();
                await googleTabs.removeOfflineSavedTab(item);
                return;
            }

            const titleSpan = e.target.closest('.tab-title');
            if (titleSpan) {
                googleTabs.openOfflineSavedTab(item);
                return;
            }
        });
        googleTabs.initContainerDragAndDrop(dvOfflineSavedList);
    }

    var discardHomeBtn = document.getElementById("btnDiscardInactiveHome");
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
    var themeToggleBtn = document.getElementById("btnThemeToggle");
    var titleGroup = document.getElementById("titleGroup");
    var exportBtn = document.getElementById("btnExportIcon");
    var importBtn = document.getElementById("btnImportIcon");
    var fileImport = document.getElementById("fileImport");
    var openSettingsBtn = document.getElementById("btnOpenSettings");
    var closeSettingsBtn = document.getElementById("btnCloseSettings");
    var toggleOrderBtn = document.getElementById("btnToggleOrder");

    if (toggleOrderBtn) {
        toggleOrderBtn.addEventListener("click", googleTabs.toggleOrderable);
    }
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", googleTabs.toggleTheme);
    }
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener("click", googleTabs.openSettings);
    }
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener("click", googleTabs.closeSettings);
    }
    var toggleSavedSettingBtn = document.getElementById("btnToggleSavedTabsSetting");
    if (toggleSavedSettingBtn) {
        toggleSavedSettingBtn.addEventListener("click", googleTabs.toggleSavedTabs);
    }
    if (titleGroup) {
        titleGroup.addEventListener("click", function () {
            var collapseIcon = document.getElementById('collapseIcon');
            if (collapseIcon && collapseIcon.style.display !== 'none') {
                googleTabs.toggleSavedTabs();
            }
        });
    }
    var titleGroupOffline = document.getElementById("titleGroupOffline");
    if (titleGroupOffline) {
        titleGroupOffline.addEventListener("click", googleTabs.toggleOfflineSavedTabs);
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
    if (discardHomeBtn) {
        discardHomeBtn.addEventListener("click", async function (e) {
            e.preventDefault();
            e.stopPropagation();
            discardHomeBtn.style.opacity = '1';
            await googleTabs.discardInactiveTabs();
            setTimeout(() => {
                discardHomeBtn.style.opacity = '';
            }, 300);
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPopup);
} else {
    setupPopup();
}
