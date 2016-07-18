var ingredientuSarasas = 'ingredientuSarasas';

///
//"ingredient": "Vištiena",
//"products": [
//{
//    "category3": "Vištiena",
//    "item_netto_weight": "",
//    "name": "Vištienos rinkinys šeimai (filė kepsniams ir blauzd.be sąn.), 1 kg",
//    "price": "4.29",
//    "price_per_unit": "4.29",
//    "unit": "kg",
//    "url": "/produktai/vistienos-rinkinys-seimai-file-kepsniams-ir-blauzd-be-san-1-kg"
//  }
///
function populatePopupWithIngredients(items){
    console.log(items);
    var $resultsForm = $("#resultsForm");
    $resultsForm.html("");

    if (items.length > 0) {
        var produktuHtml = "";
        $.when($.get('../views/templates/ingredient-item.html')
            , $.get('../views/templates/ingredient-item-option.html')
        )
        .then(function (ingredientItemTemplate, ingredientItemOptionTemplate) {
            console.log(ingredientItemTemplate);

            for (var i in items) {
                var item = items[i];
                var dropDownHtml = getDropdownHtml(item.products, ingredientItemOptionTemplate[0]);
                var produktoHtml = getProduktoHtml(item, i, dropDownHtml, ingredientItemTemplate[0]);
                produktuHtml = produktuHtml.concat(produktoHtml);
            }
            $resultsForm.html(produktuHtml);
            // Listen to selection changes
            $('select.produkto-dropdown').each(function (idx, select) {
                $(select).change(function () {
                    updateTotalPrice();
                })
            });
            // Listen to checkboxes too
            $resultsForm.find(':checkbox').each(function (idx, checkbox) {
                $(checkbox).change(function () {
                    updateTotalPrice();
                })
            })
            updateTotalPrice();

        });
    }
    else {
        console.error("ingredientuSarasas tuscias!");
        alert("ingredientuSarasas tuscias!");
    }
}

function updateTotalPrice() {
    total = 0.0;
    $('.product').each(function(idx, product) {
        var checkbox = $(product).find(':checkbox');
        if ($(checkbox).is(':checked')) {
            var selected_option = $(product).find('select.produkto-dropdown option:selected');
            total += parseFloat($(selected_option).attr('data-price'));
        }
    })
    parts = total.toFixed(2).toString().split('.');
    $('.euros').html(parts[0]);
    $('.cents').html(parts[1]);
}

function getProduktoHtml(item, i, dropDownHtml, ingredientItemTemplate){
    var templateValues = {
        produktoPavadinimas : item.ingredient,
        produktoKiekis : item.amount,
        Nr: i,
        produktoDropdownHtml : dropDownHtml
    }
        var rendered = Mustache.render(ingredientItemTemplate, templateValues);
    return rendered;
}

function getDropdownHtml(products, ingredientItemOptionTemplate){
    var selectHtml = "";
    for (var j in products) {
        var product = products[j];
        
        var templateValues = {
            optionPrice : products[j].price,
            optionUrl : products[j].url,
            optionText: products[j].name
        }
        selectHtml +=  Mustache.render(ingredientItemOptionTemplate, templateValues);
    }
    return selectHtml;
}

function updateRecipeTitle(keyRecipeTitle) { 
    chrome.storage.local.get(keyRecipeTitle, function (data) { 
        // console.log("updateRecipeTitle " + keyRecipeTitle + ' ' + data[keyRecipeTitle]);
        $('h1.title-pavadinimas').text(data[keyRecipeTitle]); 
    });
}

