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
	    	limitWarning	=	options.limitWarning,
	    	counterClass 	=	options.counterClass,
	    	limitElement	=	options.limitElement,
	    	limitClass		=	options.limitClass,
	    	warningClass	=	options.warningClass,
	    	exceededClass 	=	options.exceededClass,
			format			=	options.format;

		function doContentEditable()	{
			$el.attr( 'contenteditable', true );
			$el.attr( 'data-state', 'normal' );
			
			$el.addClass( counterClass );

			el.innerHTML = localStorage.getItem( id );

			$el.next().text( maxLen - el.innerHTML.length );

			$el.bind('keydown keyup', function(event){

				var curVal = this.innerHTML;
				var curLen = curVal.length;
				var storeVal = curVal;

				var tmpVal = curVal.replace(/&nbsp;/g, ' ');
				var tmpLen = tmpVal.length;

				var safeVal = tmpVal.substring(0, maxLen);
				var unsafeVal = tmpVal.substring(maxLen, tmpLen);
				

				if( event.type === 'keyup' )	{
					$el.next().text( format.replace(/%1/, (maxLen - tmpLen)));
				}
				
				if( curLen >= ( maxLen - limitWarning ) )	{
					$el.next().addClass(warningClass);	
				}

				if( curLen <= maxLen )	{
					this.setAttribute('data-state', 'normal');
				}

				if( unsafeVal.length && this.getAttribute('data-state') == 'normal' )	{
					
					if( $el.next().hasClass( warningClass ) )	{
						$el.next().removeClass(warningClass);	
						$el.next().addClass(exceededClass);
					}
					

					this.setAttribute('data-state', 'error');

					localStorage.setItem( id , safeVal + "<em>" + unsafeVal + '</em>');
					
					this.innerHTML = localStorage.getItem( id );

					this.focus();
					if(typeof window.getSelection != "undefined" &&
						typeof document.createRange != "undefined")	{
						var range = document.createRange();
						range.selectNodeContents(this);
						range.collapse(false);
						var sel = window.getSelection();
						sel.removeAllRanges();
						sel.addRange(range);
					} else if( typeof document.body.createTextRange != "undefined" )	{
						var textRange = document.body.createTextRange();
						textRange.moveToElementtext(this);
						textRange.collapse(false);
						textRange.seect();
					}
				} else {
					localStorage.setItem( id , this.innerHTML);	
				}		
				
			});
			
			return this;
		}

		function init() {
			
			if( undefined === $el.attr('id') )	{
				alert('ID needed');
			}
			
			id = $el.attr('id');

			if( limitElement )	{
				$('<'+limitElement+'>', {
					class: limitClass,
					text: format.replace(/%1/, (maxLen))
				}).insertAfter($(el));				
			}

			if( $el.is('input') === false && $el.is('textarea') === false )	{
				doContentEditable();
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
		limitWarning: 	25,
		limitElement: 	'span',
		counterClass:   'counter',		
		limitClass: 	'limit',		
		warningClass: 	'warning',
		exceededClass: 	'exceeded',
		format: 		'%1',
		// callbacks
		onInit: 		function() {},
		onDestroy: 		function() {},

	};

})(jQuery);