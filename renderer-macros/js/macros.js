
let alarm_sound; // wav file as alarm when count down is over


let unix_time_alarm = null;
let timer;
let program_status = 'none';

let alarm_information;
let alarm_info_text = document.getElementById('alarm-info');

let macros = document.getElementById('macros');

const second = 1;
const minute = 60  * second;
const hour   = 60  * minute;
const day    = 24  * hour;
const week   = 7   * day;
const year   = 365 * day;  



 
function preload() {

    alarm_sound = document.getElementById('alarm');

}

function alarm_go_off() {

    program_status = 'expired';
    //console.log('program status changed to expired')


    localStorage.setItem('ongoing-alarm', 'expired');
    
    alarm_sound.muted = false;
    
    alarm_sound.play();
}

// we set an interfval with this function
// this function runs every x seconds
// once the alarm has started
// then this function checks
// if the time is out
// if it is the alarm
// goes off
function timer_run() {

    // ✅ since unix_time_alarm is set
    // to the number when unix will 
    // be unix at start + seconds the 
    // alarm will run, this means that
    // the alarm has expired
    if( Date.now() >= unix_time_alarm && unix_time_alarm ) {
        
        clearInterval(timer);
        alarm_go_off();
    }
}


function preload() {

    alarm_sound  = document.getElementById('alarm');
    volume       = parseFloat(localStorage.getItem('alarm volume')) / 100; 

    
    alarm_sound.volume = volume;

}

function setup() {
    
    const ongoing_alarm = localStorage.getItem('ongoing-alarm');

    macros.value = '';

    if( localStorage.getItem('macros') != '[]' ) {

        const macros_list = JSON.parse(localStorage.getItem('macros'));

        for(const macro of macros_list) {

            macros.value += macro + ';\n';
        }
    }

    if( ongoing_alarm != 'none') {

        alarm_information = JSON.parse(localStorage.getItem('ongoing-alarm'));

            unix_time_alarm = alarm_information.unix_time_alarm_info;

        timer = setInterval( timer_run , 100); // actually starts alarm

        program_status = 'count down';

    } 
}

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

function draw() {

    let t = macros.value;

    t = t.replaceAll(' ', '');
    t = t.replaceAll('\n', '');

    t = t.split(';');
    
    t = t.filter((element) => {return element != ''});

    localStorage.setItem('macros', JSON.stringify(t));

    if( unix_time_alarm != null ) {

        const seconds_left = floor((unix_time_alarm - Date.now() ) / 1000);


        if( seconds_left > 0 ) {

            alarm_info_text.textContent = seconds_to_standard_format(seconds_left);

        }

        else
            alarm_info_text.textContent = 'alarm expired';
    }
}

function keyPressed(event) {

    const key = event.key;


    if( program_status == 'expired' && key == ' ' ) {

        alarm_sound.pause();

        program_status = 'none';

        unix_time_alarm = null;

        alarm_info_text.textContent = '-';

        localStorage.setItem('ongoing-alarm', 'none');
    }
}
