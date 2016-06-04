"use strict";

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    //alert("is background.js ateina!");
    if (request.action == "getDOM") {
        var receptu_langas = $(".recipe-ingredients table tbody tr");
        var jsonObjektas = getJsonFromRecipyTable(receptu_langas, window.location.href );
        sendResponse({ jsonObjektas: jsonObjektas });
    }
    else
        sendResponse({}); // Send nothing..
});

function getJsonFromRecipyTable(receptu_langas, url) {
    var jsonObjektas = {};
    jsonObjektas.url = url;
    jsonObjektas.ingredients = [];
    
    $(receptu_langas).each(function (i, item) {
        //console.log(i);
        //console.log(item);
        var ingredientas = {};
        ingredientas.amount = $(item).find(".amount").html();
        ingredientas.ingredient = $(item).find(".ingredient a").html();
        
        var urlWithGeneralName = $(item).find(".ingredient a").attr("href");
        var urls = urlWithGeneralName.split("/");
        var generalName = urls.pop();
        ingredientas.general_name = generalName;
        jsonObjektas.ingredients.push(ingredientas);
    });
    //var jsonString = JSON.stringify(jsonObjektas);
    return jsonObjektas;
}