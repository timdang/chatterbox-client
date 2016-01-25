var app = {};

app.init = function () {};

app.send = function (message) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data){ console.log('chatterbox: Message sent. Data: ', data); },
    error: function(data) { console.log('chatterbox: Failed to send message. Error: ', data); }
  });
};
