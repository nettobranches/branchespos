var onBarcodeScan = function(code){
      // console.log('code', code);
}

var __upc = '';
document.addEventListener("keypress", function(e) {
      // console.log('input',e);
      var inputChar = event.key;
      var charCode = event.charCode;
      var targetName = event.target.localName;
      // console.log('inputChar', inputChar);

      if(charCode >= 48 && charCode <= 57 ){
            __upc += inputChar;
      }
      if(charCode == 13 && __upc.length > 6 ){
            onBarcodeScan(__upc);
            __upc = '';
      }
      setTimeout(function(){ __upc = ''; }, 250);

});
