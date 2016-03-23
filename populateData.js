var  newDate = new Date(2016, 2, 21);
var limit = new Date(2016, 5, 15);
while (newDate < limit ){
  populateDates(newDate);
  newDate.setDate(newDate.getDate() + 1);
}

function populateDates(newDate) {
  print('adding ' + newDate);
  var update = db.dates.insert({
    dateVal: newDate,
    photographerIds:[]
  });
  if (update) {
    print('update ' + newDate);
  }
}
