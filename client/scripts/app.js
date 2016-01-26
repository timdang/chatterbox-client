var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function() {
  app.fetch(app.populate, '?order=-createdAt');

  // Collect username from initial load
  var username = window.location.search.slice(window.location.search.indexOf('=') + 1);
  $('.user-info').text('You are signed in as ' + username);

  $('.send-button').on('click', function() {
    app.handleSubmit(username);
  });

  $('#room-name').children('options').on('click', function() {
    //when new room is selected

    //when existing room is selected
    var selectedRoom = $('#room-name option:selected').text();

    // Clear and populate with messages filtered by roomname.
    app.fetch(function(data) {
      app.clearMessages();
      app.populate(
        data.filter(function(message) {
          if (message.roomname === selectedRoom) {
            return message;
          }
        })
      );
    });
  });
};

app.populate = function(data) {
  var $main = $('.mainContent');
  for (var i = 0; i < data.length; i++) {
    $main.append('<div class="' + data[i].roomname +
      '"><p>Name: ' + data[i].username +
      '<br>Message: ' + data[i].text + '</p><div>');
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

app.fetch = function(callback, queryParams) {
  $.ajax({
    url: queryParams === undefined ? app.server : app.server + queryParams,
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
  $('.mainContent').children('div').remove();
};

app.addMessage = function(username, text, roomname) {
  app.send({
    username: username,
    text: text,
    roomname: roomname
  }, function(data) {
    app.clearMessages();
    app.fetch(app.populate, '?order=-createdAt');
  });
};

app.addRoom = function() {};

app.addFriend = function() {};

app.handleSubmit = function(username) {
  app.addMessage(
    //username
    username,
    //text
    $('#message-text').val(),
    //roomname
    $('#room-name option:selected').text()
  );
};
