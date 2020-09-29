var reg_quot = /quot/gi; var reg_quot_replace = '"';
var blank_image = 'http://vt.obninsk.ru/common/blank.png';
var waiting = 'http://vt.obninsk.ru/common/loading.gif';
var Flickr_USER_ID = '185344896@N04';
var Flickr_API_KEY = '29d2b1bf86c1787806c9cec612ae0a56';
var Flickr_ERROR = 'Запрос к Flickr API завершился аварийно';
// Начало colorbox	  
(function ($, document, window) {
	var
	// Default settings object.
	// See http://jacklmoore.com/colorbox for details.
	defaults = {
		minImageSize: 300,
		transition: "elastic",
		speed: 400,
		width: false,
		initialWidth: false,
		innerWidth: false,
		maxWidth: false,
		height: false,
		initialHeight: false,
		innerHeight: false,
		maxHeight: false,
		scalePhotos: true,
		scrolling: true,
		inline: false,
		html: false,
		iframe: false,
		fastIframe: true,
		photo: true,
		href: false,
		tb_url: false,
		title: false,
		rel: true,
		opacity: 0.75,
		preloading: true,

		current: "№{current} из {total}",
		previous: "previous",
		next: "next",
		close: "close",
		xhrError: "Произошла ошибка при загрузке контента",
		imgError: "Произошла ошибка при загрузке изображения",

		open: false,
		returnFocus: true,
		reposition: true,
		loop: true,
		slideshow: false,
		slideshowAuto: true,
		slideshowSpeed: 6000,
		slideshowStart: "Пуск",
		slideshowStop: "Стоп",
		onOpen: false,
		onLoad: false,
		onComplete: false,
		onCleanup: false,
		onClosed: false,
		overlayClose: true,
		escKey: true,
		arrowKey: true,
		top: false,
		bottom: false,
		left: false,
		right: false,
		fixed: false,
		data: undefined
	},
	
	// Abstracting the HTML and event identifiers for easy rebranding
	colorbox = 'colorbox',
	prefix = 'cbox',
	boxElement = prefix + 'Element',
	
	// Events
	event_open = prefix + '_open',
	event_load = prefix + '_load',
	event_complete = prefix + '_complete',
	event_cleanup = prefix + '_cleanup',
	event_closed = prefix + '_closed',
	event_purge = prefix + '_purge',
	
	// Special Handling for IE
	isIE = !$.support.opacity && !$.support.style, // IE7 & IE8
	isIE6 = isIE && !window.XMLHttpRequest, // IE6
	event_ie6 = prefix + '_IE6',

	// Cached jQuery Object Variables
	$overlay,
	$box,
	$wrap,
	$content,
	$topBorder,
	$leftBorder,
	$rightBorder,
	$bottomBorder,
	$related,
	$window,
	$loaded,
	$loadingBay,
	$loadingOverlay,
	$title,
	$current,
	$slideshow,
	$next,
	$prev,
	$close,
	$groupControls,
	
	// Variables for cached values or use across multiple functions
	settings,
	interfaceHeight,
	interfaceWidth,
	loadedHeight,
	loadedWidth,
	element,
	index,
	photo,
	open,
	active,
	closing,
	loadingTimer,
	publicMethod,
	div = "div",
	init;

	// ****************
	// HELPER FUNCTIONS
	// ****************
	
	// Convience function for creating new jQuery objects
	function $tag(tag, id, css) {
		var element = document.createElement(tag);

		if (id) {
			element.id = prefix + id;
		}

		if (css) {
			element.style.cssText = css;
		}

		return $(element);
	}

	// Determine the next and previous members in a group.
	function getIndex(increment) {
		var
		max = $related.length,
		newIndex = (index + increment) % max;
		
		return (newIndex < 0) ? max + newIndex : newIndex;
	}

	// Convert '%' and 'px' values to integers
	function setSize(size, dimension) {
		return Math.round((/%/.test(size) ? ((dimension === 'x' ? winWidth() : winHeight()) / 100) : 1) * parseInt(size, 10));
	}
	
	// Checks an href to see if it is a photo.
	// There is a force photo option (photo: true) for hrefs that cannot be matched by this regex.
	function isImage(url) {
		return settings.photo || /\.(gif|png|jp(e|g|eg)|bmp|ico)((#|\?).*)?$/i.test(url);
	}
	
	function winWidth() {
		// $(window).width() is incorrect for some mobile browsers, but
		// window.innerWidth is unsupported in IE8 and lower.
		return window.innerWidth || $window.width();
	}

	function winHeight() {
		return window.innerHeight || $window.height();
	}

	// Assigns function results to their respective properties
	function makeSettings() {
		var i,
		data = $.data(element, colorbox);
		if (data == null) {
			settings = $.extend({}, defaults);
			if (console && console.log) console.log('Colorbox settings err');
		} else 	settings = $.extend({}, data);
		for (i in settings) {
			if ($.isFunction(settings[i]) && i.slice(0, 2) !== 'on') { // checks to make sure the function isn't one of the callbacks, they will be handled at the appropriate time.
				settings[i] = settings[i].call(element);
			}
		}
		settings.rel = settings.rel || element.rel || 'nofollow';
		settings.href = settings.href || $(element).attr('href');
		settings.tb_url = settings.tb_url || $(element).attr('tb_url') ? $(element).attr('tb_url') : 'http://vt.obninsk.ru/common/no_image.gif';
		settings.title = settings.title || element.title;
		settings.title = settings.title.replace(reg_quot, reg_quot_replace);		// поставим нормальные кавычки
		if (typeof settings.href === "string") {
			settings.href = $.trim(settings.href);
		}
		if (typeof settings.tb_url === "string") {
			settings.tb_url = $.trim(settings.tb_url);
		}
	}

	function trigger(event, callback) {
		$.event.trigger(event);
		if (callback) {
			callback.call(element);
		}
	}

	// Slideshow functionality
	function slideshow() {
		var
		timeOut,
		className = prefix + "Slideshow_",
		click = "click." + prefix,
		start,
		stop,
		clear;
		
		if (settings.slideshow && $related[1]) {
			start = function () {
				$slideshow
					.text(settings.slideshowStop)
					.unbind(click)
					.bind(event_complete, function () {
						if (settings.loop || $related[index + 1]) {
							timeOut = setTimeout(publicMethod.next, settings.slideshowSpeed);
						}
					})
					.bind(event_load, function () {
						clearTimeout(timeOut);
					})
					.one(click + ' ' + event_cleanup, stop);
				$box.removeClass(className + "off").addClass(className + "on");
				timeOut = setTimeout(publicMethod.next, settings.slideshowSpeed);
			};
			
			stop = function () {
				clearTimeout(timeOut);
				$slideshow
					.text(settings.slideshowStart)
					.unbind([event_complete, event_load, event_cleanup, click].join(' '))
					.one(click, function () {
						publicMethod.next();
						start();
					});
				$box.removeClass(className + "on").addClass(className + "off");
			};
			
			if (settings.slideshowAuto) {
				start();
			} else {
				stop();
			}
		} else {
			$box.removeClass(className + "off " + className + "on");
		}
	}

	function launch(target) {
		if (!closing) {
			
			element = target;
			
			makeSettings();
			
			$related = $(element);
			
			index = 0;
			
			if (settings.rel !== 'nofollow') {
				$related = $('.' + boxElement).filter(function () {
					var data = $.data(this, colorbox),
						relRelated;

					if (data) {
						relRelated =  data.rel || this.rel;
					}
					
					return (relRelated === settings.rel);
				});
				index = $related.index(element);
				
				// Check direct calls to ColorBox.
				if (index === -1) {
					$related = $related.add(element);
					index = $related.length - 1;
				}
			}
			
			if (!open) {
				open = active = true; // Prevents the page-change action from queuing up if the visitor holds down the left or right keys.
				
				$box.show();
				
				if (settings.returnFocus) {
					$(element).blur().one(event_closed, function () {
						$(this).focus();
					});
				}
				
				// +settings.opacity avoids a problem in IE when using non-zero-prefixed-string-values, like '.5'
				$overlay.css({"opacity": +settings.opacity, "cursor": settings.overlayClose ? "pointer" : "auto"}).show();
				
				// Opens inital empty ColorBox prior to content being loaded.
				settings.w = setSize(settings.initialWidth, 'x');
				settings.h = setSize(settings.initialHeight, 'y');
				publicMethod.position();
				
				if (isIE6) {
					$window.bind('resize.' + event_ie6 + ' scroll.' + event_ie6, function () {
						$overlay.css({width: winWidth(), height: winHeight(), top: $window.scrollTop(), left: $window.scrollLeft()});
					}).trigger('resize.' + event_ie6);
				}
				
				trigger(event_open, settings.onOpen);
				
				$groupControls.add($title).hide();
				
				$close.html(settings.close).show();
			}
			
			publicMethod.load(true);
		}
	}

	// ColorBox's markup needs to be added to the DOM prior to being called
	// so that the browser will go ahead and load the CSS background images.
	function appendHTML() {
		if (!$box && document.body) {
			init = false;

			$window = $(window);
			$box = $tag(div).attr({id: colorbox, 'class': isIE ? prefix + (isIE6 ? 'IE6' : 'IE') : ''}).hide();
			$overlay = $tag(div, "Overlay", isIE6 ? 'position:absolute' : '').hide();
			$loadingOverlay = $tag(div, "LoadingOverlay").add($tag(div, "LoadingGraphic"));
			$wrap = $tag(div, "Wrapper");
			$content = $tag(div, "Content").append(
				$loaded = $tag(div, "LoadedContent", 'width:0; height:0; overflow:hidden'),
				$title = $tag(div, "Title"),
				$current = $tag(div, "Current"),
				$next = $tag(div, "Next"),
				$prev = $tag(div, "Previous"),
				$slideshow = $tag(div, "Slideshow").bind(event_open, slideshow),
				$close = $tag(div, "Close")
			);
			
			$wrap.append( // The 3x3 Grid that makes up ColorBox
				$tag(div).append(
					$tag(div, "TopLeft"),
					$topBorder = $tag(div, "TopCenter"),
					$tag(div, "TopRight")
				),
				$tag(div, false, 'clear:left').append(
					$leftBorder = $tag(div, "MiddleLeft"),
					$content,
					$rightBorder = $tag(div, "MiddleRight")
				),
				$tag(div, false, 'clear:left').append(
					$tag(div, "BottomLeft"),
					$bottomBorder = $tag(div, "BottomCenter"),
					$tag(div, "BottomRight")
				)
			).find('div div').css({'float': 'left'});
			
			$loadingBay = $tag(div, false, 'position:absolute; width:9999px; visibility:hidden; display:none');
			
			$groupControls = $next.add($prev).add($current).add($slideshow);

			$(document.body).append($overlay, $box.append($wrap, $loadingBay));
		}
	}

	// Add ColorBox's event bindings
	function addBindings() {
		if ($box) {
			if (!init) {
				init = true;

				// Cache values needed for size calculations
				interfaceHeight = $topBorder.height() + $bottomBorder.height() + $content.outerHeight(true) - $content.height();//Subtraction needed for IE6
				interfaceWidth = $leftBorder.width() + $rightBorder.width() + $content.outerWidth(true) - $content.width();
				loadedHeight = $loaded.outerHeight(true);
				loadedWidth = $loaded.outerWidth(true);
				
				// Setting padding to remove the need to do size conversions during the animation step.
				$box.css({"padding-bottom": interfaceHeight, "padding-right": interfaceWidth});

				// Anonymous functions here keep the public method from being cached, thereby allowing them to be redefined on the fly.
				$next.click(function () {
					publicMethod.next();
				});
				$prev.click(function () {
					publicMethod.prev();
				});
				$close.click(function () {
					publicMethod.close();
				});
				$overlay.click(function () {
					if (settings.overlayClose) {
						publicMethod.close();
					}
				});
				
				// Key Bindings
				$(document).bind('keydown.' + prefix, function (e) {
					var key = e.keyCode;
					if (open && settings.escKey && key === 27) {
						e.preventDefault();
						publicMethod.close();
					}
					if (open && settings.arrowKey && $related[1]) {
						if (key === 37) {
							e.preventDefault();
							$prev.click();
						} else if (key === 39) {
							e.preventDefault();
							$next.click();
						}
					}
				});

				$('.' + boxElement, document).live('click', function (e) {
					// ignore non-left-mouse-clicks and clicks modified with ctrl / command, shift, or alt.
					// See: http://jacklmoore.com/notes/click-events/
					if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey)) {
						e.preventDefault();
						launch(this);
					}
				});
			}
			return true;
		}
		return false;
	}

	// Don't do anything if ColorBox already exists.
	if ($.colorbox) {
		return;
	}

	// Append the HTML when the DOM loads
	$(appendHTML);


	// ****************
	// PUBLIC FUNCTIONS
	// Usage format: $.fn.colorbox.close();
	// Usage from within an iframe: parent.$.fn.colorbox.close();
	// ****************
	
	$.fn.colorbox = publicMethod = $.fn[colorbox] = $[colorbox] = function (options, callback) {
		var $this = this;
		
		options = options || {};
		
		appendHTML();

		if (addBindings()) {
			if (!$this[0]) {
				if ($this.selector) { // if a selector was given and it didn't match any elements, go ahead and exit.
					return $this;
				}
				// if no selector was given (ie. $.colorbox()), create a temporary element to work with
				$this = $('<a/>');
				options.open = true; // assume an immediate open
			}
			
			if (callback) {
				options.onComplete = callback;
			}
			
			$this.each(function () {
				$.data(this, colorbox, $.extend({}, $.data(this, colorbox) || defaults, options));
			}).addClass(boxElement);
			
			if (($.isFunction(options.open) && options.open.call($this)) || options.open) {
				launch($this[0]);
			}
		}
		
		return $this;
	};

	publicMethod.position = function (speed, loadedCallback) {
		var
		css,
		top = 0,
		left = 0,
		offset = $box.offset(),
		scrollTop,
		scrollLeft;
		
		$window.unbind('resize.' + prefix);

		// remove the modal so that it doesn't influence the document width/height
		$box.css({top: -9e4, left: -9e4});

		scrollTop = $window.scrollTop();
		scrollLeft = $window.scrollLeft();

		if (settings.fixed && !isIE6) {
			offset.top -= scrollTop;
			offset.left -= scrollLeft;
			$box.css({position: 'fixed'});
		} else {
			top = scrollTop;
			left = scrollLeft;
			$box.css({position: 'absolute'});
		}

		// keeps the top and left positions within the browser's viewport.
		if (settings.right !== false) {
			left += Math.max(winWidth() - settings.w - loadedWidth - interfaceWidth - setSize(settings.right, 'x'), 0);
		} else if (settings.left !== false) {
			left += setSize(settings.left, 'x');
		} else {
			left += Math.round(Math.max(winWidth() - settings.w - loadedWidth - interfaceWidth, 0) / 2);
		}
		
		if (settings.bottom !== false) {
			top += Math.max(winHeight() - settings.h - loadedHeight - interfaceHeight - setSize(settings.bottom, 'y'), 0);
		} else if (settings.top !== false) {
			top += setSize(settings.top, 'y');
		} else {
			top += Math.round(Math.max(winHeight() - settings.h - loadedHeight - interfaceHeight, 0) / 2);
		}

		$box.css({top: offset.top, left: offset.left});

		// setting the speed to 0 to reduce the delay between same-sized content.
		speed = ($box.width() === settings.w + loadedWidth && $box.height() === settings.h + loadedHeight) ? 0 : speed || 0;
		
		// this gives the wrapper plenty of breathing room so it's floated contents can move around smoothly,
		// but it has to be shrank down around the size of div#colorbox when it's done.  If not,
		// it can invoke an obscure IE bug when using iframes.
		$wrap[0].style.width = $wrap[0].style.height = "9999px";
		
		function modalDimensions(that) {
			$topBorder[0].style.width = $bottomBorder[0].style.width = $content[0].style.width = that.style.width;
			$content[0].style.height = $leftBorder[0].style.height = $rightBorder[0].style.height = that.style.height;
		}

		css = {width: settings.w + loadedWidth, height: settings.h + loadedHeight, top: top, left: left};
		if(speed===0){ // temporary workaround to side-step jQuery-UI 1.8 bug (http://bugs.jquery.com/ticket/12273)
			$box.css(css);
		}
		$box.dequeue().animate(css, {
			duration: speed,
			complete: function () {
				modalDimensions(this);
				
				active = false;
				
				// shrink the wrapper down to exactly the size of colorbox to avoid a bug in IE's iframe implementation.
				$wrap[0].style.width = (settings.w + loadedWidth + interfaceWidth) + "px";
				$wrap[0].style.height = (settings.h + loadedHeight + interfaceHeight) + "px";
				
				if (settings.reposition) {
					setTimeout(function () {  // small delay before binding onresize due to an IE8 bug.
						$window.bind('resize.' + prefix, publicMethod.position);
					}, 1);
				}

				if (loadedCallback) {
					loadedCallback();
				}
			},
			step: function () {
				modalDimensions(this);
			}
		});
	};

	publicMethod.resize = function (options) {
		if (open) {
			options = options || {};
			
			if (options.width) {
				settings.w = setSize(options.width, 'x') - loadedWidth - interfaceWidth;
			}
			if (options.innerWidth) {
				settings.w = setSize(options.innerWidth, 'x');
			}
			$loaded.css({width: settings.w});
			
			if (options.height) {
				settings.h = setSize(options.height, 'y') - loadedHeight - interfaceHeight;
			}
			if (options.innerHeight) {
				settings.h = setSize(options.innerHeight, 'y');
			}
			if (!options.innerHeight && !options.height) {
				$loaded.css({height: "auto"});
				settings.h = $loaded.height();
			}
			$loaded.css({height: settings.h});
			
			publicMethod.position(settings.transition === "none" ? 0 : settings.speed);
		}
	};

	publicMethod.prep = function (object) {
		if (!open) {
			return;
		}
		
		var callback, speed = settings.transition === "none" ? 0 : settings.speed;
		
		$loaded.remove();
		$loaded = $tag(div, 'LoadedContent').append(object);
		
		function getWidth() {
			settings.w = settings.w || $loaded.width();
			settings.w = settings.mw && settings.mw < settings.w ? settings.mw : settings.w;
			return settings.w;
		}
		function getHeight() {
			settings.h = settings.h || $loaded.height();
			settings.h = settings.mh && settings.mh < settings.h ? settings.mh : settings.h;
			return settings.h;
		}
		
		$loaded.hide()
		.appendTo($loadingBay.show())// content has to be appended to the DOM for accurate size calculations.
		.css({width: getWidth(), overflow: settings.scrolling ? 'auto' : 'hidden'})
		.css({height: getHeight()})// sets the height independently from the width in case the new width influences the value of height.
		.prependTo($content);
		
		$loadingBay.hide();
		
		// floating the IMG removes the bottom line-height and fixed a problem where IE miscalculates the width of the parent element as 100% of the document width.
		//$(photo).css({'float': 'none', marginLeft: 'auto', marginRight: 'auto'});
		
		$(photo).css({'float': 'none'});
		
		// Hides SELECT elements in IE6 because they would otherwise sit on top of the overlay.
		if (isIE6) {
			$('select').not($box.find('select')).filter(function () {
				return this.style.visibility !== 'hidden';
			}).css({'visibility': 'hidden'}).one(event_cleanup, function () {
				this.style.visibility = 'inherit';
			});
		}
		
		callback = function () {
			var preload,
				i,
				total = $related.length,
				iframe,
				frameBorder = 'frameBorder',
				allowTransparency = 'allowTransparency',
				complete,
				src,
				img,
				data;
			
			if (!open) {
				return;
			}
			
			function removeFilter() {
				if (isIE) {
					$box[0].style.removeAttribute('filter');
				}
			}
			
			complete = function () {
				clearTimeout(loadingTimer);
				// Detaching forces Andriod stock browser to redraw the area underneat the loading overlay.  Hiding alone isn't enough.
				$loadingOverlay.detach().hide();
				trigger(event_complete, settings.onComplete);
			};
			
			if (isIE) {
				//This fadeIn helps the bicubic resampling to kick-in.
				if (photo) {
					$loaded.fadeIn(100);
				}
			}
			
			$title.html(settings.title).add($loaded).show();
			
			if (total > 1) { // handle grouping
				if (typeof settings.current === "string") {
					$current.html(settings.current.replace('{current}', index + 1).replace('{total}', total)).show();
				}
				
				$next[(settings.loop || index < total - 1) ? "show" : "hide"]().html(settings.next);
				$prev[(settings.loop || index) ? "show" : "hide"]().html(settings.previous);
				
				if (settings.slideshow) {
					$slideshow.show();
				}
				
				// Preloads images within a rel group
				if (settings.preloading) {
					preload = [
						getIndex(-1),
						getIndex(1)
					];
					while (i = $related[preload.pop()]) {
						data = $.data(i, colorbox);
						
						if (data && data.href) {
							src = data.href;
							if ($.isFunction(src)) {
								src = src.call(i);
							}
						} else {
							src = i.href;
						}

						if (isImage(src)) {
							img = new Image();
							img.src = src;
						}
					}
				}
			} else {
				$groupControls.hide();
			}
			
			if (settings.iframe) {
				iframe = $tag('iframe')[0];
				
				if (frameBorder in iframe) {
					iframe[frameBorder] = 0;
				}
				if (allowTransparency in iframe) {
					iframe[allowTransparency] = "true";
				}
				// give the iframe a unique name to prevent caching
				iframe.name = prefix + (+new Date());
				if (settings.fastIframe) {
					complete();
				} else {
					$(iframe).one('load', complete);
				}
				iframe.src = settings.href;
				if (!settings.scrolling) {
					iframe.scrolling = "no";
				}
				$(iframe).addClass(prefix + 'Iframe').appendTo($loaded).one(event_purge, function () {
					iframe.src = "//about:blank";
				});
			} else {
				complete();
			}
			
			if (settings.transition === 'fade') {
				$box.fadeTo(speed, 1, removeFilter);
			} else {
				removeFilter();
			}
		};
		
		if (settings.transition === 'fade') {
			$box.fadeTo(speed, 0, function () {
				publicMethod.position(0, callback);
			});
		} else {
			publicMethod.position(speed, callback);
		}
	};

	publicMethod.load = function (launched) {
		var href, tb_url, setResize, prep = publicMethod.prep;
		
		active = true;
		
		photo = false;
		
		element = $related[index];
		
		if (!launched) {
			makeSettings();
		}
		
		trigger(event_purge);
		
		trigger(event_load, settings.onLoad);
		
		settings.h = settings.height ?
				setSize(settings.height, 'y') - loadedHeight - interfaceHeight :
				settings.innerHeight && setSize(settings.innerHeight, 'y');
		
		settings.w = settings.width ?
				setSize(settings.width, 'x') - loadedWidth - interfaceWidth :
				settings.innerWidth && setSize(settings.innerWidth, 'x');
		
		// Sets the minimum dimensions for use in image scaling
		settings.mw = settings.w;
		settings.mh = settings.h;
		
		// Re-evaluate the minimum width and height based on maxWidth and maxHeight values.
		// If the width or height exceed the maxWidth or maxHeight, use the maximum values instead.
		if (settings.maxWidth) {
			settings.mw = setSize(settings.maxWidth, 'x') - loadedWidth - interfaceWidth;
			settings.mw = settings.w && settings.w < settings.mw ? settings.w : settings.mw;
		}
		if (settings.maxHeight) {
			settings.mh = setSize(settings.maxHeight, 'y') - loadedHeight - interfaceHeight;
			settings.mh = settings.h && settings.h < settings.mh ? settings.h : settings.mh;
		}
		href = settings.href;
		tb_url = settings.tb_url;
		loadingTimer = setTimeout(function () {
			$loadingOverlay.show().appendTo($content);
		}, 100);
		
		if (settings.inline) {
			// Inserts an empty placeholder where inline content is being pulled from.
			// An event is bound to put inline content back when ColorBox closes or loads new content.
			$tag(div).hide().insertBefore($(href)[0]).one(event_purge, function () {
				$(this).replaceWith($loaded.children());
			});
			prep($(href));
		} else if (settings.iframe) {
			// IFrame element won't be added to the DOM until it is ready to be displayed,
			// to avoid problems with DOM-ready JS that might be trying to run in that iframe.
			prep(" ");
		} else if (settings.html) {
			prep(settings.html);
		} else if (isImage(href)) {
			$(photo = new Image())
			.addClass(prefix + 'Photo')
			.error(function () {
				settings.title = false;
				prep($('<div/>').css('minHeight','200px')
					.html('<img src="'+tb_url+'" alt=""/><br>'+settings.imgError+'.<br><a href="'+href+'" title="Перейти" target="_blank">'+href+'</a>'));
			})
			.load(function () {
				var percent;
				photo.onload = null; //stops animated gifs from firing the onload repeatedly.
				
				if (settings.scalePhotos) {
					setResize = function () {
						photo.height -= photo.height * percent;
						photo.width -= photo.width * percent;
					};
					if (settings.mw && photo.width > settings.mw) {
						percent = (photo.width - settings.mw) / photo.width;
						setResize();
					}
					if (settings.mh && photo.height > settings.mh) {
						percent = (photo.height - settings.mh) / photo.height;
						setResize();
					}
				}
				var min = (photo.height < photo.width) ? photo.height : photo.width;
				if(min < settings.minImageSize) {
					photo.height = Math.round(photo.height * (settings.minImageSize/min));
					photo.width = Math.round(photo.width * (settings.minImageSize/min));
				}
				if (settings.h) {
					photo.style.marginTop = Math.max(settings.h - photo.height, 0) / 2 + 'px';
				}
				if ($related[1] && (settings.loop || $related[index + 1])) {
					photo.style.cursor = 'pointer';
					photo.onclick = function () {
						publicMethod.next();
					};
				}
				if (isIE) {
					photo.style.msInterpolationMode = 'bicubic';
				}
				setTimeout(function () { // A pause because Chrome will sometimes report a 0 by 0 size otherwise.
					prep(photo);
				}, 1);
			});
			setTimeout(function () { // A pause because Opera 10.6+ will sometimes not run the onload function otherwise.
				photo.src = href;
			}, 1);
		} else if (href) {
			$loadingBay.load(href, settings.data, function (data, status, xhr) {
				prep(status === 'error' ? $tag(div, 'Error').html(settings.xhrError) : $(this).contents());
			});
		}
	};
		
	// Navigates to the next page/image in a set.
	publicMethod.next = function () {
		if (!active && $related[1] && (settings.loop || $related[index + 1])) {
			index = getIndex(1);
			publicMethod.load();
		}
	};
	
	publicMethod.prev = function () {
		if (!active && $related[1] && (settings.loop || index)) {
			index = getIndex(-1);
			publicMethod.load();
		}
	};

	// Note: to use this within an iframe use the following format: parent.$.fn.colorbox.close();
	publicMethod.close = function () {
		if (open && !closing) {
			
			closing = true;
			
			open = false;
			
			trigger(event_cleanup, settings.onCleanup);
			
			$window.unbind('.' + prefix + ' .' + event_ie6);
			
			$overlay.fadeTo(200, 0);
			
			$box.stop().fadeTo(300, 0, function () {
			
				$box.add($overlay).css({'opacity': 1, cursor: 'auto'}).hide();
				
				trigger(event_purge);
				
				$loaded.remove();
				
				setTimeout(function () {
					closing = false;
					trigger(event_closed, settings.onClosed);
				}, 1);
			});
		}
	};

	// Removes changes ColorBox made to the document, but does not remove the plugin
	// from jQuery.
	publicMethod.remove = function () {
		$([]).add($box).add($overlay).remove();
		$box = null;
		$('.' + boxElement)
			.removeData(colorbox)
			.removeClass(boxElement)
			.die();
	};

	// A method for fetching the current element ColorBox is referencing.
	// returns a jQuery object.
	publicMethod.element = function () {
		return $(element);
	};

	publicMethod.settings = defaults;

}(jQuery, document, this));
// Конец colorbox

