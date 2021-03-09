(function(w, $){
	'use strict';

	var document = document || w.document,
		$menuWrap = $('.washu-main-menu-wrapper'),
		$menu = $menuWrap.find('.washu-main-menu'),
		$menuOpen = $('.washu-main-menu-trigger'),
		$menuContent = $menuWrap.find('.washu-main-menu-content'),
		$menuList = $menuWrap.find('.washu-main-menu-list'),
		$menuClose = $menuWrap.find('.main-menu-close'),
		$menuBack = $menuWrap.find('.main-menu-back'),
		$menuTitle = $menuWrap.find('.washu-main-menu-title'),
		$page = $('#page'),
		$search = $menuWrap.find('.search-form'),
		$searchButton = $menuWrap.find('.search-submit'),
		$searchClose = $menuWrap.find('.desktop-search-close'),
		$searchField = $search.find('.search-field'),
		$searchOpen = $menuWrap.find('.nav-search'),
		prevMenuTitle = [],
		menuTitles = [],
		desktopMenu = '';

	function supportsLocalStorage() {
		var mod = 'modernizr';
		try {
			localStorage.setItem(mod, mod);
			localStorage.removeItem(mod);
			return true;
		} catch (e) {
			return false;
		}
	}

	function matchMediaSupported() {
		return (typeof window.matchMedia != "undefined" || typeof window.msMatchMedia != "undefined");
	}

	if ( matchMediaSupported() ) {
		var desktopMenu = window.matchMedia( "(min-width: 41em)" );
	}

	if ( supportsLocalStorage() && ! desktopMenu.matches ) {
		// If menu_state item exists in session storage, update menu state
		var menu_state = sessionStorage.getItem('menu_state');
		if ( menu_state ) {
			$('.menu-item-' + menu_state).parentsUntil( $('.washu-main-menu'), 'ul' )
				.addClass( 'move-out' )
				.addClass( 'active' );
			$('.menu-item-' + menu_state + ' > ul').addClass('active');
			$menuBack.addClass('visible');

			// Update height of menu content container
			var childrenCount = $('.menu-item-' + menu_state + ' > ul').children().size();
			// Multiply by 50 to match set height of menu items
			$menuList.height(childrenCount * 50);

			// Update menu title
			var currentMenuTitle = $('.menu-item-' + menu_state + ' > .menu-item-link')[0].innerHTML;
			$menuTitle[0].innerHTML = currentMenuTitle;

			// Travel up the DOM to collect all of the parent menu titles
			$('.menu-item-' + menu_state).parentsUntil( $('.washu-main-menu'), 'li' )
				.each(function() {
					menuTitles.push($(this).find('> .menu-item-link').text());
				});
			menuTitles.reverse();
			prevMenuTitle = ['Menu'];
			prevMenuTitle = prevMenuTitle.concat(menuTitles);
		}
	}

	// Navigation toggle
	$menuOpen.on('click', menuToggle);
	$menuClose.on('click', menuToggle);
	$page.on('click', function(e) {
		if ( $page.hasClass('active') ) menuToggle(e);
		if ( $menuContent.hasClass('desktop-search-active') ) desktopSearchToggle(e);
	});

	// Stop click events from rising above main menu
	$menu.on('click', function(e) {
		e.stopPropagation();
	});

	function menuToggle(e) {
		e.preventDefault();
		e.stopPropagation();
		$page.toggleClass('active');

		// Set initial height of menu content container
		var menuInitialHeight = $menuList.height();
		$menuList.height(menuInitialHeight);
	}

	$searchOpen.on('click', desktopSearchToggle );
	$searchClose.on('click', desktopSearchToggle );

	// Create search toggle event
	// This is only necessary to support IE 11. Normally we could just do `new Event('event-name');`.
	if ( typeof(Event) === 'function' ) {
		var searchToggle = new Event('desktop-search-toggle');
	} else {
		var searchToggle = document.createEvent('Event');
		searchToggle.initEvent('desktop-search-toggle', true, true);
	}

	// Toggle Search.
	function desktopSearchToggle(e){
		e.preventDefault();
		$menuContent.toggleClass('desktop-search-active');
		$searchField.focus();
		document.dispatchEvent(searchToggle);
	}

	// When search field receives focus, apply class to parent container
	$searchField.on('blur', function() {
		$search.removeClass('is-focused');
	}).on('focus', function() {
		$search.addClass('is-focused');
	});

	// Click handler for moving deeper into sub-menus.
	$menu.find('.sub-menu-toggle').on('click', function(e){
		e.preventDefault();
		$(this).closest("ul").toggleClass('move-out');
		$(this).closest('li').toggleClass('sub-menu-active');
		$(this).siblings(".sub-menu").toggleClass('active');

		if ( supportsLocalStorage() ) {
			if ( $(this).parent().hasClass('menu-item') ) {
				var menu_state = $(this).parent().prop('class').match(/menu-item-([0-9]+)/)[1];
				sessionStorage.setItem('menu_state', menu_state);
			} else {
				sessionStorage.removeItem('menu_state');
			}
		}

		// Make the back button visible if it's not.
		if ( -1 === $menuBack[0].className.indexOf( 'visible' ) ) {
			$menuBack[0].className += ' visible';
		}

		// Update the menu title.
		prevMenuTitle.push($menuTitle[0].innerHTML);
		$menuTitle[0].innerHTML = $(this).siblings(".menu-item-link")[0].innerHTML;

		// Update height of menu content container
		var childrenCount = $(this).siblings(".sub-menu").children().size();
		// Multiply by 50 to match set height of menu items
		$menuList.height(childrenCount * 50);
	});

	// Click handler for moving back up the menu tree.
	$menuBack.on( 'click', function(e){
		e.preventDefault();
		var $levels = $menu.find('.move-out'),
			moveBackTo = $levels[$levels.length - 1];

		// Move back to previous menu level.
		moveBackTo.className = moveBackTo.className.replace( ' move-out', '' );

		if ( supportsLocalStorage() ) {
			if ( $(moveBackTo).parent().hasClass('menu-item') ) {
				var menu_state = $(moveBackTo).parent().prop('class').match(/menu-item-([0-9]+)/)[1];
				sessionStorage.setItem('menu_state', menu_state);
			} else {
				sessionStorage.removeItem('menu_state');
			}
		}

		// Update menu title text.
		$menuTitle[0].innerHTML = prevMenuTitle.pop();

		// Remove active class from sub-menu we're moving away from.
		$(moveBackTo).find('.active').toggleClass('active');

		if ( 1 === $levels.length ) {
			e.target.className = e.target.className.replace( ' visible', '' );
		}

		// Update height of menu content container
		var childrenCount = $(moveBackTo).children().not('.nav-search').size();
		// Multiply by 50 to match set height of menu items
		$menuList.height(childrenCount * 50);
	});

	// Hot Keys
	$(document).keyup(function(e) {
  	if (e.keyCode === 27) { // esc

		// Close the nav if open.
		if ( $page.hasClass('active') ) {
			menuToggle(e);
		}

		// Close the desktop search if open.
		if ( $menuContent.hasClass('desktop-search-active') ) {
			$menuContent.toggleClass('desktop-search-active');
			$searchField.blur();
		}
  	}
	});

	var nav = priorityNav.init({
		mainNavWrapper: '.washu-main-menu-content',
		mainNav: '.washu-main-menu-list',
		navDropdownLabel: "More",
		throttleDelay: 20,
		breakPoint: 655,
		count: false,
	});

	$('.header-alt .site-header').sticky({
		topSpacing: -77,
	});

	if ( typeof(Event) === 'function' ) {
		var event = new Event('resize');
	} else {
		var event = document.createEvent('Event');
		event.initEvent('resize', true, true);
	}

	$('.site-header').on('sticky-start', function() {
		window.dispatchEvent(event);
		window.dispatchEvent(event);
	});
	$('.site-header').on('sticky-end', function() {
		window.dispatchEvent(event);
		window.dispatchEvent(event);
	});

})(window, jQuery);
