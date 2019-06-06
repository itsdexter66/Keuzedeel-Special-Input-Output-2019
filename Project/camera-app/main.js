const electron = require('electron');
const fs = require("fs");
const url = require('url');
const path = require('path');

const { app, protocol, BrowserWindow, Menu, ipcMain } = electron;
const { readFile } = fs;
const { URL } = url;
const { extname } = path;

let createProtocol = (scheme, normalize = true) => {
    protocol.registerBufferProtocol(scheme,
        (request, respond) => {
            let pathName = new URL(request.url).pathname;
            pathName = decodeURI(pathName); // Needed in case URL contains spaces
            
            readFile(__dirname + "/" + pathName, (error, data) => {
                let extension = extname(pathName).toLowerCase();
                let mimeType = "";
                
                if (extension === ".js") {
                    mimeType = "text/javascript";
                }
                else if (extension === ".html") {
                    mimeType = "text/html";
                }
                else if (extension === ".css") {
                    mimeType = "text/css";
                }
                else if (extension === ".svg" || extension === ".svgz") {
                    mimeType = "image/svg+xml";
                }
                else if (extension === ".json") {
                    mimeType = "application/json";
                }
                
                respond({mimeType, data}); 
            });
        },
        (error) => {
            if (error) {
                console.error(`Failed to register ${scheme} protocol`, error);
            }
        }
    );
}
    
let mainWindow, inputWindow;

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } }]);

app.on('ready', () => {
    createProtocol('app');

    mainWindow = new BrowserWindow({width:616,height:658,webPreferences:{nodeIntegration:true}});
    // mainWindow.webContents.openDevTools();
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "/index.html"),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('close', () => {
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createInputWindow() {
    inputWindow = new BrowserWindow({width:300,height:300,title:'Add Input',webPreferences:{nodeIntegration:true}});
    // inputWindow.webContents.openDevTools();
    inputWindow.loadURL(url.format({
        pathname: path.join(__dirname, "/src/input.html"),
        protocol: 'file:',
        slashes: true
    }));

    inputWindow.on('close', () => {
        inputWindow = null;
    });

    // inputWindow.setMenu(null);
}

ipcMain.on('input:add', (e, input) => {
    mainWindow.webContents.send('input:add', input);
    inputWindow.close();
});

ipcMain.on('main:addinput', (e, input) => {
    mainWindow.webContents.send('main:addinput', input);
});

const mainMenuTemplate = [
    {
        label: 'Tools',
        submenu:[
            {
                label: 'Add Input',
                click() {
                    createInputWindow();
                }
            },
            {
                label: 'Toggle Draw',
                accelerator: process.platform == 'darwin' ? 'Command+D' : 'Ctrl+D',
                click() {
                    mainWindow.webContents.send('main:draw');
                }
            }
        ]
    }
];

// Only for mac
if(process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// Developer tools if in not in release mode
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}