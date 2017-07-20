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
        resString = resString+'Customer Name:'+res[i].customerName+'@'+res[i].address.zip+'<br>';
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

  Tracker.autorun(() => {

      var totalUsers = Session.get('insertData').length;
      var totalCount = Session.get('totalCount');
      if(totalCount!==0&&(totalCount===totalUsers)){
        bootbox.alert('All users are handled!')
        Session.set('insertData',[]);
        Session.set('companySel','');
        Session.set('totalCount',0);
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
  'change #uploadCustomers':function(e,t){
    var customerData = Papa.parse(e.target.files[0],{

      complete:function(res){
          var insertData = res.data;
          Session.set('insertData',res.data);
        }
      })
  },
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
                      var insertData = Session.get('insertData');
                      checkAndInsertCustomer(insertData[index],insertData.length);
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
