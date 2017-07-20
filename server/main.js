import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  SyncedCron.add({
  name: 'Export sales orders to folder',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 2 mins');
  },
  job: function() {
    Meteor.call('saveFile',function(error,res){
      Meteor.call('updateNextRepunishDate',res)
    });
  }
  });
  SyncedCron.start();
});
