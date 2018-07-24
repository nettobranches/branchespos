Vue.filter('currency', function (money) {
  return accounting.formatMoney(money)
})
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY HH:mm')
  }
})
