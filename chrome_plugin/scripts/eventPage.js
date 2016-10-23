console.log("Vykdomas eventPage.js")
const MATCH_URL = "http://tomasra.com:5000/match";
function checkWebpage(loadingStatus) {
    if (loadingStatus === undefined) {
        // No url yet or no changes in it
    }
    else if (loadingStatus === 'loading') {
        chrome.storage.local.remove('ingredientuSarasas');
        // Check if page contains a recipe and store result in local storage
        chrome.tabs.query({ active: true }, function (tab) {
            tab = tab[0];
            var fullUrl = tab.url;
            console.log(fullUrl);
            var recipeSiteExtractor = GetRecipeExtractor(fullUrl);
            if (recipeSiteExtractor) {
                chrome.storage.local.set({ recipeFound: true });
                chrome.browserAction.setBadgeText({ text: "!" });
                chrome.browserAction.setIcon({ path: "graphics/receptumeistras-icon-chrome-38-2-active.png" });
            } else {
                chrome.storage.local.set({ recipeFound: false });
                chrome.browserAction.setBadgeText({ text: "" });
                chrome.browserAction.setIcon({ path: "graphics/receptumeistras-icon-chrome-38-2-neutral.png" });
            }
        });
    } else if (loadingStatus === 'complete') {
        chrome.tabs.query({ active: true }, function (tab) {
            tab = tab[0];
            chrome.tabs.sendMessage(tab.id, "getDOM", {}, function (response) {
                if (response && response.jsonObjektas) {
                    var jsonObjektas = response.jsonObjektas;
                    var jsonString = JSON.stringify(jsonObjektas);

                    $.ajax({
                        type: "post",
                        url: MATCH_URL,
                        data: jsonString,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            chrome.storage.local.set({
                                ingredientuSarasas: data,
                                recipeTitle: response.jsonObjektas.recipeTitle,
                            });
                        },
                        error: function (jq, status, message) {
                            var msg = '$.ajax post error when calling ' + MATCH_URL + '; status: ' + status + '; message: ' + message;
                            console.error(msg);
                            alert(msg);
                        }
                    });
                }
            });
        });
    }
    else if (loadingStatus == "onActivated") {
        chrome.storage.local.get("ingredientuSarasas", function (data) {
            console.log("ingredientuSarasas!!");

            console.log(data);

            chrome.tabs.query({ active: true }, function (tab) {
                tab = tab[0];
                var fullUrl = tab.url;

                var recipeSiteExtractor = GetRecipeExtractor(fullUrl);
                var arReceptoLangas = false;
                if (recipeSiteExtractor) {
                    arReceptoLangas = true;
                }
                console.log("arReceptoLangas: " + arReceptoLangas);
                var arYraIngredientuSarasas = data && data.ingredientuSarasas;
                console.log("arYraIngredientuSarasas: " + arYraIngredientuSarasas);

                if (arReceptoLangas && arYraIngredientuSarasas) {
                    console.log('recipe found');
                    chrome.storage.local.set({ recipeFound: true });
                    chrome.browserAction.setBadgeText({ text: "!" });
                    chrome.browserAction.setIcon({ path: "graphics/receptumeistras-icon-chrome-38-2-active.png" });
                } else {
                    console.log('recipe not found');
                    chrome.storage.local.set({ recipeFound: false });
                    chrome.browserAction.setBadgeText({ text: "" });
                    chrome.browserAction.setIcon({ path: "graphics/receptumeistras-icon-chrome-38-2-neutral.png" });
                }
            });
        });
    }
};


chrome.tabs.onActivated.addListener(function (activeInfo) {
    console.log("onActivated loadint..");
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        var keyRecipeFound = 'recipe-found-' + tab.url;
        chrome.storage.local.get(keyRecipeFound, function (data) {
            var recipeFound = data[keyRecipeFound];
            if (recipeFound === true) {
                chrome.browserAction.setBadgeText({ text: "!" });
                chrome.browserAction.setIcon({ path: "graphics/receptumeistras-icon-chrome-38-2-active.png" });
            } else {
                chrome.browserAction.setBadgeText({ text: "" });
                chrome.browserAction.setIcon({ path: "graphics/receptumeistras-icon-chrome-38-2-neutral.png" });
            }
        })
    })
}, false);

//Kai paklikini ant linko, (onActivated nesuveikia)
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log("onUpdated loadint..");
    checkWebpage(changeInfo.status);
});

chrome.tabs.onCreated.addListener(function (tab) {
    console.log("onCreated loadint..");
    checkWebpage(undefined);
});
