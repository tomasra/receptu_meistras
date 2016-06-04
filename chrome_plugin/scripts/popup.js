document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('checkPage');

    chrome.browserAction.setBadgeText({ text: "5.3€" });

    //Gaunam koks url:
    chrome.tabs.getCurrent(function (tab) {
        var fullUrl = tab.url;
        alert("asdasd");
        var tukstReceptuUrl = "http://www.delfi.lt/1000receptu/receptai/";
        alert(fullUrl.substring(0, tukstReceptuUrl.length));
        if (fullUrl.substring(0, tukstReceptuUrl.length) === tukstReceptuUrl) {
            alert("yra!");
        }
        else {
            alert("nera!");
        }
    }
    );

    //var receptuLangas = $(".recipe-ingredients");
    //alert(receptuLangas);
    checkPageButton.addEventListener('click', function () {

        chrome.tabs.getSelected(null, function (tab) {
            d = document;

            var f = d.createElement('form');
            f.action = 'http://gtmetrix.com/analyze.html?bm';
            f.method = 'post';
            var i = d.createElement('input');
            i.type = 'hidden';
            i.name = 'url';
            i.value = tab.url;
            f.appendChild(i);
            d.body.appendChild(f);
            f.submit();
        });
    }, false);
}, false);