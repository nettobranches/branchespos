var onBarcodeScan = function(code){
      console.log('code', code);
}

var __upc = '';
document.addEventListener("keypress", function(e) {
      console.log('input',e);
      var inputChar = e.key;
      var charCode = e.charCode;
      var keyCode = e.keyCode;
      var targetName = e.target.localName;
      // console.log('inputChar', inputChar);

      if(charCode >= 48 && charCode <= 122 ){
            __upc += inputChar;
      }
      if(keyCode == 13 && __upc.length > 6 ){
            onBarcodeScan(__upc);
            __upc = '';
      }
      setTimeout(function(){ __upc = ''; }, 250);

});
