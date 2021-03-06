var headerRow1= ["Flag", "SONum", "Status", "CustomerName", "CustomerContact", "BillToName", "BillToAddress", "BillToCity", "BillToState", "BillToZip", "BillToCountry", "ShipToName", "ShipToAddress", "ShipToCity", "ShipToState", "ShipToZip", "ShipToCountry", "CarrierName", "TaxRateName", "PriorityId", "PONum", "VendorPONum", "Date", "Salesman", "ShippingTerms", "PaymentTerms", "FOB", "Note", "QuickBooksClassName", "LocationGroupName", "FulfillmentDate", "URL", "CarrierService", "DateExpired", "Phone", "Email", "CF-Custom", "CF-Commerce Channel"]
var headerRow1String = headerRow1.toString();
var headerRow2= ["Flag", "SOItemTypeID", "ProductNumber", "ProductDescription", "ProductQuantity", "UOM", "ProductPrice", "Taxable", "TaxCode", "Note", "QuickBooksClassName", "FulfillmentDate", "ShowItem", "KitItem", "RevisionLevel"];
var headerRow2String = headerRow2.toString();
var billingInfo = {
  BillToName:'Provectus Health',
  BillToZip:'30067',
  BillToCity:'Marietta',
  BillToState:'GA',
  BillToAddress:'1640 Powers Ferry Rd.Building 26, Suite 250',
  BillToCountry:'US'
}
function dataParser(dataBeforeParse){
  var orderData = [];
  orderData.push(headerRow1);
  orderData.push(headerRow2);
  _.each(dataBeforeParse,function(item){
      var orderInfo = item;
      var today = orderInfo.repunishDate||new Date();
      var formatDate = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
      var refillProducts = orderInfo.refillProducts;
      orderData.push(['SO','','10',orderInfo.business,orderInfo.business,orderInfo.customerName,orderInfo.address.street,orderInfo.address.city,orderInfo.address.state,orderInfo.address.zip,'UNITED STATES',orderInfo.customerName,orderInfo.address.street,orderInfo.address.city,orderInfo.address.state,orderInfo.address.zip,'UNITED STATES','USPS','None','30','','',formatDate,'steve.monnier@ihealthlabs.com','Prepaid & Billed','COD','Origin','','None','Sunnyvale',formatDate,'','','',orderInfo.phone,'','','']);
      for(var i=0;i<totalLength;i++){
        var refillProduct =refillProducts[i];
          orderData.push(
            ['Item','10',refillProduct.productName,'',refillProduct.quantity,'ea','','FALSE','NON','','None',formatDate,'FALSE','FALSE']
          )
      }
  })
  console.log(orderData);
  return orderData;
}


var index=0;
var insertCustomerInfo = function(item){
  var business = Session.get('business');
  var itemLength = item.length;
  var refillProducts =[];
  for(var i=6;i<itemLength;i++){
    if(item[i]&&item[i]!='0'){
      if(i===6){
        refillProducts.push({
          productName:'Control Solution',
          quantity:item[i]
        })
      }
      if(i===7){
        refillProducts.push({
          productName:'Test Strips',
          quantity:item[i]
        })
      }
      if(i===8){
        refillProducts.push({
          productName:'Lancets',
          quantity:item[i]
        })
      }
    }
  }

  var id = customerInfo.insert({
    customerName:item[0],
    phone:item[1],
    address:{
      street:item[2],
      city:item[3],
      state:item[4],
      zip:item[5],
    },
    refillProducts:refillProducts,
    business:business
  })
  if(id){
    var count = Session.get('totalCount')
    count++;
    Session.set('totalCount',count);
  }
}

var checkAndInsertCustomer = function(item,length){
  if(index>=length){
    return false;
  }
  index++;
  Meteor.call('findExistingCustomer',item,function(error,res){
    if(res.length>0){
      //if customer name exists
      var customerInfo = res;
      var resString ='';
      for(var i=0;i<res.length;i++){
        resString = resString+'Customer Name:'+res[i].customerName+'@'+res[i].business+'<br>';
      }
      bootbox.confirm({
        message: "Duplicate Customer name found. Do you still want to add this new customer?<br>"+resString,
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if(result){
              //if still add duplicate customer
                insertCustomerInfo(item);
                checkAndInsertCustomer(Session.get('insertData')[index],length);
            }
            else{
              //if do not insert duplicate customer
              var count = Session.get('totalCount')
              count++;
              Session.set('totalCount',count);
              checkAndInsertCustomer(Session.get('insertData')[index],length);
            }
        }
      })
    }
    //if new customer
    else{

          insertCustomerInfo(item);
          checkAndInsertCustomer(Session.get('insertData')[index],length);

        }
      })
}




