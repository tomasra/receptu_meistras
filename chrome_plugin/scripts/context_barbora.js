"use strict";
function notify() {
    alert("clicked");
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var pridetiProdukta = getUrlParameter('receptuMeistrasPridetiProdukta');
var uzdaryti = getUrlParameter('receptuMeistrasUzdaryti');
var aktyvinti = getUrlParameter('receptuMeistrasAktyvinti');
if (pridetiProdukta == 1) {
    //executinam clicka
    //alert("noriu clickint!");

    $(".b-add-to-cart").click();

    if (uzdaryti == 1) {
        setTimeout(function () {
                //chrome.tabs.getCurrent(function (tab) {
            //chrome.tabs.remove(tab.id, function () { });
                //});
                window.close();
        }, 400);
    }
    if (aktyvinti == 1) {
        setTimeout(function () {
            //chrome.tabs.getCurrent(function (tab) {
            //chrome.tabs.remove(tab.id, function () { });
            //});
            window.focus();
        }, 200);
    }

        //if (uzdaryti == 1) {
        //    chrome.tabs.getCurrent(function (tab) {
        //        chrome.tabs.remove(tab.id, function () { });
        //    });
        //}
    //
}

//chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
////chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
//    //alert("is background.js ateina!");
//    if (request == "getDOM") {
//        var receptu_langas = $(".recipe-ingredients table tbody tr");
//        var jsonObjektas = getJsonFromRecipyTable(receptu_langas, window.location.href );
//        sendResponse({ jsonObjektas: jsonObjektas });
//    }
//    else
//        sendResponse({}); // Send nothing..
//});

