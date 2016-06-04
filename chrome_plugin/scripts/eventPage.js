alert("eventPage loadina!");
function checkWebpage() {
    //paziurim ar tai 1000 receptu puslapis:
    chrome.tabs.getSelected(null, function (tab) {
        var fullUrl = tab.url;
        var tukstReceptuUrl = "http://www.delfi.lt/1000receptu/receptai/";
        if (fullUrl.substring(0, tukstReceptuUrl.length) === tukstReceptuUrl) {
                                chrome.browserAction.setBadgeText({ text: "!" });

            // Send a request to the content script.
            chrome.tabs.sendRequest(tab.id, { action: "getDOM" }, function (response) {

                console.log(response);
                if (response && response.jsonObjektas) {
                    var jsonObjektas = response.jsonObjektas;
                    console.log(jsonObjektas);
                    var jsonString = JSON.stringify(jsonObjektas);
                    console.log(jsonString);
                    
                    //Cia reikia gauti popup contexta:

                    //cia reikia callinti tomo scripta!
                    $.ajax({
                        type: "post",
                        url: "http://tomasra.com:5000/match",
                        data: jsonString,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function (data){
                            console.log(data);
                            alert(data);
                            //Gavus duomenis, cia galime pradeti pildyti lentele.

                            //1. Lentele gyvena popup.html

                            //chrome.tabs.sendRequest(tab.id, { action: "getDOM" }, function (response) {
                            //});


                        },
                        error: function (jq, status, message) {
                            var msg = '$.ajax post error when calling http://tomasra.com:5000/match : ' + status + ' - Message: ' + message;
                            console.error(msg);
                            alert(msg);
                        }
                    });

                //Isvalyti lentele is popup.html, updatinti kad ten rodytu loading...
                //http://tomasra.com:5000/match
                }
            });

        }
        else {
            chrome.browserAction.setBadgeText({ text: "" });
        }
    });
};


chrome.tabs.onActivated.addListener(function (activeInfo) {

    console.log("onActivated loadint..");
    checkWebpage();
}, false);

//Kai paklikini ant linko, (onActivated nesuveikia)
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log("onUpdated loadint..");
    checkWebpage();
});

//Uzgaudo su onActivated
//chrome.tabs.onCreated.addListener(function (activeInfo) {
//    alert("onCreated");
//    console.log("onCreated loadint..");
//    checkWebpage();
//}, false);