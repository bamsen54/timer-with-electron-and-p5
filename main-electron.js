
const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');

let main_window;

function create_main_window() {

    main_window = new BrowserWindow({
        title: 'timer',
        width: 1080,
        height: 430,
        //resizable: false,
        //autoHideMenuBar: true,
        icon: `${__dirname}/icon/bird.ico`,
        
    });

    //main_window.webContents.openDevTools();
    main_window.loadFile(path.join(__dirname, './pre-renderer/pre.html'));
}




const template = [

    {
        label:'help',
        click: () => { main_window.loadFile(path.join(__dirname, './renderer-help/help.html'))}
       /*  submenu:[ 
            {
                label:'',
                click: () => { main_window.loadFile(path.join(__dirname, './renderer-help/help.html'))}
            }
        ] */
    }
]

const menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);



app.whenReady().then(()=> {

    create_main_window();
})