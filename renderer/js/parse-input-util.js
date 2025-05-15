// e.g. calculates seconds to 15:45 and 
// 'x seconds' where x is the seconds to 15:45
function calculate_seconds_until_hhmm(hhmm) {

    // e.g. hhmm = '15:45' -> hh = 15, mm = 45 
    hh = parseInt( hhmm.slice(0, 2) );
    mm = parseInt( hhmm.slice(3, 5) );

    if( hh < 0 || hh > 24 || mm < 0 || mm > 59)
        return 'Invalid hh:mm format';

    const now = new Date();

    const hour_now    = now.getHours();
    const minute_now  = now.getMinutes();
    const seconds_now = now.getSeconds();

    // difference between hhmm and now
    // we need to multiply hour difference by 3600 and minute difference by 60
    // since one hour is 3600 seconds and one minute is 60 seconds
    let difference = 3600 * (hh - hour_now)  + 60 * (mm - minute_now) + (0 - seconds_now);

    if( difference < 0)    
        difference += 86400;

    return difference + ' seconds ';
}


function is_leap_year(year) {

    let is_leap_year = false;
    
    if( year % 4 == 0 )
        is_leap_year = true;

    if( year % 100 == 0 )
        is_leap_year = false;

    if( year % 400 == 0)
        is_leap_year = true;

    return is_leap_year;

}

function get_next_leap_year() {

    const now = new Date();

    let year = now.getFullYear();

    let is_leap_year = false;

    while( !is_leap_year ) {

        if( year % 4 == 0 )
            is_leap_year = true;

        if( year % 100 == 0)
            is_leap_year = false;

        if( year % 400 == 0 )
            is_leap_year = true;

        if( is_leap_year )
            break;

        year++;
    }

    return year;
}


function combine_sign_series(plus_minus_serie) {

    // we only care about minus count since 
    // it is the only thing that change the 
    // total sign
    let minus_count = 0;

    for( const sign of plus_minus_serie ) {

        if( sign == '-' )
            minus_count++;
    }

    return (minus_count % 2) ? '-' : '+';
}

function check_if_date_is_valid(year, month, day) {

    if( Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day) )
        return false;

    if( day < 1 )
        return false;
    if( month > 11 )
        return false;

    if( is_leap_year(year) && month == 1 && day == 29) // leap day
        return true;

    if( day <= days_in_month[month] )
        return true;

    return false;
}

// months are 0 indexed, so January = 1, February = 2, ...
// day of the month are 1 indexed
// returns x + ' seconds' where x is amount of
// seconds to the date year-month-date
function get_seconds_to_date(year, month, day) {
   
    if( !check_if_date_is_valid(year, month, day ) )
        return 'invalid date';
    
    const now = new Date();

    const date = new Date();

    // we want this year month and day at 00:00:00
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    date.setFullYear(year);
    date.setMonth(month);
    date.setDate(day);

    const ms_difference     = date - now;
    const second_difference = ceil(ms_difference / 1000);

    const time_zone_hour_offset = (date.getTimezoneOffset() - now.getTimezoneOffset()) / 60;

    return second_difference;// - time_zone_hour_offset * 3600;
}

// identifies all strings on form year-month-day
// year-month-day
// year.month.day
// year/month/day
// e.g. 2025.05.03 or 2025.5.3
function get_all_date_sub_strings(input_string) {
    
    // separation works with .-/
    const dot_regex   = new RegExp('\\d+.\\d{1,2}.\\d{1,2}', 'g');
    const dash_regex  = new RegExp('\\d+-\\d{1,2}-\\d{1,2}', 'g');
    const slash_regex = new RegExp('\\d+/\\d{1,2}/\\d{1,2}', 'g');

    let matches = [];
    
    matches = matches.concat([...input_string.matchAll(dot_regex)]);
    matches = matches.concat([...input_string.matchAll(dash_regex)]);
    matches = matches.concat([...input_string.matchAll(slash_regex)]);

    for( let k = 0; k < matches.length; k++ )
        matches[k] = matches[k][0];

    // bug matches contain duplicates
    // this fixes it
    return [...new Set(matches)];
}

// a string_date is one string with year month and day
function check_if_string_date_is_valid(string_date) {

    let separator = '/';

    if( string_date.includes('.') )
        separator = '.';

    else if( string_date.includes('-') )
        separator = '-';

    let [year, month, day] = string_date.split(separator);

    // month minus one because we 0 index months but input is 1 indexed
    [year, month, day] = [parseInt(year), parseInt(month) - 1, parseInt(day)];

    return check_if_date_is_valid(year, month, day);
}

function string_date_to_seconds(string_date) {

    if( !check_if_string_date_is_valid(string_date) )
        return 'invalid string date';

    let separator = '/';

    if( string_date.includes('.') )
        separator = '.';

    else if( string_date.includes('-') )
        separator = '-';

    let [year, month, day] = string_date.split(separator);
    [year, month, day]     = [parseInt(year), parseInt(month) - 1, parseInt(day)];

    return get_seconds_to_date(year, month, day) + ' seconds';
}

// takes integer 0-6
function get_seconds_to_week_day(weeK_day) {

    const now           = new Date();
    const this_week_day = now.getDay();

    const date = new Date();

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    let days_to_week_day = weeK_day - this_week_day;
    
    if( days_to_week_day < 1)
        days_to_week_day += 7;

    //print( days_to_week_day);

    date.setDate(date.getDate() + days_to_week_day );

    return floor((date - now) / 1000);
}

// inputs that do not belong to any other category
function misc(input_string) {

    input_string = input_string.replaceAll('tomorrow', '00:00');
    input_string = input_string.replaceAll('fortnight', '14days');
    input_string = input_string.replaceAll('noon', '12:00');
    input_string = input_string.replaceAll('midnight', '00:00');

    return input_string;
}

// thanks to 
// Saranga Jayaruwan
// https://stackoverflow.com/questions/1779013/check-if-string-contains-only-digits
function is_a_number_string(string){

    return Number.isInteger(parseInt(string));
}

