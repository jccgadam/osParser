var index=0;
var insertCustomerInfo = function(item){
  var business = Session.get('business');
  customerInfo.insert({
    customerName:item[0],
    address:{
      street:item[2],
      city:item[3],
      state:item[4],
      zip:item[5],
    },
    refillProducts:[
      {
        productName:'Control Solution',
        quantity:item[6]||0
      }
    ],
    business:business
  })
}

var checkAndInsertCustomer = function(item,length){
  if(index>=length){
    return false;
  }
  index++;
  Meteor.call('findExistingCustomer',item,function(error,res){
    if(res.length>0){
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
                insertCustomerInfo(item);
                checkAndInsertCustomer(Session.get('insertData')[index],length);
            }
            else{
              checkAndInsertCustomer(Session.get('insertData')[index],length);
            }
        }
      })
    }
    else{
          insertCustomerInfo(item);
          checkAndInsertCustomer(Session.get('insertData')[index],length);

        }
      })
}

Template.uploadCustomers.helpers({
  doc:function(){
    var doc = Session.get('insertData');
    if(doc){
      return doc;
    }
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
            // bootbox.confirm('Do you want to add customers?')
            // checkAndInsertCustomer(insertData[index],insertData.length);

        }
      })
  },
  'blur #business':function(e,t){
    e.preventDefault();
    var business = e.target.value;
    Session.set('business',business)
  },
  'click .confirmAndUpload':function(e,t){
      e.preventDefault();
      bootbox.confirm({
            message:'Confirm customers to load ?',
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

          }
})
