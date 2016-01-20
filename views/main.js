/*global define, webix, alert, console, location, $$*/
/*look "../assets/.js" for globals*/
/*jshint -W030 */
/*main masterfile*/
define(["app"], function (app) {
    "use strict";
    var toolbar, ui, isfirsttime = true,
        menu_data = [
            {
                id: "bidblock",
                icon: "plug",
                value: "підключення2",
                data: [{
                        value: "+Оформити",
                        id: "newbid",
                        icon: "check-square-o"
                    },
                    {
                        value: "Нові",
                        id: "new_bids",
                        icon: "user-plus"
                    }, {
                        value: "Із сайту",
                        id: "fromsite_bids",
                        icon: "home"
                    }, {
                        value: "Виконані",
                        id: "done_bids",
                        icon: "thumbs-up"
                    }, {
                        value: "Перепідключені",
                        id: "reconnected_bids",
                        icon: "reply-all"
                    }, {
                        value: "Відмова",
                        id: "rejected_bids",
                        icon: "user-times"
                    }, {
                        value: "Опитування",
                        id: "votes",
                        icon: "phone",
                    }, {
                        value: "Опитані",
                        id: "voted",
                        icon: "phone-square"
                    }
                ]
            },
            {
                id: "supblock",
                icon: "ambulance",
                value: "підтримка",
                data: [{
                        value: "+Оформити",
                        id: "newsup",
                        icon: "check-square-o"
                    },
                    {
                        value: "Не вирішені",
                        id: "new_sups",
                        icon: "thumbs-o-down"
                    }, {
                        value: "Вирішені",
                        id: "done_sups",
                        icon: "thumbs-o-up"
                    }, {
                        value: "Відмова",
                        id: "rejected_sups",
                        icon: "user-times"
                    }
                ]
            },
            {
                id: "adminblock",
                icon: "gear",
                value: "администрирование",
                data: [{
                        value: "Користувачі",
                        id: "users",
                        icon: "user"
                    }, {
                        value: "Ролі",
                        id: "roles",
                        icon: "users"
                    }, {
                        value: "Статистика",
                        id: "stat",
                        icon: "bar-chart"
                    }, {
                        value: "Тарифи",
                        id: "tariffs",
                        icon: "money"
                    }, {
                        value: "Адреси",
                        id: "addresses",
                        icon: "home"
                    }
                ]
            }
	   ];

    toolbar = {
        view: "toolbar",
        borderless: true,
        cols: [{
            view: "button",
            type: "iconButton",
            icon: "gears",
            label: app.config.name + " <span class='app-title-description'>" + app.config.description + " <sup>[WEB]</sup></span>",
            width: 400,
            css: "app-logo",
            click: function () {
                $$("mainmenu").toggle();
            }
        }, {
            view: "template",
            id: "currency",
            template: "<span class='webix_icon fa-plug'></span> <red>#criticalbid#</red> | <green>#newbid#</green> &nbsp; <span class='webix_icon fa-ambulance'></span> <red>#criticalsup#</red> | <green>#newsup#</green>&nbsp;&nbsp;",
            css: 'app-transp-panel',
            borderless: true,
            align: 'right',
            data: {
                newbid: 142,
                criticalbid: 6,
                newsup: 98,
                criticalsup: 3
            }
        }, {
            view: "template",
            id: "currentUser",
            template: "<span class='webix_icon fa-user'></span> Андрей",
            width: 150,
            borderless: true
        }, {
            view: "button",
            type: "icon",
            icon: "power-off",
            width: 50,
            align: 'left',
            click: function () {
                // alert('exit');
            }
        }]
    };



    ui = {
        rows: [
            toolbar, {
                cols: [{
                    view: "sidebar",
                    id: "mainmenu",
                    data: menu_data,
                    css: "app-left-menu",
                    width: 240,
                    on: {
                        onAfterSelect: function (id) {
                            app.show('/main/' + id);
                            //$$("currency").define("url", $$("currency").config.url);
                        }
                    }
                }, {
                    type: "clean",
                    id: 'main_content',
                    css: "app-right-panel",
                    borderless: true,
                    padding: 4,
                    rows: [{
                        $subview: true
                    }]
                }]
            }
        ]
    };
    return {
        $ui: ui,
        $oninit: function (view, $scope) {
            $$('mainmenu').openAll();
        },
        $onurlchange: function (config, url, $scope) {
            isfirsttime && $$("mainmenu").select(url[0].page);
            isfirsttime = false;
        }
    };
});
