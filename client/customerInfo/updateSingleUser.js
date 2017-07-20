
Template.updateSingleUser.events({
  'click #returnButton':function(e,t){
    e.preventDefault();
    window.history.back();
  },
  'change #companySel':function(e,t){
    e.preventDefault();
    var opt = e.target.find('option:selected')
    console.log(opt);
  }
})

AutoForm.addHooks('updateSingleUser',{
  onSuccess:function(){
    bootbox.alert('Update Succeeded!')
  }
})