Template.uploadCustomers.onCreated(function(){
  Session.set('insertData',[]);
  Session.set('companySel','');
  Session.set('totalCount',0);
  Session.set('orderData',[]);
  Tracker.autorun(() => {

      var totalUsers = Session.get('insertData').length;
      var totalCount = Session.get('totalCount');
      if(totalCount!==0&&(totalCount===totalUsers)){
        bootbox.alert('All users are handled!')
        Session.set('insertData',[]);
        Session.set('companySel','');
        Session.set('totalCount',0);
        $('#uploadCustomers').val('');
        $('#companySel').find('option:first').attr('selected', 'selected');
        index=0;
      }
  });

})



Template.uploadCustomers.helpers({
  doc:function(){
    var doc = Session.get('insertData');
    if(doc){
      return doc;
    }
  },
  businessOpt:function(){
    var companyOpts = companyInfo.find().fetch();
    console.log(companyOpts)
    return companyOpts;
  },
  disabled:function(){
    var business = Session.get('business');
    if(business){
      return ''
    }
    else return 'disabled'
  },
  settings:function(){
        return {
            showFilter:false,
            fields:[
              {
                key:'0',label:'Customer Name',cellClass:'center',headerClass:'center'
              },
              {
                key:'2',label:'Street',cellClass:'center',headerClass:'center'
              },
              {
                key:'3',label:'City',cellClass:'center',headerClass:'center'
              },
              {
                key:'4',label:'state',cellClass:'center',headerClass:'center'
              },
              {
                key:'5',label:'zipcode',cellClass:'center',headerClass:'center'
              },
              {
                key:'6',label:'CS',cellClass:'center',headerClass:'center'
              },
              {
                key:'7',label:'STR',cellClass:'center',headerClass:'center'
              }
            ]
          }
        }
})


