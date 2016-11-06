"use strict";

/** Runs when barbora.lt window is opened. 
 * Checks if there are parameters in url like reciplayAddProduct 
 * and if yes, runs various actions against the page, like simulate button click.
 * @param {any} object, must have fullUrl property.
 */
function ContextBarbora(options) {
    this.init = function (options) {
        const addProduct = this.getUrlParameter('reciplayAddProduct', options.fullUrl);
        const closeWindow = this.getUrlParameter('reciplayClose', options.fullUrl);
        const focusWindow = this.getUrlParameter('reciplayFocus', options.fullUrl);
        if (addProduct) {
            $(".col-md-6 .b-add-to-cart").click();

        }
        if (closeWindow) {
            setTimeout(function () {
                window.close();
            }, 1000);
        }
        if (focusWindow) {
            setTimeout(function () {
                window.focus();
            }, 200);
        }
    }
    /** Gets value of parameter from url string.
     * @param {string} parameterName
     * @param {string} fullUrl
     */
    this.getUrlParameter = function (parameterName, fullUrl) {
        const sPageURL = decodeURIComponent(fullUrl),
            sURLVariables = sPageURL.split('&');
        for (let i = 0; i < sURLVariables.length; i++) {
            const sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === parameterName) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
        return null;
    }

    this.init(options);
}

new ContextBarbora({ fullUrl: window.location.search.substring(1) });

