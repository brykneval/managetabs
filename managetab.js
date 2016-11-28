var googleTabs = {
    removeTabs: function() {
        var isGoogle = document.getElementById("liGoogle").checked;
        var txtRemoveId = document.getElementById("txtRemove");
        chrome.windows.getAll({
            populate: true
        }, function(windows) {
            windows.forEach(function(window) {
                window.tabs.forEach(function(tab) {
                    var tempUrl = tab.url;
                    if (isGoogle) {
                        if (tempUrl.indexOf("www.google.com") > -1) {
                            chrome.tabs.remove(parseInt(tab.id));
                            document.getElementById(tab.id).remove();
                        }
                    }
                    if (txtRemoveId.value.length > 0) {
                        if (tempUrl.indexOf(txtRemoveId.value) > -1) {
                            chrome.tabs.remove(parseInt(tab.id));
                            document.getElementById(tab.id).remove();
                        }
                    }
                });
            });
        });
    },

    tabListing: function() {
        chrome.windows.getAll({
            populate: true
        }, function(windows) {
            windows.forEach(function(window) {
                window.tabs.forEach(function(tab) {
                    var tempUrl = tab.url;
                    var tabList = document.getElementById('dvList');
                    var listItem = document.createElement('a');
                    var innerImage = document.createElement('img');
                    var closeImage = document.createElement('img');
                    var innerSpan = document.createElement('span');
                    innerImage.src = tab.favIconUrl;
                    innerImage.setAttribute("style", "width:20px; height:20px;border:none;padding-right:20px;");
                    listItem.appendChild(innerImage);
                    closeImage.src = "close.png";
                    closeImage.setAttribute("style", "width:16px;height:16px;border:none;padding-right:20px;float:right;");
                    closeImage.addEventListener("click", googleTabs.tabClose);
                    listItem.appendChild(closeImage);
                    innerSpan.appendChild(document.createTextNode(tab.title));
                    innerSpan.setAttribute("style", "cursor:pointer;");
                    innerSpan.addEventListener("click", googleTabs.tabSelect);
                    listItem.appendChild(innerSpan);
                    listItem.id = tab.id;
                    listItem.onmouseover = googleTabs.tabHover;
                    tabList.appendChild(listItem);
                });
            });
        });
    },

    tabClose: function() {
        chrome.tabs.remove(parseInt(this.parentNode.id));
        document.getElementById(this.parentNode.id).remove();
    },

    tabSelect: function() {
        chrome.tabs.update(parseInt(this.parentNode.id), {
            active: true
        });
    },
};

document.addEventListener('DOMContentLoaded', function() {
    var removeBtn = document.getElementById("btnRemove");
    googleTabs.tabListing();
    removeBtn.addEventListener("click", googleTabs.removeTabs);
});