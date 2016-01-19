/*jshint nomen: true */
/*look "../assets/.js" for globals*/
/*jshint -W117 */
/*входящие*/
define([
    "models/test"
], function (journal) {
    'use strict';
    var grid_markup;
    grid_markup = {
        view: "datatable",
        dragColumn: true,
        select: 'row',
        autoConfig: true,
        data: journal,
        on: {},
    };
    
    return {
        $ui: grid_markup,
        $ondestroy: function () { /*kill all popups and temporary events here!*/ },
        $oninit: function (view, $scope) {
        
        }
    };
});
