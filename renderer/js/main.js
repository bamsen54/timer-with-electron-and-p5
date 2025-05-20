
// input      : when the user inputs the text into the input
// count down : when the user has started the alarm and the program counts down
// expired    : when the alarm has reached 0 and the alarm sound is played  
let program_status = 'input';
//console.log('program status changed to input')

const title        = document.getElementById('title-text');
const input_field  = document.getElementById('input');
const start_button = document.getElementById('start');

const ongoing_alarm = localStorage.getItem('ongoing-alarm');

/* DEALS WITH ALARM */

    // the unix timestamp when alarm should go off
    // if current unix time stamp is x then alarm
    // should go off at x + input_field to seconds
    let unix_time_alarm; 
    let unix_at_alarm_go_off;

    let alarm_input_is_valid = false; // uses parser.parse_input and if it gives a valid time back this is set to true
    

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
    window.addEventListener('keydown', (e) => { 
        
        if(e.key == ' ' && e.target == document.body)
             e.preventDefault();
    })


function setup() {

    create_background_canvas();
    
    use_help_input();

    const ongoing_alarm = localStorage.getItem('ongoing-alarm');
    
    if( ongoing_alarm == 'none' ) {

        // all of these start off as hidden so that going back to timer does not show then if not in none
        title.className = '';
        input_field.className = '';
        start_button.className = 'invalid';
    }

    else if( ongoing_alarm == 'expired' ) {

        program_status = 'expired';
        //console.log('program status changed to expired')


        input_field.style.display = 'none';
        start_button.style.display = 'none';
        title.style.display = 'none';

        alarm_sound.play();
    }

    else {

        const alarm_information = JSON.parse(ongoing_alarm);

        const unix_timer_info_as_integer = parseInt(alarm_information.unix_time_alarm_info);

        const seconds_left = floor( (unix_timer_info_as_integer - (new Date()).getTime()) / 1000 ) ;

        input_field.value = seconds_left + ' seconds';

        alarm_input_is_valid = true;
        
        start_alarm();
        input_field.value = '';
    } 
}

function draw() {

    background(32, 30, 30);
    
    window_resized();
    
    menu();
    count_down();
    expired();

    if( time_when_alarm_will_go_off )
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
            
            //start_button.className = 'invalid';

            alarm_input_is_valid = false;
        }
    }
}

function count_down() {

    if( program_status == 'count down' ) {

        const seconds_left = ceil((unix_time_alarm - (new Date()).getTime()) / 1000);

        if( seconds_left <= 0 && program_status == 'count down') {

            program_status  = 'expired';
            //console.log('program status changed to expired')

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
        //console.log('program status changed to input')


        alarm_sound.pause();

        input_field.style.display  = '';
        title.style.display        = '';
        start_button.style.display = '';

        title.className = '';
        input_field.className = '';
        start_button.className = 'invalid';

        count_down_text.textContent = '';

        count_down_text.style.display = 'none';

        unix_time_alarm = null;
        unix_at_alarm_go_off = null;
    }

    if(program_status == 'debug' && key == ' ')
        parser.parse_input(input_field.value);

    if( key == 'r' && program_status == 'count down' ) {
        
        program_status = 'input';
        //console.log('program status changed to input')


        count_down_text.style.display = 'none';


        input_field.style.display  = '';
        title.style.display        = '';
        start_button.style.display = '';

        title.className = '';
        input_field.className = '';
        start_button.className = 'invalid';

        count_down_text.textContent = '';
        count_down_finished_at_span.textContent = '';

        unix_time_alarm      = null;
        unix_at_alarm_go_off = null;


    }
}

// ⏰ the program starts the countdown
// by setting the unix_time_alarm to the 
// current unix + the seconds of the alarm
function start_alarm() {

    if( program_status == 'input' && alarm_input_is_valid ) {

        const input_value = input_field.value;
        input_field.value = '';

        const seconds     = parser.parse_input(input_value); // seconds that alarm runs

        if( Number.isNaN(seconds) )
            return;

        // remove input field, button and title
        input_field.style.display = 'none';
        start_button.style.display = 'none';
        title.style.display = 'none';

        count_down_text.style.display = '';

        program_status = 'count down'; // sets program state to run
        //console.log('program status changed to count down')


        unix_time_alarm = Date.now() + seconds * 1000; // at what unix time stamp alarm should go off
        //console.log(unix_time_alarm - Date.now())

        timer = setInterval( timer_run , 100); // actually starts alarm

        //timer_go_off_has_been_calculated = false;

        time_when_alarm_will_go_off = calculate_at_what_time_alarm_will_go_off();
        console.log(time_when_alarm_will_go_off, 'here 1');

        //console.log(time_when_alarm_will_go_off)

        start_button.className = 'invalid';

        // setting ongoing alarm in localStorage

        const alarm_information = {

            unix_time_alarm_info: unix_time_alarm,
            time_when_alarm_will_go_off_info: time_when_alarm_will_go_off

        };

        localStorage.setItem('ongoing-alarm', JSON.stringify(alarm_information));

        input_field.className = 'input-field-not-visible';
    
        return alarm_information;
    }
}

function alarm_go_off() {

    program_status = 'expired';
    //console.log('program status changed to expired')


    localStorage.setItem('ongoing-alarm', 'expired');
    
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

function turn_off_alarm_expired_state_after_a_while() {

    if( program_status != 'expired' )
        return;

    const now = new Date();

    let max_seconds_of_expired_time;
    const expired_time_limit = localStorage.getItem('expired time limit');

    if( expired_time_limit == 'unlimited' )
        return;

    max_seconds_of_expired_time = parseInt(expired_time_limit);
    
    if( unix_at_alarm_go_off ) {

        const seconds_since_alarm_went_off = floor( (now - unix_at_alarm_go_off) / 1000 );
        
        if( seconds_since_alarm_went_off >= max_seconds_of_expired_time ) {

            console.log('alarm expired limit hit')

            program_status = 'input'; 
            //console.log('program status changed to input')
            
            alarm_sound.pause();

            input_field.style.display  = '';
            input_field.className      = '';
            title.style.display        = '';
            start_button.style.display = '';

            count_down_text.textContent = '';

            unix_at_alarm_go_off = null;
        }
    }
}

