
/**
 * imports and manipulates the dom elements
 */


const DOM = new function() {

    this.alarm_sound;                 // wav file as alarm signal
    this.title_text;                  // title text above alarm input field
    this.alarm_input_field;           // text input for setting timer
    this.start_button;                // start button which changes class weather the user input is valid or not
    this.count_down_span;             // displays time left and that the alarm has expired
    this.count_down_finished_at_span; // displays time when alarm will go off

    this.hide_element = function(element) {

        element.style.display = 'none';
    }

    this.show_element = function(element) {

        element.style.display = '';
    }
}

function preload() {

    DOM.alarm_sound                 = document.getElementById('alarm-sound');
    DOM.title_text                  = document.getElementById('title-text');
    DOM.alarm_input_field           = document.getElementById('alarm-input-field');
    DOM.start_button                = document.getElementById('start-button');
    DOM.count_down_span             = document.getElementById('count-down-span');
    DOM.count_down_finished_at_span = document.getElementById('count-down-finished-at-span');
}



