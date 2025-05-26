
const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');

let main_window;

function create_main_window() {

    main_window = new BrowserWindow({
        title: 'timer',
        width: 1080,
        height: 463,
        //resizable: false,
        autoHideMenuBar: true,
        icon: `${__dirname}/icon/bird.ico`,
        titleBarStyle: 'hiddenInset', // or 'customButtonsOnHover'

        
    });

    //main_window.webContents.openDevTools();
    main_window.loadFile(path.join(__dirname, './renderer/timer.html'));
}


app.whenReady().then(()=> {

    create_main_window();
})