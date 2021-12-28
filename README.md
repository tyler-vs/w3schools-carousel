# w3schools-carousel

See how to build a [JavaScript carousel here](https://www.w3schools.com/howto/howto_js_slideshow.asp)

## Installation

1. run `npm install`
2. run `npm run watch`

## Usage


```js
// Pass in the query selector string. E.g. "#carousel--1" and then an object full of options.
const carousel1 = new Carousel("#carousel--1", {
  wrap: true,
  interval: 4000,
  initialSlideIndex: 3,
  slideWidth: 400
});

// Get the DOM element.
const c3 = document.querySelector("#carousel--3");

// Initialize carousel by passing in the DOM element and the options object.
const carousel3 = new Carousel(c3, {
  wrap: false,
  interval: 2000
});
````

## Contributing
~~Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.~~

Just for fun!

## License
[MIT](https://choosealicense.com/licenses/mit/)
