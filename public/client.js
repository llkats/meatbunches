(function($) {

  var socket = io.connect('http://meatbunch.es');
  var template = $('#template').html();
  var fingerprints = [];

  socket.on('newmeat', function (data) {

    var copy = $(template).clone();
    var list = $('#meats');
    var images = $('img');

    if (images.length < 9) {

      //make sure that each fingerprint is unique. Want each of the 8 to be different, just like the BB
      if (fingerprints.indexOf(data.meat.chat.value.fingerprint) !== -1){
        return;
      }
      fingerprints.push(data.meat.chat.value.fingerprint);

      // search for empty images, fill them with new data
      if ($('[data-empty]').length > 0) {
        $('[data-empty]').first().attr('src', data.meat.chat.value.media).removeAttr('data-empty');
        return;
      }

      // otherwise fill the template in with data
      copy.find('img').attr({
        'src' : data.meat.chat.value.media,
        'height' : '150',
        'width' : '200'
      });

      // if the image is the 4th one appended (counting from zero), create the meatspace logo
      if (images.length == 3) {
        list.append(copy);

        var template2 = $(template).clone();
        template2.find('img').addClass('logo').attr({
          'src' : '/meatspace.svg',
          'height' : '150',
          'width' : '200'
        });
        template2.find('a').addClass('logolink');

        list.append(template2);
      } else {
        list.append(copy);
      }
    }

    // else add new data to elements already present
    else if ($('[data-empty]').length > 0) {
      $('[data-empty]').first().attr('src', data.meat.chat.value.media).removeAttr('data-empty');
      return;
    }
  });

  // remove an unwanted gif
  $('ul').on('click', 'a:not(:eq(4))', function(e) {
    e.preventDefault();

    $(e.currentTarget).find('img').attr({'src' : '', 'data-empty' : ''});
  });

}(jQuery));