// Начало embed_flickr		
(function($) {
    $.fn.embed_flickr = function(size, radius, _float, word, flickr_user_id, flickr_api_key){ 
		var Album_List = {};
		var Cache = {};
		var calls = 0;
		var albums_found = false;
		var flickr = 'https://www.flickr.com/services/rest/?method=flickr.';
		var tail = '&format=json&nojsoncallback=1';
		var api_key = '&api_key=';
		var user_id = '&user_id=';
		var photo_not_found = '<h3 align="center" style="color:firebrick;">Альбом пуст</h3>';
		return this.each(showOverview);
	function showOverview(){
		var $this, $album_list, $wrap, not_found = '<h3 align="center" style="color:firebrick;">' + 'Для user ID "'+flickr_user_id+'"<br>не доступны альбомы Flickr<br>со словом "'+word+'"</h3>';
		$this = $(this);
        $this.empty();
           if ( Cache.__overview ){ Cache.__overview.show(); return; }
           $album_list = $('<div/>')
               .addClass('album_list')
               .css('margin','0px')
               .css('padding','10px')
               .css('visibility','visible')
               .css('position','relative')
               .css('float', _float)
               .append($('<div/>').html('<img src="' + waiting + '" alt="" style="margin-left:50px;">'));
		$wrap =  $('<div/>').css({'position':'relative', 'visibility':'hidden'})	
		$wrap.append( $album_list )	
		$this.prepend($wrap);
		$album_list.empty();
        // Выдать список всех альбомов пользователя с заданными flickr_user_id и flickr_api_key
		$.getJSON(flickr + 'photosets.getList' + api_key + flickr_api_key + user_id + flickr_user_id + tail, renderAlbumList);
		function renderAlbumList(data){
        	if (data && data.photosets && data.photosets.photoset){
				var n, primary_url, album_arr = data.photosets.photoset;
				for(n=0; n < album_arr.length; n++) {
					var album = album_arr[n];
					if (album.title._content.match(word)){
						getAlbumCover(album);
						albums_found = true;
					}
				};
				if(!albums_found) {$album_list.html(not_found); return;}
			} else {$album_list.html(not_found); return;}
			Cache.__overview = $album_list;
			function getAlbumCover(album){
				// Выдать заголовочную картинку альбома размером 150х150
				$.getJSON(flickr + 'photos.getSizes' + api_key + flickr_api_key + '&photo_id=' + album.primary + tail,
				function(response){
					primary_url = response.sizes.size[1].source
					Album_List[album.id] = {
						"id": album.id,
						"description": album.description._content,
						"primary_url": primary_url
					};
					appendCoverImage(Album_List[album.id]);
				});
			}
        }
        function appendCoverImage(cover){
                albums_found = true;
				$div_1 = $('<div/>')
					.addClass('youtube_div_1')
					.css({'display':'inline-block', 'border':'3px solid gainsboro', 'border-radius':radius, '-webkit-border-radius':radius, '-moz-border-radius':radius, 'box-shadow':'4px 5px 3px gray', 'border-style':'inset' });
                var $img = $('<img/>')
					.addClass('album_cover_image')
                    .attr('title',cover.description)
                    .attr('src',cover.primary_url)
					.attr('style', 'padding:0px;')
					.css('height', size)
					.css('width', size)
					.css('zIndex', 0)
					.css('vertical-align','middle')
					.css('position','relative')
					.css('border', '0px')
					.css('margin', '0px')
					.css('border-radius', radius-3)
					.click(function() {
						$album_list.hide();
						showAlbumContent($this, cover.id, cover.description);
					});
				$div_1.append($img);	
                   if(_float == 'right') $div_1.css('margin-left','10px'); 
				else $div_1.css('margin-right','10px');
				$div_1.css({'margin-top':'5px', 'margin-bottom':'5px'});
				$album_list.append($div_1);
				$img.abs_animate({properties:{ height:1.2, width:1.2 }}, $img.get(0), false, true);
        }
	}
	// Выдать содержимое альбома albimID пользователя с заданными flickr_user_id и flickr_api_key
        function showAlbumContent($this, albimID, description){
			++calls;
			var $description_div, photo_arr = [];
            if ( Cache[albimID] ){ Cache[albimID].show(); return; };
            var i, $album, albumPics=[], $albumDiv;
			var clear_right = (_float == 'right') ? '<br style="clear:right">' : '';
            $album = $('<div/>').addClass('album'+calls).css({ 'float' : _float, 'margin-left' : '16px', 'margin-right' : '16px' });
            if (Cache.__overview){
                $album.append($("<div/>")
                    .css({'border-width':'0px', 'float':'left', 'text-indent':'40px' })
                    .append($("<div/>")
					.html('<img class="descript_img" src="http://vt.obninsk.ru/common/picasa_holder_red.gif" alt="" title="Вернуться к списку альбомов" style="border:2px solid silver;box-shadow:4px 5px 2px grey;border-radius:8px;padding:6px;padding-bottom:2px;bottom:6px;">')
                    .click(function(){ $album.hide(); showOverview() })
                    .css({'border-style':'outset',
                            'cursor':'pointer',
							'zIndex':0,
                            'border-width':'0px',
                            'text-align'  :'center',
                            'width'       : '200px',
                            'height'      : '102px'
						})
                    )
                 );
				if (description){
					$description_div = $("<div/>")
					.html('<h4 class="descript_div">' + description + '</h4>' + clear_right)
					.css({'color':'firebrick', 'height':'102px', 'display':'table-cell', 'vertical-align':'middle'})
					$album.append($description_div);
				}
			}
			// Получить внутренность альбома
			$.getJSON(flickr + 'photosets.getPhotos' + api_key + flickr_api_key + user_id + flickr_user_id + '&photoset_id=' + albimID + tail, renderAlbum);
            $this.prepend($album);
			function renderAlbum(data){
				if (data && data.photoset && data.photoset.photo){
					photo_arr = data.photoset.photo;
					if(photo_arr.length < 1) {$description_div.append(photo_not_found); return;}
					for(var m=0; m < photo_arr.length; m++) getSizes(photo_arr[m], photo_arr[m].title);
				} else { $description_div.append(photo_not_found); return;};
            }
			function getSizes(photo, title){
				$.getJSON(flickr + 'photos.getSizes' + api_key + flickr_api_key  + '&photo_id=' + photo.id + tail, function(data){appendInnerImage(data, title);});
			}
            function appendInnerImage(the_photo, title){
				var $img, $div, $a, size_obj = the_photo.sizes.size;
				var original = 8;
				for(var z=0; z < size_obj.length; z++){
					if(size_obj[z].label == 'Original') { original = z; break; }
				}
				$img = $(new Image());
				$img.load(function(){$img.show();})
				.addClass('the_image')
				.css('height', size)
				.css('width', size)
				.css('zIndex', 0)
				.css('vertical-align','middle')
				.css('top','0px')
				.css('border','2px solid silver')
				.css('box-shadow','4px 5px 2px grey')
				.css('border-radius', radius)
				.css('margin-right','8px')
				.hide();
				$a = $("<a/>").addClass('group')
                .attr("href",size_obj[original].source)
                .attr("title",title)
                .append($img);
				$div = makeDiv(); 
				$div.append($a);
				$album.append($div);
				$img.attr("src", size_obj[1].source);
				$('a', $album).colorbox({rel:'album'+calls, slideshow:true, maxWidth:"98%", maxHeight:"98%"});
            }
			function makeDiv(){
               var $div = $('<div/>').css('float', _float).css({marginRight:'2px', marginBottom:'10px'});
               if (waiting) $div.css('background','url(' + waiting + ') no-repeat center center');            
               return $div;
            }
        };
    };
// 	Конец embed_flickr

// 	Исправленный nextSibling
	function pNext(obj) { while (obj = obj.nextSibling) if (obj.nodeType == 1) return obj; return null; }

// 	Начало FisheyeLiteAnimator
var FisheyeLiteAnimator = function(props, the_node, abs, ghost, isPhoto) {
	this._target = the_node;
	this.properties = { fontSize: 2.75 };
	this.units = "px";
	var prop, _in = {}, _out = {};
    this.backOut = function(n) {
        n = n - 1; var s = 1.70158;
        return Math.pow(n, 2) * ((s + 1) * n + s) + 1;
    }
    this.elasticOut = function(n) {
        if(n==0 || n == 1){ return n; }
        var p = .3; var s = p / 4;
        return Math.pow(2, -10 * n) * Math.sin((n - s) * (2 * Math.PI) / p) + 1;
    }
	var runningIn = new dojo.animateProperty({
		node: this._target,
		easing: this.backOut,
		duration: 350,
		properties: _in
	});
	var runningOut = new dojo.animateProperty({
		node: this._target,
		duration: 1420,
		easing: this.elasticOut,
		properties: _out
	});
	this.show = function() { runningOut.stop(); the_node.style.zIndex++; if(ghost) ghost.style.opacity = 0; runningIn.play();  }
	this.hide = function() { if(ghost) ghost.style.opacity = 1; runningIn.stop(); the_node.style.zIndex--; runningOut.play();  }
	this.back = function() { if(ghost) ghost.style.opacity = 1; runningIn.stop(); runningOut.play(); }
	this.makeAnims = function() {
		var cs = dojo.getComputedStyle(this._target);
		for(var p in this.properties){
			prop = this.properties[p],
			deep = dojo.isObject(prop),
			v = parseInt(cs[p])
			_out[p] = { end: v, units:this.units };
			_in[p] = deep ? prop : { end: prop * v, units:this.units };
		}
		if(abs) {
		var z = (parseInt(cs.width)*(1-prop)/2);
			_in['marginLeft'] = { start:0, end:z };
			_in['marginTop'] = { start:0, end:z };
			_out['marginLeft'] = { start:z, end:0 };
			_out['marginTop'] = { start:z, end:0 };
		}
	};
	this.properties = props.properties || this.properties;
	this.makeAnims();
	$(this._target).unbind('mouseover').bind('mouseover', this.show);	
	$(this._target).unbind('mouseout').bind('mouseout', this.hide);
	if(isPhoto) {
		$(this._target).unbind('click').bind('click', function(){
			var neighbor = pNext(this);
			if(neighbor && neighbor.tagName == 'IMG') $(neighbor).click();
		});
	}
}
// Конец FisheyeLiteAnimator

// 	Начало AbsAnimator
var AbsAnimator = function(props, image, ghost, isPhoto) {
	var clone = image.cloneNode(true);
	clone.style.zIndex = image.style.zIndex + 1;
	clone.style.position = 'absolute';
	clone.style.border = '3px solid gainsboro';
	clone.style.borderStyle = 'inset';
	clone.style.boxShadow = '4px 5px 3px gray';
	image.parentElement.insertBefore(clone, image);
	image.src = blank_image;
	image.style.border = '3px solid transparent';
	var div_found = (image.parentElement.tagName == 'DIV') ? image.parentElement : image.parentElement.parentElement ;
	div_found.style.border = '3px solid transparent';
	div_found.style.boxShadow = '';
	div_found.borderStyle = '';
	return (new FisheyeLiteAnimator(props, clone, true, ghost, isPhoto));
}
// Конец AbsAnimator

// Включим постоянную подгонку размеров охватывающих дивов и выравнивание (каждые 50 миллисекунд)
function _adjust(elem, align) {
    if(elem == undefined || elem == null) return;
    if(align == 'center') {
        var center_timer = setInterval(function() { 
			if(elem && elem.parentNode) {
				elem.parentNode.style.height = elem.offsetHeight + 'px';
				elem.style.left = Math.round((elem.parentNode.offsetWidth - elem.offsetWidth)/2) + 'px';
			} else clearInterval(center_timer);
        }, 50);
    } else if(align == 'right') {
        elem.style.right = '0px';
        elem.style.position = 'relative';
        elem.setAttribute('float','right');
    } else {
        elem.style.left = '0px';
        elem.style.position = 'relative';
        elem.setAttribute('float','left');
    }
}

// Внедрим в див альбомы flickr (сначала показываем их обложки)
	$.fn.light_flickr = function(size, oval, align, word, flickr_user_id, flickr_api_key){
		flickr_user_id = flickr_user_id || Flickr_USER_ID;
		flickr_api_key = flickr_api_key || Flickr_API_KEY;
		var $div_outer = $(this);
		var size = size || 150;
		var radius;
		if(oval == 'circle') radius = size/2;
		else if(oval == 'oval') radius = size/3;
		else radius = 8;
		var _float = (align == 'left' || align == 'center') ? 'left' : 'right';
		dojo.addOnLoad(function() {
			// Создадим нужные элементы DOM
			var $div_abs;
			var unicName = "flickr" + Math.floor( Math.random() * 1000000);
			$div_outer.empty();
			$div_outer.css('position','relative');
			$div_abs = $('<div/>')
				.attr('id',unicName)
				.css('cursor','pointer')
				.css('position','absolute');
			$div_outer.append($div_abs);    
			 $('#' + unicName).embed_flickr(size, radius, _float, word, flickr_user_id, flickr_api_key);
			_adjust($div_abs.get(0), align);    // Включим выравнивание дива $div_abs
		});
	}

// Анимируем один "голый" объект
$.fn.one_animate = function(props, obj) { new FisheyeLiteAnimator(props, obj); };
$.fn.abs_animate = function(props, obj, ghost, isPhoto) { return AbsAnimator(props, obj, ghost, isPhoto); };

// Внедрим в див серию видео с Youtuba
$.fn.light_youtube = function(size, oval, align) {
    var args = arguments;
    var size = size || 160;
    var radius;
    if(oval == 'circle') radius = size/2;
    else if(oval == 'oval') radius = size/3;
    else radius = 8;
	var img_radius = radius-3;
    var $div_outer = $(this);
    dojo.addOnLoad(function() {
        // Создадим нужные элементы DOM
        var $div_abs, $div_1, $anchor;
        $div_outer.empty();
        $div_outer.css('position','relative');
        $div_abs = $('<div/>').css('position','absolute');
		$video_list = $('<div/>')
                .addClass('video_list')
                .css('margin','0px')
                .css('padding','10px')
                .css('visibility','visible')
                .css('position','relative');
		if(align == 'left') $video_list.css('float','left');
        if(align == 'right') $video_list.css('float','right');		
		$wrap =  $('<div/>').css({'position':'relative', 'visibility':'hidden'})	
		$wrap.append( $video_list )	
		$div_abs.append($wrap);	
        for (var i=3, c=args.length; i<c; i++) {
            var vid = args[i];
			$div_1 = $('<div/>')
				.addClass('youtube_div_1')
				.css({'display':'inline-block', 'border':'3px solid gainsboro', 'border-radius':radius, '-webkit-border-radius':radius, '-moz-border-radius':radius, 'box-shadow':'4px 5px 3px gray', 'border-style':'inset' });
            $anchor = $('<a/>')
            .addClass('youtube_anchor')
            .attr('id', vid)
            .attr('href', 'http://www.youtube.com/embed/'+vid+'?rel=1&amp;wmode=transparent')
            .attr('title', 'Видео с Google YouTube')
            .html('<img class="youtube_image_n" src="http://i.ytimg.com/vi/'+vid+'/mqdefault.jpg" alt="" style="margin:0;vertical-align:middle;height:'+size+'px;width:'+size+'px;border-radius:'+img_radius+'px;'+'border:0;"/>');
            $div_1.append($anchor);
			if(align == 'right') $div_1.css('margin-left','7px'); 
            else $div_1.css('margin-right','7px');
			$div_1.css({'margin-top':'5px', 'margin-bottom':'5px'});
            $video_list.append($div_1);    
        }
        $div_outer.append($div_abs); 
        $("a.youtube_anchor").colorbox({iframe:true, innerWidth:720, innerHeight:480, maxWidth:"98%", maxHeight:"98%"}); 
        // Включим анимацию для картинок с ютуба
		$("img.youtube_image_n", $div_outer).each(function(){ $div_outer.abs_animate({properties:{ height:1.2, width:1.2 }}, this); });
        // Возьмем описания видео с ID ютуба (кроссдоменно)
        var yt_anchor_list = dojo.query('a.youtube_anchor');
        dojo.forEach(yt_anchor_list, function(item){
			$.getJSON("https://www.googleapis.com/youtube/v3/videos", {
				key: "AIzaSyAmaSpCjFRLOgGeEH2bucQz0Cp3dLLe_28",
				part: "snippet",
				id: item.getAttribute('id')
			}, function(data) {
				if (data.items.length === 0) return;
				var the_title = data.items[0].snippet.title;
				the_title = the_title.replace(reg_quot, reg_quot_replace);		// поставим нормальные кавычки
				item.setAttribute('title', the_title);
			});
		});
        _adjust($div_abs.get(0), align);    // Включим выравнивание дива $div_abs
    });
}

// Внедрим в див одно видео с Youtuba без позиционирования и выравнивания
$.fn.one_youtube = function(siz, oval, bord_weight, bord_color, vid, _img) {
    var size = (siz == undefined || siz == null) ? 160 : siz;
	var vid_img = (_img == undefined || _img == null) ? 'http://i.ytimg.com/vi/'+vid+'/mqdefault.jpg' : _img;
    var radius;
    if(oval == 'circle') radius = size/2;
    else if(oval == 'oval') radius = size/3;
    else radius = 8;
	var img_radius = radius-3;
    var $div_outer = $(this);
    dojo.addOnLoad(function() {
        // Создадим нужные элементы DOM
        var $div_1, $anchor;
        $div_outer.empty();
		$div_1 = $('<div/>')
			.addClass('youtube_div_1')
			.css({'display':'inline-block', 'border':bord_weight+' solid '+bord_color, 'border-radius':radius, '-webkit-border-radius':radius, '-moz-border-radius':radius, 'box-shadow':'4px 5px 3px gray' });
        $anchor = $('<a/>')
            .addClass('youtube_anchor')
            .attr('href', 'http://www.youtube.com/embed/'+vid+'?rel=1&amp;wmode=transparent')
            .attr('title', 'Видео с Google YouTube')
            .html('<img class="youtube_image_n" src="'+vid_img+'" alt="" style="vertical-align:middle;height:'+size+'px;width:'+size+'px;border-radius:'+img_radius+'px;'+'border:0;"/>');
        $div_1.append($anchor);
        $div_outer.append($div_1); 
        $(".youtube_anchor").colorbox({iframe:true, innerWidth:720, innerHeight:480, maxWidth:"98%", maxHeight:"98%"}); 
        // Включим анимацию для картинок с ютуба
        var image = $("img.youtube_image_n").get(0);
        new FisheyeLiteAnimator( { properties:{ height:1.2, width:1.2 } }, image );	
        // Возьмем описания видео с ID ютуба (кроссдоменно)
        var item = dojo.query('a.youtube_anchor')[0];
        $.getJSON("https://www.googleapis.com/youtube/v3/videos", {
				key: "AIzaSyAmaSpCjFRLOgGeEH2bucQz0Cp3dLLe_28",
				part: "snippet",
				id: vid
			}, function(data) {
				if (data.items.length === 0) return;
				var the_title = data.items[0].snippet.title;
				the_title = the_title.replace(reg_quot, reg_quot_replace);		// поставим нормальные кавычки
				item.setAttribute('title', the_title);
		});
    });
}

/* Ещё не отлаживал...
// Анимируем один "обернутый" объект
$.fn.one_rich_animate = function(siz, oval, bord_weight, bord_color, _img) {
    var size = (siz == undefined || siz == null) ? 160 : siz;
	var vid_img = (_img == undefined || _img == null) ? 'http://vt.obninsk.ru/common/blank.png' : _img;
    var radius;
    if(oval == 'circle') radius = size/2;
    else if(oval == 'oval') radius = size/3;
    else radius = 8;
	var img_radius = radius-3;
    var $div_outer = $(this);
    dojo.addOnLoad(function() {
        // Создадим нужные элементы DOM
        var $div_1, $anchor;
        $div_outer.empty();
		$div_1 = $('<div/>')
			.addClass('youtube_div_1')
			.css({'display':'inline-block', 'border':bord_weight+' solid '+bord_color, 'border-radius':radius, '-webkit-border-radius':radius, '-moz-border-radius':radius, 'box-shadow':'4px 5px 3px gray' });
        $anchor = $('<a/>')
            .addClass('youtube_anchor')
            .attr('href', '#')
            .html('<img class="youtube_image_n" src="'+vid_img+'" alt="" style="vertical-align:middle;height:'+size+'px;width:'+size+'px;border-radius:'+img_radius+'px;'+'border:0;"/>');
        $div_1.append($anchor);
        $div_outer.append($div_1); 
        // Включим анимацию для картинок с ютуба
        var image = $("img.youtube_image_n").get(0);
        new FisheyeLiteAnimator( { properties:{ height:1.2, width:1.2 } }, image );	
    });
}
*/

})(jQuery);
