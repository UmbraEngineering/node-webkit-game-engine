
// 
// Creates a new DOM element
// 
// @param {tag} the new element's tagName
// @param {attrs} an object containing attribute pairs
// @return element
// 
exports.create = function(tag, attrs) {
	var elem = document.createElement(tag);

	if (attrs) {
		Object.keys(attrs).forEach(function(key) {
			elem.setAttribute(key, attrs[key]);
		});
	}

	return elem;
};

// 
// Registers a new element type
// 
// @param {tag} the tag name
// @param {opts} any registerElement options
// @param {baseStyle} base styles to apply to the new element
// @return void
// 
exports.register = function(tag, opts, baseStyles) {
	document.registerElement(tag, opts);
	if (baseStyles) {
		exports.css.addRule(tag, baseStyles);
	}
}

// -------------------------------------------------------------

// 
// Find all elements matching the given selector
// 
// @param {scope} optional; the scope to search, default to `document`
// @param {selector} the selector to search using
// @return array
// 
exports.find = function(scope, selector) {
	if (arguments.length < 2) {
		selector = scope;
		scope = document;
	}
	return Array.prototype.slice.call(scope.querySelectorAll(selector));
};

// 
// Find the first element matching the given selector
// 
// @param {scope} optional; the scope to search, default to `document`
// @param {selector} the selector to search using
// @return element
// 
exports.findOne = function(scope, selector) {
	if (arguments.length < 2) {
		selector = scope;
		scope = document;
	}
	return scope.querySelector(selector);
};

// -------------------------------------------------------------

// 
// The CSS function namespace
// 
exports.css = { };

// 
// Get a specific style property for an element
// 
// @param {elem} the element
// @param {prop} the property to lookup
// @return string
// 
exports.css.get = function(elem, prop) {
	return window.getComputedStyle(elem).getPropertyValue(prop);
};

// 
// Set style properties for an element
// 
// @param {elem} the element
// @param {values} an object of properties to set
// @return void
// 
exports.css.set = function(elem, values) {
	Object.keys(values).forEach(function(key) {
		elem.style[key] = values[key];
	});
};

// 
// Define a new CSS rule for the document
// 
// @param {selector} the CSS selector
// @param {rules} an object containing rules, or a CSS formatted style string
// @param {index} optional, where in the stylesheet should the rule be added
// @return void
// 
exports.css.addRule = function(selector, rules, index) {
	if (typeof rules === 'object') {
		rules = Object.keys(rules).reduce(reduceCSS(rules), '');
	}

	if (typeof selector === 'object' && selector.join) {
		selector = selector.join(',');
	}

	if ('insertRule' in sheet) {
		sheet.insertRule(selector + '{' + rules + '}', index);
	} else if ('addRule' in sheet) {
		sheet.addRule(selector, rules, index);
	}
};

// 
// Define multiple new CSS rules for the document
// 
// @param {rules} an object with selector keys and rules as values
// @return void
// 
exports.css.addRules = function(rules) {
	Object.keys(rules).forEach(function(selector) {
		exports.addRule(selector, rules[selector]);
	});
};

// 
// Create a new stylesheet to house any custom rules
// 
var sheet = (function() {
	// Create the <style> tag
	var style = document.createElement("style");

	// WebKit hack :(
	style.appendChild(document.createTextNode(""));

	// Add the <style> element to the page
	document.head.appendChild(style);

	return style.sheet;
})();

function reduceCSS(rules) {
	return function(memo, rule) {
		return memo + rule + ': ' + rules[rule] + ';';
	};
}
