Meteor.publish('allProducts',function(){
  return productInfo.find();
})


Meteor.publish('allCustomers',function(){
  return customerInfo.find({},{fields:{customerName:1,'address.zip':1,status:1,'refillProducts':1,'repunishDate':1}});
})


Meteor.publish('singleUser',function(id){
  return customerInfo.find(id)
})


Meteor.publish('allBusiness',function(){
  return companyInfo.find();
})

Meteor.publish('singleBusiness',function(id){
  return companyInfo.find(id)
})
