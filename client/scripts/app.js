var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function() {
  app.fetch(app.populate);
};

app.populate = function(data) {
  var $main = $('#main');
  for (var i = 0; i < data.length; i++) {
    $main.append('<div class="' + data[i].roomname +
      '">Name: ' + data[i].name +
      '\nMessage: ' + data[i].message + '</div>');
  }
};

app.send = function(message, callback) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message sent. Data: ', data);
      callback(data);
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
      callback(data.results);
    },
    error: function() {
      console.log('chatterbox: Failed to fetch data. Error');
    }
  });
};

app.clearMessages = function() {
  $('#main').children('div').remove();
};

app.addMessage = function(username, text, roomname) {
  app.send({
    username: username,
    text: text,
    roomname: roomname
  }, function(data) {
    app.populate(data);
  });
};

app.addRoom = function() {};

app.addFriend = function() {};

app.handleSubmit = function() {};
