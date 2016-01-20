/*global define, webix*/
/*
	App configuration
*/
define([
	"libs/webix-jet/core"
], function (core) {
    "use strict";
    //configuration
    if (!webix.env.touch && webix.ui.scrollSize) {
        webix.CustomScroll.init();
    }

    var app = core.create({
        id: "Smart&Simple OperatorWebAssistant",
        name: "Smart&Simple",
        description: "Operator Assistant",
        version: "0.1.0",
        debug: true,
        start: "/main/new_bids"
    });	
	
    webix.i18n.setLocale("ru-RU");
    return app;
});
