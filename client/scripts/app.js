var app = {
  users: {},
  rooms: {
    'New Room': 'New Room'
  },
  server: 'https://api.parse.com/1/classes/chatterbox'
};

app.init = function() {
  // Populate DOM with initial query
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
  app.username = window.location.search.slice(window.location.search.indexOf('=') + 1);
  $('.user-info').text('You are signed in as ' + app.username);
};

app.populate = function(data) {
  var $main = $('.mainContent');
  for (var i = 0; i < data.length; i++) {
    var $newDiv = $('<div class="' + app.escaped(data[i].roomname) + ' ' + app.escaped(data[i].username) + ' chat"></div>');
    $newDiv.append('Name: <a href="#" class="' + data[i].username + '">' + app.escaped(data[i].username));
    $newDiv.append('<p>Message: ' + app.escaped(data[i].text) + '<br>');
    $newDiv.append('Room: ' + app.escaped(data[i].roomname));

    if (app.users[data[i].username] === true) {
      $newDiv.addClass('bolded');
    }

    $main.append($newDiv);
  }
  app.friendListener();
};

app.escaped = function(string) {
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;',
    "{": '&#123',
    "}": '&#125',
    "[": '&#91',
    "]": '&#93',
    "!": '&#33',
    "`": '&#96',
    "@": '&#64',
    "$": '&#36',
    "%": '&#37',
    "(": '&#40',
    ")": '&#41',
    "=": '&#61',
    "+": '&#43',
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'{}!`@$%()=+\/]/g, function(s) {
      return entityMap[s];
    });
  }
  return escapeHtml(string);
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

app.addFriend = function(friend) {
  friendString = "." + friend;
  app.users[friend] = true;
  $(friendString).toggleClass('bolded');
};

// Adding friends
app.friendListener = function() {
  $('a').on('click', function() {
    var friend = $(this).attr('class');
    console.log('friend being passed', friend);
    app.addFriend(friend);
  });
};

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

  // Add a new roomname to the DOM and to the app
  if (!app.rooms[roomname]) {
    app.addRoom(roomname);
  }
  app.rooms[roomname] = roomname;

  // Rehide the add-room text input
  $('#add-room').val('').addClass('hidden');
};
