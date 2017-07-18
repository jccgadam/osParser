

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
  name:'uploadCustomers'
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
