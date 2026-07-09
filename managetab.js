const ICONS = {
    save: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
    unsave: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
    snooze: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h6l-6 8h6"></path><path d="M14 4h6l-6 8h6"></path></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
    globe: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>'
};

var googleTabs = {
    initTheme: function() {
        chrome.storage.local.get(['theme'], function(result) {
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

    updateThemeIcon: function(theme) {
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

    toggleTheme: function() {
        let currentTheme = document.documentElement.getAttribute('data-theme');
        if (!currentTheme) {
            currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        chrome.storage.local.set({ theme: newTheme });
        googleTabs.updateThemeIcon(newTheme);
    },
    getSavedTabs: async function() {
        const result = await chrome.storage.local.get(['savedTabs']);
        return result.savedTabs || [];
    },

    setSavedTabs: async function(tabs) {
        await chrome.storage.local.set({ savedTabs: tabs });
    },

    saveAllTabs: async function() {
        const tabs = await chrome.tabs.query({ currentWindow: true });
        let savedTabs = await googleTabs.getSavedTabs();
        
        const allSaved = tabs.every(tab => savedTabs.find(t => t.url === tab.url));
        
        if (allSaved) {
            savedTabs = savedTabs.filter(savedTab => !tabs.some(tab => tab.url === savedTab.url));
        } else {
            tabs.forEach(tab => {
                if (!savedTabs.find(t => t.url === tab.url)) {
                    savedTabs.push({ url: tab.url, title: tab.title, favIconUrl: tab.favIconUrl });
                }
            });
        }
        
        await googleTabs.setSavedTabs(savedTabs);
        googleTabs.renderSavedTabs();
    },

    restoreAllTabs: async function() {
        const savedTabs = await googleTabs.getSavedTabs();
        const openTabs = await chrome.tabs.query({});
        savedTabs.forEach(tab => {
            if (!openTabs.some(openTab => openTab.url === tab.url)) {
                chrome.tabs.create({ url: tab.url });
            }
        });
    },

    clearAllSavedTabs: async function() {
        await googleTabs.setSavedTabs([]);
        googleTabs.renderSavedTabs();
    },

    toggleSaveTab: async function(e) {
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

    unsaveTab: async function(e) {
        e.stopPropagation();
        const url = this.getAttribute('data-url');
        let savedTabs = await googleTabs.getSavedTabs();
        savedTabs = savedTabs.filter(t => t.url !== url);
        await googleTabs.setSavedTabs(savedTabs);
        googleTabs.renderSavedTabs();
    },

    openSavedTab: function() {
        const url = this.getAttribute('data-url');
        chrome.tabs.create({ url: url });
    },

    updateActiveTabIcons: async function(savedTabs) {
        const tabItems = document.querySelectorAll('#dvList .tab-item');
        tabItems.forEach(item => {
            const saveSpan = item.querySelector('.tab-save');
            if (!saveSpan) return;
            const url = saveSpan.getAttribute('data-url');
            if (!url) return;
            const isSaved = savedTabs.some(t => t.url === url);
            if (isSaved) {
                saveSpan.innerHTML = ICONS.unsave;
                saveSpan.title = 'Unsave tab';
            } else {
                saveSpan.innerHTML = ICONS.save;
                saveSpan.title = 'Save tab';
            }
        });
    },

    renderSavedTabs: async function() {
        const savedTabs = await googleTabs.getSavedTabs();
        googleTabs.updateActiveTabIcons(savedTabs);
        const openTabs = await chrome.tabs.query({});
        
        const filteredSavedTabs = savedTabs.filter(savedTab => {
            return !openTabs.some(openTab => openTab.url === savedTab.url);
        });

        const savedGroup = document.getElementById('savedTabsGroup');
        const dvSavedList = document.getElementById('dvSavedList');
        const mainLabel = document.getElementById('mainLabel');
        const btnRestoreAllIcon = document.getElementById('btnRestoreAllIcon');
        const btnClearAllSavedIcon = document.getElementById('btnClearAllSavedIcon');
        dvSavedList.innerHTML = '';

        if (savedTabs.length === 0) {
            if (mainLabel) mainLabel.textContent = 'Tabs';
            if (btnRestoreAllIcon) btnRestoreAllIcon.style.display = 'none';
            if (btnClearAllSavedIcon) btnClearAllSavedIcon.style.display = 'none';
        } else {
            if (mainLabel) mainLabel.textContent = 'Saved Tabs';
            if (btnRestoreAllIcon) btnRestoreAllIcon.style.display = 'flex';
            if (btnClearAllSavedIcon) btnClearAllSavedIcon.style.display = 'flex';
        }

        if (filteredSavedTabs.length === 0) {
            savedGroup.style.display = 'none';
            return;
        }

        savedGroup.style.display = 'block';
        var fragment = document.createDocumentFragment();

        filteredSavedTabs.forEach(function(tab) {
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
            saveSpan.title = 'Unsave tab';
            saveSpan.setAttribute('data-url', tab.url);
            saveSpan.addEventListener('click', googleTabs.unsaveTab);

            listItem.appendChild(innerImage);
            listItem.appendChild(innerSpan);
            listItem.appendChild(saveSpan);
            
            fragment.appendChild(listItem);
        });
        
        dvSavedList.appendChild(fragment);
    },
    discardInactiveTabs: async function() {
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



    tabListing: async function() {
        const tabs = await chrome.tabs.query({});
        var tabList = document.getElementById('dvList');
        var fragment = document.createDocumentFragment();
        
        tabs.forEach(function(tab) {
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
            saveSpan.title = 'Save tab';
            saveSpan.setAttribute('data-url', tab.url);
            saveSpan.addEventListener('click', googleTabs.toggleSaveTab);

            listItem.appendChild(innerImage);
            listItem.appendChild(innerSpan);
            listItem.appendChild(saveSpan);
            listItem.appendChild(snoozeSpan);
            listItem.appendChild(closeSpan);
            
            fragment.appendChild(listItem);
        });
        
        tabList.appendChild(fragment);
    },

    tabClose: function() {
        chrome.tabs.remove(parseInt(this.parentNode.id));
        document.getElementById(this.parentNode.id).remove();
    },

    tabDiscard: async function() {
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

    tabSelect: function() {
        var tabId = parseInt(this.parentNode.id);
        chrome.tabs.update(tabId, {
            active: true
        });
        this.parentNode.classList.remove('discarded');
    },
};

document.addEventListener('DOMContentLoaded', function() {
    googleTabs.initTheme();
    var discardIcon = document.getElementById("btnDiscardIcon");
    var saveAllBtn = document.getElementById("btnSaveAllIcon");
    var restoreAllBtn = document.getElementById("btnRestoreAllIcon");
    var clearAllBtn = document.getElementById("btnClearAllSavedIcon");
    var themeToggleBtn = document.getElementById("btnThemeToggle");
    googleTabs.tabListing();
    googleTabs.renderSavedTabs();
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", googleTabs.toggleTheme);
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
    if (discardIcon) {
        discardIcon.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            googleTabs.discardInactiveTabs();
        });
    }
});