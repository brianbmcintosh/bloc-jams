var buildCollectionItemTemplate = function() {

  var template = '<div class="collection-album-container column fourth">' +
  '  <img src="assets/images/album_covers/01.png"/>' +
  '  <div class="collection-album-info caption">' +
  '    <p>' +
  '      <a class="album-name" href="album.html"> The Colors </a>' +
  '      <br/>' +
  '      <a href="album.html"> Pablo Picasso </a>' +
  '      <br/>' +
  '      X songs' +
  '      <br/>' +
  '    </p>' +
  '  </div>' +
  '</div>';

  // Wrap variable in a jQuery object
  return $(template);
};

$(window).load(function(){

  // The container for our albums
  var $collectionContainer = $('.album-covers');

  // Make sure the album container is empty
  $collectionContainer.empty();

  // Loop through 12 albums
  for(var i = 0; i < 12; i++){

    var $newThumbnail = buildCollectionItemTemplate();

    // Append the album template to the container 
    $collectionContainer.append($newThumbnail);

  }

});
