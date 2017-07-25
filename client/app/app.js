

Template.header.events({
  'mouseenter .topDropDown':function(e,t){
      e.preventDefault();
      var target = e.target;
      $(target).children('ul.menuDropDown').slideToggle(400);
  },
  'mouseleave .topDropDown':function(e,t){
      e.preventDefault();
      var target = e.target;
      $(target).children('ul.menuDropDown').slideToggle(400);
  }
})
