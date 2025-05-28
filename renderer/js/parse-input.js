/**
 * 
 * The main function of this file is the last function
 * 
 * Takes the input as a string and converts it to seconds
 * for example 5min -> 300 
 * 
 * We do this in very small steps and each step will be carefully 
 * explained.
 * 
 * 
 *  TODO very careful todo to explain all this
 */

// replaces all letters with the lower case version

function use_macros(input_string) {

    if( !macros )
        return input_string;

    for( let k = 0; k < macros.length; k ++ ) { 

        const old_input_string = input_string;
    
        for( const macro of macros ) {

            let [macro_word, replace_with] = macro.split('=');

            macro_word   = macro_word.trim();
            replace_with = replace_with.trim(); 


            input_string = input_string.replaceAll(macro_word, replace_with);
        }

        if( old_input_string == input_string )
            break;
    }

    return input_string;
}

function lowercase_all(input_string) {

    return input_string.toLowerCase();
}

function parse_time_of_day_with_am_pm(input_string) {

    const hhmm_regex_am    = new RegExp('[0-9][0-9]:[0-9][0-9][ ]*am', 'g');
    const hhmm_regex_pm    = new RegExp('[0-9][0-9]:[0-9][0-9][ ]*pm', 'g');
    const matches_hhmm_am  = [...input_string.matchAll(hhmm_regex_am)];
    const matches_hhmm_pm  = [...input_string.matchAll(hhmm_regex_pm)];

    const hh_regex_am      = new RegExp('[0-9]+[ ]*am', 'g');
    const hh_regex_pm      = new RegExp('[0-9]+[ ]*pm', 'g');
    const matches_hh_am  = [...input_string.matchAll(hh_regex_am)];
    const matches_hh_pm  = [...input_string.matchAll(hh_regex_pm)];

    for( let match of matches_hhmm_am ) {

        let hhmm_am = match[0];
        let hhmm    = hhmm_am.slice(0, 5);

        let [hh, mm] = hhmm.split(':');

        hh = parseInt(hh);

        if( hh > 12 || hh < 0 )
            continue;


        hh = hh % 12; // am formula, any am is the same as 24 hour clock except when hh = 12 which is 00:mm on a  24 hour clock

        if( hh < 10 )
            hh = '0' + hh;

        input_string = input_string.replaceAll(hhmm_am, hh + ':' + mm);
    }

    for( let match of matches_hhmm_pm ) {

        let hhmm_am = match[0];
        let hhmm    = hhmm_am.slice(0, 5);

        let [hh, mm] = hhmm.split(':');

        hh = parseInt(hh);

        if( hh > 12 || hh < 0 )
            continue;


        if( hh != 12)
            hh += 12; // am formula, any am is the same as 24 hour clock except when hh = 12 which is 00:mm on a  24 hour clock

        if( hh < 10 )
            hh = '0' + hh;

        input_string = input_string.replaceAll(hhmm_am, hh + ':' + mm);
    }

    for( const match of matches_hh_am ) {

        let hhmm_am = match[0];
        let hh      = parseInt(hhmm_am.slice(0, hhmm_am.length - 2));

        if( hh > 12 || hh < 0 )
            continue;

        hh = hh % 12; // am formula, any am is the same as 24 hour clock except when hh = 12 which is 00:mm on a  24 hour clock

        if( hh < 10 )
            hh = '0' + hh;

        input_string = input_string.replaceAll(hhmm_am, hh + ':' + '00');
    }

     for( const match of matches_hh_pm ) {

        let hhmm_pm = match[0];
        let hh      = parseInt(hhmm_pm.slice(0, hhmm_pm.length - 2));

        if( hh > 12 || hh < 0 )
            continue;

        if( hh != 12)
            hh += 12; // am formula, any am is the same as 24 hour clock except when hh = 12 which is 00:mm on a  24 hour clock

        if( hh < 10 )
            hh = '0' + hh;

        input_string = input_string.replaceAll(hhmm_pm, hh + ':' + '00');
    }

    return input_string;
}

