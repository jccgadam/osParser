import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
var createDownload = function(csvString){
  var blob = new Blob([csvString]);
        var a = window.document.createElement("a");
        a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
        fileName = $('#fileName').val();
        a.download = fileName+".csv";
        document.body.appendChild(a);
        a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
        document.body.removeChild(a);

  }
  var saveFile = function(data){
      var blob = new Blob([data]);
      var file = new File([blob],'dummyname')
      var fsFile = new FS.File(file);
      fsFile.name('test.csv');
      // fsFile.size = file.size;
      salesOrders.insert(fsFile,function(error,res){
        if(error){
          console.log(error)
        }
        else{
          alert('inserted')
        }
      })
  }


var parseSalesOrder = function(dataBeforeParse){
  headerRow1=["Flag", "SONum", "Status", "CustomerName", "CustomerContact", "BillToName", "BillToAddress", "BillToCity", "BillToState", "BillToZip", "BillToCountry", "ShipToName", "ShipToAddress", "ShipToCity", "ShipToState", "ShipToZip", "ShipToCountry", "CarrierName", "TaxRateName", "PriorityId", "PONum", "VendorPONum", "Date", "Salesman", "ShippingTerms", "PaymentTerms", "FOB", "Note", "QuickBooksClassName", "LocationGroupName", "FulfillmentDate", "URL", "CarrierService", "DateExpired", "Phone", "Email", "CF-Custom", "CF-Commerce Channel"]
  headerRow1String = headerRow1.toString();
  headerRow2=["Flag", "SOItemTypeID", "ProductNumber", "ProductDescription", "ProductQuantity", "UOM", "ProductPrice", "Taxable", "TaxCode", "Note", "QuickBooksClassName", "FulfillmentDate", "ShowItem", "KitItem", "RevisionLevel"];
  headerRow2String = headerRow2.toString();
  var data = Papa.unparse({
                           fields:headerRow1,
                           data:dataBeforeParse
                         })
  data = data.replace(headerRow1String,headerRow1String+'\r\n'+headerRow2String);
  // createDownload(data);
  console.log(data)
  saveFile(data)
  Session.set('dataBeforeParse','');
}

Tracker.autorun(function() {
    var sessionVal = Session.get("dataBeforeParse");
    if(sessionVal&&sessionVal.length)
      parseSalesOrder(sessionVal);
});

Template.upload.onCreated(function(){
  Session.set('dataBeforeParse',[]);
  Meteor.subscribe('allProducts');
})

Template.upload.helpers({
  orderData:function(){
    return Session.get('dataBeforeParse');
  },
  doc:function(){
    return productInfo.find().fetch();
  }
})
Template.upload.events({
  'change #uploadFile':function(e,t){
    var file = e.currentTarget.files[0];
    var fileRes = [];
    var config = {
	                 header: true,
                   encoding: "utf8",
                 };

    Papa.parse(file,{
          config:config,
          complete:function(res){
            var orderData =[];
            var dataBeforeParse  = res.data;

              _.each(dataBeforeParse,function(item){
                  var orderInfo = item;
                  var today = new Date();
                  var formatDate = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
                  var totalLength = item.length;
                  orderData.push(['SO','','10','WellSmith','WellSmith',orderInfo[0],orderInfo[2],orderInfo[3],orderInfo[4],orderInfo[5],'UNITED STATES',orderInfo[0],orderInfo[2],orderInfo[3],orderInfo[4],orderInfo[5],'UNITED STATES','USPS','None','30','','',formatDate,'steve.monnier@ihealthlabs.com','Prepaid & Billed','COD','Origin','','None','','Sunnyvale',formatDate,'','','','','','','']);
                  for(var i=6;i<totalLength;i++){
                    var itemNo = i;
                    if(itemNo===6&&item[i]){
                      orderData.push(
                        ['Item','10','Control Solution','Control Solution for test strips, BG Parts',item[i],'ea','10.00','FALSE','NON','','None',formatDate,'FALSE','FALSE']
                      )
                    }
                  }

              })
              Session.set('dataBeforeParse',orderData);
          }
     })
  },
  'blur #fileName':function(e,t){
       e.preventDefault();
       console.log(e.target.value)
       if(e.target.value!=''){
         console.log(e.target.value)
         $('#uploadFile').removeAttr('disabled');
       }
  }
})
