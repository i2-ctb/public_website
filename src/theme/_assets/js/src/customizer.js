/**
 * Theme Customizer enhancements for a better user experience.
 *
 * Contains handlers to make Theme Customizer preview reload changes asynchronously.
 */

( function( $ ) {
	// Site title and description.
	if ( $( 'body' ).hasClass( 'home' ) ) {
		wp.customize( 'blogname', function( value ) {
			value.bind( function( to ) {
				$( '.site-title' ).text( to );
			} );
		} );
	} else {
		wp.customize( 'blogname', function( value ) {
			value.bind( function( to ) {
				$( '.site-title a' ).text( to );
			} );
		} );
	}
	wp.customize( 'blogdescription', function( value ) {
		value.bind( function( to ) {
			$( '.site-description' ).text( to );
		} );
	} );
} )( jQuery );
