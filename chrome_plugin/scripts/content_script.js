"use strict";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    //alert("is background.js ateina!");
    if (request == "getDOM") {
        var receptu_langas = $(".recipe-ingredients table tbody tr");
        var jsonObjektas = getJsonFromRecipyTable(receptu_langas, window.location.href );
        sendResponse({ jsonObjektas: jsonObjektas });
    }
    else
        sendResponse({}); // Send nothing..
});

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