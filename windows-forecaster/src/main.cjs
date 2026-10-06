'use strict';
const {app,BrowserWindow,ipcMain,dialog,Menu}=require('electron');
const path=require('node:path');
const fs=require('node:fs/promises');
const {pathToFileURL}=require('node:url');
const {validateProject,MAX_BYTES}=require('./project.cjs');
let mainWindow;const pagePath=path.join(__dirname,'..','renderer','index.html');
function authorized(event){if(!mainWindow||event.sender!==mainWindow.webContents||event.senderFrame!==mainWindow.webContents.mainFrame||event.senderFrame.url!==pathToFileURL(pagePath).href)throw Error('Untrusted project request.');}
function createWindow(){
 mainWindow=new BrowserWindow({width:1360,height:900,minWidth:850,minHeight:650,title:'Daniel Financial Forecaster',backgroundColor:'#08131c',webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true,webSecurity:true}});
 mainWindow.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 mainWindow.webContents.on('will-navigate',(event,url)=>{if(url!==pathToFileURL(pagePath).href)event.preventDefault();});
 mainWindow.webContents.session.setPermissionRequestHandler((_webContents,_permission,callback)=>callback(false));
 mainWindow.webContents.session.setPermissionCheckHandler(()=>false);
 mainWindow.webContents.session.webRequest.onBeforeRequest((details,callback)=>callback({cancel:/^https?:/i.test(details.url)}));
 mainWindow.webContents.session.on('will-download',(_event,item)=>{item.setSaveDialogOptions({title:'Save exported financial report',defaultPath:path.join(app.getPath('downloads'),path.basename(item.getFilename()))});});
 mainWindow.loadFile(pagePath);mainWindow.on('closed',()=>{mainWindow=null;});
 Menu.setApplicationMenu(Menu.buildFromTemplate([{label:'File',submenu:[{label:'Save project',accelerator:'CmdOrCtrl+S',click:()=>mainWindow?.webContents.send('project-action','save')},{label:'Open project',accelerator:'CmdOrCtrl+O',click:()=>mainWindow?.webContents.send('project-action','open')},{type:'separator'},{role:'quit'}]},{label:'View',submenu:[{role:'resetZoom'},{role:'zoomIn'},{role:'zoomOut'},{role:'togglefullscreen'},...(app.isPackaged?[]:[{role:'toggleDevTools'}])]}]));
}
ipcMain.handle('project:save',async(event,value)=>{authorized(event);const project=validateProject(value);const result=await dialog.showSaveDialog(mainWindow,{title:'Save financial forecast project',defaultPath:'Financial-Forecast.ffproject.json',filters:[{name:'Forecaster project',extensions:['ffproject.json']}]});if(result.canceled)return {canceled:true};const temporary=result.filePath+'.'+process.pid+'.tmp';try{await fs.writeFile(temporary,JSON.stringify(project,null,2),{encoding:'utf8',mode:0o600});await fs.rename(temporary,result.filePath);}catch(error){await fs.rm(temporary,{force:true}).catch(()=>{});throw error;}return {canceled:false,name:path.basename(result.filePath)};});
ipcMain.handle('project:open',async(event)=>{authorized(event);const result=await dialog.showOpenDialog(mainWindow,{title:'Open financial forecast project',properties:['openFile'],filters:[{name:'Forecaster project',extensions:['json']}]});if(result.canceled)return {canceled:true};const file=result.filePaths[0];const stat=await fs.stat(file);if(stat.size>MAX_BYTES)throw Error('Project exceeds 16 MB.');const project=validateProject(JSON.parse(await fs.readFile(file,'utf8')));return {canceled:false,name:path.basename(file),project};});
app.whenReady().then(createWindow);app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
