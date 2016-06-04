var ingredientuSarasas = 'ingredientuSarasas';
function populatePopupWithIngredients(items){
    console.log(items);
    //alert("populatePopupWithIngredients");
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("pradedam loadint..");
    
    chrome.storage.local.get("ingredientuSarasas", function (items) {
        if (!items) {
            chrome.storage.onChanged.addListener(function (changes, areaName) {
                console.log(changes);
                console.log(areaName);
                items = changes;

                populatePopupWithIngredients(changes);
            });
        }
        else {
            populatePopupWithIngredients(items);
        }
    });



    

    var checkPageButton = document.getElementById('checkPage');
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
    
    chrome.browserAction.getBadgeText({}, function (badgeText) {
        if (badgeText) {

        }
    });






});


