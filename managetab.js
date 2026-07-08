var googleTabs = {
    discardInactiveTabs: async function() {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const tabs = await chrome.tabs.query({ currentWindow: true });
        for (const tab of tabs) {
            if (activeTab && tab.id !== activeTab.id && !tab.discarded) {
                chrome.tabs.discard(tab.id);
                var el = document.getElementById(tab.id);
                if (el) el.classList.add('discarded');
            }
        }
    },

    removeTabs: async function() {
        var txtRemoveValue = document.getElementById("txtRemove").value;
        if (!txtRemoveValue) return; // Early exit if empty

        const tabs = await chrome.tabs.query({});
        const tabsToRemove = [];
        const elementsToRemove = [];

        tabs.forEach(function(tab) {
            if (tab.url.indexOf(txtRemoveValue) > -1) {
                tabsToRemove.push(tab.id);
                var el = document.getElementById(tab.id);
                if (el) elementsToRemove.push(el);
            }
        });

        if (tabsToRemove.length > 0) {
            chrome.tabs.remove(tabsToRemove);
            elementsToRemove.forEach(el => el.remove());
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
            innerImage.src = tab.favIconUrl || 'icons/icon-16.png';
            innerImage.className = 'tab-icon';

            var innerSpan = document.createElement('span');
            innerSpan.className = 'tab-title';
            innerSpan.textContent = tab.title;
            innerSpan.title = tab.title;
            innerSpan.addEventListener("click", googleTabs.tabSelect);

            var closeImage = document.createElement('img');
            closeImage.src = "close.png";
            closeImage.className = 'tab-close';
            closeImage.title = 'Close tab';
            closeImage.addEventListener("click", googleTabs.tabClose);

            var snoozeSpan = document.createElement('span');
            snoozeSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
            snoozeSpan.className = 'tab-snooze';
            snoozeSpan.title = 'Discard tab';
            snoozeSpan.addEventListener('click', googleTabs.tabDiscard);

            listItem.appendChild(innerImage);
            listItem.appendChild(innerSpan);
            listItem.appendChild(snoozeSpan);
            listItem.appendChild(closeImage);
            
            fragment.appendChild(listItem);
        });
        
        tabList.appendChild(fragment);
    },

    tabClose: function() {
        chrome.tabs.remove(parseInt(this.parentNode.id));
        document.getElementById(this.parentNode.id).remove();
    },

    tabDiscard: function() {
        chrome.tabs.discard(parseInt(this.parentNode.id));
        this.parentNode.classList.add('discarded');
    },

    tabSelect: function() {
        chrome.tabs.update(parseInt(this.parentNode.id), {
            active: true
        });
    },
};

document.addEventListener('DOMContentLoaded', function() {
    var removeBtn = document.getElementById("btnRemove");
    var discardIcon = document.getElementById("btnDiscardIcon");
    googleTabs.tabListing();
    removeBtn.addEventListener("click", googleTabs.removeTabs);
    if (discardIcon) {
        discardIcon.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            googleTabs.discardInactiveTabs();
        });
    }
});