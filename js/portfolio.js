window.onload = function() {
    let projs = null;
    projs = document.getElementsByClassName('project');
    for(let i = 0; i < projs.length; i++) {
	projs[i].onmouseover = function() {
	    projs[i].classList.remove('project-further');
	    projs[i].classList.add('project-closer');
	}
	projs[i].onmouseout = function() {
	    projs[i].classList.add('project-further');
	    projs[i].classList.remove('project-closer');
	}
    }
    let soie = document.getElementById('soie');
    soie.style.cursor = 'pointer';
    soie.onclick = ()=> {
	window.location.href = 'soie';
	
    }
}
