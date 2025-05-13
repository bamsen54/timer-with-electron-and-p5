
// for parsing holiday entries

// sourcce https://www.irt.org/articles/js052/index.htm
// changed so that we get month and date in list
function easter(Y) {

    let C = Math.floor(Y/100);
    let N = Y - 19*Math.floor(Y/19);
    let K = Math.floor((C - 17)/25);
    let I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
    I = I - 30*Math.floor((I/30));
    I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
    let J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
    J = J - 7*Math.floor(J/7);
    let L = I - J;
    let M = 3 + Math.floor((L + 40)/44);
    let D = L + 28 - 31*Math.floor(M/4);

    return [M - 1, D]
}

// easter day can be:
// maundy thursday, good friday, easter eve, easter / easter day, easter monday
function get_easter_date(easter_day) {

    const now = new Date();

    const this_year = now.getFullYear();

    let [month, day] = easter(this_year);
    
    const date = new Date();

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMonth(month);

    let day_off_set; // days offset from easter sunday, e.g. good friday would be -2

    switch(easter_day) {

        case 'holy monday':
            day_off_set = - 6;
            break;

        case 'holy tuesday':
            day_off_set = - 5;
            break;
        
        case 'holy wednesday':
            day_off_set = - 4;
            break;

        case 'maundy thursday':
            day_off_set = - 3;
            break;

        case 'good friday':
            day_off_set = - 2;
            break;

        case 'easter eve':
            day_off_set = - 1;
            break;

        default:
            day_off_set = 0;
    }

    date.setDate(day + day_off_set);

    if( date - now < 0 ) {

        [month, day] = easter(this_year + 1);

        date.setDate(day + day_off_set);

        if( day + day_off_set < 1 )
            return date.getDate() + ' ' + index_to_month_name[month - 1];
        
        return date.getDate() + ' ' + index_to_month_name[month];
    }

    return date.getDate() + ' ' + index_to_month_name[month];
}

function thanksgiving(year) {

    const date = new Date();

    date.setFullYear(year);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMonth(10);

    date.setDate(22);

    const current_week_day = date.getDay();

    const days_to_next_thursday = (7 - current_week_day + 4) % 7; // (7 - current_week_day) is days to sunday
                                                                  // + 4 to thursday if current_week_day is wednesday or 
                                                                  // earlier we get get next thursday so we add % 7 fixes that
    return [10, 22 + days_to_next_thursday];
}

function get_thanksgiving_date() {

    const now = new Date();

    const this_year = now.getFullYear();

    let [month, day] = thanksgiving(this_year);
    
    const date = new Date();

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setDate(day);
    date.setMonth(month);

    if( date - now < 0 ) {

        [month, day] = thanksgiving(this_year + 1);

        date.setDate(day);
        date.setMonth(month);
        date.setFullYear(this_year + 1)

        return date.getDate() + ' ' + index_to_month_name[month];
    }

    date.setFullYear(this_year);

    return date.getDate() + ' ' + index_to_month_name[month];
}

function get_black_friday_date() {

    const thanksgiving_date = get_thanksgiving_date();

    const day = parseInt(get_thanksgiving_date().split(' ')[0]);

    return (day + 1) + ' november';
}

