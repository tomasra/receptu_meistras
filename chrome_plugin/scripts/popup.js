var ingredientuSarasas = 'ingredientuSarasas';
function populatePopupWithIngredients(items){
    console.log(items);
    //alert("populatePopupWithIngredients");
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("pradedam loadint..");
    
    var spinner = new Spinner({
        scale: 2.0,
    }).spin();
    $('.section').append(spinner.el);

    chrome.storage.local.get("ingredientuSarasas", function(items) {
        // console.log(items);
        if (items.ingredientuSarasas !== undefined) {
            spinner.stop();
            populatePopupWithIngredients(items);
        } else {
            chrome.storage.onChanged.addListener(function(changes, areaName) {
                // HACK: checking if ingredient list was cleared or populated in eventPage.js
                if (changes.ingredientuSarasas.newValue === undefined) {
                    // Cleared - need to wait for data
                    spinner.spin();
                    // console.log(changes);
                } else {
                    // Populated
                    spinner.stop();
                    populatePopupWithIngredients(changes.ingredientuSarasas.newValue);
                    // console.log(changes);
                }
            });
        }
    })

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
