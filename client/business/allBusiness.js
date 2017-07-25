
Template.allBusiness.helpers({
  doc:function(){
    return this;
  },
  setting:function(){
    return {
      rowsPerPage: 8,
      showFilter: true,
      fields: [
        {
          key:'companyName',label:'Company Name',cellClass:'center',headerClass:'center',sortDirection:-1,sortOrder:1,
        },
        {
          key:'productInfo',label:'Products Count',cellClass:'center',headerClass:'center',fn:function(value){
            if(value)
              return value.length;

              else return 0;
          }
        },
        {
          key:'_id',label:'Update',cellClass:'center',headerClass:'center',
          fn:function(value){
            return new Spacebars.SafeString("<a href='/updateBusiness/"+value+"'><button class='btn btn-primary' id="+value+">Update Company</button></a>");
          }
        }
      ]
    }
  }
})
