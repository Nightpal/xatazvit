/*jshint node: true */
/*jshint -W117 */
"use strict";

function prepareSum(o) {
    if (o === 0) {
        return 0;
    }
    if (!o) {
        return '';
    }
    return parseInt(o, 10).formatMoney(0, '', ' ');
}
Array.prototype.arrayObjectIndexOf = function arrayObjectIndexOf(property, value) {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i][property] === value) return i;
    }
    return -1;
};

Number.prototype.formatMoney = function (decimals, decimal_sep, thousands_sep) {
    var n = this,
        c = isNaN(decimals) ? 2 : Math.abs(decimals),
        d = decimal_sep || '.',
        t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        sign = (n < 0) ? '-' : '',
        i = parseInt(n = Math.abs(n).toFixed(c), 10).toString(),
        j = ((i.length) > 3) ? i.length % 3 : 0;
    return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};

function parseDate(input, format) {
    format = format || 'yyyy-mm-dd';
    var parts = input.match(/(\d+)/g),
        i = 0,
        fmt = {};
    format.replace(/(yyyy|dd|mm)/g, function (part) {
        fmt[part] = i++;
    });

    return new Date(parts[fmt.yyyy], parts[fmt.mm] - 1, parts[fmt.dd]);
}


function dateTimeTemplate(date) {
    if (!date) {
        return '';
    }
    var d = date.split(' ')[0].split('-');
    return d[2] + "." + d[1] + "." + d[0] + " " + date.split(' ')[1];
}

function dateTemplate(date) {
    if (!date) {
        return '';
    }
    var d = date.split(' ')[0].split('-');
    return d[2] + "." + d[1] + "." + d[0];
}



/*----------------data loading logic-----------------------------------------------------------*/

function reloadModels(arr) {
    var i = 0;
    for (; i < arr.length; i++) {
        arr[i].clearAll();
        arr[i].load(arr[i].config.url);
    }

}

function drawEmpty(grid) { /*shows "empty" overlay if no data was loaded*/
    if (!grid) {
        grid = $$('main_content').getChildViews()[0].getChildViews()[1];
    }
    if (grid.hideOverlay) {
        grid.hideOverlay();
        if (!grid.count()) {
            grid.showOverlay("Пусто");
        }
    }
}

function drawLoading(grid) { /*shows loading overlay and hides it after data loading*/
    if (grid) {
        grid.hideOverlay();
        grid.showOverlay("<div class='app-loading-view'>&nbsp;&nbsp;Загрузка...</div>");
    }
}

function extractUniq(grid, id_name, value_name, a1_name, a1_val) {
    var i, e, c, d = [];
    for (i in grid.data.pull) {
        e = grid.data.pull[i];
        c = {
            id: e[id_name],
            value: e[value_name]
        };
        if (a1_name) {
            if (a1_val) {
                c[a1_name] = e[a1_val];
            } else {
                c[a1_name] = e[a1_name];
            }
        }

        if (d.arrayObjectIndexOf('id', e[id_name]) == -1) {
            d.push(c);
        }
    }
    return d;
}
/*----------------./data loading logic-----------------------------------------------------------*/




/*----------------filters comparators------------------------------------------------------------*/
function notSet(val) { //helper
    return !val || val === null;
}

function containsSplitCompare(filter, value) { /*for complex multiselect filters - looks for "filter keyword" in  multiselect [val1, val2, val4]*/
    return notSet(filter) || (filter.toLowerCase().split(',').indexOf(value.toLowerCase()) != -1);
}

function sumCompare(filter, value) {
    if (!filter) return true;
    var prefix = filter.substr(0, 1),
        pref_arr = ['>', '<', '='],
        isrange = filter.indexOf('-') != -1,
        f1,
        f2;
    if (isrange) {
        f1 = filter.split('-')[0].trim() || 0;
        f2 = filter.split('-')[1].trim() || 1000000000;

        return parseInt(value) >= parseInt(f1) && parseInt(value) <= f2;
    }
    if (pref_arr.indexOf(prefix) != -1) {
        switch (prefix) {
            case '<':
                return parseInt(filter.replace(prefix, '').trim()) >= parseInt(value);
            case '>':
                return parseInt(filter.replace(prefix, '').trim()) <= parseInt(value);
            case '=':
                return parseInt(filter.replace(prefix, '').trim()) === parseInt(value);
        }
    }
    return notSet(filter) || (value.toLowerCase().indexOf(filter.toLowerCase()) != -1);

}

function containsCompare(filter, value) {
    return notSet(filter) || (value.toLowerCase().indexOf(filter.toLowerCase()) != -1);
}

function equalCompare(filter, value) {
    return notSet(filter) || (value.toLowerCase() == filter.toLowerCase());
}

function rangeCompare(filter, value) {
    return notSet(filter) || (parseInt(filter[0]) * 250000 <= parseInt(value) && parseInt(value) <= parseInt(filter[1]) * 250000);

}

function afterDateCompare(filter, value) {
    if (notSet(value)) {
        return false;
    }
    return notSet(filter) || parseDate(value) >= filter;
}

function beforeDateCompare(filter, value) {
    if (notSet(value)) {
        return false;
    }
    return notSet(filter) || parseDate(value) <= filter;
}

function equalDateCompare(filter, value) {
    if (notSet(value)) {
        return false;
    }
    return notSet(filter) || parseDate(value).getTime() - filter.getTime() === 0;
}
/*----------------./filters comparators-----------------------------------------------------------*/




/*----------------filtering process helpers-----------------------------------------------------------*/
function getAllFilterValues(grid, custom_filters_ids) {

    var custom_filters = custom_filters_ids.map(function (obj) {
            return $$(obj);
        }),
        header_filters_values = (function () {
            var r = [],
                i;
            for (i in grid._filter_elements) {
                r[i] = (extractValue(grid.getFilter(i)));
            }
            return r;
        }()),
        custom_filers_values = (function () {
            var r = [],
                i;
            for (i = 0; i < custom_filters.length; i++) {
                r[custom_filters[i]._settings.id] = (extractValue(custom_filters[i]));
            }
            return r;
        }()),
        all_filter_values = mergeArrays(header_filters_values, custom_filers_values);

    return all_filter_values;
}

function defineValue(obj, value) {
    value = value || '';
    if (obj.value) {
        obj.value = value;
    } else if (obj.setValue) {
        obj.setValue(value);
    }
}

function extractValue(obj) {
    if (obj.value) {
        return obj.value;
    } else if (obj.setValue) {
        return obj.getValue();
    }
}

function clearFilters(grid, custom) {
    var i, val;
    for (i = 0; i < custom.length; i++) {
        val = '';
        if (custom[i].config.id == 'rangesum') {
            val = [0, 100];
        }
        defineValue(custom[i], val);

    }
    for (i in grid._filter_elements) {
        defineValue(grid.getFilter(i));
    }
}

function mergeArrays(array1, array2) {
    var i;
    for (i in array1) {
        array2[i] = array1[i];
    }
    return array2;
}

function checkAllEmptyFilters(arr) {
    var i;
    for (i in arr) {
        if (arr[i] && arr[i] !== null) {
            return false;
        }
    }
    return true;
}

function multiselectTree(tree, combo) {
    var filters = extractValue(combo);
    tree.unselectAll();
    if (filters) {
        tree.select(filters.split(','));
    }

}


function resetDefults(form, i) {
    form.elements.isaccepted.setValue(i);
    form.elements.date.setValue(new Date());
    form.elements.currency.setValue('₴');

    for (var c in form.elements) {
        form.markInvalid(form.elements[c].config.name, false);
    }


    //  form.setDirty();


}
