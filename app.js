(function(){
  function load(src){
    return new Promise(function(resolve,reject){
      var s=document.createElement('script');
      s.src=src;
      s.onload=resolve;
      s.onerror=function(){reject(new Error('Konnte '+src+' nicht laden'));};
      document.head.appendChild(s);
    });
  }
  load('app-core.js')
    .then(function(){return load('app-config.js');})
    .then(function(){return load('app-main.js');})
    .then(function(){return load('v15-patch.js');})
    .catch(function(err){console.error('PPP-RL Startfehler',err);});
})();