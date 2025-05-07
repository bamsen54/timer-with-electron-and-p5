

/**
 * 
 *  This is a project based on e.ggtimer at e.ggtimer.com! All credit goes to them.
 */

/**
 *  What happens when user enters a valid input
 *     
 *  1. (input ▶️)      The input is processed by parser.parse_input at parse-input.js
 *                      which converts the input to a appropriate number. Which is
 *                      the seconds the alarm will be set to.
 * 
 *                   
 *                      
 * 
 *  2. (count down ⏰)  Then start_alarm will be called in main.js. It will hide
 *                      the title, input field and the start button. Then it will
 *                      set unix_ms_alarm to the time the alarm should go off. Then  
 *                      it uses the setInterval so that the function timer_run in main.js
 *                      is run every 100 ms. timer_run checks weather the current
 *                      unix is above the unix_ms_alarm. If it is the alarm will go off. 
 * 
 *                      At the same time a count down will be displayed by
 *                      the function display_count_down in gui.js.
 * 
 * 
 * 
 * 
 *  3. (expired ✅)     When the alarm goes off the sound alarm.waw will be played
 * 
 */

let alarm_input_is_valid = false;

let alarm_sound; // wav file as alarm when count down is over

let unix_time_alarm; // the unix timestamp when alarm should go off
                     // if current unix time stamp is x then alarm
                     // should go off at x + input_field to seconds

// input      : when the user inputs the text into the input
// count down : when the user has started the alarm and the program counts down
// expired    : when the alarm has reached 0 and the alarm sound is played  
let program_status = 'input';
let alarm_done = false;

const timer_go_off = new Date();

let timer_go_off_has_been_calculated = false;

let time_when_alarm_will_go_off = '';


const input_field  = document.getElementById('input');
const start_button = document.getElementById('start');

input_field.style.cursor = 'default'

function setup() {

    // sets canvas at top left top left corner with the exact
    // dimensions of the window
    // the z-index is - 1 so that it is behind all the dom elements
    //--------------------------------------------------------------
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', - 1);
    //--------------------------------------------------------------

    alarm_sound = document.getElementById('alarm');
    
    if( localStorage.getItem('timer input from help') ) {
        
        input_field.value = localStorage.getItem('timer input from help')
        alarm_input_is_valid = true;
        localStorage.clear();
        start_alarm();
        input_field.value = '';
    }

    textAlign(CENTER, CENTER);

    pixelDensity(3);
}

function draw() {

    
   background(32, 30, 30);

    window_resized();
    
    menu();
    count_down();
    expired();

    if( unix_time_alarm > (new Date()).getTime() )
        alarm_done = true;

    if( alarm_done ) {

        program_status = 'input';
        alarm_sound.pause();
    }

    if( input_field.style.display == '' )
        program_status = 'input';

    display_when_alarm_will_go_off(time_when_alarm_will_go_off);
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

        const seconds_left = ceil((unix_ms_alarm - (new Date()).getTime()) / 1000);

        if( seconds_left <= 0)
            program_status = 'expired';
        

        display_count_down(seconds_left); // it will figure out the seconds left automatically.
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
    }

    if(program_status == 'debug' && key == ' ')
        parser.parse_input(input_field.value);

    // temporary
    if( key == 'r' && program_status == 'count down' ) {
        
        program_status = 'input';
        alarm_done = true;
        input_field.style.display  = '';
        title.style.display        = '';
        start_button.style.display = '';
        
    }

    // test

    
}

// ⏰ the program starts the countdown
// by setting the unix_ms_alarm to the 
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
        alarm_done = false;

        unix_ms_alarm = Date.now() + seconds * 1000; // at what unix time stamp alarm should go off

        timer = setInterval( timer_run , 100); // actually starts alarm

        timer_go_off_has_been_calculated = false;

        time_when_alarm_will_go_off = calculate_at_what_time_alarm_will_go_off();
    }
}

function alarm_go_off() {

    program_status = 'expired';
    
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

    // ✅ since unix_ms_alarm is set
    // to the number when unix will 
    // be unix at start + seconds the 
    // alarm will run, this means that
    // the alarm has expired
    if( Date.now() >= unix_ms_alarm) {
        
        clearInterval(timer);
        alarm_go_off();
        
    }
}

