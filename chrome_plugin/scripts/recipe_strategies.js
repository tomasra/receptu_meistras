"use strict";
const TukstReceptuStrategy = function () {
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

const GaspadineStrategy = function () {
    this.extractRecipeData = function () {
        var receptu_langas = $("ul.ingredients > li");
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
        return jsonObjektas;
    }
};

const BeatosVirtuveRecipesStrategy = function () {
    this.extractRecipeData = function () {
        var receptu_langas = $('.ingridientai > .ingridentu_informacija > ul > li');
        var jsonObjektas = this._getJsonFromRecipyTable(receptu_langas, window.location.href);
        return jsonObjektas
    };
    this.getName = function () {
        return "BeatosVirtuve";
    };

    this._getJsonFromRecipyTable = function (receptu_langas, url) {
        var jsonObjektas = {};
        jsonObjektas.recipeTitle = $('.iraso_antraste > h2').text()
        jsonObjektas.url = url;
        jsonObjektas.ingredients = [];

        $(receptu_langas).each(function (i, item) {
            var ingredientas = {};
            ingredientas.ingredient = item.textContent;
            jsonObjektas.ingredients.push(ingredientas);
        });
        return jsonObjektas;
    }
};

const BeatosVirtuveVideosStrategy = function () {
    this.extractRecipeData = function () {
        var receptu_langas = $('.iraso_informacija2').text().trim().split(/\.\s|\,\s/);
        var jsonObjektas = this._getJsonFromRecipyTable(receptu_langas, window.location.href);
        return jsonObjektas
    };
    this.getName = function () {
        return "BeatosVirtuve";
    };

    this._getJsonFromRecipyTable = function (receptu_langas, url) {
        var jsonObjektas = {};
        jsonObjektas.recipeTitle = document.title.split(' - ')[0];
        jsonObjektas.url = url;
        jsonObjektas.ingredients = [];

        const regex = /.*[r|R]eikės:\s(.+)/gu;
        $(receptu_langas).each(function (i, item) {
            var ingredientas = {};
            const parsedItem = item.replace(regex, '$1');
            ingredientas.ingredient = parsedItem;
            jsonObjektas.ingredients.push(ingredientas);
        });
        return jsonObjektas;
    }
};

const RECEPTU_PSL_URL_PREFIX_STRATEGIES = [
    {
        url: "www.delfi.lt/1000receptu/receptai/",
        strategy: TukstReceptuStrategy
    },
    {
        url: "www.gaspadine.lt/receptas/",
        strategy: GaspadineStrategy
    },
    {
        url: "www.receptai.lt/receptas/",
        strategy: GaspadineStrategy
    },
    {
        url: "www.beatosvirtuve.lt/recipes/",
        strategy: BeatosVirtuveRecipesStrategy
    },
    {
        url: "www.beatosvirtuve.lt/videos/",
        strategy: BeatosVirtuveVideosStrategy
    },
];
var RecipeSiteExtractor = function () {
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


const GetRecipeExtractor = function (fullUrl) {
    const urlWithoutHttp = fullUrl.replace(/(http|https):\/\/(\S+)/g, `\$2`);

    const recipeSiteExtractor = new RecipeSiteExtractor();
    let yraReceptuPuslapis = false;
    let i = 0;
    while (yraReceptuPuslapis === false && i < RECEPTU_PSL_URL_PREFIX_STRATEGIES.length) {
        if (urlWithoutHttp.substring(0, RECEPTU_PSL_URL_PREFIX_STRATEGIES[i].url.length) === RECEPTU_PSL_URL_PREFIX_STRATEGIES[i].url) {
          let recipeUrlPart = urlWithoutHttp.substring(RECEPTU_PSL_URL_PREFIX_STRATEGIES[i].url.length);
          if (recipeUrlPart.length > 0){
            yraReceptuPuslapis = true;
            recipeSiteExtractor.setStrategy(RECEPTU_PSL_URL_PREFIX_STRATEGIES[i].strategy);
            return recipeSiteExtractor;
          }
            return null;
        }
        i++;
    }
    return null;
}
