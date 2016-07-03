"use strict";

var tukstReceptuUrl = "http://www.delfi.lt/1000receptu/receptai/";

function getJsonFromRecipyTable(receptu_langas, url) {
    var jsonObjektas = {};
    jsonObjektas.recipeTitle = $('h1#article-title').text();
    jsonObjektas.url = url;
    jsonObjektas.ingredients = [];
    
    $(receptu_langas).each(function (i, item) {
        //console.log(i);
        //console.log(item);
        var ingredientas = {};
        ingredientas.amount = $(item).find(".amount").html();
        ingredientas.ingredient = $(item).find(".ingredient a").html();
        // Special cases with ingredient lists consisting of multiple parts
        // http://www.delfi.lt/1000receptu/receptai/apsilaizysite-pirstelius-chacapuri-su-vistiena.d?id=71449664
        if ((ingredientas.amount !== undefined && ingredientas.amount.trim().length > 0)
        || (ingredientas.ingredient !== undefined && ingredientas.ingredient.trim().length > 0)) {
            var urlWithGeneralName = $(item).find(".ingredient a").attr("href");
            var urls = urlWithGeneralName.split("/");
            var generalName = urls.pop();
            ingredientas.general_name = generalName;
            jsonObjektas.ingredients.push(ingredientas);
        }
    });
    //var jsonString = JSON.stringify(jsonObjektas);
    return jsonObjektas;
}


var fullUrl = window.location.href;
if (fullUrl.substring(0, tukstReceptuUrl.length) === tukstReceptuUrl) {
    var key = 'recipe-found-' + window.location.href;
    var obj = {}
    obj[key] = true;
    console.log(key);
    chrome.storage.local.set(obj);

    var receptu_langas = $(".recipe-ingredients table tbody tr");
    var jsonObjektas = getJsonFromRecipyTable(receptu_langas, window.location.href );
    var jsonString = JSON.stringify(jsonObjektas);
    // console.log(jsonString);
    $.ajax({
        type: "post",
        url: "http://tomasra.com/reciprice/api/match",
        data: jsonString,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data){
            // console.log(data);
            //Gavus duomenis, cia galime deti i chrome localStorage:
            // var key = 'ingredients-' + window.location.href;
            var keyIngr = 'ingredients-' + window.location.href;
            var keyTitle = 'recipe-title-' + window.location.href;
            var obj = {};
            obj[keyIngr] = data;
            obj["recipeTitle"] = jsonObjektas.recipeTitle;
            //recipeTitle = jsonObjektas.recipeTitle;
            chrome.storage.local.set(obj);

            // chrome.storage.local.set({
            //     keyIngr: data,
            //     keyTitle: jsonObjektas.recipeTitle,
            //     // ingredientuSarasas : data,
            //     // recipeTitle: response.jsonObjektas.recipeTitle,
            // });

            // chrome.storage.local.get(key, function(data) {
            //     console.log(data[key]);
            // })

            console.log('data');
            // chrome.storage.local.set({
            //     ingredientuSarasas : data,
            //     recipeTitle: response.jsonObjektas.recipeTitle,
            // });
        },
        error: function (jq, status, message) {
            var msg = '$.ajax post error when calling http://tomasra.com/reciprice/api/match : ' + status + ' - Message: ' + message;
            console.error(msg);
            alert(msg);
        }
    });

    // chrome.storage.local.set({ recipeFound: true });
    chrome.browserAction.setBadgeText({ text: "!" });
    chrome.browserAction.setIcon({ path: "graphics/receptumeistras-icon-chrome-38-2-active.png" });
} else {
    var key = 'recipe-found-' + window.location.href;
    var obj = {}
    obj[key] = false;
    console.log(key);
    chrome.storage.local.set(obj);

    // console.log('recipe not found');
    // var key = 'recipe-found-' + window.location.href;
    // chrome.storage.local.set({ key: false });

    // chrome.storage.local.set({ recipeFound: false });
    chrome.browserAction.setBadgeText({ text: "" });
    chrome.browserAction.setIcon({ path: "graphics/receptumeistras-icon-chrome-38-2-neutral.png" });
}




// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
// //chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
//     //alert("is background.js ateina!");
//     if (request == "getDOM") {
//         var receptu_langas = $(".recipe-ingredients table tbody tr");
//         var jsonObjektas = getJsonFromRecipyTable(receptu_langas, window.location.href );
//         sendResponse({ jsonObjektas: jsonObjektas });
//     }
//     else
//         sendResponse({}); // Send nothing..
// });
