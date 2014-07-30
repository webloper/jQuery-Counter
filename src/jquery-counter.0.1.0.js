/*!
 * jQuery Counter v0.1.0
 * [DESCRIPTION]
 * [http://PLUGIN-URL]
 *
 * Copyright (c) 2014 Ravi Kumar [AUTHOR URL]
 * Released under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Date: 2014-07-24T01:32Z
 */

;(function ($) {
  	var pluginName = 'counter';

  	function Plugin(element, options) {
		var el   = element;
		var $el  = $(element);
		
		options  = $.extend({}, $.fn[pluginName].defaults, options);
		
	    var id,	    	
	    	maxLen 			= 	options.limit,
	    	containerClass 	=	options.containerClass,
	    	counter,
	    	parent;
		
		function init() {
			
			if( undefined === $el.attr('id') )	{
				alert('ID needed');
			}
			
			hook('onInit');
		}

		function option (key, val) {
			if (val) {
				options[key] = val;
			} else {
				return options[key];
			}
		}

		function destroy() {
			$el.each(function() {
				var el = this;
				var $el = $(this);

				// Add code to restore the element to its original state...

				hook('onDestroy');
				$el.removeData('plugin_' + pluginName);
			});
		}

		function hook(hookName) {
			if (options[hookName] !== undefined) {
				options[hookName].call(el);
			}
		}

		init();

		return {
			option: option,
			destroy: destroy
		};
	}

	$.fn[pluginName] = function(options) {
		if (typeof arguments[0] === 'string') {
			var methodName = arguments[0];
			var args = Array.prototype.slice.call(arguments, 1);
			var returnVal;
			this.each(function() {
				if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
					returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
				} else {
					throw new Error('Method ' +  methodName + ' does not exist on jQuery.' + pluginName);
				}
			});
			if (returnVal !== undefined){
				return returnVal;
			} else {
				return this;
			}
		} else if (typeof options === "object" || !options) {
			return this.each(function() {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
				}
			});
		}
	};

	$.fn[pluginName].defaults = {
		
		// properties
		limit: 			140,

		// callbacks
		onInit: 		function() {},
		onDestroy: 		function() {},

	};

})(jQuery);