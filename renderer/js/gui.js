

/*
    Handles Everything that deals with converting seconds to proper form and displayng it
*/

// assums that integer is positive
function get_quotient_and_remainder(integer, divisor) {

    const quotient  = floor(integer / divisor);
    const remainder = integer % divisor;

    return [quotient, remainder];
}

function seconds_to_standard_format(seconds) {

    [number_of_years, seconds_left]   = get_quotient_and_remainder(seconds, year);

    //   [number_of_weeks, seconds_left]   = get_quotient_and_remainder(seconds_left, week);

    [number_of_days, seconds_left]    = get_quotient_and_remainder(seconds_left, day);

    [number_of_hours, seconds_left]   = get_quotient_and_remainder(seconds_left, hour);

    [number_of_minutes, seconds_left] = get_quotient_and_remainder(seconds_left, minute);

    [number_of_seconds, seconds_left] = get_quotient_and_remainder(seconds_left, second);
    
    let standard_format = '';

    if(number_of_years == 1)
        standard_format += number_of_years + ' year ';

    else if(number_of_years > 1)
        standard_format += number_of_years + ' years ';

    if(number_of_days == 1)
        standard_format += number_of_days + ' day ';

    else if(number_of_days > 1)
        standard_format += number_of_days + ' days ';

    if(number_of_hours == 1)
        standard_format += number_of_hours + ' hour ';

    else if(number_of_hours > 1)
        standard_format += number_of_hours + ' hours ';

    if(number_of_minutes == 1)
        standard_format += number_of_minutes + ' minute ';

    else if(number_of_minutes > 1)
        standard_format += number_of_minutes + ' minutes ';

    if(number_of_seconds == 1)
        standard_format += number_of_seconds + ' second ';

    else if(number_of_seconds > 1)
        standard_format += number_of_seconds + ' seconds ';

    return standard_format;
}

function get_seconds_left() {

    if( !unix_timer_alarm )
        return;

    return ceil( ( unix_timer_alarm - Date.now() ) / 1000 ); 
}

function display_count_down(seconds_left) {

    if( seconds_left  ) {
        
        let text_display = seconds_to_standard_format(seconds_left);
        text_display     = remove_surplus_spaces(text_display);

        const text_size = find_max_font_size_that_fits(text_display, 0.95 * width, 0.95 * height);

        
        count_down_text.textContent = text_display;
    }
    
    else if( program_status == 'expired' ) {

        count_down_text.textContent = 'Alarm Expired!';
    }
}

function calculate_at_what_time_alarm_will_go_off() {

    const seconds = get_seconds_left();
    const date = new Date();

    const now_time_zone = date.getTimezoneOffset();
    date.setSeconds(date.getSeconds() + seconds);
    date_time_zone = date.getTimezoneOffset();

    const hour_time_zone_offset = (date_time_zone - now_time_zone) / 60;

    date.setHours(date.getHours() - hour_time_zone_offset);

    return date;
}

function display_when_alarm_will_go_off(date) {

    if( program_status != 'count down' )
        return;

    const dsl = date.toString().split(' '); // date string list

    let day = dsl[2];

    if( day[0] == '0' )
        day = day.slice(1, );
                    
    const date_string = dsl[0] + ' '+ dsl[4] + ' ' + day + ' ' + dsl[1] + ' ' + dsl[3] + ' ' + dsl[5];
    
    count_down_finished_at_span.textContent = date_string;
}

function window_resized() {

    resizeCanvas(windowWidth, windowHeight);
}