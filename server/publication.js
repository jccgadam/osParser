Meteor.publish('allProducts',function(){
  return productInfo.find();
})


Meteor.publish('allCustomers',function(){
  return customerInfo.find();
})


Meteor.publish('singleUser',function(id){
  return customerInfo.find(id)
})