function recipeFound() {
    $('.recipe-not-found').detach();

    $("#resultsForm").on("click", "a.button-buy", function () {
        var nr = $(this).data("nr");
        var dropDownId = "#produkto" + nr + "dropdown";
        var url = $(dropDownId).val();
        var fullUrl = "https://www.barbora.lt" + url + "?receptuMeistrasPridetiProdukta=1";
        chrome.tabs.create({ url: fullUrl, selected: false }, function (tab) {
            //chrome.tabs.update(tab.id, { selected: true });
        });

        //window.open(fullUrl, '_blank');
        return false;
    });

    var spinner = new Spinner({
        scale: 2.0,
    }).spin();
    $('.section').append(spinner.el);

    chrome.tabs.query({active: true}, function(tab) {
        tab = tab[0];
        var keyIngredients = 'ingredients-' + tab.url;
        var keyRecipeTitle = 'recipe-title-' + tab.url;
        console.log(keyIngredients);
        console.log(keyRecipeTitle);
        chrome.storage.local.get(keyIngredients, function(data) {
            var ingredients = data[keyIngredients];
            console.log("ingredients: " + ingredients);
            if (ingredients) {
                // Ingredients already loaded
                spinner.stop();
                populatePopupWithIngredients(ingredients);
                updateRecipeTitle(keyRecipeTitle);
            } else {
                // Need to wait
                chrome.storage.onChanged.addListener(function(changes, areaName) {
                    if (changes[keyIngredients] !== undefined) {
                        spinner.stop();
                        populatePopupWithIngredients(changes[keyIngredients].newValue);
                        updateRecipeTitle(keyRecipeTitle);
                    }
                    // console.log(changes);
                })
            }

        })

    });

    var checkPageButton = document.getElementById('checkPage');
    checkPageButton.addEventListener('click', function () {

        var urlsToCall = [];
        $('.product').each(function (idx, product) {
            var checkbox = $(product).find(':checkbox');
            if ($(checkbox).is(':checked')) {
                var selected_option = $(product).find('select.produkto-dropdown option:selected');
                var url = $(selected_option).val();
                urlsToCall.push(url);
            }
        });
        console.log(urlsToCall);

        for (i in urlsToCall) {
            var fullUrl = "";
            var selected1 = false;
            console.log("selected1");
            console.log(i);
            if (parseInt(i) + 1 == urlsToCall.length) {
                selected1 = true;
            }
            if (selected1) {
                fullUrl = "https://www.barbora.lt" + urlsToCall[i] + "?receptuMeistrasPridetiProdukta=1&receptuMeistrasAktyvinti=1";
            }
            else {
                fullUrl = "https://www.barbora.lt" + urlsToCall[i] + "?receptuMeistrasPridetiProdukta=1";
            }
            //var selected1 = (i + 1 == urlsToCall.length);
            
            if (selected1) {
                setTimeout(function () {
                    chrome.tabs.create({ url: fullUrl, selected: selected1 }, function (tab) {
                        //chrome.tabs.update(tab.id, { selected: true });
                    });
                }, 3000);
            }
            else
            {
                chrome.tabs.create({ url: fullUrl, selected: selected1 }, function (tab) {
                    //chrome.tabs.update(tab.id, { selected: true });
                });
            }
        }

        //chrome.tabs.getSelected(null, function (tab) {
        //    d = document;

        //    var f = d.createElement('form');
        //    f.action = 'http://gtmetrix.com/analyze.html?bm';
        //    f.method = 'post';
        //    var i = d.createElement('input');
        //    i.type = 'hidden';
        //    i.name = 'url';
        //    i.value = tab.url;
        //    f.appendChild(i);
        //    d.body.appendChild(f);
        //    f.submit();
        //});
    }, false);

    chrome.browserAction.getBadgeText({}, function (badgeText) {
        if (badgeText) {

        }
    });    
}

function recipeNotFound() {
    $('.recipe-found').detach();
}

document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({active: true}, function(tab) {
        tab = tab[0];
        var keyRecipeFound = 'recipe-found-' + tab.url;
        var keyIngredients = 'ingredients-' + tab.url;

        chrome.storage.local.get(keyRecipeFound, function(data) {
            var valRecipeFound = data[keyRecipeFound];
            console.log(data);
            if (valRecipeFound === true) {
                console.log("document.addEventListener('DOMContentLoaded). Receptas BUVO rastas localStorage. ");
                console.log(valRecipeFound);
                recipeFound();
            } else {
                console.log("document.addEventListener('DOMContentLoaded) Receptas NEBUVO rastas localStorage. Ne recepto puslapis, arba laukiama rezultato!");
                recipeNotFound();
            }
        })

        // console.log(keyRecipeFound);
        // console.log(keyIngredients);
    })

});
