// Counter Function js

$( document ).ready(function () {
  $('textarea').on('keyup', function(event) {
    var charLength = $(this).val().length; // Get string length of tweet
    var counter = $('.counter');
    counter.css('color', '#000'); // Text is black unless...
    if(charLength > 140) {
      counter.css('color', 'red');
    }
    counter.text(140 - charLength); // Change Character length
  });
});