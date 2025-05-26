
/**
 *  All the event and callback functionsa are here
 */

let timer_interval;

function alarm_go_off() {

    program_status = 'expired';
    //console.log('program status changed to expired')

    unix_at_alarm_go_off = (new Date()).getTime();

    DOM.alarm_sound.play();
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
        
        clearInterval(timer_interval);
        alarm_go_off();
        program_status = 'expired';

    }
}

function change_to_valid_or_invalid_based_on_input() {

     const input_text = DOM.alarm_input_field.value;

    if( parser.parse_input(input_text) != undefined )
        DOM.start_button.className = 'input-valid';

    else 
        DOM.start_button.className = 'input-invalid';
}

// onclick start button
// if the user input is valid this fires with both a click and with Enter key
function start_alarm() {

    if( program_status != 'input' || DOM.start_button.className == 'input-invalid')
        return;

    const input = DOM.alarm_input_field.value;

    DOM.alarm_input_field.value = '';
    DOM.start_button.className  = 'input-invalid';

    unix_time_alarm = Date.now() + parser.parse_input(input) * 1000; 
    
    time_when_alarm_will_go_off = calculate_at_what_time_alarm_will_go_off();
    
    DOM.hide_element(DOM.title_text);
    DOM.hide_element(DOM.alarm_input_field);
    DOM.hide_element(DOM.start_button);

    DOM.show_element(DOM.count_down_span);
    DOM.show_element(DOM.count_down_finished_at_span);

    program_status = 'count down';
    timer_interval = setInterval(timer_run, 10);
}

function keyPressed() {

    const key = event.key;


    if( key == 'Enter' )
        start_alarm();

    if( key == ' ' && program_status == 'expired') {
        
        program_status  = 'input';
        unix_time_alarm = null;

        DOM.alarm_sound.pause();
        
        DOM.hide_element(DOM.count_down_span);
        DOM.hide_element(DOM.count_down_finished_at_span);

        DOM.show_element(DOM.title_text);
        DOM.show_element(DOM.alarm_input_field);
        DOM.show_element(DOM.start_button);
    }

    else if( key == 'r' && program_status == 'count down' ) {

        program_status  = 'input';
        unix_time_alarm = null;

        DOM.hide_element(DOM.count_down_span);
        DOM.hide_element(DOM.count_down_finished_at_span);

        DOM.show_element(DOM.title_text);
        DOM.show_element(DOM.alarm_input_field);
        DOM.show_element(DOM.start_button);
    }
}