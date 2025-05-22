

function setup() {

    document.getElementById('volume').value = parseFloat(localStorage.getItem('alarm volume'));
    document.getElementById('expired-time-limit').value = localStorage.getItem('expired time limit');
    


    if( localStorage.getItem('ongoing-alarm') == 'expired' )
        localStorage.setItem('ongoing-alarm', 'none');
}

function draw() {

    const expired_time_limit = document.getElementById('expired-time-limit').value;
    
    if( expired_time_limit == '5' ) 
        localStorage.setItem('expired time limit', 5);

    else if( expired_time_limit == '10' )
        localStorage.setItem('expired time limit', 10);


    else if( expired_time_limit == '15' ) 
        localStorage.setItem('expired time limit', 15);

    else if( expired_time_limit == '30' ) 
        localStorage.setItem('expired time limit', 30);

    else if( expired_time_limit == '60' ) 
        localStorage.setItem('expired time limit', 60);

    else if( expired_time_limit == 'unlimited' ) 
        localStorage.setItem('expired time limit', 'unlimited');


    const volume = document.getElementById('volume').value;
    
    localStorage.setItem('alarm volume', volume);

   

    const alarm_information = localStorage.getItem('ongoing-alarm');
     console.log(alarm_information)

    if( alarm_information != 'none' && alarm_information != 'expired' ) {

        const alarm_information_object = JSON.parse(alarm_information);

        const unix_time_alarm = floor(alarm_information_object.unix_time_alarm_info);

        if( (new Date()).getTime() > unix_time_alarm ) {
            
            localStorage.setItem('ongoing-alarm', 'expired');
            window.location.href = '../renderer/index.html'; 
        }
    }
}

