function loadScriptIfVersionChanged(scriptName) {
    var storedVersion = '4.25'
      const script = document.createElement('script');
      script.src = `assets/js/${scriptName}?v=${storedVersion}`;
      script.defer = true;
      document.head.appendChild(script);
}


loadScriptIfVersionChanged('popper.min.js');
loadScriptIfVersionChanged('main.js');
loadScriptIfVersionChanged('ps.js');


