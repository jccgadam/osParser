
const Baby = require('babyparse');
const spawn = require('child_process').spawn;
const fs = require('fs');

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

Meteor.methods({
  'selectUsers':function(){
    var endofWeek = moment().endOf('week').toDate();
    var selectedUsers = customerInfo.find({repunishDate:{$lt:endofWeek}})

  }
})


function dataParser(dataBeforeParse){
  var orderData = [];
  _.each(dataBeforeParse,function(item){
      var orderInfo = item;
      var today = orderInfo.repunishDate||new Date();
      var formatDate = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
      var totalLength = orderInfo.refillProducts.length;
      var refillProducts = orderInfo.refillProducts;
      orderData.push(['SO','','10',orderInfo.business,orderInfo.business,orderInfo.customerName,orderInfo.address.street,orderInfo.address.city,orderInfo.address.state,orderInfo.address.zip,'UNITED STATES',orderInfo.customerName,orderInfo.address.street,orderInfo.address.city,orderInfo.address.state,orderInfo.address.zip,'UNITED STATES','USPS','None','30','','',formatDate,'steve.monnier@ihealthlabs.com','Prepaid & Billed','COD','Origin','','None','Sunnyvale',formatDate,'','','',orderInfo.phone,'','','']);
      for(var i=0;i<totalLength;i++){
        var refillProduct =refillProducts[i];
          orderData.push(
            ['Item','10',refillProduct.productName,'',refillProduct.quantity,'ea','','FALSE','NON','','None',formatDate,'FALSE','FALSE']
          )
      }
  })
  return orderData;
}

Meteor.methods({
  saveFile: function() {
    var endofWeek = moment().endOf('week').toDate();
    var today = moment(new Date()).format('MM-DD-YY');
    var selectedUsers = customerInfo.find({repunishDate:{$lt:endofWeek}}).fetch();
    if(selectedUsers.length)
    {
      headerRow1=["Flag", "SONum", "Status", "CustomerName", "CustomerContact", "BillToName", "BillToAddress", "BillToCity", "BillToState", "BillToZip", "BillToCountry", "ShipToName", "ShipToAddress", "ShipToCity", "ShipToState", "ShipToZip", "ShipToCountry", "CarrierName", "TaxRateName", "PriorityId", "PONum", "VendorPONum", "Date", "Salesman", "ShippingTerms", "PaymentTerms", "FOB", "Note", "QuickBooksClassName", "LocationGroupName", "FulfillmentDate", "URL", "CarrierService", "DateExpired", "Phone", "Email", "CF-Custom", "CF-Commerce Channel"]
      headerRow1String = headerRow1.toString();
      headerRow2=["Flag", "SOItemTypeID", "ProductNumber", "ProductDescription", "ProductQuantity", "UOM", "ProductPrice", "Taxable", "TaxCode", "Note", "QuickBooksClassName", "FulfillmentDate", "ShowItem", "KitItem", "RevisionLevel"];
      headerRow2String = headerRow2.toString();
       json = dataParser(selectedUsers);
       var data = Baby.unparse(json);
       data = headerRow1String + '\r\n'+headerRow2String + '\r\n'+data;
       var newFile = new FS.File();
       data = new Buffer(data);
       newFile.attachData(data,{type:'text/plain'});
       newFile.name(today+'.csv');
       var id = salesOrders.insert(newFile)
       if(id){
        var idArray = _.map(selectedUsers,function(k,v){
           return k._id
         })
       }

       return idArray;
     }
     return;

  }
});

Meteor.methods({
  'updateNextRepunishDate':function(res){
    if(res){
      for(var i=0;i<res.length;i++)
      {
        var v = res[i];
        var customerDoc = customerInfo.findOne({'_id':v});
        var nextrepunishDate = moment(customerDoc.repunishDate).add(1 ,'week').toDate();
        customerInfo.update({'_id':v},{$set:{repunishDate:nextrepunishDate}});
      }
    }
  }
})
