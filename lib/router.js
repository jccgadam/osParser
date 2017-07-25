

Router.route('/',{
    template:'allCustomers',
    waitOn:function(){
      return Meteor.subscribe('allCustomers');
    },
    data:function(){
      return customerInfo.find();
    }
})

Router.route('/allCustomers',{
  name:'allCustomers',
  waitOn:function(){
    return Meteor.subscribe('allCustomers');
  },
  data:function(){
    return customerInfo.find();
  }
})

Router.route('/uploadCustomers',{
  name:'uploadCustomers',
  waitOn:function(){
    return Meteor.subscribe('allBusiness');
  }
})

Router.route('/updatesingleuser/:id',{
  name:'updateSingleUser',
  waitOn:function(){
    return Meteor.subscribe('singleUser',this.params.id);
  },
  data:function(){
    return customerInfo.findOne();
  }
})

Router.route('/insertBusiness')

Router.route('/allBusiness',{
  waitOn:function(){
    return Meteor.subscribe('allBusiness')
  },
  data:function(){
    return companyInfo.find().fetch();
  }
})

Router.route('/updateBusiness/:id',{
  name:'updateBusiness',
  waitOn:function(){
    return Meteor.subscribe('singleBusiness',this.params.id)
  },
  data:function(){
    return companyInfo.findOne();
  }
})
