'use strict';
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('desktop',{saveProject:project=>ipcRenderer.invoke('project:save',project),openProject:()=>ipcRenderer.invoke('project:open'),onProjectAction:callback=>{const listener=(_event,action)=>{if(action==='save'||action==='open')callback(action);};ipcRenderer.on('project-action',listener);return ()=>ipcRenderer.removeListener('project-action',listener);}});
