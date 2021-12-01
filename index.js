class Carousel {
  constructor(selector) {
    // @TODO Feature detection

    // Get DOM elements
    this.carousel = document.querySelector(selector);
    if (!this.carousel) {
      console.error("Error, no carousel element found! Bail!");
      return false;
    }
    // Bind "this" to methods
    this.init = this.init.bind(this);
    this.init();
  }

  /**
   * Initializes the carousel by:
   * - setting up variables
   * - Getting data- attribute values
   * - Binding "this" to methods
   * - Invoke addEventListeners() method
   * - Show initial slide
   * @return {[type]} [description]
   */
  init() {
    // Set up variables
    this.slideIndex = null;
    this.sliderInterval = null;
    this.playButton = this.carousel.querySelector(".button--play");
    this.nextButton = this.carousel.querySelector(".button--next");
    this.prevButton = this.carousel.querySelector(".button--prev");
    this.pauseButton = this.carousel.querySelector(".button--pause");

    // Get data- attribute values
    this.wrap = this.carousel.hasAttribute("data-wrap")
      ? // Convert the boolean string data- attribute to a real boolean value using this technique https://stackoverflow.com/a/264037
        this.carousel.getAttribute("data-wrap") === "true"
      : defaults.wrap;
    this.interval = this.carousel.hasAttribute("data-interval")
      ? Number(this.carousel.getAttribute("data-interval"))
      : defaults.interval;
    this.slideIndex = 1;

    // Bind "this" with methods
    this.play = this.play.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this.pause = this.pause.bind(this);

    // Even private methods
    this.showDivs = this.showDivs.bind(this);

    // Add event listeners
    this.addEventListeners();

    // Init
    this.showDivs(this.slideIndex);
  }

  // Binding in the constructor instead of here.
  addEventListeners() {
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

// Sub classing with "extends" on the Carousel class.
// This Super JSON Carousel will use JSON to generate a similar
// carousel slider like the Carousel class does.
class SuperJSONCarousel extends Carousel {
  constructor(selector, slidesObject) {
    // Pass selector to the parent class
    super(selector);

    // Get slides object/array
    this.slides = slidesObject;

    // Bind methods with "this"
    this.renderApp = this.renderApp.bind(this);
    this.renderSlide = this.renderSlide.bind(this);
    this.renderButtons = this.renderButtons.bind(this);

    // Render the slides
    this.carousel.innerHTML = this.renderApp(this.slides);

    // Call super/parent init method
    super.init();
  }

  // Add an init() method that basically overrides the parent classes
  // init() method. This is because the parent init() method assumes
  // DOM elements will be available, while in this extended class
  // we are building the DOM elements in the script.
  //
  // We need to render those script created elements before
  // running the parent init() method.
  /**
   * Init to override the original classe's init method
   * @return {[type]} [description]
   */
  init() {
    console.count("SuperJSONCarousel init");
  }

  /**
   * Returns an UL with rendered slides
   * @param  {Array} slides Array of slide data.
   * @return {[type]}          [description]
   */
  renderApp(slides) {
    return [
      "<div class='carousel-items'>",
      slides
        .map((heading, i) => {
          return this.renderSlide(heading, i);
        })
        .join(""),
      this.renderSlide(),
      "</div>",
      this.renderButtons()
    ].join("");
  }

  /**
   * Render a slide's HTML
   * @param  {Object} slide Slide object
   * @param  {Number} index Index number
   * @return {[type]}       [description]
   */
  renderSlide(slide, index) {
    if (!slide) {
      console.log("Error. Must provide slide parameter");
      return;
    }
    return [
      "<div class='carousel-item carousel-item--" + index + "'>",
      "<div class='carousel-item__inner'>",
      "<div class='carousel-item__box-ratio'>",
      "<img src='" + slide.image + "' class='carousel-item__img'>",
      "</div>",
      "<div class='carousel-item__caption'>",
      "<h3>" + slide.heading + "</h3>",
      "<p>" + slide.subheading + "</p>",
      "</div>",
      "</div>",
      "</div>"
    ].join("");
  }

  /**
   * Helper method to create HTML button elements from scratch.
   * @param  {String} content HTML/string content
   * @param  {String} css     String for CSS classes
   * @param  {String} title   String title for title attribute
   * @param  {String} data    String value for data- attribute
   * @return {[type]}         [description]
   */
  renderButton(content, css, title, data) {
    if (!content) {
      console.log("Must provide content to the renderButton function.");
      return;
    }

    return [
      "<button ",
      this.renderClassAttribute(css),
      this.renderDataAttribute("slide", data),
      this.renderTitleAttribute(title),
      ">",
      content,
      "</button>"
    ].join("");
  }

  // @todo handle [...class] array of classes
  /**
   * Helper method to render class attribute.
   * @param  {String} name Class attribute value
   * @return {[type]}      [description]
   */
  renderClassAttribute(name) {
    if (!name) {
      console.log("Error. Must provide a class name.");
      return;
    }
    return `class="${name}" `;
  }

  /**
   * Helper method for rendering title attribute.
   * @param  {String} title Title attirbute value.
   * @return {[type]}       [description]
   */
  renderTitleAttribute(title) {
    if (!title) {
      console.log("Error. Must provide a title for the title attribute.");
      return;
    }
    // return 'title="' + title + '" ';
    return `title="${title}" `;
  }

  /**
   * Helper method for rendering a data- attribute.
   * @param  {String} name  Value that comes after data-
   * @param  {String} value String value
   * @return {[type]}       [description]
   */
  renderDataAttribute(name = "slide", value) {
    if (!value) {
      console.log(
        "Error. Value must be provided for the renderDataAttribute function."
      );
    }
    return `data-${name}="${value}"`;
  }

  /**
   * Helper method to render slideshow buttons.
   * @return {[type]} [description]
   */
  renderButtons() {
    return [
      // "<button class='button button--prev' data-slide='prev' title='Prev'>&#10094;</button>",
      // "<button class='button button--play'>Play</button>",
      // "<button class='button button--pause'>Pause</button>",
      // "<button class='button button--next' data-slide='next' title='Next'>&#10095;</button>"
      this.renderButton("&#10094;", "button button--prev", "Prev", "prev"),
      this.renderButton("Play", "button button--play"),
      this.renderButton("Pause", "button button--pause"),
      this.renderButton("&#10095;", "button button--next", "Next", "next")
    ].join("");
  }
}

// Static methods, logger utility, utility functions, mixins
