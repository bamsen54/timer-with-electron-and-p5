
// input      : when the user inputs the text into the input
// count down : when the user has started the alarm and the program counts down
// expired    : when the alarm has reached 0 and the alarm sound is played  
let program_status = 'input';

/* DEALS WITH ALARM */

    // the unix timestamp when alarm should go off
    // if current unix time stamp is x then alarm
    // should go off at x + input_field to seconds
    let unix_time_alarm; 

    let alarm_input_is_valid = false; // uses parser.parse_input and if it gives a valid time back this is set to true
    let alarm_expired        = false; // when alarm is in expired mode this is true

    let alarm_sound; // wav file as alarm when count down is over

    alarm_sound        = document.getElementById('alarm');
    alarm_sound.volume = parseFloat(localStorage.getItem('alarm volume'));

/* DEALS WITH GUI (what users sees but does not interact with)*/

    let time_when_alarm_will_go_off = '';  

    // displays time left of alarm
    const count_down_text             = document.getElementById('count-down-span');

    // displays date and time when alarm will be expired
    const count_down_finished_at_span = document.getElementById('count-down-finished-at-span');

    // thanks to Oriol
    // https://stackoverflow.com/questions/22559830/html-prevent-space-bar-from-scrolling-page
    window.addEventListener('keydown', (e) => { if(e.keyCode == 32 && e.target == document.body) e.preventDefault();})
    window.onscroll = function () { window.scrollTo(0, 0); };


/* DEALS WITH USER INTERACTION */

    const input_field  = document.getElementById('input');
    const start_button = document.getElementById('start');

    input_field.style.cursor = 'default'


function setup() {

    create_background_canvas();
    
    use_help_input();
}

function draw() {

    background(32, 30, 30);
    
    window_resized();
    
    menu();
    count_down();
    expired();

    if( unix_time_alarm > (new Date()).getTime() )
        alarm_expired = true;

    if( alarm_expired ) {

        program_status = 'input';
        unix_time_alarm = null;
        
        alarm_sound.pause();
    }

    display_when_alarm_will_go_off(time_when_alarm_will_go_off);

    turn_off_alarm_expired_state_after_a_while();
}
    

// take input to start and stop alarm
function menu() {

    if( program_status == 'input') {

        const alarm_seconds = parser.parse_input(input_field.value);

        if( alarm_seconds >= 0 ) {
            
            start_button.className = 'valid';

            alarm_input_is_valid = true;
        }

        else {
            
            start_button.className = 'invalid';

            alarm_input_is_valid = false;
        }
    }
}

function count_down() {

    if( program_status == 'count down' ) {

        const seconds_left = ceil((unix_timer_alarm - (new Date()).getTime()) / 1000);

        if( seconds_left <= 0 && program_status == 'count down') {

            program_status  = 'expired';
            unix_time_alarm = null;

        }
        
        display_count_down(seconds_left); // it will figure out the seconds left automatically.
    }

    else {

        //count_down_text.textContent = '';
        count_down_finished_at_span.textContent = '';

    }
}

function expired() {

    if( program_status == 'expired' )
        display_count_down();
}

function keyPressed(event) {

    const key = event.key;
    
    // ▶️ the user starts the timer
    if( key == 'Enter' && alarm_input_is_valid && program_status == 'input' ) {

        start_alarm();

        input_field.value = '';
    }

    if( program_status == 'expired' && key == ' ') {
        
        program_status = 'input'; 

        alarm_sound.pause();

        input_field.style.display  = '';
        title.style.display        = '';
        start_button.style.display = '';

        count_down_text.textContent = '';

        unix_at_alarm_go_off = null;
    }

    if(program_status == 'debug' && key == ' ')
        parser.parse_input(input_field.value);

    if( key == 'r' && program_status == 'count down' ) {
        
        program_status = 'input';
        
        input_field.style.display  = '';
        title.style.display        = '';
        start_button.style.display = '';

        count_down_text.textContent = '';
        count_down_finished_at_span.textContent = '';

        alarm_expired = true;
    }
}

// ⏰ the program starts the countdown
// by setting the unix_timer_alarm to the 
// current unix + the seconds of the alarm
function start_alarm() {

    if( program_status == 'input' && alarm_input_is_valid ) {

        const input_value = input_field.value;
        const seconds     = parser.parse_input(input_value); // seconds that alarm runs

        if( Number.isNaN(seconds) )
            return;

        // remove input field, button and title
        input_field.style.display = 'none';
        start_button.style.display = 'none';
        title.style.display = 'none';

        program_status = 'count down'; // sets program state to run
        alarm_expired = false;

        unix_timer_alarm = Date.now() + seconds * 1000; // at what unix time stamp alarm should go off

        timer = setInterval( timer_run , 100); // actually starts alarm

        //timer_go_off_has_been_calculated = false;

        time_when_alarm_will_go_off = calculate_at_what_time_alarm_will_go_off();

        start_button.className = 'invalid';
    }
}

function alarm_go_off() {

    program_status = 'expired';
    
    unix_at_alarm_go_off = (new Date()).getTime();

    if( input_field.style.display != '') 
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

    // ✅ since unix_timer_alarm is set
    // to the number when unix will 
    // be unix at start + seconds the 
    // alarm will run, this means that
    // the alarm has expired
    if( Date.now() >= unix_timer_alarm) {
        
        clearInterval(timer);
        alarm_go_off();
        
    }
}

function turn_off_alarm_expired_state_after_a_while() {

    const now = new Date();

    let max_seconds_of_expired_time;
    const expired_time_limit = localStorage.getItem('expired time limit');

    if( expired_time_limit == 'unlimited' )
        return;

    max_seconds_of_expired_time = parseInt(expired_time_limit);
    
    if( unix_at_alarm_go_off ) {

        const seconds_since_alarm_went_off = floor( (now - unix_at_alarm_go_off) / 1000 );
        
        if( seconds_since_alarm_went_off >= max_seconds_of_expired_time ) {

            program_status = 'input'; 

            alarm_sound.pause();

            input_field.style.display  = '';
            title.style.display        = '';
            start_button.style.display = '';

            unix_at_alarm_go_off = null;
        }
    }
}

