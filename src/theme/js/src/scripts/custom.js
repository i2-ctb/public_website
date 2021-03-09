/* Place all custom javascript functions here */
jQuery(document).ready(function($){

	// Apply stickyfill to elements with 'stick' class
	var stickyElements = document.getElementsByClassName('stick');
	for (var i = stickyElements.length - 1; i >= 0; i--) {
	    Stickyfill.add(stickyElements[i]);
	}

	// If the current URL matches a link in the menu, apply class of current-page
	var url = window.location.href;
	$('.washu-main-menu-content a[href="' + url + '"]').addClass('current-page');

	// Footer widget expand/contract toggle
	$('.footer-widget-title').on('click', function(event){
		var mq = window.matchMedia( "(max-width: 655px)" );
		if (mq.matches) {
			$(this).parent().toggleClass('show');
		}
	});

});
