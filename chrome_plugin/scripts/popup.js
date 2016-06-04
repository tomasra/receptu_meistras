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
        for (var i in items) {
            var item = items[i];
            console.log(item);
            var dropDownHtml = getDropdownHtml(item.products);
            var produktoHtml = getProduktoHtml(item, i, dropDownHtml);
            console.log(produktoHtml);
            produktuHtml = produktuHtml.concat(produktoHtml);
        }
        $resultsForm.html(produktuHtml);
        // Listen to selection changes
        $('select.produkto-dropdown').each(function(idx, select) {
            $(select).change(function() {
                updateTotalPrice();
            })
        });
        // Listen to checkboxes too
        $resultsForm.find(':checkbox').each(function(idx, checkbox) {
            $(checkbox).change(function() {
                updateTotalPrice();
            })
        })
        updateTotalPrice();
    }
    else {
        console.error("ingredientuSarasas tuscias!");
        alert("ingredientuSarasas tuscias!");
    }

    //$resultsForm.html(produktoHtml);
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

function getProduktoHtml(item, i, dropDownHtml){
    var productTemplate = 
 '<div class="product"  id="produktas{{Nr}}"> \
<div class="checkbox-wrapper"> \
<input type="checkbox" class="producto-checkbox" id="checkbox{{Nr}}" checked /> \
<label for="checkbox{{Nr}}"></label> \
</div> \
<div class="productName inline"> \
{{produktoPavadinimas}} \
</div> \
<div class="quantity inline"> \
{{produktoKiekis}} \
</div> \
<select class="produkto-dropdown" id="produkto{{Nr}}dropdown"> \
{{produktoDropdownHtml}} \
</select> \
<a class="button-buy" id="buttonBuy{{Nr}}" href="#" data-nr="{{Nr}}" target="_blank"></a> \
</div>';

    var ingredientName = item.ingredient;
    var ingredientKiekis = item.amount;
    var produktoHtml = productTemplate.replace(/{{Nr}}/g, i);
    produktoHtml = produktoHtml.replace(/{{produktoPavadinimas}}/g, ingredientName);
    produktoHtml = produktoHtml.replace(/{{produktoPavadinimas}}/g, ingredientName);
    produktoHtml = produktoHtml.replace(/{{produktoKiekis}}/g, ingredientKiekis);
    produktoHtml = produktoHtml.replace(/{{produktoDropdownHtml}}/g, dropDownHtml);
    return produktoHtml;
}

function getDropdownHtml(products){
    var selectTemplate = '<option value="{{optionUrl}}" data-price="{{optionPrice}}">{{optionPrice}}€ {{optionText}}</option>';
    var selectHtml = "";
    for (var j in products) {
        var product = products[j];
        var productPrice = product.price;
        var productName = product.name;
        var productUrl = product.url;
        var workingSelectTemplate = selectTemplate.replace(/{{optionPrice}}/g, productPrice);
        workingSelectTemplate = workingSelectTemplate.replace(/{{optionUrl}}/g, productUrl);
        workingSelectTemplate = workingSelectTemplate.replace(/{{optionText}}/g, productName);
        selectHtml += workingSelectTemplate;
    }
    return selectHtml;
}

function updateRecipeTitle() {
    chrome.storage.local.get("recipeTitle", function(obj) {
        $('h1.title-pavadinimas').text(obj.recipeTitle);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("pradedam loadint..");

    $("#resultsForm").on("click", "a.button-buy", function () {
        var nr = $(this).data("nr");
        var dropDownId = "#produkto" + nr + "dropdown";
        var url = $(dropDownId).val();
        var fullUrl = "https://www.barbora.lt" + url;
        window.open(fullUrl, '_blank');
        return false;
    });

    var spinner = new Spinner({
        scale: 2.0,
    }).spin();
    $('.section').append(spinner.el);

    chrome.storage.local.get("ingredientuSarasas", function(items) {
        // console.log(items);
        if (items.ingredientuSarasas !== undefined) {
            spinner.stop();
            populatePopupWithIngredients(items.ingredientuSarasas);
            updateRecipeTitle();
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
                    updateRecipeTitle();
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
