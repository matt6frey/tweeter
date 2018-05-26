/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function getTweetDate(date) {
  var today = new Date();
  var days = Math.round((today - date) / (1000 * 60 * 60 * 24));
  var message = '';

  if(days <= 1) {
    // returns time of day tweet was created
    date = new Date(date);
    var isMorning = (date.getHours() > 11) ? "PM" : "AM";
    var hours = ((date.getHours()-12) === 0) ? 12 : date.getHours()-12;
    var minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
    var time = hours + ":" + minutes + " " + isMorning;
    message = "Today at " + time;
  } else {
    // Returns time, in days, since it was created.
    message = days + " days ago";
  }

  return message;
}

function createTweetElement (data) {
  // create Article.
  data = (typeof data === "string") ? JSON.parse(data) : data;
  var article = $('<article>');
  article.addClass('tweet');

  //Create header
  var header = $('<header></header>');
  header.append($('<img>').attr('src', data.user.avatars.small).attr('alt', 'The avatar of ' + data.user.handle));
  header.append($('<h2></h2>').text(data.user.name));
  header.append($('<span></span>').text(data.user.handle));

  article.append(header);
  article.append($('<p></p>').text(data.content.text)); // Add tweet content

  //Create footer
  var footer = $('<footer></footer>');
  var tweetDate = $('<p></p>');
  var actions = $('<ul></ul>');
  var actionsIconsArray = ['fas fa-heart', 'fas fa-retweet', 'fas fa-flag']; // Classes for li elements

  var dateToString = getTweetDate(data.created_at);

  footer.append(tweetDate.text(dateToString));

  for (let classItem of actionsIconsArray) {
    let li = $('<li></li>'); // Create Li
    let b = $('<b></b>').addClass(classItem); //create B.class element
    if ( classItem.search("heart") !== -1 ) {
      b.attr("data-likes", data.likes);
      b.attr("data-status", '');
      let span = $("<span></span>").text(data.likes).css("margin-right", "5px");
      li.prepend(span);
    } // Add data-likes attr
    li.append(b); // Add B to Li.
    actions.append(li); // add Li to Ul
  }

  footer.append(actions); // Add Ul
  article.append(footer); // Add footer

  return article;
}

function toggleLike() {
  // Adds likeTweet listener.
  var text = $(this).closest('article').find('p').first().text();
  var name = $(this).closest('article').find('h2').first().text();
  var target = $(this);
  var likes = $(this).data("likes");
  var likeStatus = $(this).data("status");
  console.log(likeStatus);
  $.ajax({
    url: '/tweets/like',
    method: 'POST',
    contentType: 'application/json; charset=utf-8',
    dataType: "json",
    traditional: true,
    data: JSON.stringify({ name: name, text : text, status: likeStatus }),
    success: function(res) {
      if(res) {
        if(likeStatus !== '') {
          $(target).css('color', 'inherit');
          $(target).data("likes", (likes - 1));
          $(target).data("status", "");
          $(target).closest('article').find('footer span').text(likes - 1);
        } else {
          $(target).css('color', '#bd0202');
          $(target).data("likes", (likes + 1));
          $(target).data("status", 'liked');
          $(target).closest('article').find('footer span').text(likes + 1);
        }
      }
    }
  });
}

function renderTweets(tweets) {
  if(tweets instanceof Array) {
    tweets.forEach(function (tweet) {
      $("#content-feed").prepend(createTweetElement(tweet));
      $('.fas.fa-heart').unbind('click'); // Prevent double event binding
      $('.fas.fa-heart').on('click', $(this), toggleLike);
    });
  } else {
    $("#content-feed").prepend(createTweetElement(tweets));
    $('.fas.fa-heart').unbind('click'); // Prevent double event binding.
    $('.fas.fa-heart').on('click', $(this), toggleLike);
  }
}

function loadTweets() {
  var allTweets;
  $.ajax({
    url: "/tweets",
    method:"GET",
    success: function (res) {
      allTweets = Object.values(res);
      renderTweets(allTweets); // Returns an array of the tweet objects
      return;
    }
  });
}

