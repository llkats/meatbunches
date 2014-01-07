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
        'width' : '200', 
        'fingerprint' : data.meat.chat.value.fingerprint
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
      if (fingerprints.indexOf(data.meat.chat.value.fingerprint) !== -1){
        return;
      }
       $('[data-empty]').first().attr({
        'src': data.meat.chat.value.media, 
        'data-fingerprint': data.meat.chat.value.fingerprint
      }).removeAttr('data-empty');
      return;
    }
  });

  // remove an unwanted gif
  $('ul').on('click', 'a:not(:eq(4))', function(e) {
    e.preventDefault();
    //removing gif is not a permanent block, so we should let them back in if they post again to chat.meatspace,
    //therefore we need to remove their fingerprint from the array
    var fingerprintToRemove = $(e.currentTarget).find('img').attr("data-fingerprint");
    var index = fingerprints.indexOf(fingerprintToRemove);
    if (index > -1){
      fingerprints.splice(index, 1);
    }
    $(e.currentTarget).find('img').attr({'src' : '', 'data-empty' : ''}).removeAttr('data-fingerprint');;

  });

}(jQuery));
