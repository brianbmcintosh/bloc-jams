
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
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(currentlyPlayingSongNumber);

    }

    // If song clicked is not the currentlyPlayingSong, display a pause button
    if (currentlyPlayingSongNumber !== songNumber){
          $row.find('.song-item-number').html(pauseButtonTemplate);
          setSong(songNumber);
//          currentlyPlayingSongNumber = songNumber;
//          currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
          updatePlayerBarSong();
          currentSoundFile.play();

    // If clicking the currently playing song, display the play button
    } 
    
    else if (currentlyPlayingSongNumber === songNumber) {
        $row.find('.song-item-number').html(playButtonTemplate);
        if (currentSoundFile.isPaused()) {
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButtonButton)
            currentSoundFile.play();
    }
        
        else {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton)
            currentSoundFile.pause();
    }

//          currentlyPlayingSongNumber = null;
//          currentSongFromAlbum = null;


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
var currentSoundFile = null;
var currentVolume = 80;
var currentAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next ');

$(document).ready( function() {

  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playPauseButton.click(togglePlayFromPlayerBar);
    
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
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
//    currentlyPlayingSongNumber = currentSongIndex + 1;
//    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
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
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
//    currentlyPlayingSongNumber = currentSongIndex + 1;
//    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};  
    


var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: [ 'mp3' ],
    preload: true
     });
    
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
}

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]')
};

var togglePlayFromPlayerBar = function() {
        var $currentlyPlayingSongCell = getSongNumberCell(currentlyPlayingSongNumber);
    if (currentSoundFile.isPaused()) {
        $currentlyPlayingSongCell.html(pauseButtonTemplate);
        $(this).html(playerBarPauseButton);
        currentSoundFile.play();
    }
    else {
        $currentlyPlayingSongCell.html(playButtonTemplate);
        $(this).html(playerBarPlayButton);
        currentSoundFile.pause();
}
};

var $playPauseButton = $('.main-controls .play-pause')
