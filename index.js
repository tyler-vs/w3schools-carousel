console.clear();

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

    // Set up variables
    // this.settings;
    // @TODO pass in config
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

    console.log("this.wrap", this.wrap);
    console.log("this.interval", this.interval);

    // this.addEventListeners();
    //
    // V2
    //
    // How supercharged side nav works
    // bind all the methods in the constructor
    // Methods for event listeners
    this.play = this.play.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this.pause = this.pause.bind(this);
    // Even private methods
    this.showDivs = this.showDivs.bind(this);
    // Add event listeners without bind() in the call.
    this.addEventListenersV2();

    // Init
    this.showDivs(this.slideIndex);
  } // end constructor

  // Original working way
  // addEventListeners() {
  //   // Add event listeners
  //   this.playButton.addEventListener("click", this.play.bind(this));
  //   this.nextButton.addEventListener("click", this.nextSlide.bind(this));
  //   this.prevButton.addEventListener("click", this.prevSlide.bind(this));
  //   this.pauseButton.addEventListener("click", this.pause.bind(this));
  // }

  // Binding in the constructor instead of here.
  addEventListenersV2() {
    // Add event listeners
    this.playButton.addEventListener("click", this.play);
    this.nextButton.addEventListener("click", this.nextSlide);
    this.prevButton.addEventListener("click", this.prevSlide);
    this.pauseButton.addEventListener("click", this.pause);
  }

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
  }
  pause() {
    clearInterval(this.sliderInterval);
  }
  prevSlide() {
    this.showDivs((this.slideIndex += -1));
  }
  nextSlide() {
    this.showDivs((this.slideIndex += 1));
  }
  play() {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    }, this.interval);
  }
}

// Initiate
const carousel1 = new Carousel("#carousel--1");

// Extend SuperCarousel from the Carousel class
class SuperCarousel extends Carousel {
  constructor(selector) {
    super(selector);
    this.slideToButtons = this.carousel.querySelectorAll("[data-slide-to]");
    if (!this.slideToButtons.length > 0) {
      console.log('Error, no "slide-to" buttons found.');
      return false;
    }
    this.slideToButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        this.selectSlide(Number(event.target.dataset.slideTo));
      });
    });
  } // end constructor

  selectSlide(n) {
    this.showDivs((this.slideIndex = n));
  }
}

const carousel2 = new SuperCarousel("#carousel--2");
