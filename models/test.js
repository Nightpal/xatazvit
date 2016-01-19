/*jshint -W117 */
/*look "../assets/.js" for globals*/
/*main masterfile*/
define([], function () {
    "use strict";
    var exchange_collection = new webix.DataCollection({
        name: "exchange_collection",
        url: "http://192.168.1.2:3000/test"        
    });


    return exchange_collection;
});
