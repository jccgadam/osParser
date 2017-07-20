
Template.allCustomers.helpers({
  doc:function(){
    return this;
  },
  setting:function(){
    return {
            rowsPerPage: 8,
            showFilter: true,
            fields: [
              {
                key:'customerName',label:'Customer Name',cellClass:'center',headerClass:'center',sortDirection:-1,sortOrder:1,
              },
              {
                key:'address.zip',label:'Zipcode',cellClass:'center',headerClass:'center'
              },
              {
                key:'refillProducts',label:'Item Count',cellClass:'center',headerClass:'center',fn:function(value){
                  return value.length;
                }
              },
              {
                key:'repunishDate',label:'Repunish Date',cellClass:'center',headerClass:'center',fn:function(value){
                  return moment(value).format('MM-DD-YYYY');
                }
              },
              {
                key:'status',label:'Status',cellClass:'center',headerClass:'center',
                  fn:function(value,object){
                    var _id = object._id;
                    if(value){
                       return new Spacebars.SafeString("<button class='btn btn-danger inactiveUser' id="+_id+">Inactive user</button>");
                    }
                    else return new Spacebars.SafeString("<button class='btn btn-success activeUser' id="+_id+">Active user</button>");
                }
              },
              {
                key:'status',label:'status',hidden:true,sortDirection:-1,sortOrder:0,fn:function(value){
                  if(value){
                    return 0
                  }
                  else return -1;
                }
              },
              {
                key:'_id',label:'Update',cellClass:'center',headerClass:'center',
                fn:function(value){
                  return new Spacebars.SafeString("<a href='/updateSingleUser/"+value+"'><button class='btn btn-primary' id="+value+">Update User</button></a>");
                }
              }
            ]
        };
  }
})


Template.allCustomers.events({
  'click .inactiveUser':function(e,t){
      e.preventDefault();
      var userId = e.target.id;
      bootbox.confirm('Inactive this user?',function(res){
        if(res){
            Meteor.call('inactiveUser',userId,function(error,res){
              if(error){
                console.log(error);
              }
            })
        }
      })

  },
  'click .activeUser':function(e,t){
      e.preventDefault();
      var userId = e.target.id;
      bootbox.confirm('re-active this user?',function(res){
        if(res){
            Meteor.call('activeUser',userId,function(error,res){
              if(error){
                console.log(error);
              }
            })
        }
      })

  }
})
