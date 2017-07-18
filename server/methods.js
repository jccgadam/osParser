


Meteor.methods({
    'findExistingCustomer':function(customerData){

      var res = customerInfo.find({'customerName':customerData[0]}).fetch();
      if(res.length>0){
        return res;
      }
      else return [];
    }
})


Meteor.methods({
  'inactiveUser':function(userId){
    customerInfo.update({'_id':userId},{$set:{status:false}});
  },
  'activeUser':function(userId){
    customerInfo.update({'_id':userId},{$set:{status:true}});
  }
})
