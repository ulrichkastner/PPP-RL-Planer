// ═══════════════════════════════════════════════════════════════════
// DATENBASIS Anlage 1 · G-BA 2024 · ab 01.01.2025
// mw: [§5a Ärzte, §5b Pflege, §5c Psych/PT, §5d Spezialther, §5e Bewegung, §5f Sozial]
// ═══════════════════════════════════════════════════════════════════
const BB = {
  A1:{name:'A1 Regelbehandlung',short:'A1',mw:[207,856,49,150,0,76],teil:false,grp:'A',intensiv:false},
  A2:{name:'A2 Intensivbehandlung',short:'A2',mw:[257,1536,35,146,0,74],teil:false,grp:'A',intensiv:true},
  A6:{name:'A6 Tagesklinik',short:'A6',mw:[114,329,107,193,0,67],teil:true,grp:'A',intensiv:false},
  A7:{name:'A7 Psychoth. Komplex',short:'A7',mw:[265,509,132,152,0,49],teil:false,grp:'A',intensiv:false},
  A8:{name:'A8 Psychoth. Komplex TK',short:'A8',mw:[265,201,132,152,0,49],teil:true,grp:'A',intensiv:false},
  A9:{name:'A9 StäB',short:'A9',mw:[0,0,0,0,0,0],teil:false,grp:'A',intensiv:false},
  S1:{name:'S1 Sucht Regel',short:'S1',mw:[226,835,61,107,0,109],teil:false,grp:'S',intensiv:false},
  S2:{name:'S2 Sucht Intensiv',short:'S2',mw:[256,1562,68,85,0,153],teil:false,grp:'S',intensiv:true},
  S6:{name:'S6 Tagesklinik Sucht',short:'S6',mw:[115,318,105,170,0,101],teil:true,grp:'S',intensiv:false},
  S9:{name:'S9 StäB Sucht',short:'S9',mw:[0,0,0,0,0,0],teil:false,grp:'S',intensiv:false},
  G1:{name:'G1 Gerontopsych Regel',short:'G1',mw:[183,1270,56,137,0,75],teil:false,grp:'G',intensiv:false},
  G2:{name:'G2 Gerontopsych Intensiv',short:'G2',mw:[211,1645,37,118,0,51],teil:false,grp:'G',intensiv:true},
  G6:{name:'G6 Tagesklinik Geronto',short:'G6',mw:[115,372,107,193,0,68],teil:true,grp:'G',intensiv:false},
  G9:{name:'G9 StäB Geronto',short:'G9',mw:[0,0,0,0,0,0],teil:false,grp:'G',intensiv:false},
  P1:{name:'P1 Psychosomatik Regel',short:'P1',mw:[180,220,100,102,0,34],teil:false,grp:'P',intensiv:false},
  P2:{name:'P2 Psychosomatik Komplex',short:'P2',mw:[230,250,167,144,0,35],teil:false,grp:'P',intensiv:false},
  P3:{name:'P3 intensivierte Komplex',short:'P3',mw:[275,614,145,157,0,45],teil:false,grp:'P',intensiv:false},
  P4:{name:'P4 integrierte Komplex',short:'P4',mw:[330,583,150,151,0,40],teil:false,grp:'P',intensiv:false},
  P5:{name:'P5 intensiviert integriert',short:'P5',mw:[380,677,130,159,0,25],teil:false,grp:'P',intensiv:false},
  P6:{name:'P6 Psychosomatik TK Regel',short:'P6',mw:[200,200,80,80,0,11],teil:true,grp:'P',intensiv:false},
  P7:{name:'P7 Psychosomatik TK Komplex',short:'P7',mw:[280,250,117,144,0,44],teil:true,grp:'P',intensiv:false}
};
const VS_BBs=['A1','A2','A7','A9','S1','S2','S9','G1','G2','G9','P1','P2','P3','P4','P5'];
const TK_BBs=['A6','A8','S6','G6','P6','P7'];
const BG=[
{id:'a',label:'Ärzte §5a',short:'§5a',cls:'bg-a',wh:40.0},
{id:'b',label:'Pflege §5b',short:'§5b',cls:'bg-b',wh:38.5},
{id:'c',label:'Psychol./PT §5c',short:'§5c',cls:'bg-c',wh:38.5},
{id:'d',label:'Spezial-/Bewegungs-/Physiotherapie §5d',short:'§5d',cls:'bg-d',wh:38.5},
{id:'f',label:'Sozialdienst §5f',short:'§5f',cls:'bg-f',wh:38.5}
];
const BG_IDX={a:0,b:1,c:2,d:3,e:4,f:5};
const FEHL={a:21,b:27,c:21.2,d:24.1,e:24.1,f:24.1};
let IB_BD=0;let EQ_ZIEL=100;
const N_VS=16,N_TK=4;
function defaultStation(i,isTK){const bbList=isTK?TK_BBs:VS_BBs;const mix={};bbList.forEach(k=>mix[k]=0);if(!isTK){mix.A1=22}else{mix.A6=24}const vkIst={};BG.forEach(bg=>vkIst[bg.id]='');return{name:isTK?`TK ${i}`:`Station ${i}`,betten:isTK?24:22,mix,vkIst}}
const KLINIK={vs:Array.from({length:N_VS},(_,i)=>defaultStation(i+1,false)),tk:Array.from({length:N_TK},(_,i)=>defaultStation(i+1,true))};
const f1=v=>(+v).toFixed(1),f2=v=>(+v).toFixed(2),f0=v=>Math.round(+v).toLocaleString('de'),pct=v=>(+v).toFixed(1)+' %';
const scCl=q=>q>=95?'ok':q>=90?'warn':'err',bCl=q=>q>=95?'b-ok':q>=90?'b-warn':'b-err',bTx=q=>q>=95?'ERFÜLLT':q>=90?'GRENZWERTIG':'UNTERSCHRITTEN';
function qDays(){const q=document.getElementById('cfg-qrt').value;return q.includes('Q1')?90:q.includes('Q2')?91:92}function qDaysEff(isTK){const d=qDays();return isTK?Math.round(d*5/7):d}function vDiv(bb){return BB[bb].teil?5:7}function jazQ(bgId){return BG.find(b=>b.id===bgId).wh*(qDays()/7)}
let VV=1.0;
function staReal(sta,isTK){const bbList=isTK?TK_BBs:VS_BBs;return bbList.reduce(function(a,k){return a+(+sta.mix[k]||0)},0)}
function staBelegPct(sta,isTK){return sta.betten>0?(staReal(sta,isTK)/sta.betten*100):0}
function staBtage(sta,isTK){return Math.round(staReal(sta,isTK)*qDaysEff(isTK))}
function weightedMW(sta,isTK,bgIdx){const bbList=isTK?TK_BBs:VS_BBs;let totMW=0,totPat=0;bbList.forEach(function(k){const pats=+sta.mix[k]||0;totMW+=BB[k].mw[bgIdx]*pats;totPat+=pats});return totPat>0?totMW/totPat:0}
function staVksMind(sta,isTK,bgIdx){const bbList=isTK?TK_BBs:VS_BBs;let vksMind=0;bbList.forEach(function(k){const pats=+sta.mix[k]||0;if(pats<=0)return;vksMind+=BB[k].mw[bgIdx]*pats*(qDays()/vDiv(k))/60});return vksMind*VV}
function vksBrutto(vksMind,bgId){const fq=FEHL[bgId]/100;const vksB=fq<1?vksMind/(1-fq):vksMind*2;if(bgId==='a')return vksB/(1-IB_BD/100);return vksB}function vkFromVks(vks,bgId){return vks/jazQ(bgId)}
const INTENSIV_BBS=['A2','S2','G2'];function calcIntensivAnt(sta){const total=staReal(sta,false);const intensiv=INTENSIV_BBS.reduce(function(a,k){return a+(+sta.mix[k]||0)},0);return total>0?(intensiv/total*100):0}function ndFaktor(intPct){return intPct>35?1.6:intPct>20?1.4:intPct>0?1.2:0}
function kpi(lbl,val,note,cl='ink'){return `<div class="kpi-box"><div class="kpi-lbl">${lbl}</div><div class="kpi-num ${cl}">${val}</div><div class="kpi-note">${note}</div></div>`}function pb(lbl,val,note){var sc=scCl(val),w=Math.min(val,100);var noteHtml=note?' <span style="font-size:9px;opacity:.6;">'+note+'</span>':'';return '<div class="pb-wrap"><div class="pb-meta"><span>'+lbl+noteHtml+'</span><span>'+pct(val)+'</span></div><div class="pb-track"><div class="pb-fill '+sc+'" style="width:'+w+'%"></div></div></div>'}
