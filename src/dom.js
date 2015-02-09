
exports.create = function(tag, attrs) {
	var elem = document.createElement(tag);

	if (attrs) {
		Object.keys(attrs).forEach(function(key) {
			elem.setAttribute(key, attrs[key]);
		});
	}

	return elem;
};

// -------------------------------------------------------------

exports.find = function(query) {
	return document.querySelectorAll(query);
};

exports.findOne = function(query) {
	return document.querySelector(query);
};

// -------------------------------------------------------------

exports.css = { };

exports.css.get = function(elem, prop) {
	return window.getComputedStyle(elem).getPropertyValue(prop);
};

exports.css.set = function(elem, values) {
	Object.keys(values).forEach(function(key) {
		elem.style[key] = values[key];
	});
};
