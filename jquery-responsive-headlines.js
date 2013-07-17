/*!
 * jQuery Responsive Headlines - v 1.0 - 2013-07-17
 * Copyright (c) 2013 Thomas Kahn
 * Dual licensed under the MIT and GPL licenses.
 */
 
/*
ABOUT JQUERY RESPONSIVE HEADLINES
With this jQuery plugin you can create responsive one-line headlines.
Instead of wrapping the text, this plugin adapts the text size to
fit the width of its container. It's build on top of jQuery Boilerplate
(http://jqueryboilerplate.com/).

HOW TO USE IT
It works just like any other jquery plugin. 
Here's a super simple example that turns all h1-tags on the page 
into responsive headlines:

   $('h1').responsiveHeadlines();
 
There are also a handfull of options that you can use to customize
the behaviour of the plugin. The easiest way to understand what they
do is read the comments in the source code below and do some experimentation
on your own using the HTML demo page which accompanies this code in the
repository on GitHub. But here's an example with some options set,
just to get you started:

   $('h1').responsiveHeadlines({
               container: 'myDiv',
               maxFontSize: 64,
               minFontSize: 18
   });

JQUERY THROTTLE/DEBOUNCE
jQuery Responsive Headlines works best if you use it together with 
Ben Alman's jquery-throttle-debounce plugin. It's a plugin for 
controling/limiting the number of calls to a function. 
In this case it's very useful since the window resize event is triggered 
very often and the function that determines the size of the text is 
bound to this event. 

Ben Alman's project page: http://benalman.com/projects/jquery-throttle-debounce-plugin/
Ben Alman's repository on GitHub: https://github.com/cowboy/jquery-throttle-debounce

Per default jquery-trottle-debounce is used (the option useThrottleDebounce
is set to true) and therefore I have included a copy of it in this repository.
As I said, for performance reasons I recommend that you use it, but if you 
for some reason don't want it just set the option useThrottleDebounce to false. 
 
*/

 
// The semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ($, window, document, undefined) {
    
    // Defaults
    var pluginName = 'responsiveHeadlines',
        defaults = {
            container: 'parent',	// The keyword 'parent' (default) or a CSS-class name.
			maxFontSize: 9999,		// The maximum value for the font size. It won't get bigger than this.
									// Use it to set a max size if you need that. Default is 9999.
			minFontSize: 1,			// The minimum value for the font size. It won't get smaller than this.
									// Use it to set a minimum value if you need that. Default is 1.
			useThrottleDebounce: true, // Set this to false if you don't want to use jquery-throttle-debounce
			throttleDebounceParams: {	method: 'debounce', // Use throttle or debounce
										delay: 250, // Delay before event is fired
										no_trailing: false, // Please see jquery-throttle-debounce documentation
										at_begin: false // Please see jquery-throttle-debounce documentation
									}
        };

		
    // The actual plugin constructor
    function ResponsiveHeadlines(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
        
		this._defaults = defaults;
		this._name = pluginName;
		
		this.init();
    }

    ResponsiveHeadlines.prototype = {
		// Initializer
		init: function () {
			var self = this, el = $(this.element), o = this.options;

			// If the proper element styles are not set, set them.
			// They make sure the headline is always on a single row since
			// this plugin only works with single row headlines.
			if(el.css('display') !== 'inline') {
				el.css('display', 'inline');
			}
			
			if(el.css('white-space') !== 'nowrap') {
				el.css('white-space','nowrap');
			}
			
			// Run the resize function
			self.resizeText();
			
			// Event handler when the window is resized.
			// To avoid too many calls to the resizeText function, which
			// will lead to bad performance, I use Ben Almans jquery-throttle-debounce
			// (https://github.com/cowboy/jquery-throttle-debounce). It limits the
			// number of calls to the function. You can use either throttle or debounce.
			
			// Is jquery-throttle-debounce used?
			if(o.useThrottleDebounce) {
				
				if(o.throttleDebounceParams.method === 'trottle') {
					// Throttle method
					$(window).on('resize', $.trottle(o.throttleDebounceParams.delay, o.throttleDebounceParams.no_trailing, function() {
						self.resizeText();
					}));
				} else {
					// Debounce method
					$(window).on('resize', $.debounce(o.throttleDebounceParams.delay, o.throttleDebounceParams.at_begin, function() {
						self.resizeText();
					}));
				}
			} else {
				// No throttling or debouncing
				$(window).on('resize', function() {
					self.resizeText();
				});
			}
		
		},
		// The function that does the actual text resizing
		resizeText: function(){
			var el = $(this.element), o = this.options;
			
			// Which container should I resize to?
			var container;
			if(o.container === 'parent') {
				container = el.parent();
			} else {
				container = $('.' + o.container);
			}
			
			var containerWidth = container.width();
			var textWidth = el.outerWidth(); // outerWidth takes padding into account
			var startTextSize = parseInt(el.css('font-size'),10);
			var textSize = startTextSize;

			// Make the text bigger
			if(containerWidth > textWidth) {
				while(el.outerWidth() < container.width() && o.maxFontSize > textSize) {
					textSize++;
					el.css('font-size', textSize); 
				}
				// Just a last check to see if the text has grown too much.
				// If so, adjust it down one step
				if (el.outerWidth() > container.width() && o.minFontSize < textSize) {
					textSize--;
					el.css('font-size', textSize); 
				}
			} 
			// Make the text smaller
			else {
				while(el.outerWidth() > container.width() && o.minFontSize < textSize) {
					textSize--;
					el.css('font-size', textSize); 
				}
			}
		}	
	};
	

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new ResponsiveHeadlines( this, options ));
            }
        });
    };

})( jQuery, window, document );