// changes every instance of hourhour:minuteminute (e.g. 15:45)
// 'x + seconds' where x is the amount of seconds from now to 15:45
function parse_time_of_day(input_string) {
    
    // looks for all strings of format digitdigit:digitdigit e.g. 15:25
    const hhmm_regex    = new RegExp('[0-9][0-9]:[0-9][0-9]', 'g');
    // all hhmm found as a strin in a list e.g. ['00:15', '15:25']
    const matches = [...input_string.matchAll(hhmm_regex)];

    // take all hhmm in input_string and replace them 
    // with x + ' seconds' where x is seconds to hhmm
    for( const match of matches ) {
        
        const hhmm = match[0];
        
        const seconds = calculate_seconds_until_hhmm(hhmm); // from parse-input-util

        input_string = input_string.replaceAll(hhmm, seconds);
    }

    return input_string;
}

function parse_week_days(input_string) {

    input_string = input_string.replaceAll('sunday',    get_seconds_to_week_day(0) + ' seconds' );
    input_string = input_string.replaceAll('monday',    get_seconds_to_week_day(1) + ' seconds' );
    input_string = input_string.replaceAll('tuesday',   get_seconds_to_week_day(2) + ' seconds' );
    input_string = input_string.replaceAll('wednesday', get_seconds_to_week_day(3) + ' seconds' );
    input_string = input_string.replaceAll('thursday',  get_seconds_to_week_day(4) + ' seconds' );
    input_string = input_string.replaceAll('friday',    get_seconds_to_week_day(5) + ' seconds' );
    input_string = input_string.replaceAll('saturday',  get_seconds_to_week_day(6) + ' seconds' );

    input_string = input_string.replaceAll('sun', get_seconds_to_week_day(0) + ' seconds' );
    input_string = input_string.replaceAll('mon', get_seconds_to_week_day(1) + ' seconds' );
    input_string = input_string.replaceAll('tue', get_seconds_to_week_day(2) + ' seconds' );
    input_string = input_string.replaceAll('wed', get_seconds_to_week_day(3) + ' seconds' );
    input_string = input_string.replaceAll('thu', get_seconds_to_week_day(4) + ' seconds' );
    input_string = input_string.replaceAll('fri', get_seconds_to_week_day(5) + ' seconds' );
    input_string = input_string.replaceAll('sat', get_seconds_to_week_day(6) + ' seconds' );

    return input_string;
}

// full date means year month day
function parse_full_date(input_string) {

    // these are string dates
    const dates = get_all_date_sub_strings(input_string);

    for( const date of dates ) {

        if( check_if_string_date_is_valid(date) ) {

            const seconds = string_date_to_seconds(date);

            input_string  = input_string.replaceAll( date, seconds);
        }
    }

    return input_string;
}

function add_number_spacing(input_string) {

    const numbers = '0123456789';

    let is_in_number = false;

    let input_string_with_number_spacing = '';

    // when we reach the beginning or end of a number in the string
    // we add a space 
    for( character of input_string ) {

        if (numbers.includes(character) && !is_in_number) {
            
            input_string_with_number_spacing += (' ' + character)
            is_in_number = true;
        }
        
        else if ( !numbers.includes(character) && is_in_number ) {
            
            input_string_with_number_spacing += (' ' + character)
            is_in_number = false;
        }
        
        else
            input_string_with_number_spacing += character 
    }

    input_string_with_number_spacing = remove_surplus_spaces(input_string_with_number_spacing);

    return input_string_with_number_spacing
}


// removes any leading or trailing zeroes and
// replaces any series of spaces to a single space
// for example '   a b   cd ' -> 'a b cd'
function remove_surplus_spaces(input_string) {

    // source geeksforgeeks.org
    // https://www.geeksforgeeks.org/how-to-replace-multiple-spaces-with-single-space-in-javascript/
    
    return input_string.replaceAll(/\s+/g, ' ').trim(); 
}


// signs are + or - so '+10min' -> '+ 10min'
function add_sign_spacing(input_string) {

    input_string = input_string.replaceAll('+', ' + ');
    input_string = input_string.replaceAll('-', ' - ');

    input_string = this.remove_surplus_spaces(input_string);

    return input_string;
}

// take any series of + and - and combine
// them. e.g. --+ -> + since -- -> + and so on
function combine_signs(input_string) {

    // matches any series of +- and a space and then a space at the end
    // this prevents single spaces to be counted
    // for example the space in '5 min'
    // would not count
    // however '5  min' would count
    // but we have removed all surplus spaces
    // so this works 
    const regex = new RegExp('[+-\\s]+\\s', 'g');

    const matches           = [...input_string.matchAll(regex)];
    const plus_minus_series = [];

    for( const match of matches )
        plus_minus_series.push( match[0] )
    
    for( const plus_minus_serie of plus_minus_series ) {

        const combined_sign = combine_sign_series(plus_minus_serie);

        input_string = input_string.replaceAll(plus_minus_series, ' ' + combined_sign + ' ');
    }

    return remove_surplus_spaces(input_string);
}

