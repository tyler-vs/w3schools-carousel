/*! Carousel v2.0.0 | (c) 2021 tyler-vs | MIT License | https://github.com/tyler-vs/w3schools-carousel/ */
define(function () { 'use strict';

	/**
	 * Element.matches() polyfill (simple version)
	 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
	 */
	if (!Element.prototype.matches) {
		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
	}

	// Custom error
	class InvalidSelectorError extends Error {
	  constructor(message) {
	    super(message);
	    this.name = "InvalidSelectorError";
	  }
	}


	// Custom error
	class UnsupportedBrowserError extends Error {
	  constructor(message) {
	    super(message);
	    this.name = "UnsupportedBrowserError";
	  }
	}

	/**
	 * helpers.js
	 *
	 * Collection of helper functions for Carousel.
	 */


	/**
	 * Set the carousel width.
	 * @param {Node} element Carousel element
	 * @param {Number} width   Carousel width in pixels
	 */
	function setWidth(element, width) {
	  if (!element || !width) {
	    return;
	  }
	  // Check if slideWidth setting is not null or undefined.
	  if (width != null || width != undefined) {
	    element.style.maxWidth = `${width}px`;
	  }
	}

	/**
	 * Add classes to each slide element in carousel.
	 * @param {NodeList} slides Slide DOM elements returned from querySelectorAll.
	 */
	function addFadeToSlides(slides) {

	  // Check that slides were passed
	  if (!slides) return;

	  // Run function for each slide.
	  slides.forEach((slide) => {

	    // Add classes to each slide for fade effect
	    addClass(slide, ["fade", "fader", "bounce"]);
	  });
	}


	/**
	 * Check support for browser APIs.
	 * @return {Boolean} True or false based on support queries.
	 */
	function supports() {
	  return (
	    'querySelector' in document &&
	    'addEventListener' in window &&
	    'customEvent' in window &&
	    'forEach' in Array.prototype
	  );
	}

	/**
	 * Add class(es) to DOM elements
	 * @param {[type]} element [description]
	 * @param {[type]} names   [description]
	 */
	function addClass(element, names) {
	  const cssClasses = [].concat(names);
	  if (cssClasses.length > 0) {
	    cssClasses.forEach((cssClass) => {
	      element.classList.add(cssClass);
	    });
	  }
	}

	/**
	 * Emit a custom event
	 * @param  {String} type   The event type
	 * @param  {Object} detail Any details to pass along with the event
	 * @param  {Node}   elem   The element to attach the event to
	 */
	function emitEvent (type, detail = {}, elem = document) {

	  // Make sure there's an event type
	  if (!type) return;

	  // Create a new event
	  let event = new CustomEvent(type, {
	    bubbles: true,
	    cancelable: true,
	    detail: detail
	  });

	  // Dispatch the event
	  return elem.dispatchEvent(event);
	}

	/**
	 * Constructor
	 * @param {String|Node} selector Either a query selector string or DOM node.
	 * @param {Object} options  Object with options.
	 */
	function Carousel(selector, options) {

	  // Check browser support.
	  if (!supports) {
	    throw new UnsupportedBrowserError(`W3Schools Carousel Plugin: This browser does not support the required JavaScript methods and browser APIs.'!`);
	  }

	  // Bail if not selector.
	  if (!selector) {
	    throw new InvalidSelectorError("A selector is required!");
	  }

	  // If selector is a string date type then run querySelector().
	  if (typeof selector === "string") {
	    this.carousel = document.querySelector(selector);
	  } else {
	    // Otherwise use the element
	    this.carousel = selector;
	  }

	  // Bail if no element found.
	  if (!this.carousel) {
	    console.error("Error, no carousel element found! Bail!");
	    return false;
	  }

	  // Defaults
	  this.defaults = {
	    // Cycle to the first slide after the last slide
	    wrap: false,

	    // Set interval in milliseconds
	    interval: 1000,

	    // Set the intial slide (index 1?)
	    initialSlideIndex: 1,

	    // Set a max slide width (defauly: null)
	    slideWidth: null,

	    // Fade animation on slide transitions
	    useFade: true,

	    // CSS Classes
	    classes: {
	      initialized: "carousel--init"
	    },

	    // Selectors
	    selectors: {
	      playButton: ".button--play",
	      nextButton: ".button--next",
	      prevButton: ".button--prev",
	      pauseButton: ".button--pause",
	      slideToButtons: "[data-slide-to]",
	      slides: '.carousel-item'
	    },

	    // Callbacks
	    before: function () {
	      console.log("before");
	    },
	    after: function () {
	      console.log("after");
	    }
	  };

	  // Set settings.
	  this.settings = Object.assign({}, this.defaults, options);

	  // Prevent settings object from being modified.
	  Object.freeze(this.settings);

	  // Bind "this" to methods
	  this.init = this.init.bind(this);

	  // Initialize
	  this.init();
	}

	// Return information about this object.
	Carousel.prototype.toString = function () {
	  return `carousel: ${this.carousel}, settings: ${this.settings}`;
	};

	// Initialize the carousel.
	Carousel.prototype.init = function () {

	  // Run "before" callback.
	  this.settings.before(this.carousel);

	  // Set up variables.
	  this.slideIndex = null;
	  this.sliderInterval = null;

	  // Get the slide elements.
	  this.slides = this.carousel.querySelectorAll(this.settings.selectors.slides);

	  // Check if we have any slide elements.
	  if (!this.slides.length > 0) {
	    console.log('Error. No slide elements found.');
	  }

	  // Check if useFade is enabled.
	  if (this.settings.useFade) {

	    // Add fade support to slides.
	    addFadeToSlides(this.slides);
	  }

	  // Get button DOM elements.
	  this.playButton = this.carousel.querySelector(
	    this.settings.selectors.playButton
	  );
	  this.nextButton = this.carousel.querySelector(
	    this.settings.selectors.nextButton
	  );
	  this.prevButton = this.carousel.querySelector(
	    this.settings.selectors.prevButton
	  );
	  this.pauseButton = this.carousel.querySelector(
	    this.settings.selectors.pauseButton
	  );
	  this.slideToButtons = this.carousel.querySelectorAll(
	    this.settings.selectors.slideToButtons
	  );

	  // Set up carousel settings.
	  this.wrap = this.settings.wrap;
	  this.interval = this.settings.interval;
	  this.slideIndex = this.settings.initialSlideIndex;
	  this.slideWidth = this.settings.slideWidth;
	  this.lastSlideIndex = this.initialSlideIndex;

	  // Bind "this" with class methods.
	  this.play = this.play.bind(this);
	  this.nextSlide = this.nextSlide.bind(this);
	  this.prevSlide = this.prevSlide.bind(this);
	  this.pause = this.pause.bind(this);
	  this.showSlide = this.showSlide.bind(this);

	  // Add event listeners.
	  this.addEventListeners();

	  // Show initial slide.
	  this.showSlide(this.slideIndex);

	  // Set carousel width.
	  setWidth(this.carousel, this.slideWidth);

	  // Add initialized class
	  if (
	    this.settings.classes.initialized != null ||
	    (this.settings.classes.initialized != undefined &&
	      !this.carousel.classList.contains(this.settings.classes.initialized))
	  ) {
	    this.carousel.classList.add(this.settings.classes.initialized);
	  }

	  // Run "after" callback.
	  this.settings.after(this.carousel);
	};

	Carousel.prototype.addEventListeners = function () {
	  this.playButton.addEventListener("click", this.play);
	  this.nextButton.addEventListener("click", this.nextSlide);
	  this.prevButton.addEventListener("click", this.prevSlide);
	  this.pauseButton.addEventListener("click", this.pause);

	  // Check if we have any "slide to" buttons.
	  if (this.slideToButtons.length > 0) {
	    // Loop through each button.
	    this.slideToButtons.forEach((button) => {
	      // Add "click" event handler.
	      button.addEventListener("click", (event) => {
	        // Select slide based off data- attribute
	        const n = Number(event.target.dataset.slideTo);
	        this.showSlide((this.slideIndex = n));
	      });
	    });
	  }
	};



	Carousel.prototype.getSlider = function () {
	  return this.carousel;
	};

	/**
	 * Show a slide
	 * @param  {Number} n Index number of slide to slide to.
	 */
	Carousel.prototype.showSlide = function (n) {

	  // Bail if no parameter passed
	  if (!n) {
	    return;
	  }

	  var i;

	  // Go back to first slide.
	  if (n > this.slides.length) {
	    if (this.wrap == true) {
	      this.slideIndex = 1;
	    } else {
	      this.slideIndex = this.slides.length;
	      return;
	    }
	  }
	  // Go to last slide.
	  if (n < 1) {
	    if (this.wrap == true) {
	      this.slideIndex = this.slides.length;
	    } else {
	      this.slideIndex = 1;
	      return;
	    }
	  }

	  // Hide all slides.
	  for (i = 0; i < this.slides.length; i++) {
	    this.slides[i].style.display = "none";
	  }

	  // Show slide.
	  this.slides[this.slideIndex - 1].style.display = "block";

	  // Get the direction based on the slide index numbers.
	  const direction = (this.lastSlideIndex > this.slideIndex) ? 'backwards' : 'forward';

	  // Emit custom event.
	  emitEvent('carousel::slide', {
	    direction: direction,
	    from: this.lastSlideIndex,
	    to: this.slideIndex
	  }, this.carousel);

	  // Update lastSlideIndex to current slide.
	  this.lastSlideIndex = this.slideIndex;
	};

	Carousel.prototype.pause = function () {
	  console.count("pause()");
	  clearInterval(this.sliderInterval);
	};

	Carousel.prototype.prevSlide = function () {
	  this.showSlide((this.slideIndex += -1));
	};

	Carousel.prototype.nextSlide = function () {
	  this.showSlide((this.slideIndex += 1));
	};

	Carousel.prototype.play = function () {
	  console.count("play()");
	  this.sliderInterval = setInterval(() => {
	    this.nextSlide();
	  }, this.interval);
	};

	return Carousel;

});
