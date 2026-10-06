'use strict';
const test=require('node:test'),assert=require('node:assert/strict');const {validateProject}=require('../src/project.cjs');
function valid(){return {schemaVersion:1,app:'Daniel Financial Forecaster',data:'month,income,expenses\n2026-09,100,70',settings:{coverage:'30'},sources:[],batch:[],activeTB:null};}
test('round-trip settings and financial table data',()=>{const p=valid();p.sources=[{name:'Financial report',rows:[['Code','Description','Debit','Credit'],['100','Cash',100,0]]}];assert.deepEqual(validateProject(JSON.parse(JSON.stringify(p))),p);});
test('reject unknown app, version, settings, or executable-shaped values',()=>{assert.throws(()=>validateProject({...valid(),schemaVersion:2}));assert.throws(()=>validateProject({...valid(),settings:{path:'/secret'}}));assert.throws(()=>validateProject({...valid(),sources:[{name:'x',rows:[[{arbitrary:'object'}]]}]}));});
test('reject inconsistent balances while allowing signed credits',()=>{const p=valid();p.activeTB={accounts:[{code:'1',description:'Test',debit:0,credit:-100,net:100,row:1}],debit:0,credit:-100,baseDate:'2026-09-30',baseMonth:'2026-09'};assert.equal(validateProject(p),p);p.activeTB.accounts[0].net=50;assert.throws(()=>validateProject(p));});
test('reject excessively large projects',()=>{assert.throws(()=>validateProject({...valid(),data:'x'.repeat(2000001)}));});
