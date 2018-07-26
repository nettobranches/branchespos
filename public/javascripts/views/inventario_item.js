var curr_url = window.location.href;
console.log('url', curr_url.split('/').pop());
var itemId =  curr_url.split('/').pop();
vm.list_inventario_item(itemId);
vm.list_colors();
