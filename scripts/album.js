
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
//          $row.find('.song-item-number').html(pauseButtonTemplate);
          setSong(songNumber);
          currentSoundFile.play();        
        $(this).html(pauseButtonTemplate);
//        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        updatePlayerBarSong();
        updateSeekBarWhileSongPlays();
        

//          currentlyPlayingSongNumber = songNumber;
//          currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

    // If clicking the currently playing song, display the play button
    } 
    
    else if (currentlyPlayingSongNumber === songNumber) {
////            $row.find('.song-item-number').html(pauseButtonTemplate);
        if (currentSoundFile.isPaused()) {
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButtonButton)
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
 }

        else {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton)
            currentSoundFile.pause();
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        }

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

 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
 
     
//     if ($seekBars.parent.hasClass('.volume')) {}
         
         

     $seekBars.click(function(event) {
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();

         var seekBarFillRatio = offsetX / barWidth;
 

         updateSeekPercentage($(this), seekBarFillRatio);
     
     
     $seekBars.find('.thumb').mousedown(function(event) {
              var $seekBar = $(this).parent();
 
     $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });

      $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
                       });
     });
 };

 var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

var trackIndex = function(album,song) {
    return album.songs.indexOf(song);
};


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
var $nextButton = $('.main-controls .next');


$(document).ready( function() {
  setCurrentAlbum(albumPicasso);
  setupSeekBars();
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
    };
    
    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
//    currentlyPlayingSongNumber = currentSongIndex + 1;
//    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
//    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
//    $('.currently-playing .artist-name').text(currentAlbum.artist);
//    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
//    $('.main-controls .play-pause').html(playerBarPauseButton);
    updatePlayerBarSong();
    
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
        return index ==  (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
//    currentlyPlayingSongNumber = currentSongIndex + 1;
//    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
//    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
//    $('.currently-playing .artist-name').text(currentAlbum.artist);
//    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
//    $('.main-controls .play-pause').html(playerBarPauseButton);
    updatePlayerBarSong();
    
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

 var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
}

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]')
};


