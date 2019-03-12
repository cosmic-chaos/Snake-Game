function store(name,value) {
	localStorage.setItem(name,value);
}

function read(name) {
	var value = localStorage.getItem(name);
	return value;
}

function clear(name) {
	localStorage.removeItem(name);
}