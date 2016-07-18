
var fullUrl = window.location.href;

//Cia tikriname puslapius, ar tai receptu puslapiai:

var recipeSiteExtractor = GetRecipeExtractor(fullUrl);

if (recipeSiteExtractor) {
    //chrome.browserAction.setBadgeText({ text: "!" });
    //chrome.browserAction.setIcon({ path: "graphics/receptumeistras-icon-chrome-38-2-active.png" });
    var key = 'recipe-found-' + window.location.href;
    var obj = {}
    obj[key] = true;
    console.log(key);
    chrome.storage.local.set(obj);
    
    var jsonObjektas = recipeSiteExtractor.extractRecipeData();
    
    var jsonString = JSON.stringify(jsonObjektas);
    
    // console.log(jsonString);
    $.ajax({
        type: "post",
        url: "http://tomasra.com/reciprice/api/match",
        data: jsonString,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            // console.log(data);
            //Gavus duomenis, cia galime deti i chrome localStorage:
            var keyIngr = 'ingredients-' + window.location.href;
            var keyTitle = 'recipe-title-' + window.location.href;
            var obj = {};
            obj[keyIngr] = data;
            obj[keyTitle] = jsonObjektas.recipeTitle;
            chrome.storage.local.set(obj);
            
            console.log('Receptas ' + jsonObjektas.recipeTitle + ' sekmingai idetas i chromeStorage.');

        },
        error: function (jq, status, message) {
            var msg = '$.ajax post error when calling http://tomasra.com/reciprice/api/match : ' + status + ' - Message: ' + message;
            console.error(msg);
            alert(msg);
        }
    });


} else {
    console.log("Nera recepto puslapis: " + window.location.href)
    //var key = 'recipe-found-' + window.location.href;
    //var obj = {}
    //obj[key] = false;
    //console.log(key);
    //chrome.storage.local.set(obj);

    //chrome.browserAction.setBadgeText({ text: "" });
    //chrome.browserAction.setIcon({ path: "graphics/receptumeistras-icon-chrome-38-2-neutral.png" });
}
