/*jshint -W117 */
/*look my.js for globals*/
/*jshint node: true */
'use strict';
webix.ui.datafilter.cashColumn = webix.extend({
    refresh: function (master, node, value) {
        var usd = 0,
            uah = 0,
            eur = 0;
        master.eachRow(
            function (row) {
                var sum = parseInt(this.getItem(row).sum, 10),
                    currency = this.getItem(row).currency;
                switch (currency) {
                    case '₴':
                        uah += sum;
                        break;

                    case '$':
                        usd += sum;
                        break;

                    case '€':
                        eur += sum;
                        break;

                    default:
                        break;
                }
            }
        );
        node.firstChild.innerHTML = '<red>₴ ' + prepareSum(uah) + '</red> | <green>$ ' + prepareSum(usd) + '</green> | <blue>€ ' + prepareSum(eur) + '</blue>';
    }
}, webix.ui.datafilter.summColumn);

webix.ui.datafilter.rowsCountColumn = webix.extend({
    refresh: function (master, node, value) {
        var all = Object.keys(master.data.pull).length,
            viewed = master.count();
        node.firstChild.innerHTML = 'Σ: <b>' + prepareSum(viewed) + '</b> из ' + prepareSum(all);
    }
}, webix.ui.datafilter.summColumn);

/*global filters */
function fwayspath(grid) {
    return {
        view: "multicombo",
        id: "wayspath_complex_filter",
        css: "app-complex-combo",
        label: "Направления:",
        labelPosition: "top",
        button: true,
        on: {
            onChange: function () {
                defineValue($$(grid).getFilter('way_id'));
                $$(grid).filterByAll();
            }
        }
    };
}

function fways(data, grid) {
    var tree_id = 'cfgtree';
    return {
        view: "multicombo",
        id: "ways_complex_filter",
        css: "app-complex-combo",
        label: "Направления:",
        labelPosition: "top",
        button: true,
        suggest: {
            data: data,
            body: {
                view: "tree",
                css: "app-multi-tree",
                id: tree_id,
                template: "{common.icon()} {common.folder()} <span>#value#</span>",
                select: 'multiselect'
            }
        },
        on: {
            onChange: function () {
                defineValue($$(grid).getFilter('way_id'));
                var combo = this;
                setTimeout(function () {
                    multiselectTree($$(tree_id), combo);
                }, 10);
                $$(grid).filterByAll();
            },
            onItemClick: function () {
                multiselectTree($$(tree_id), this);
            },
            onTimedKeyPress: function () {
                multiselectTree($$(tree_id), this);
            }
        }
    };
}

function fdates(grid) {
    return {
        cols: [{
            view: "datepicker",
            label: "От:",
            id: "date_from_filter",
            labelAlign: "left",
            labelPosition: "top",
            on: {
                onChange: function () {
                    defineValue($$(grid).getFilter('date'));
                    $$(grid).filterByAll();
                }
            }
        }, {
            view: "datepicker",
            label: "До:",
            id: "date_to_filter",
            labelAlign: "left",
            labelPosition: "top",
            on: {
                onChange: function () {
                    $$("date_from_filter").callEvent("onChange");
                }
            }
        }]
    };

}

function frangesum(grid) {

    return {
        view: "rangeslider",
        id: "rangesum",

        label: "Диапазон сумм:",
        labelAlign: "left",
        labelPosition: "top",

        value: [0, 100],
        title: function (obj) {
            var v = obj.value;
            return (v[0] == v[1] ? v[0] : prepareSum(v[0] * 250000) + " - " + prepareSum(v[1] * 250000));
        },
        on: {
            onChange: function () {
                defineValue($$(grid).getFilter('sum'));
                $$(grid).filterByAll();
            }
        }

    };

}

function waysComplexFilterSuggset(waytree) {
    return {
        data: waytree,
        template: '#value#',
        body: {
            view: "tree",
            css: "app-multi-tree",
            template: "{common.icon()} {common.folder()} <span>#value#</span>",
            select: true
        }
    };
}

function usersComplexFilterSuggset(data) {
    return {
        data: data,
        template: "#value#",
        body: {
            template: "<i class='fa app-fa-user-#role#'></i> <span class='app-user-role-#role#'>#value#</span>"
        }
    };
}

function fsender(grid) {
    return {
        view: "multicombo",
        id: 'senders_complex_filter',
        css: "app-complex-combo",
        label: "Отправители:",
        labelPosition: "top",
        button: true,
        on: {
            onChange: function () {
                defineValue($$(grid).getFilter("sender_id"));
                //console.log(this.getValue());
                $$(grid).filterByAll();
            }
        }
    };

}

function freceiver(grid) {
    return {
        view: "multicombo",
        id: 'receivers_complex_filter',
        css: "app-complex-combo",
        label: "Получатели:",
        labelPosition: "top",
        button: true,
        on: {
            onChange: function () {
                defineValue($$(grid).getFilter("receiver_id"));
                //console.log(this.getValue());
                $$(grid).filterByAll();
            }
        }
    };

}

function fclearfilters(grid, custom_filters) {
    return {
        view: "button",
        type: "htmlbutton",
        image: "assets/img/filterclear.png",
        label: '<div class="image"></div>',
        inputWidth: 30,
        tooltip: 'очистить фильтры',
        width: 30,
        css: "app-cancel-filters",
        click: function () {
            custom_filters = custom_filters.map(function (obj) {
                return $$(obj);
            });
            clearFilters($$(grid), custom_filters);
            $$(grid).filter();
        }
    };

}
