(function(){
  function byId(id){return document.getElementById(id);}
  function addStyle(){
    var st=document.createElement('style');
    st.textContent='.v15-acc{border:1px solid var(--line);border-radius:6px;margin:10px 0;background:rgba(255,255,255,.35);overflow:hidden}.v15-acc-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;cursor:pointer;background:var(--cream);font-family:Syne,sans-serif;font-weight:700}.v15-acc-title{display:flex;gap:10px;align-items:center}.v15-acc-arrow{transition:transform .2s}.v15-acc.open .v15-acc-arrow{transform:rotate(90deg)}.v15-acc-body{display:none;padding:10px}.v15-acc.open .v15-acc-body{display:block}.psy-presets button.v15-active{background:var(--ink)!important;color:var(--paper)!important;border-color:var(--ink)!important}.mw-v15{width:58px;text-align:right;padding:4px 5px;border:1px solid var(--line);border-radius:4px;background:#fff;font:inherit}';
    document.head.appendChild(st);
  }
  function makeAcc(title,cards,open){
    var box=document.createElement('div');box.className='v15-acc'+(open?' open':'');
    var h=document.createElement('div');h.className='v15-acc-head';
    h.innerHTML='<div class="v15-acc-title"><span class="v15-acc-arrow">▶</span><span>'+title+'</span></div><span class="card-sub">'+cards.length+' Einheiten</span>';
    var b=document.createElement('div');b.className='v15-acc-body';
    var g=document.createElement('div');g.className='sta-grid';cards.forEach(function(c){g.appendChild(c);});b.appendChild(g);box.appendChild(h);box.appendChild(b);
    h.onclick=function(){box.classList.toggle('open');};return box;
  }
  function accordion(){
    var vs=byId('vs-grid'),tk=byId('tk-grid');if(!vs||!tk)return;
    var cards=Array.prototype.slice.call(vs.children); if(cards.length<16)return;
    vs.classList.remove('sta-grid');vs.innerHTML='';
    vs.appendChild(makeAcc('S1–S4 · Akutpsychiatrie',cards.slice(0,4),true));
    vs.appendChild(makeAcc('S5–S8 · Gerontopsychiatrie und Sucht',cards.slice(4,8),false));
    vs.appendChild(makeAcc('S9–S12 · Allgemeinpsychiatrie und Psychosomatik',cards.slice(8,12),false));
    vs.appendChild(makeAcc('S13–S16 · PKF Fürth',cards.slice(12,16),false));
    var tc=Array.prototype.slice.call(tk.children);tk.classList.remove('sta-grid');tk.innerHTML='';tk.appendChild(makeAcc('TK1–TK4 · Tageskliniken',tc,true));
  }
  function removeScenarios(){
    var nav=document.querySelector('nav');if(nav){Array.prototype.slice.call(nav.querySelectorAll('button')).forEach(function(b){if((b.getAttribute('onclick')||'').indexOf("'sz'")>=0)b.remove();});var ps=Array.prototype.slice.call(nav.querySelectorAll('button')).filter(function(b){return (b.getAttribute('onclick')||'').indexOf("'psy'")>=0;})[0];if(ps)ps.textContent='⑤ Psychosomatik';}
    var p=byId('page-sz');if(p)p.remove();
  }
  function ruleEditor(){
    var page=byId('page-rl');if(!page)return;var table=page.querySelector('table');if(!table)return;var body=table.querySelector('tbody');if(!body)return;
    var cats=['A1','A2','A6','A7','A8','A9','S1','S2','S6','S9','G1','G2','G6','G9','P1','P2','P3','P4','P5','P6','P7'];body.innerHTML='';
    cats.forEach(function(k){if(!BB[k])return;var tr=document.createElement('tr');var art=BB[k].teil?'Teilstat.':'Vollstat.';var html='<td><span class="pill p'+BB[k].grp+'">'+k+'</span></td><td>'+BB[k].name+'</td>';
      [0,1,2,3,5].forEach(function(i){html+='<td class="num"><input class="mw-v15" type="number" min="0" step="1" value="'+Math.round(BB[k].mw[i]||0)+'" data-cat="'+k+'" data-idx="'+i+'"></td>';});html+='<td>'+art+'</td>';tr.innerHTML=html;body.appendChild(tr);
    });
    Array.prototype.slice.call(body.querySelectorAll('input')).forEach(function(inp){inp.onchange=function(){var k=this.getAttribute('data-cat'),i=+this.getAttribute('data-idx');BB[k].mw[i]=Math.max(0,Math.round(+this.value||0));this.value=BB[k].mw[i];if(typeof onCfgChange==='function')onCfgChange();if(typeof calcPsyScenario==='function')calcPsyScenario();};});
    var info=page.querySelector('.alert');if(info)info.innerHTML='Alle Minutenwerte sind mit dem aktuellen Planungsstand vorbelegt und können für Szenariorechnungen direkt editiert werden.';
  }
  function presetButtons(){
    var wrap=document.querySelector('.psy-presets');if(!wrap)return;var buttons=Array.prototype.slice.call(wrap.querySelectorAll('button'));
    buttons.forEach(function(btn){btn.addEventListener('click',function(){buttons.forEach(function(b){b.classList.remove('v15-active');});btn.classList.add('v15-active');});});
  }
  function labels(){document.title='PPP-RL 2027 · Klinikplanung v15';var h=document.querySelector('.header-mid');if(h)h.textContent='Klinikplanung 2027 · Psychiatrie & Psychosomatik · v15';var live=document.querySelector('.chip.live');if(live)live.textContent='v15';var hb=byId('page-cfg');if(hb){var x=hb.querySelector('.hbox');if(x)x.textContent='Konfigurieren Sie jede Station einzeln: Name, Kapazität und reale Patientenzahlen je Kategorie. Die Konfiguration ist die gemeinsame Datenbasis für Idealbesetzung und Erfüllungsquoten.';}}
  function init(){addStyle();removeScenarios();accordion();ruleEditor();presetButtons();labels();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,80);});else setTimeout(init,80);
})();