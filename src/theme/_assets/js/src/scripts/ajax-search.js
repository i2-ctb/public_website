jQuery(document).ready( function($) {

	var $searchWrap = $('.header-search'),
		$searchField = $('.header-search .search-field'),
		$loadingIcon = $('.header-search .loading'),
		desktopSearch = "";
    	termExists = "";

	function matchMediaSupported() {
    	return (typeof window.matchMedia != "undefined" || typeof window.msMatchMedia != "undefined");
	}

    if ( matchMediaSupported() ) {
    	var desktopSearch = window.matchMedia( "(min-width: 61.5em)" );
    }

	// Debounce function from https://davidwalsh.name/javascript-debounce-function
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	// Add results container and disable autocomplete on search field
	$searchWrap.append('<div class="results"></div>');
	var $searchResults = $('.header-search .results');
	$searchField.attr('autocomplete', 'off');

	// Perform search on keyup on search field, hide/show loading icon
	$searchField.keyup( function() {
		if ( desktopSearch.matches ) {
			$loadingIcon.css('display', 'block');
			if( $searchField.val() !== "" ) {
				termExists = true;
				doSearch();
			} else {
				termExists = false;
				$searchResults.empty();
				$loadingIcon.css('display', 'none');
			}
		}
	});

	// Make AJAX request every 200 milliseconds, output results
	var doSearch = debounce(function() {
		var query = $searchField.val();
		$.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'ajax_search',
				query: query,
			},
			success: function(result) {
				if ( termExists ) {
					$searchResults.html('<div class="results-list">' + result + '</div>');
				}
			},
			complete: function() {
				$loadingIcon.css('display', 'none');
			}
		});
	}, 200);

});