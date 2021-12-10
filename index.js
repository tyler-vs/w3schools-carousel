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
    this.slides = this.carousel.querySelectorAll(".carousel-item");
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
    var x = this.slides;

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

    // Add auto controls (play/pause) support
    this.autoControls = this.carousel.hasAttribute("data-auto-controls")
      ? this.carousel.getAttribute("data-auto-controls") === "true"
      : false;
    console.log("this.autoControls", this.autoControls);
    if (this.autoControls) {
      this.renderAutoControls = this.renderAutoControls.bind(this);
    }
    // Add fade support
    this.fade = this.carousel.hasAttribute("data-fade")
      ? this.carousel.getAttribute("data-fade") === "true"
      : false;
    console.log("this.fade", this.fade);
    // Add caption support
    this.captions = this.carousel.hasAttribute("data-captions")
      ? this.carousel.getAttribute("data-captions") === "true"
      : false;
    console.log("this.captions", this.captions);
    if (this.captions) {
      this.renderCaptions = this.renderCaptions.bind(this);
    }
    // Add pager support
    this.pager = this.carousel.hasAttribute("data-pager")
      ? this.carousel.getAttribute("data-pager") === "true"
      : false;
    console.log("this.pager", this.pager);
    if (this.pager) {
      this.renderPager = this.renderPager.bind(this);
    }

    // Bind methods with "this"
    this.renderApp = this.renderApp.bind(this);
    this.renderSlide = this.renderSlide.bind(this);
    this.renderButtons = this.renderButtons.bind(this);

    // Render the slides
    this.carousel.innerHTML = this.renderApp(this.slides);

    // Call super/parent init method
    super.init();

    // Must be called after super.init();
    // Get "slide to" buttons
    this.slideToButtons = this.carousel.querySelectorAll("[data-slide-to]");
    // Bail if no "slide to" buttons found
    if (!this.slideToButtons.length > 0) {
      console.log('Error, no "slide-to" buttons found.');
      return false;
    }
    // Loop through each button
    this.slideToButtons.forEach((button) => {
      // Add click event handler
      button.addEventListener("click", (event) => {
        // Select slide
        this.selectSlide(Number(event.target.dataset.slideTo));
      });
    });
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
      "<div class='carousel-item carousel-item--" +
        index +
        " " +
        (this.fade === true ? "fade" : "") +
        " '>",
      "<div class='carousel-item__inner'>",
      "<div class='carousel-item__box-ratio'>",
      "<img src='" + slide.image + "' class='carousel-item__img'>",
      "</div>",
      this.renderCaptions(slide),
      "</div>",
      "</div>"
    ].join("");
  }
  /**
   * Render pager
   * @return {[type]} [description]
   */
  renderPager() {
    if (!this.pager) {
      console.log("Error. Pager is not set to true.");
      return;
    }

    // Old school way
    return [
      "<button class='button button--indicator' data-slide-to='1'>Slide to #1</button>",
      "<button class='button button--indicator' data-slide-to='2'>Slide to #2</button>",
      "<button class='button button--indicator' data-slide-to='3'>Slide to #3</button>",
      "<button class='button button--indicator' data-slide-to='4'>Slide to #4 (nope)</button>",
      "<button class='button button--indicator' data-slide-to='5'>Slide to #5 (nope)</button>"
    ].join("");

    // Get an array of DOM strings
    const arr = [];

    // Check that we have slides
    if (this.slidesLength > 0) {

      // For each slide
      this.slides.forEach((slide, i) => {
        // Push render dot into the array
        arr.push(this.renderDot(i + 1));
      });

    } else {
      console.log("Error. No slides.");
      return;
    }

    return arr.join("");
  }

  renderDot(i) {
    // Old school way
    // const button = document.createElement("button");
    // button.classList.add("button", "button--inidicator");
    // button.setAttribute("data-slide-to", i);
    // button.textContent = `Slide to #${i}`;
    // New way
    return [
      "<button class='button button--indicator' data-slide-to='" + i + "'>",
      "Slide to #" + i + ".",
      "</button>"
    ].join("");
  }

  /**
   * Render slide captions
   * @param  {Object} slide Slide object
   * @return {[type]}       [description]
   */
  renderCaptions(slide) {
    if (!slide) {
      console.log("No slide data for captions passed.");
      return false;
    }
    return [
      "<div class='carousel-item__caption'>",
      "<h3>" + slide.heading + "</h3>",
      "<p>" + slide.subheading + "</p>",
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
      return;
    }
    return `data-${name}="${value}"`;
  }

  /**
   * Render auto controls (play/pause) buttons
   * @return {[type]}         [description]
   */
  renderAutoControls() {
    if (!this.autoControls) {
      return "";
    }
    return [
      this.renderButton("Play", "button button--play", null, null),
      this.renderButton("Pause", "button button--pause", null, null)
    ].join("");
  }

  /**
   * Helper method to render slideshow buttons.
   * @return {[type]} [description]
   */
  renderButtons() {
    return [
      this.renderPager(),
      this.renderButton("&#10094;", "button button--prev", "Prev", "prev"),
      this.renderAutoControls(),
      this.renderButton("&#10095;", "button button--next", "Next", "next")
    ].join("");
  }

  /**
   * Select slide by number
   * @param  {[type]} n [description]
   * @return {[type]}   [description]
   */
  selectSlide(n) {
    this.showDivs((this.slideIndex = n));
  }
}

// Static methods, logger utility, utility functions, mixins
