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
    // Bind "this" to methods
    this.init = this.init.bind(this);
    this.init();
  }

  init() {
    console.count("Original init");
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

    // Add event listeners without bind() in the call.
    // this.addEventListeners = this.addEventListeners.bind(this);
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

// Initiate fist carousel
const carousel1 = new Carousel("#carousel--1");

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
  init() {
    console.count("SuperJSONCarousel init");
  }

  // Returns an UL with rendered headings
  renderApp(headings) {
    return [
      "<div class='carousel-items'>",
      headings
        .map((heading, i) => {
          return this.renderSlide(heading, i);
        })
        .join(""),
      this.renderSlide(),
      "</div>",
      this.renderButtons()
    ].join("");
  }

  // Render a slide's HTML
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

  // Helper method to create HTML button elements from scratch
  renderButton(content, css, title, data) {
    if (!content) {
      console.log("Must provide content to the renderButton function.");
      return;
    }

    return [
      "<button ",
      // @todo add checks
      // "<button " +
      // (css !== undefined ? this.renderClassAttribute(css) : "") +
      this.renderClassAttribute(css),
      this.renderDataAttribute("slide", data),
      this.renderTitleAttribute(title),
      ">",
      content,
      "</button>"
    ].join("");
  }

  // @todo handle [...class] array of classes
  renderClassAttribute(name) {
    if (!name) {
      console.log("Error. Must provide a class name.");
      return;
    }
    // return 'class="' + name + '" ';
    return `class="${name}" `;
  }

  renderTitleAttribute(title) {
    if (!title) {
      console.log("Error. Must provide a title for the title attribute.");
      return;
    }
    // return 'title="' + title + '" ';
    return `title="${title}" `;
  }

  renderDataAttribute(name = "slide", value) {
    if (!value) {
      console.log(
        "Error. Value must be provided for the renderDataAttribute function."
      );
    }
    return `data-${name}="${value}"`;
  }

  // Renders slideshow buttons
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

// async function to get JSON data, run this before
// initiating a new carousel.
function getJson() {
  return fetch("https://assets.codepen.io/307033/slides.json")
    .then(function (response) {
      // The API call was successful!
      return response.json();
    })
    .then(function (data) {
      // This is the JSON from our response
      console.log(data);
      return data.slides;
    })
    .catch(function (err) {
      // There was an error
      console.warn("Something went wrong.", err);
    });
}
getJson().then((data) => {
  console.log("data", data);
  const carousel2 = new SuperJSONCarousel("#carousel--2", data);
});

// Static methods, logger utility, utility functions, mixins
