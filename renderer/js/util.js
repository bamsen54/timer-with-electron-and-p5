
const second = 1;
const minute = 60  * second;
const hour   = 60  * minute;
const day    = 24  * hour;
const week   = 7   * day;
const year   = 365 * day;  


const time_unit_to_seconds = {

    'second' : second,
    'minute' : minute,
    'hour'   : hour,
    'day'    : day,
    'week'   : week,
    'year'   : year
};

const proper_spelling_of_time_units = {

    'sec'     : 'second',
    'secs'    : 'second',
    'second'  : 'second',
    'seconds' : 'second',
    
    'min'     : 'minute',
    'mins'    : 'minute',
    'minute'  : 'minute',
    'minutes' : 'minute',

    'hour'    : 'hour',
    'hours'   : 'hour',

    'day'     : 'day',
    'days'    : 'day',

    'week'    : 'week',
    'weeks'   : 'week', 
    
    'year'    : 'year',
    'years'   : 'year',
}

const months = {
    
    'january'   : true,
    'february'  : true,
    'march'     : true,
    'april'     : true,
    'june'      : true,
    'augusti'   : true,
    'september' : true,
    'october'   : true,
    'november'  : true,
    'december'  : true
}

const proper_spelling_of_months = {

    'jan'    : 'january',
    'feb'    : 'february',
    'febuary': 'february',
    'mar'    : 'march',
    'apr'    : 'april',
    'jun'    : 'june',
    'jul'    : 'july',
    'aug'    : 'augusti',
    'sep'    : 'september',
    'oct'    : 'october',
    'nov'    : 'november',
    'dec'    : 'december'
}
const days_in_month_string = {

    // month, number of days
    'january'  :  31, // jan
    'february' :  28, // feb
    'march'    :  31, // .
    'april'    :  30, // .
    'may'      :  31, // .
    'june'     :  30,
    'july'     :  31,
    'august'   :  31,
    'september':  30,
    'october'  : 31,
    'november' : 30,
    'december' : 31, // dec
};

const month_as_index = {

    
    'january'  :  0, // jan
    'february' :  1, // feb
    'march'    :  2, // .
    'april'    :  3, // .
    'may'      :  4, // .
    'june'     :  5,
    'july'     :  6,
    'august'   :  7,
    'september':  8,
    'october'  :  9,
    'november' : 10,
    'december' : 11, // dec
};

const index_to_month_name = {

     0: 'january',
     1: 'february',
     2: 'march',
     3: 'april',
     4: 'may',
     5: 'june',
     6: 'july',
     7: 'august',
     8: 'september',
     9: 'october',
    10: 'november',
    11: 'december'
}

const index_to_month_name_capital = {

    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
   10: 'November',
   11: 'December'
}


const days_in_month = {

    // month, number of days
    0:  31, // jan
    1:  28, // feb
    2:  31, // .
    3:  30, // .
    4:  31, // .
    5:  30,
    6:  31,
    7:  31,
    8:  30,
    9: 31,
    10: 30,
    11: 31, // dec
};

const week_day_short_to_full = {

    'sun' : 0,
    'mon' : 1,
    'tue' : 2,
    'wed' : 3,
    'thu' : 4,
    'fri' : 5,
    'sat' : 6
}

const week_day_to_index = {

    'sunday'    : 0,
    'monday'    : 1,
    'tuesday'   : 2,
    'wednesday' : 3,
    'thursday'  : 4,
    'friday'    : 5,
    'saturday'  : 6
}

function is_string_in_list(list, string) {

    for( const element of list ) {
        
        if( element == string )
            return true;
    }

    return false;
}

function remove_element_from_list(list, remove) {

    const list_without_remove = [];

    for( const e of list ) {

        if( JSON.stringify(e) != JSON.stringify(remove) )
            list_without_remove.push(e);
    }

    return list_without_remove;
}

function textHeight(text, maxWidth) {
    var words = text.split(' ');
    var line = '';
    var h = this._textLeading;

    for (var i = 0; i < words.length; i++) {
        var testLine = line + words[i] + ' ';
        var testWidth = drawingContext.measureText(testLine).width;

        if (testWidth > maxWidth && i > 0) {
            line = words[i] + ' ';
            h += this._textLeading;
        } else {
            line = testLine;
        }
    }

    return h;
}

function find_max_font_size_that_fits(text_display, w, h) {

    let final_text_size = 0;

    const text_max_width  = w;
    

    for( let text_size = 1; text_size < 1000000; text_size++ ) {

        textSize(text_size);

        if( textWidth(text_display) > text_max_width ) {
            
            final_text_size = text_size;
            
            break;
        }

        
    }

    return final_text_size;
}
