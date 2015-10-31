var pointsArray = document.getElementsByClassName('point')

var animatePoints = function(points) {
        
    var revealPoints = function(index) {
        pointsArray[index].style.opacity = 1;
        pointsArray[index].style.transform = "scaleX(1) translateY(0)";
        pointsArray[index].style.msTransform = "scaleX(1) translateY(0)";
        pointsArray[index].style.WebkitTransform = "scaleX(1) translateY(0)";   
    };
    
    for (i=0; i<pointsArray.length; i++) {
    revealPoints(i);
    }

};



window.onload = function() {
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    
    window.addEventListener('scroll', function(event) {
        if (document.body.scrollTop >= scrollDistance) {
            animatePoints(pointsArray);
        }
    });

}
