window.onload = function() {
    let soie = document.getElementById('soie');
    soie.style.cursor = 'pointer';
    soie.onclick = ()=> {
	window.location.href = 'soie';	
    }
    
    let lastMove = null;    
    soie.ontouchstart = function(e) {
	lastMove = e;
    };
    soie.ontouchmove = function(e) {
	lastMove = e;
    };
    soie.ontouchend = function(e) {
	e.preventDefault();
	let bounds = soie.getBoundingClientRect();
	for(let i = 0; i < lastMove.changedTouches.length; i++) {
	    console.log(lastMove.changedTouches[i].pageX);
	    if(lastMove.changedTouches[i].pageX > bounds.left &&
	       lastMove.changedTouches[i].pageX < bounds.right &&
	       lastMove.changedTouches[i].pageY > bounds.top &&
	       lastMove.changedTouches[i].pageY < bounds.bottom) {
		window.location.href = 'soie';	
	    }
	}
    }
}
