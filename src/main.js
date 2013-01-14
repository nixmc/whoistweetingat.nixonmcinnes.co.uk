// name: Persons actual name
// twitter_account: screen_name on twitter
// nmsite: slug to their NM profile.
// initials: initials for co-tags

var data = {
  teams: [{
      name: "Steel Rain",
      members: [
        {name: "Ruth", twitter_account: "ruharper", nmsite: "ruth", initials: "RH"},
        {name: "Clive", twitter_account: "CliveAndrews", nmsite: "clive", initials: "CA"},
        {name: "Danny", twitter_account: "DanielleSheerin", nmsite: "dannielle", initials: "DS"},
        {name: "Jenni", twitter_account: "JenniLloyd", nmsite: "jenni", initials: "JL"}
      ]
    },
    {
      name: "Thunder Fox",
      members: [
        {name: "Ross", twitter_account: "RossBreadmore", nmsite: "ross", initials: "RB"},
        {name: "Max", twitter_account: "maxwellinever", nmsite: "max", initials: "MS"},
        {name: "Will", twitter_account: "WillMcInnes", nmsite: "will", initials: "WM"},
        {name: "Bruce", twitter_account: "bbonus", nmsite: "", initials: "BW"}
      ]
    },
    {
      name: "Hammer of Thor",
      members: [
        {name: "Julian", twitter_account: "JulianNewby", nmsite: "julian", initials: "JN"},
        {name: "Anna", twitter_account: "Carlsonator", nmsite: "anna", initials: "AC"},
        {name: "Caz", twitter_account: "caz_notyetman", nmsite: "caroline", initials: "CY"},
        {name: "Belinda", twitter_account: "contentqueen", nmsite: "belinda", initials: "BRG"}
      ]
    }
    // {
    //   name: "Cosmic Fieldmice",
    //   members: [
    //   ]
    // }
  ]
};

$(document).ready(function(){
  // fill up the templates
  var mydate = new Date();
  var current_week = mydate.getWeek(1) % 3;
  var next_week = current_week == 2 ? 0 : current_week + 1;

  var template = $("#template").html();
  $.tmpl(template, data.teams[current_week]).appendTo($("#main"));
  return_junk();

  var members = []
  for(var x = 0; x < data.teams.length; x = x+1){
    if(current_week != x && next_week != x){
      members = members.concat(data.teams[x].members);
    }
  }
  var everybody_else_template = $("#everybody_else_template").html();
  $.tmpl(everybody_else_template, {members: members, next_week: data.teams[next_week]}).appendTo($("#main"));
});

var return_junk = function(twitter_account){
  $("li span.member").each(function(){
    var $item = $(this);
    var $placeholder = $(this).find('span.loading');
    var classes = $(this).attr("class").split(" ");
    var default_avatar = '<img src="http://si0.twimg.com/images/dev/cms/intents/bird/bird_blue/bird_48_blue.png">';
    var missing_avatar = '<img src="/images/default.jpg">';
    if(classes.length > 1 && classes[1] != ""){
      $.ajax({
        url: 'https://api.twitter.com/1/users/show.json',
        dataType: 'json',
        data: 'screen_name=' + classes[1] + '&callback=?',
        success: function(data){
          if(data){
            if(data.profile_image_url){
              $placeholder.html('<img src="' + data.profile_image_url + '">');
            }
            else{
              $placeholder.html(default_avatar);
            }
          }
          else{
            $placeholder.html(default_avatar);
          }
        },
        error: function(xhr, error){
          $placeholder.html(default_avatar);
        }
      });
    }
    else{
      $placeholder.html(missing_avatar);
    }
  });

}

/**
* Returns the week number for this date. dowOffset is the day of week the week
* "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
* the week returned is the ISO 8601 week number.
* @param int dowOffset
* @return int
*/
Date.prototype.getWeek = function (dowOffset) {
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

  dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
  var newYear = new Date(this.getFullYear(),0,1);
  var day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = (day >= 0 ? day : day + 7);
  var daynum = Math.floor((this.getTime() - newYear.getTime() - (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
  var weeknum;
  //if the year starts before the middle of a week
  if(day < 4) {
    weeknum = Math.floor((daynum+day-1)/7) + 1;
    if(weeknum > 52) {
      nYear = new Date(this.getFullYear() + 1,0,1);
      nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
      the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  }
  else {
    weeknum = Math.floor((daynum+day-1)/7);
  }
  return weeknum;
};
