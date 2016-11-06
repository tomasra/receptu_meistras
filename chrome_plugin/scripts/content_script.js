"use strict";
const fullUrl = window.location.href;
const MATCH_URL = "http://tomasra.com/reciprice/api/match"

const recipeSiteExtractor = GetRecipeExtractor(fullUrl);

if (recipeSiteExtractor) {
    const key = 'recipe-found-' + window.location.href;
    let obj = {}
    obj[key] = true;
    chrome.storage.local.set(obj);

    const jsonObjektas = recipeSiteExtractor.extractRecipeData();
    const jsonString = JSON.stringify(jsonObjektas);

    let xhr = $.ajax({
        type: "post",
        url: MATCH_URL,
        data: jsonString,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            const keyIngr = 'ingredients-' + window.location.href;
            const keyTitle = 'recipe-title-' + window.location.href;
            const obj = {};
            obj[keyIngr] = data;
            obj[keyTitle] = jsonObjektas.recipeTitle;
            chrome.storage.local.set(obj);
            console.log('Recipe ' + jsonObjektas.recipeTitle + ' added to chromeStorage.');
        },
        error: function (jq, status, message) {
            var msg = '$.ajax post error when calling ' + MATCH_URL + '; status: ' + status + '; message: ' + message;
            console.error(msg);
            alert(msg);
        }
        , complete: function(jq, status){
            window.onbeforeunload = null;
        }
    });

    window.onbeforeunload = function () {
        xhr.abort();
        return null;
    }

} else {
    console.log("Not a recipe page: " + window.location.href)
}
