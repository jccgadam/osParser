import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  SyncedCron.add({
  name: 'Export sales orders to folder',
  schedule: function(parser) {
    // parser is a later.parse object
    // export all orders need to be shipped within before this week.
      return parser.text('every 5 min');
      // return parser.text('every 5 min ');
  },
  job: function() {
    Meteor.call('saveFile',function(error,res){
      Meteor.call('updateNextRepunishDate',res)
    });
  }
  });
  SyncedCron.start();
});
