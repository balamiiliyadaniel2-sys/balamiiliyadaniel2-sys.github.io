'use strict';
const MAX_BYTES=16*1024*1024;
const ALLOWED_SETTINGS=new Set(['coverage','basis','balance','horizon','revenue','expense','currency','batch-coverage','batch-currency','auto-frequency','auto-horizon','auto-matching','tb-currency','tb-month','tb-frequency','tb-rate','tb-horizon']);
function validateProject(value){
 if(!value||value.schemaVersion!==1||value.app!=='Daniel Financial Forecaster')throw Error('This is not a supported forecaster project.');
 if(Buffer.byteLength(JSON.stringify(value),'utf8')>MAX_BYTES)throw Error('Project exceeds 16 MB.');
 if(value.cadence!==undefined&&!['daily','monthly'].includes(value.cadence))throw Error('Invalid reporting cadence.');
 if(value.selectedSource!==undefined&&(typeof value.selectedSource!=='string'||value.selectedSource.length>5))throw Error('Invalid selected table.');
 if(typeof value.data!=='string'||value.data.length>2000000)throw Error('Invalid financial data preview.');
 if(!value.settings||typeof value.settings!=='object'||Array.isArray(value.settings))throw Error('Invalid settings.');
 for(const [key,v]of Object.entries(value.settings))if(!ALLOWED_SETTINGS.has(key)||typeof v!=='string'||v.length>100)throw Error('Invalid project setting.');
 function sources(list){if(!Array.isArray(list)||list.length>20)throw Error('Too many document tables.');for(const s of list){if(!s||typeof s.name!=='string'||s.name.length>500||!Array.isArray(s.rows)||s.rows.length>10000)throw Error('Invalid document table.');for(const row of s.rows){if(!Array.isArray(row)||row.length>64)throw Error('Invalid table row.');for(const cell of row)if(!(cell===null||(typeof cell==='string'&&cell.length<=20000)||(typeof cell==='number'&&Number.isFinite(cell))||typeof cell==='boolean'))throw Error('Invalid table value.');}}}
 sources(value.sources);
 if(!Array.isArray(value.batch)||value.batch.length>10)throw Error('Invalid conversion list.');
 for(const item of value.batch){if(!item||typeof item.name!=='string'||item.name.length>500)throw Error('Invalid document name.');sources(item.sources);if(!item.mapping||typeof item.mapping!=='object')throw Error('Invalid column mapping.');for(const key of ['source','header','date','layout','code','description','debit','credit'])if(typeof item.mapping[key]!=='string'||item.mapping[key].length>100)throw Error('Invalid column mapping.');if(typeof item.include!=='boolean')throw Error('Invalid inclusion setting.');}
 if(value.activeTB!==null){const tb=value.activeTB;if(!tb||!Array.isArray(tb.accounts)||tb.accounts.length>10000)throw Error('Invalid account balances.');for(const a of tb.accounts){if(typeof a.code!=='string'||typeof a.description!=='string'||a.code.length>500||a.description.length>20000||!['debit','credit','net','row'].every(k=>Number.isSafeInteger(a[k])))throw Error('Invalid account.');if(a.net!==a.debit-a.credit)throw Error('Inconsistent account balance.');}for(const k of ['debit','credit'])if(!Number.isSafeInteger(tb[k]))throw Error('Invalid total.');if(tb.debit!==tb.accounts.reduce((s,a)=>s+a.debit,0)||tb.credit!==tb.accounts.reduce((s,a)=>s+a.credit,0))throw Error('Inconsistent totals.');for(const k of ['baseDate','baseMonth'])if(typeof tb[k]!=='string'||tb[k].length>10)throw Error('Invalid reporting date.');}
 return value;
}
module.exports={validateProject,MAX_BYTES};
