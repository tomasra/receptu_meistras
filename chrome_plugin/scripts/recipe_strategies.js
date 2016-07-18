"use strict";
var TukstReceptuStrategy = function () {
    this.extractRecipeData = function () {
        var receptu_langas = $(".recipe-ingredients table tbody tr");
        var jsonObjektas = this._getJsonFromRecipyTable(receptu_langas, window.location.href);
        return jsonObjektas
    };
    this.getName = function () {
        return "1000receptu";
    };
    
    this._getJsonFromRecipyTable = function (receptu_langas, url) {
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
        return jsonObjektas;
    }

};

var GaspadineStrategy = function () {
    this.extractRecipeData = function () {
        var receptu_langas = $("#ingredients ul.ingredients > li");
        var jsonObjektas = this._getJsonFromRecipyTable(receptu_langas, window.location.href);
        return jsonObjektas
    };
    this.getName = function () {
        return "Gaspadine";
    };
    
    this._getJsonFromRecipyTable = function (receptu_langas, url) {
        var jsonObjektas = {};
        jsonObjektas.recipeTitle = $("div.article.recipe div h1[itemprop='name']").text();
        jsonObjektas.url = url;
        jsonObjektas.ingredients = [];
        
        $(receptu_langas).each(function (i, item) {
            console.log(i);
            console.log(item);
            //Gaspadine turi general name + optional details.
            var ingredientas = {};
            var amount = $(item).find("[itemprop='amount']").html();//irgi gali buti optional
            if (amount) {
                ingredientas.amount = amount;
            }
            ingredientas.ingredient = $(item).find("[itemprop='name']").html();
            var optionalContents = $(item).contents().filter(function () { return this.nodeType === 3; });
            if (optionalContents && optionalContents.length > 0 && optionalContents[0]) {
                var optionalContent = optionalContents[0].textContent.trim();
                if (optionalContent !== ',' && optionalContent.length > 0) {
                    ingredientas.optional_details = optionalContent;
                }
            }
            jsonObjektas.ingredients.push(ingredientas);
        });
        console.log(jsonObjektas);
        return jsonObjektas;
    }
};

var RECEPTU_PSL_URL_PREFIX_STRATEGIES = [
    {
        url: "http://www.delfi.lt/1000receptu/receptai/",
        strategy: TukstReceptuStrategy
    },
    {
        url: "http://www.gaspadine.lt/receptas/",
        strategy: GaspadineStrategy
    }
];

var RecipeSiteExtractor = function () {
    //this._recipeSiteStrategy = {};
};

RecipeSiteExtractor.prototype = {
    setStrategy: function (recipeSiteStrategy) {
        this._recipeSiteStrategy = new recipeSiteStrategy;
    },
    
    getName: function () {
        return this._recipeSiteStrategy.getName();
    },
    
    extractRecipeData: function () {
        return this._recipeSiteStrategy.extractRecipeData();
    }
};


var GetRecipeExtractor = function (fullUrl){
    var recipeSiteExtractor = new RecipeSiteExtractor();
    var yraReceptuPuslapis = false;
    var i = 0;
    while (yraReceptuPuslapis === false && i < RECEPTU_PSL_URL_PREFIX_STRATEGIES.length) {
        console.log(i);
        if (fullUrl.substring(0, RECEPTU_PSL_URL_PREFIX_STRATEGIES[i].url.length) === RECEPTU_PSL_URL_PREFIX_STRATEGIES[i].url) {
            yraReceptuPuslapis = true;
            recipeSiteExtractor.setStrategy(RECEPTU_PSL_URL_PREFIX_STRATEGIES[i].strategy);
            console.log(recipeSiteExtractor.getName());
            return recipeSiteExtractor;
        }
        i++;
    }
    return null;
}