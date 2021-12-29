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
};


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
};


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
};


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
};

export {setWidth, addFadeToSlides, supports, addClass, emitEvent};
