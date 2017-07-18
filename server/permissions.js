salesOrders.allow({
  'insert':function(){
    return true;
  }
})

customerInfo.allow({
  'insert':function(){
    return true;
  },
  'update':function(){
    return true;
  }
})
