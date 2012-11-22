/********************************************************************************
/*
 * scrollAppend (jQuery auto append results)
 * 2012 by Hawkee.com (hawkee@gmail.com)
 *
 * Version 1.2
 * 
 * Requires jQuery 1.7 and jQuery UI 1.8
 *
 * Dual licensed under MIT or GPLv2 licenses
 *   http://en.wikipedia.org/wiki/MIT_License
 *   http://en.wikipedia.org/wiki/GNU_General_Public_License
 *
 *
 *  Options:
 *
 *  url: Where to query for the next page of results.
 *
 *  params: An array of parameters to be passed to the URL
 *
 *  appendTo: The div that will get the next page of results.
 *
 *  callback: Anything that needs to be called once the next page has been appended.
 *
 *  pixelBuffer: Pixes from the bottom of the window before starting to load next page.
 *
 *  pageVar: What will be passed to your server to represent the page number.
 *
 *  expireCacheMins: Number of minutes before cached appends get cleared.
 *
 *  pagesToPause: The number of pages to show before we pause and require a click to continue.
 *
 *  loadingImage: A spinner or image to indicate the next page is loading.
 *
 *  moreText: The text that will be indicate a pause.
 *
 *  disableCache: Always start from the first page, don't cache appends.
 *
 * Usage:
 *
 * $(window).scrollAppend({
 *		url: 'newsfeed.php',
 *		params: { type: "image", who: "friends" }
 *		appendTo: "#newsfeed"
 *	});
*/


(function($){$.widget("ui.scrollAppend", {

	options:{
		pixelBuffer: 500,
		pageVar: 'p',
		expireCacheMins: 20,
		pagesToPause: 3,
		loadingImage: '/images/loading.gif',
		moreText: 'Show More',
		disableCache: false 
	},

	_create:function() {
		
		var self = this;
		self.loading = false;
		self.page = 0;
		self.stop = false;
		self.pause = false;

		// Get the params and save them as a key so we can store the cache according to the page
		// it was generated on.

		var params_key = self.options.params;
		params_key[self.options.pageVar] = 0;
		var param_key = jQuery.param(params_key);

		self.param_key = param_key;

		// Clears expired localStorage data.

		this.clearOld();

		// Look for cached appends.

		if(!self.options.disableCache) {
			var cache = localStorage.getItem('scroll_'+self.param_key);
			if(cache != undefined) {
				var timestamp = localStorage.getItem('time_'+self.param_key);
				self.page = localStorage.getItem('p_'+self.param_key);
				//console.log("resuming from page: "+self.page+" at "+timestamp);
				$(this.options.appendTo).append(cache);
				if(self.options.callback) self.options.callback.apply();
			}
		}

		// See if we're already at the end of the results on the first page.

		self.checkAppend();

		// Determines if we scrolled to the bottom of the page and appends if we still have results and we aren't paused.

		$(window).scroll(function () { 
			self.checkAppend();
		});

		$(document).on('click', '#scroll_append_more', function() { self.append(); $(this).remove(); self.pause = false; return false; });
	},

	// Checks if we need to append and calls append if need be.

	checkAppend: function () {
		var self = this;
		if($(window).scrollTop() >= $(document).height() - $(window).height() - self.options.pixelBuffer) {
			if(!self.loading) {
				if(self.stop) return;
				if(!self.pause) self.append();
			}
		}
	},

	// Appends the next page

	append: function() {

		var self = this;
		self.loading = true;
		self.page++;
		
		self.options.params[self.options.pageVar] = self.page;

		var loadingImage;
		if(self.options.loadingImage) {
			$(self.options.appendTo).append("<div id='scroll_append_loading' class='scroll_append_loading'><img src='"+self.options.loadingImage+"'></div>");
		}
		
		$.ajax({
			url: self.options.url,
			data: self.options.params,
			cache: false,
			success: function(html){
				$('#scroll_append_loading').remove();
				if(html == 'false') self.stop = true;
				else {
					$(self.options.appendTo).append(html);

					// Update the cache for returning to the page.

					if(!self.options.disableCache) {
						var old = localStorage.getItem('scroll_'+self.param_key);
						if(old === null) old = "";
						self.saveData('scroll_'+self.param_key, old + html);
						self.saveData('p_'+self.param_key, self.page);
						var timestamp = Number(new Date());
						self.saveData('time_'+self.param_key, timestamp);
					}
				}

				// Check if we need to pause.

				var mod = self.page % self.options.pagesToPause;
				if(mod == 0) {
					$(self.options.appendTo).append("<div id='scroll_append_more' class='scroll_append_more'>"+self.options.moreText+"</div>");
					self.pause = true;
				}

				if(self.options.callback) self.options.callback.apply();

				self.loading = false;
			}
		});
	},

	// Saves the appended data to localStorage and handles the limit by clearing old data.

	saveData: function(key, value) {
		try {
			localStorage.setItem(key, value);
		} catch (e) {
			if(e.code == 22) {
				this.clearOld();
				//console.log("Quota exceeded");
			}
		}
	},

	// Clears old cached data that has exceeded the given cache time limit

	clearOld: function() {
		for (var i = 0; i < localStorage.length; i++){
			var timestamp = Number(new Date());
			var regex = new RegExp("^time_(.+)", "g");
			var key = localStorage.key(i);
			var match = regex.exec(key);

			if(match) {
				var params = match[1];
				var prev_timestamp = localStorage.getItem(key);
				var diff = timestamp - prev_timestamp;
				diff = Math.round(diff/1000/60);

				//console.log("Age of cache: "+diff+" mins");
				if(diff >= this.options.expireCacheMins) {
					localStorage.removeItem("scroll_"+params);
					localStorage.removeItem("p_"+params);
					localStorage.removeItem("time_"+params);
					//console.log("Expiring");
				}
			}	
		}
	}

});
})(jQuery);
