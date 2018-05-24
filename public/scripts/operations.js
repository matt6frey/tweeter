$( document ).ready(function () {

  var tweets = loadTweets();
  $('#nav-bar').on('click', ' button', function () {
    $('section.new-tweet').slideToggle();
    $('textarea').focus();
  }); // Button Functionality

  $('form[name="new-tweet"]').on('submit', function (e) {
    e.preventDefault(); // Stop regular form submission.
    var date = new Date();
    if ($('textarea').val() !== '' &&  $('textarea').val().length <= 140) { // Check for errors
      $.ajax({
        url: '/tweets/',
        method: 'POST',
        data: $(this).serialize(),
        success: function (response) {
          renderTweets(response);
          $('textarea').val('');
          return;
        }
      });
    } else {
      var err;
      if ($('textarea').val() === '') { // If empty string
        err = "Enter your tweet before sending.";
      } else { // If too long
        err = "Your tweet is greater than 140 characters.";
      }
      alert(err);
      $('textarea').css({'border-color':'red', 'color':'red'}); // Visual cues for errors
      setTimeout(function () { $('textarea').css({'border-color':'inherit', 'color': 'inherit'}); }, 2000);
    }
  });

});