// converts all strings of only digits to an actual int
function convert_all_numeric_strings_to_int(input_string) {

    const only_digits = new RegExp('[0-9]+', 'g');

    const matches = [...input_string.matchAll(only_digits)];

    const numerics = [];

    for( const match of matches )
        numerics.push( match[0] );

    const input_as_list = input_string.split(' ');
    
    for( let k = 0 ; k < input_as_list.length; k++ ) {

        const string_at_k = input_as_list[k];

        if( is_string_in_list(numerics, string_at_k) )
            input_as_list[k] = parseInt(string_at_k);
    }

    return input_as_list;
}

function convert_months_to_proper_spelling(input_list) {

    input_list = JSON.parse(JSON.stringify(input_list));
    
    for( let k = 0; k < input_list.length; k++ ) { 

        if( proper_spelling_of_months[input_list[k]] )
            input_list[k] = proper_spelling_of_months[input_list[k]];
    }
    
    return input_list;
}

function parse_day_month_and_year(input_list) {

    input_list = JSON.parse(JSON.stringify(input_list));

    for ( let entry = 1; entry < input_list.length; entry++ ) {

        const day   = input_list[entry - 1];
        const month = month_as_index[input_list[entry]];
        const year  = input_list[entry + 1];

        const month_string = input_list[entry];

        const date  = day + ' ' + month_string + ' ' + year; // the string day month
        
        if( !Number.isInteger(day) )
            continue;

        if( !Number.isInteger(month) )
            continue;

        if( !Number.isInteger(year) )
            continue;

        if( !check_if_date_is_valid(year, month, day) ) 
            continue;
        
        const seconds_to_date = get_seconds_to_date(year, month, day);

        let as_string = input_list.join(' ');

        // replace day and month to the appropriate seconds and convert back to list
        as_string  = as_string.replaceAll(date, seconds_to_date + ' seconds');
        input_list = as_string.split(' ');

        input_list = convert_numeric_entries_to_integer(input_list);
    } 

    return input_list;
}

function parse_date_and_month(input_list) {

    input_list = JSON.parse(JSON.stringify(input_list));

    const now = new Date();

    let this_year = now.getFullYear();

    for ( let entry = 1; entry < input_list.length; entry++ ) {

        const day   = input_list[entry - 1];
        const month = month_as_index[input_list[entry]];
        
        const month_string = input_list[entry];

        const date = day + ' ' + month_string;

        if( !Number.isInteger(day) )
            continue;

        if( !Number.isInteger(month) )
            continue;

        let seconds_to_date;

        // handle 29 february
        if( month == 1 && day == 29)
            seconds_to_date = get_seconds_to_date(get_next_leap_year(), month, day);

        // everything else
        else
            seconds_to_date = get_seconds_to_date(this_year, month, day);

        if( seconds_to_date < 0)
            seconds_to_date = get_seconds_to_date(this_year + 1, month, day);

        // convert to string to replace date (mm/dd) with seconds
        // then convert back to list
        let as_string = input_list.join(' ');
        as_string     = as_string.replaceAll(date, seconds_to_date + ' seconds');
        input_list    = as_string.split(' ');
        input_list    = convert_numeric_entries_to_integer(input_list);
    }

    return input_list;
}

function parse_month(input_list) {
    
    const now = new Date();

    let this_year = now.getFullYear();

    for( let entry = 0; entry < input_list.length; entry++ ) {

        const month        = month_as_index[input_list[entry]];

        const month_string = input_list[entry];

        if( !Number.isInteger(month) )
            continue;

        let as_string = input_list.join(' ');

        let seconds_to_date = get_seconds_to_date(this_year, month, 1);

        if( seconds_to_date < 0)
            seconds_to_date = get_seconds_to_date(this_year + 1, month, 1);

        as_string  = as_string.replaceAll(month_string, seconds_to_date + ' seconds');

        input_list = as_string.split(' ');

        input_list = convert_numeric_entries_to_integer(input_list);

    }

    return input_list;
}

