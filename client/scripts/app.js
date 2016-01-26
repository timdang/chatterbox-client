var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function() {
  app.fetch(app.populate);
};

app.populate = function(data){
  var retrievedData = data.results;
    var $main = $('#main');
  for (var i = 0; i < retrievedData.length; i++) {
    $main.append('<div class="' + retrievedData[i].roomname +
      '">Name: ' + retrievedData[i].name +
      '\nMessage: ' + retrievedData[i].message + '</div>');
  }
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message sent. Data: ', data);
    },
    error: function(data) {
      console.log('chatterbox: Failed to send message. Error: ', data);
    }
  });
};

app.fetch = function(callback) {
  $.ajax({
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Fetched. Data: ', data);
      callback(data);
    },
    error: function() {
      console.log('chatterbox: Failed to fetch data. Error');
    }
  });
};