function parse_holiday(input_string) {

    // we add +0sec in all of these since they are on the form 
    //day month and if we write for example christmas christmas 
    // we get 25 december 25 december which will be read as ( 25 december 25) december
    // which is not valid but 25 december (+0sec) 25december is

    // holy week
    input_string = input_string.replaceAll('holy-monday', get_easter_date('holy monday') + '+0sec');
    input_string = input_string.replaceAll('holy monday', get_easter_date('holy monday') + '+0sec');
    input_string = input_string.replaceAll('holymonday', get_easter_date('holy monday') + '+0sec');
    input_string = input_string.replaceAll('holy-tuesday', get_easter_date('holy tuesday') + '+0sec');
    input_string = input_string.replaceAll('holy tuesday', get_easter_date('holy tuesday') + '+0sec');
    input_string = input_string.replaceAll('holytuesday', get_easter_date('holy tuesday') + '+0sec');
    input_string = input_string.replaceAll('holy-wednesday', get_easter_date('holy wednesday') + '+0sec');
    input_string = input_string.replaceAll('holy wednesday', get_easter_date('holy wednesday') + '+0sec');
    input_string = input_string.replaceAll('holywednesday', get_easter_date('holy wednesday') + '+0sec');
    input_string = input_string.replaceAll('maundy-thursday', get_easter_date('maundy thursday') + '+0sec');
    input_string = input_string.replaceAll('maundy thursday', get_easter_date('maundy thursday') + '+0sec');
    input_string = input_string.replaceAll('maundythursday', get_easter_date('maundy thursday') + '+0sec');
    input_string = input_string.replaceAll('good-friday', get_easter_date('good friday') + '+0sec');
    input_string = input_string.replaceAll('good friday', get_easter_date('good friday') + '+0sec');
    input_string = input_string.replaceAll('goodfriday', get_easter_date('good friday') + '+0sec');
    input_string = input_string.replaceAll('easter-eve', get_easter_date('easter eve') + '+0sec');
    input_string = input_string.replaceAll('easter eve', get_easter_date('easter eve') + '+0sec');
    input_string = input_string.replaceAll('eastereve', get_easter_date('easter eve') + '+0sec');

    input_string = input_string.replaceAll('easter-day', get_easter_date('easter') + '+0sec');
    input_string = input_string.replaceAll('easter day', get_easter_date('easter') + '+0sec');
    input_string = input_string.replaceAll('easterday', get_easter_date('easter') + '+0sec');
    input_string = input_string.replaceAll('easter-sunday', get_easter_date('easter') + '+0sec');
    input_string = input_string.replaceAll('easter sunday', get_easter_date('easter') + '+0sec');
    input_string = input_string.replaceAll('eastersunday', get_easter_date('easter') + '+0sec');
    input_string = input_string.replaceAll('easter', get_easter_date('easter') + '+0sec');
    

    // thanksgiving
    input_string = input_string.replaceAll('thanksgiving', get_thanksgiving_date() + '+0sec');

    // black friday
    input_string = input_string.replaceAll('black-friday', get_black_friday_date() + '+0sec');
    input_string = input_string.replaceAll('black friday', get_black_friday_date() + '+0sec');
    input_string = input_string.replaceAll('blackfriday', get_black_friday_date() + '+0sec');

    // christmas
    input_string = input_string.replaceAll('christmas-eve', '24 december + 0sec');
    input_string = input_string.replaceAll('christmas eve', '24 december + 0sec');
    input_string = input_string.replaceAll('christmaseve', '24 december + 0sec');
    input_string = input_string.replaceAll('xmas-eve', '24 december + 0sec');
    input_string = input_string.replaceAll('xmas eve', '24 december + 0sec');
    input_string = input_string.replaceAll('xmaseve', '24 december + 0sec');

    input_string = input_string.replaceAll('christmas-day', '25 december + 0sec');
    input_string = input_string.replaceAll('christmas day', '25 december + 0sec');
    input_string = input_string.replaceAll('christmasday', '25 december + 0sec');
    input_string = input_string.replaceAll('christmas', '25 december + 0sec');
    input_string = input_string.replaceAll('xmas-day', '25 december + 0sec');
    input_string = input_string.replaceAll('xmas day', '25 december + 0sec');
    input_string = input_string.replaceAll('xmasday', '25 december + 0sec');
    input_string = input_string.replaceAll('xmas', '25 december + 0sec');

    input_string = input_string.replaceAll('boxing-day', '26 december + 0sec');
    input_string = input_string.replaceAll('boxing day', '26 december + 0sec');
    input_string = input_string.replaceAll('boxingday', '26 december + 0sec');

    // new year
    input_string = input_string.replaceAll("new-year's-eve", '31 december + 0sec');
    input_string = input_string.replaceAll("new-years-eve", '31 december + 0sec');
    input_string = input_string.replaceAll("new-year-eve", '31 december + 0sec');
    input_string = input_string.replaceAll("new year's eve", '31 december + 0sec');
    input_string = input_string.replaceAll("new years-eve", '31 december + 0sec');
    input_string = input_string.replaceAll("newyear'seve", '31 december + 0sec');
    input_string = input_string.replaceAll("newyearseve", '31 december + 0sec');
    input_string = input_string.replaceAll("newyeareve", '31 december + 0sec');

    // last chronologically since it runs when the year is over
    input_string = input_string.replaceAll("newyear's", '1 january + 0sec');
    input_string = input_string.replaceAll("newyears", '1 january + 0sec');
    input_string = input_string.replaceAll("newyear", '1 january + 0sec');
    input_string = input_string.replaceAll("new year's", '1 january + 0sec');
    input_string = input_string.replaceAll("new years", '1 january + 0sec');
    input_string = input_string.replaceAll("new year", '1 january + 0sec');

    return input_string;
}