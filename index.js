/**
 * Carousel class
 * @author Tyler Van Schaick
 * @file Carousel class
 */
class Carousel {
  constructor(selector) {

    // @TODO Feature detection

    // Get DOM elements
    this.carousel = document.querySelector(selector);
    if (!this.carousel) {
      console.error("Error, no carousel element found! Bail!");
      return false;
    }
    this.playButton = this.carousel.querySelector(".button--play");
    this.nextButton = this.carousel.querySelector(".button--next");
    this.prevButton = this.carousel.querySelector(".button--prev");
    this.pauseButton = this.carousel.querySelector(".button--pause");

    // Set variables
    this.slideIndex = null;
    this.sliderInterval = null;

    // Get data- attribute values
    // Last image goes back to first image
    this.wrap = this.carousel.hasAttribute("data-wrap")
      ? // Convert the boolean string data- attribute to a real boolean value using this technique https://stackoverflow.com/a/264037
        this.carousel.getAttribute("data-wrap") === "true"
      : defaults.wrap;
    this.interval = this.carousel.hasAttribute("data-interval")
      ? Number(this.carousel.getAttribute("data-interval"))
      : defaults.interval;
    this.slideIndex = 1;

    // Bind functions
    this.play = this.play.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this.pause = this.pause.bind(this);
    this.showDivs = this.showDivs.bind(this);

    this.addEventListenersV2();

    // Init
    this.showDivs(this.slideIndex);
  } // end constructor

  /**
   * Add carousel related event listeners.
   */
  addEventListenersV2() {
    // Add event listeners
    this.playButton.addEventListener("click", this.play);
    this.nextButton.addEventListener("click", this.nextSlide);
    this.prevButton.addEventListener("click", this.prevSlide);
    this.pauseButton.addEventListener("click", this.pause);
  }

  /**
   * Show a specified div element/carousel slide
   * @param  {number} n carousel slide index number
   * @return {[type]}   [description]
   */
  showDivs(n) {
    var i;
    var x = this.carousel.querySelectorAll(".carousel-item");

    // Go back to first slide
    if (n > x.length) {
      if (this.wrap == true) {
        this.slideIndex = 1;
      } else {
        this.slideIndex = x.length;
        return;
      }
    }
    // Go to last slide
    if (n < 1) {
      if (this.wrap == true) {
        this.slideIndex = x.length;
      } else {
        this.slideIndex = 1;
        return;
      }
    }
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    x[this.slideIndex - 1].style.display = "block";
  };

  /**
   * Pause the carousel
   * @return {[type]} [description]
   */
  pause() {
    clearInterval(this.sliderInterval);
  };

  /**
   * Go to previous carousel slide
   * @return {[type]} [description]
   */
  prevSlide() {
    this.showDivs((this.slideIndex += -1));
  };

  /**
   * Go to next carousel slide
   * @return {[type]} [description]
   */
  nextSlide() {
    this.showDivs((this.slideIndex += 1));
  };

  /**
   * Play the carousel slides
   * @return {[type]} [description]
   */
  play() {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    }, this.interval);
  };
};

// Initiate
const carousel1 = new Carousel("#carousel--1");

// Extend SuperCarousel from the Carousel class
class SuperCarousel extends Carousel {
  constructor(selector) {
    super(selector);
    this.slideToButtons = this.carousel.querySelectorAll("[data-slide-to]");
    if (!this.slideToButtons.length > 0) {
      console.error('Error, no "slide-to" buttons found.');
      return false;
    }
    this.slideToButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        this.selectSlide(Number(event.target.dataset.slideTo));
      });
    });
  }; // end constructor

  /**
   * Select a certain carousel slide
   * @param  {[type]} n [description]
   * @return {[type]}   [description]
   */
  selectSlide(n) {
    this.showDivs((this.slideIndex = n));
  };
};

const carousel2 = new SuperCarousel("#carousel--2");
