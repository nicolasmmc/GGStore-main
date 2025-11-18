jQuery(function($) {
	// Toggle mobile menu
	$('.menu-toggle').on('click', function(e) {
		e.preventDefault();
		$('.dashboard-nav').toggleClass('mobile-show');
	});

	// Handle dropdown toggles
	$('.dashboard-nav-dropdown-toggle').on('click', function(e) {
		e.preventDefault();
		$(this).parent().toggleClass('show');
	});

	// Close menu when clicking on nav items
	$('.dashboard-nav-item:not(.dashboard-nav-dropdown-toggle)').on('click', function() {
		$('.dashboard-nav').removeClass('mobile-show');
	});

	// Handle dropdown hover on desktop
	function adjustNav() {
		var winWidth = $(window).width();
		
		if (winWidth >= 992) {
			$('.dashboard-nav-dropdown').on('mouseenter', function() {
				$(this).addClass('show');
			});
			
			$('.dashboard-nav-dropdown').on('mouseleave', function() {
				$(this).removeClass('show');
			});
		} else {
			$('.dashboard-nav-dropdown').off('mouseenter mouseleave');
		}
	}
	
	$(window).on('resize', adjustNav);
	adjustNav();

	// Close mobile menu when clicking outside
	$(document).on('click', function(e) {
		if (!$(e.target).closest('.dashboard-nav').length) {
			$('.dashboard-nav').removeClass('mobile-show');
		}
	});
}); 