Template.uploadCustomers.events({
  // 'change #uploadCustomers':function(e,t){
  //   var customerData = Papa.parse(e.target.files[0],{
  //     complete:function(res){
  //         var insertData = res.data;
  //         Session.set('insertData',res.data);
  //       }
  //     })
  // },


  //<!-----case for ProvectusiHealthOrders---->

  'change #uploadCustomers':function(e,t){
      var fileName = e.target.files[0].name;

      //if file name changes , change here
      console.log(fileName);
      var poNumber = fileName.split('ProvectusiHealthOrder_')[1].split('.csv')[0];
      console.log(poNumber);
      var orderData=[];
      var config = {
	                 header: true,
                   encoding: "utf8",
                 };
      Papa.parse(e.target.files[0],{
        header:true,
        complete:function(res){
          var dataBeforeParse = res.data;
          _.each(dataBeforeParse,function(item){
              var orderInfo = item;
              var today = new Date();
              var formatDate = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
              var totalLength = item.length;
              orderData.push(['SO','','20','Provectus Health Strategies','jterry@provectushealth.com','Provectus Health Strategies',billingInfo.BillToAddress,billingInfo.BillToCity,billingInfo.BillToState,billingInfo.BillToZip,'UNITED STATES',orderInfo.Name,orderInfo['Street Address - 1']+','+orderInfo['Street Address - 2'],orderInfo.City,orderInfo.State,orderInfo['Zip code'],'UNITED STATES','USPS','None','30',poNumber,'',formatDate,'steve.monnier@ihealthlabs.com','Prepaid & Billed','COD','Origin','','None','Sunnyvale',formatDate,'','','','','','','']);
                if(item['550BT']||item['BPE-S']||item['BPE-M']||item['BPE-Standard']||item['550BTS']||item['BP Track Standard']){
                  var count = item['550BT']||item['BPE-S']||item['BPE-M']||item['BPE-Standard']||item['550BTS']||item['BP Track Standard']
                  if(count!=0)
                  orderData.push(
                    ['Item','10','550BT Track','',count,'ea','0.0','FALSE','NON','','None',formatDate,'FALSE','FALSE']
                  )
                }
                if(item['BPE-L']||item['BPE-XL']||item['550BTXL']||item['BP Track XL']||item['550BT-XL']){
                  let count = item['BPE-L'] || item['BPE-L'] || item['BPE-XL'] || item['550BTXL']||item['']||item['550BT-XL'];
                  if(count!=0)
                  orderData.push(
                    ['Item','80','550BT-XL-KIT Track','',count,'ea','0.0','FALSE','NON','','None',formatDate,'FALSE','FALSE']
                  )
                }
                if(item['PO3']){
                  let count = item['PO3'];
                  if(count!=0)
                  orderData.push(
                    ['Item','10','PO3M Air','',item['PO3'],'ea','0.0','FALSE','NON','','None',formatDate,'FALSE','FALSE']
                  )
                }
                if(item['Cuff-550BT-S/L']){
                  let count = item['Cuff-550BT-S/L'];
                  if(count!=0)
                    orderData.push([
                        'Item','10','PO3M Air','',item['Cuff-550BT-S/L'],'ea','0.0','FALSE','NON','','None',formatDate,'FALSE','FALSE'
                    ])
                }
                if(item['BG5']){
                  let count = item['BG5'];
                  if(count!=0)
                  orderData.push(
                    ['Item','10','BG5 Smart','',item['BG5'],'ea','0.0','FALSE','NON','','None',formatDate,'FALSE','FALSE']
                  )
                }
                if(item['STR-50']||item['STRP']){
                  let count = item['STR-50']||item['STRP'];
                  if(count!=0)
                  orderData.push(
                    ['Item','10','BG-STR-2003','',item['STR-50']||item['STRP'],'ea','0.0','FALSE','NON','','None',formatDate,'FALSE','FALSE']
                  )
                }
                if(item['BG-LAN']||item['LAN']){
                  let count = item['BG-LAN']||item['LAN'];
                  if(count!=0)
                  orderData.push(
                    ['Item','10','Lancets','',item['BG-LAN']||item['LAN'],'ea','0.0','FALSE','NON','','None',formatDate,'FALSE','FALSE']
                  )
                }
                if(item['LANCING DEVICE']||item['Lancing Device']||item['LAN-DEV']){
                  let count = item['LANCING DEVICE']||item['Lancing Device']||item['LAN-DEV'];
                  if(count!=0)
                  orderData.push(
                    ['Item','10','Lancing Device','',count,'ea','0.0','FALSE','NON','','None',formatDate,'FALSE','FALSE']
                  )
                }
                if(item['Control Solution']||item['CTR']|| item['CTR ']){
                  let count = item['Control Solution']||item['CTR']|| item['CTR '];
                  if(count!=0)
                  orderData.push(
                    ['Item','10','Control Solution','',item['Control Solution']||item['CTR']||item['CTR '],'ea','0.0','FALSE','NON','','None',formatDate,'FALSE','FALSE']
                  )
                }

              // var csvString = JSON.stringify(orderData);
              // console.log(csvString);

          })
          var csvString = Papa.unparse(orderData);
          csvString = headerRow1String+'\n'+headerRow2String+'\n'+csvString;

         var blob = new Blob([csvString]);
         if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
             window.navigator.msSaveBlob(blob, "filename.csv");
         else
         {
             var a = window.document.createElement("a");
             a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
             a.download = "filename.csv";
             document.body.appendChild(a);
             a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
             document.body.removeChild(a);
         }

        }
      })

  },
  // <!-----case for ProvectusiHealthOrders---->

  // 'change #uploadCustomers':function(e,t){
  //     var orderData=[];
  //     var config = {
	//                  header: true,
  //                  encoding: "utf8",
  //                };
  //     Papa.parse(e.target.files[0],{
  //       complete:function(res){
  //         var dataBeforeParse = res.data;
  //         dataBeforeParse = dataBeforeParse.slice(1,dataBeforeParse.length);
  //         console.log(dataBeforeParse);
  //         _.each(dataBeforeParse,function(item){
  //           console.log(item);
  //             var orderInfo = item;
  //             var today = new Date();
  //             var formatDate = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
  //             var totalLength = item.length;
  //             orderData.push(['SO','','20','Woot.com','','Woot.com','4121 International Pkwy','Carrollton','TX','75007','UNITED STATES',orderInfo[3],orderInfo[4]+','+orderInfo[5],orderInfo[6],orderInfo[7],orderInfo[8],'UNITED STATES',orderInfo[16],'None','30',orderInfo[2],'',formatDate,'Wade.shu@ihealthlabs.com','Prepaid & Billed','COD','Origin','','None','Sunnyvale',formatDate,'',orderInfo[17],orderInfo[10],'','','','']);
  //             orderData.push(['Item','10','HS4 Lite','',orderInfo[14],'ea','46.49','FALSE','NON','','None',formatDate,'FALSE','FALSE']);
  //         })
  //         var csvString = Papa.unparse(orderData);
  //         csvString = headerRow1String+'\n'+headerRow2String+'\n'+csvString;
  //
  //        var blob = new Blob([csvString]);
  //        if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
  //            window.navigator.msSaveBlob(blob, "filename.csv");
  //        else
  //        {
  //            var a = window.document.createElement("a");
  //            a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
  //            a.download = "filename.csv";
  //            document.body.appendChild(a);
  //            a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
  //            document.body.removeChild(a);
  //        }
  //
  //       }
  //     })
  //
  // },
  'change #companySel':function(e,t){
    e.preventDefault();
    var opt = $(e.target).find('option:selected').val();
    Session.set('business',opt);
  },
  'click .confirmAndUpload':function(e,t){
      e.preventDefault();
      var business = Session.get('business');
      bootbox.confirm({
            message:'Confirm customers to upload ? Business Name: '+business,
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                },
              },
              callback:function(res){
                    if(res){
                      console.log('called');
                      var insertData = Session.get('insertData');
                      console.log('insertData',insertData);
                      checkAndInsertCustomer(insertData[0],insertData.length);
                    }
                }
              })
          },
    'click .resetUsers':function(e,t){
        e.preventDefault();
        var selectUsers = Session.get('insertData');
        if(selectUsers.length){
          $('#uploadCustomers').val('');
          $('#companySel').find('option:first').attr('selected', 'selected');
          Session.set('insertData',[]);
        }
    }
})
