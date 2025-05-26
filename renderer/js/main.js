
// program has three phases:
// input, count down and expired
let program_status              = 'input';

// TODO
let unix_time_alarm             = null; 

// time and date when alarm will go off
let time_when_alarm_will_go_off = null;

function setup() {

    noCanvas();
}

function draw() {

    if( program_status == 'input' )
        change_to_valid_or_invalid_based_on_input();
    
    else if( program_status == 'count down') {
        
        display_count_down(get_seconds_left());
        display_when_alarm_will_go_off(time_when_alarm_will_go_off);
    }
}

