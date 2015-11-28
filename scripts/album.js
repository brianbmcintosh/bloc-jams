var albumPicasso = {
   name: 'The Colors',
   artist: 'Pablo Picasso',
   label: 'Cubism',
   year: '1881',
   albumArtUrl: 'assets/images/album_covers/01.png',
   songs: [
       { name: 'Blue', length: '4:26' },
       { name: 'Green', length: '3:14' },
       { name: 'Red', length: '5:01' },
       { name: 'Pink', length: '3:21'},
       { name: 'Magenta', length: '2:15'}
   ]
};

// Another Example Album
var albumMarconi = {
   name: 'The Telephone',
   artist: 'Guglielmo Marconi',
   label: 'EM',
   year: '1909',
   albumArtUrl: 'assets/images/album_covers/20.png',
   songs: [
       { name: 'Hello, Operator?', length: '1:01' },
       { name: 'Ring, ring, ring', length: '5:01' },
       { name: 'Fits in your pocket', length: '3:21'},
       { name: 'Can you hear me now?', length: '3:14' },
       { name: 'Wrong phone number', length: '2:15'}
   ]
};
var createSongRow = function(songNumber, songName, songLength) {

   var template =
      '<tr class="album-view-song-item">' +
      '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
      '  <td class="song-item-title">' + songName + '</td>' +
      '  <td class="song-item-duration">' + songLength + '</td>' +
      '</tr>';

  var $row = $(template);

  var clickHandler = function(){

    var songNumber = parseInt($(this).attr('data-song-number'));

    // If a song is currently playing, revert that song button to the song's number
    if (currentlyPlayingSongNumber !== null ) {
        var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
        currentlyPlayingCell.html(currentlyPlayingSongNumber);

    }

    // If song clicked is not the currentlyPlayingSong, display a pause button
    if (currentlyPlayingSongNumber !== songNumber){
          $row.find('.song-item-number').html(pauseButtonTemplate);
          currentlyPlayingSongNumber = songNumber;
          currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
          updatePlayerBarSong();

    // If clicking the currently playing song, display the play button
    } else if (currentlyPlayingSongNumber === songNumber) {
          $row.find('.song-item-number').html(playButtonTemplate);
          currentlyPlayingSongNumber = null;
          currentSongFromAlbum = null;
          $('.main-controls .play-pause').html(playerBarPlayButton)
    }

  };

  var onHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      if (songNumber !== currentlyPlayingSongNumber) {
          songNumberCell.html(playButtonTemplate);
      }
  };

  var offHover = function(event) {

      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      if (songNumber !== currentlyPlayingSongNumber) {
          songNumberCell.html(songNumber);
      }
  };



//    $row.find('.song-item-title').click(clickHandler);
//    $row.find('.song-item-duration ').click(clickHandler);
    $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;

};

var setCurrentAlbum = function(album) {
    currentAlbum = album;

  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.name);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  // Loop through each song in the album
  for (i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
    $albumSongList.append($newRow);
  }

};

var trackIndex = function(album,song) {
    return album.songs.indexOf(song);
}


// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// initial state of variables
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next ');

$(document).ready( function() {

  setCurrentAlbum(albumMarconi);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});

var updatePlayerBarSong = function() {
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
}

//var nextSong = function() {
////* record old index + make new one
//   var oldSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
//    var newSongIndex = oldSongIndex + 1;
//    if (newSongIndex > currentAlbum.songs.length) {
//        newSongIndex = 0;
//    }
//    
////* set new album info  
//    var previouslyPlayedSongNumber = oldSongIndex + 1;
//    currentlyPlayingSongNumber = newSongIndex + 1;
//    currentSongFromAlbum = currentAlbum.songs[newSongIndex];
//    updatePlayerBarSong();
//     
//    
//    var songNumberCell = $(this).find('.song-item-number');
//      var songNumber = songNumberCell.attr('data-song-number');
//
//      if (songNumber !== currentlyPlayingSongNumber) {
//          songNumberCell.html(playButtonTemplate);
//      }
////* update the playerbar and the song item number cell
//   var $nextSongNumberCell = $('song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
//   var $lastSongNumberCell = $('song-item-number[data-song-number="' + previouslyPlayedSongNumber + '"]');
//    
//   $nextSongNumberCell.html(pauseButtonTemplate);
//   $lastSongNumberCell.html(previouslyPlayedSongNumber);
//
//};

var nextSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

//var previousSong = function() {
//
//    var oldSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
//    var newSongIndex = oldSongIndex - 1;
//    if (newSongIndex < 0) {
//        newSongIndex = currentAlbum.songs.length - 1;
//    }
//    var previouslyPlayedSongNumber = oldSongIndex + 1;
//    currentlyPlayingSongNumber = newSongIndex + 1;
//    currentSongFromAlbum = currentAlbum.songs[newSongIndex];
//    updatePlayerBarSong();
//    
//
//    var $nextSongNumberCell = $('song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
//    var $lastSongNumberCell = $('song-item-number[data-song-number="' + previouslyPlayedSongNumber + '"]');
//    
//    $nextSongNumberCell.html(pauseButtonTemplate);
//    $lastSongNumberCell.html(previouslyPlayedSongNumber);
//
//};

var previousSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};  
    



