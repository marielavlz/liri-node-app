var fs = require('fs');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var action = process.argv[2];
var value = process.argv[3];
var keys = require('./keys.js');
var omdbKey = keys.omdbKeys

var params = {
    screen_name: 'mari_withani',
    count: 20
};



// switch case for whatever command the user enters
switch(action){
    case 'my-tweets':
        twitter();
    break;

    case 'spotify-this-song':
        spotifySong();
    break;

    case 'movie-this':
        movie();
    break;

    case 'do-what-it-says':
        whateverThisIs();
    break;

    default:
        console.log("Command not Valid. Please try again.");
    break;
}

// Twitter function
function twitter(){
  
  var client = new Twitter(keys.twitterKeys);

   client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                console.log('');
                console.log('My Last 20 Tweets: ');
                console.log('--------------------------');
                tweets.forEach(function(individualTweet) {
                    console.log('Time Posted: ' + individualTweet.created_at);
                    console.log('Tweet: ' + individualTweet.text);
                    console.log('--------------------------');


                });

            } else {
                console.log(error);
         };
    });

}


//Spotify Function
function spotifySong(value) {
  
  if (value === undefined){
    value = "Smells like Teen Spirit"; 
  }

  spotify.search(
    {
      type: "track", 
      query:  value 
    }, 

     function(err, data) {
      console.log('data',data)
        if (err) {
          console.log('Error occurred: ' + err);
          return;
        }

    
      var spotifyCall = data.tracks.items;

      for (var i =0; i<spotifyCall.length; i++){
          
          console.log("Spotify Song Information");
          var artist = spotifyCall.artists.name;
          console.log("Artist: " + artist);
          var song = spotifyCall.name;
          console.log("Song name: " + song);
          var preview = spotifyCall.preview_url;
          console.log("Preview Link: " + preview);
          var album = spotifyCall.album.name;
          console.log("Album: " + album);

    }
    
    });
}

//OMDB function
function movie() {
// set movie name equal to user input
var movieName = value;
var movieDefault = "Forrest Gump";
// search variables
var queryURL = 'http://www.omdbapi.com/?apikey=' + omdbKey + '&t=' + movieName + '&y=&plot=short&r=json';
var urlDefault = 'http://www.omdbapi.com/?apikey=' + omdbKey + '&t=' + movieDefault + '&y=&plot=short&r=json';

 // if the user entered a title, search that
 if (movieName != null) {
    request(queryURL, function (error, response, body) {
      // If the request is successful
      if (!error && response.statusCode == 200) {
              // Parse the body
              console.log("OMDB Movie Information")
              console.log("Title: " + value);
              console.log("Year: " + JSON.parse(body)["Year"]);
              console.log("Rating: " + JSON.parse(body)["imdbRating"]);
              console.log("Country of Production: " + JSON.parse(body)["Country"]);
              console.log("Language: " + JSON.parse(body)["Language"]);
              console.log("Plot: " + JSON.parse(body)["Plot"]);
              console.log("Actors: " + JSON.parse(body)["Actors"]);
            };
      });//end of request

    // if user doesn't enter a value, value will be set to Forrest Gump
    } else {
      request(urlDefault, function (error, response, body) {
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode == 200) {
              console.log("Title: " + movieDefault);
              console.log("Year: " + JSON.parse(body)["Year"]);
              console.log("Rating: " + JSON.parse(body)["imdbRating"]);
              console.log("Country of Production: " + JSON.parse(body)["Country"]);
              console.log("Language: " + JSON.parse(body)["Language"]);
              console.log("Plot: " + JSON.parse(body)["Plot"]);
              console.log("Actors: " + JSON.parse(body)["Actors"]);
            };//end of if
      });//end of request
    } // end of else
  } // end of movie()

//Do what is Says function
function whateverThisIs(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}