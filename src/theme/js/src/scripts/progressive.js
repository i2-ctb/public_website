/**
* Testing for Browser features. Modernizr is another option to do this, but
* we don't need modernizer for these simple things now. If we find we need
* Modernizer later, we can migrate these progressive enhancements using that.
*/

(function($){

	var htmlElement = document.documentElement;

	// Feature Detect JS. If this runs then we are running js!
	htmlElement.className = htmlElement.className.replace(/no-js/, "js");

})(jQuery);
