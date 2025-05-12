

function setup() {

    document.getElementById('expired-time-limit').value =   localStorage.getItem('expired time limit');
}

function draw() {

    const expired_time_limit = document.getElementById('expired-time-limit').value;
    
    if( expired_time_limit == '10' ) 
        localStorage.setItem('expired time limit', 10);

    else if( expired_time_limit == '15' ) 
        localStorage.setItem('expired time limit', 15);

    else if( expired_time_limit == '30' ) 
        localStorage.setItem('expired time limit', 30);

    else if( expired_time_limit == '60' ) 
        localStorage.setItem('expired time limit', 60);

    else if( expired_time_limit == 'unlimited' ) 
        localStorage.setItem('expired time limit', 'unlimited');
}