function convert_numeric_entries_to_integer(input_list) {

    input_list = JSON.parse(JSON.stringify(input_list));

    for( let k = 0; k < input_list.length; k++ ) {

        if( is_a_number_string(input_list[k]) )
            input_list[k] = parseInt(input_list[k]);
    }

    return input_list;
}

// e.g. ['-', 5, 'min', '+', 10, 'sec'] -> [-5, 'min', 10, 'sec']
function use_signs(input_list) {

    input_list = JSON.parse(JSON.stringify(input_list));

    for( let k = 0; k < input_list.length - 1; k++ ) {

        const first  = input_list[k];
        const second = input_list[k + 1];

        // if we find '+' we just remove it since it does not change anything
        if( first == '+' && Number.isInteger(second) )
            input_list[k] = '';
        
        // if we find a '-' and then an integer
        // we remove the '-' and change the sign on the integer
        if( first == '-' && Number.isInteger(second)) {

            input_list[k] = '';

            input_list[k + 1] *= ( - 1 ); 
        }
    }

    // we replaced the used '+' and '-' with '' so we remove it now
    input_list = remove_element_from_list(input_list, '');

    return input_list;
}

function is_on_simple_form(input_list) {

    if( !input_list )
        return false;

    if( input_list.length % 2 != 0 )
        return false;

    // the even elements has to be integers for it to be valid
    for( let k = 0; k < input_list.length; k++ ) {

        const element = input_list[k];
        
        if( k % 2 == 0 ) {
            
            // if event index and not integer then it is not valid
            if( !Number.isInteger( element ) )
                return false;
        }

        else {

            // if odd index and not proper spelled time unit then it is not valid
            if( !time_unit_to_seconds[element] )
                return false;
        }
    }

    return true;
}

function simple_form_to_seconds(input_list) {

    if( !input_list )
        return;

    if( input_list.length == 0 )
        return;

    let seconds_total = 0;

    for( let k = 0; k < input_list.length; k += 2 ) {

        const first  = input_list[k];
        const second = input_list[k + 1];
        
        seconds_total += (first * time_unit_to_seconds[second]);
    }

    return seconds_total;
}

function convert_time_units_to_proper_spelling(input_list) {

    input_list = JSON.parse(JSON.stringify(input_list));

    for( let k = 0; k < input_list.length; k++ ) {

        const unit = input_list[k];

        if( proper_spelling_of_time_units[ unit ] )
            input_list[k] = proper_spelling_of_time_units[ unit ];
    }

    return input_list;
}

const parser = new function() {

    this.parse_input = function(input_string) {

        input_string = use_macros(input_string);

        input_string = lowercase_all(input_string);
        
        input_string = parse_time_of_day_with_am_pm(input_string);
        input_string = parse_time_of_day(input_string);
        
        input_string = add_number_spacing(input_string);

        input_string = misc(input_string);

        input_string = parse_holiday(input_string);
        input_string = parse_week_days(input_string);
        
        input_string = parse_full_date(input_string);
        //print(input_string, 'full date')
        input_string = add_number_spacing(input_string);
        //print(input_string, 'number spacing')
        input_string = add_sign_spacing(input_string);
        //print(input_string, 'sign spacing')
        input_string = remove_surplus_spaces(input_string);
        //print(input_string, 'surplus')

        input_string = combine_signs(input_string);
        
        //print(input_string, 'combine')
        let input_list;

        input_list = input_string.split(' ');

        input_list = convert_all_numeric_strings_to_int(input_string);
        //print(input_list, 'numerics to int');
        input_list = convert_months_to_proper_spelling(input_list);
        //print(input_list, 'proper spelling');

        input_list = convert_numeric_entries_to_integer(input_list);
        //print(input_list, 'numerics to int');

        input_list = parse_day_month_and_year(input_list);
        //print(input_list, 'parse daty month and year');
        input_list = parse_date_and_month(input_list);
        input_list = parse_month(input_list);
        //input_list = convert_numeric_entries_to_integer(input_list);
        input_list = convert_time_units_to_proper_spelling(input_list);
        //input_list = convert_numeric_entries_to_integer(input_list);

        //print(input_list, 'before use signs');

        input_list = use_signs(input_list);

        //print(input_list, 'after use signs');

        
        if( !is_on_simple_form( input_list) )
            return;
        
        const seconds = simple_form_to_seconds(input_list);

        if( seconds >= 0 )
            return seconds;
    }
}