




function help_ten_min() {

    localStorage.setItem('ongoing-alarm', 'help');
    localStorage.setItem('timer input from help', '10min');
    window.location.href = '../renderer/index.html';
}

function setup() {

    if( localStorage.getItem('ongoing-alarm') == 'expired' )
        localStorage.setItem('ongoing-alarm', 'none');
}

function draw() {

    const alarm_information = localStorage.getItem('ongoing-alarm');

    if( alarm_information != 'none' && alarm_information != 'expired' ) {

        const alarm_information_object = JSON.parse(alarm_information);

        const unix_time_alarm = floor(alarm_information_object.unix_time_alarm_info);

        if( (new Date()).getTime() > unix_time_alarm ) {
            
            localStorage.setItem('ongoing-alarm', 'expired');
            window.location.href = '../renderer/index.html';
        }
    }
}

