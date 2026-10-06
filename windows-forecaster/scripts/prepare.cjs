'use strict';
const fs=require('node:fs');const path=require('node:path');
const root=path.join(__dirname,'..'),source=path.join(root,'..','cashflow','index.html'),target=path.join(root,'renderer');
if(fs.existsSync(source)){
 const html=fs.readFileSync(source,'utf8'),style=html.match(/<style>([\s\S]*?)<\/style>/),script=html.match(/<script>([\s\S]*?)<\/script>/);
 if(!style||!script)throw Error('Forecaster source has an unexpected format.');
 fs.mkdirSync(target,{recursive:true});fs.writeFileSync(path.join(target,'style.css'),style[1]);fs.writeFileSync(path.join(target,'app.js'),script[1]);
 const toolbar='<section><h2>Windows workspace</h2><div class="controls"><button id="desktop-save">Save project · Ctrl+S</button><button id="desktop-open">Open project · Ctrl+O</button></div><p id="desktop-status" role="status" aria-live="polite">Files are processed on this computer. Saved project files contain financial data and are not encrypted.</p></section>';
 const csp="default-src 'none'; script-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' blob:; worker-src 'self' blob:; font-src 'self'; base-uri 'none'; form-action 'none'";
 const page=html.replace(style[0],'<link rel="stylesheet" href="style.css">').replace(script[0],'<script src="app.js"></script><script src="desktop.js"></script>').replace('<meta charset="utf-8">','<meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="'+csp+'">').replace('<a href="../">← Daniel’s portfolio</a>','<span class="tag">DANIEL FINANCIAL FORECASTER · WINDOWS</span>'+toolbar);
 fs.writeFileSync(path.join(target,'index.html'),page);
}
for(const name of ['index.html','style.css','app.js','desktop.js'])if(!fs.existsSync(path.join(target,name)))throw Error('Missing renderer/'+name+'. Extract the complete source ZIP or run from the portfolio repository.');
console.log('Desktop renderer ready.');
