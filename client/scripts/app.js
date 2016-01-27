var app = {
  users: {},
  rooms: {
    'New Room': 'New Room'
  }
};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function() {
  app.fetch(function(data) {
    app.populate(data);
    data.forEach(function(message) {
      if (message.roomname === undefined) {
        message.roomname = 'All Rooms';
      }
      if (app.rooms[message.roomname] === undefined) {
        app.addRoom(message.roomname);
        app.rooms[message.roomname] = message.roomname;
      }
    });
    $('#room-name').append('<option>New Room<option>');
  }, '?order=-createdAt');

  // Collect username from initial load
  var username = window.location.search.slice(window.location.search.indexOf('=') + 1);
  $('.user-info').text('You are signed in as ' + username);

  $('.send-button').on('click', function() {
    app.handleSubmit(username);
  });

  $('#room-name').on('change', function() {
    var selectedRoom = $('#room-name option:selected').text();
    //when new room is selected
    if (selectedRoom === 'New Room') {
      $('#add-room').removeClass('hidden');
    }

    // Clear and populate with messages filtered by roomname.
    app.fetch(function(data) {
      app.clearMessages();

      var selectedRoomMessages = data.filter(function(message) {
        return (selectedRoom === 'All Rooms' || message.roomname === selectedRoom);
      });

      app.populate(selectedRoomMessages);
    }, '?order=-createdAt');
  });
};

app.populate = function(data) {
  var $main = $('.mainContent');
  for (var i = 0; i < data.length; i++) {
    $main.append('<div class="' + data[i].roomname +
      '"><p>Name: ' + data[i].username +
      '<br>Message: ' + data[i].text + '<br>Room: ' + data[i].roomname + '</p><div>');
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
    $('#message-text').val('');
  });
};

app.addRoom = function(roomname) {
  $('#room-name').append('<option>' + roomname + '</option>');
};

app.addFriend = function() {};

app.handleSubmit = function(username) {
  var roomname = $('#add-room').val() || $('#room-name option:selected').text();
  app.addMessage(
    //username
    username,
    //text
    $('#message-text').val(),
    //roomname
    roomname
  );
  if (!app.rooms[roomname]) {
    app.addRoom(roomname);
  }
  app.rooms[roomname] = roomname;
  $('#add-room').val('').addClass('hidden');
};
