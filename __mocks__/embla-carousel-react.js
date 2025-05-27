// __mocks__/embla-carousel-react.js
import React from 'react';

const useEmblaCarousel = () => {
  const ref = React.useRef();

  // Mock EmblaCarousel API
  const emblaApi = React.useMemo(() => ({
    canScrollPrev: () => false, // Default to false, tests can override if needed
    canScrollNext: () => false, // Default to false
    scrollPrev: () => {},
    scrollNext: () => {},
    scrollTo: () => {},
    slidesInView: () => [],
    slidesToScroll: () => 1,
    selectedScrollSnap: () => 0,
    scrollProgress: () => 0,
    engine: {
      slides: [], // Add a mock for engine.slides
      scrollSnaps: [], // Add a mock for engine.scrollSnaps
    },
    // Event listeners - these are crucial
    on: (eventName, callback) => {
      // console.log(`Mock emblaApi.on: ${eventName}`);
      // You could store callbacks and simulate events if needed for more complex tests
    },
    off: (eventName, callback) => {
      // console.log(`Mock emblaApi.off: ${eventName}`);
    },
    reInit: () => {},
    destroy: () => {},
    // Add any other methods or properties that the ShadCN Carousel might use
  }), []);

  return [ref, emblaApi];
};

export default useEmblaCarousel;

// If ShadCN UI's Carousel or its sub-components (CarouselPrevious, CarouselNext)
// import other named exports from 'embla-carousel-react', they might need to be mocked here too.
// For example, if it uses Autoplay:
// export const Autoplay = () => ({
//   name: 'autoplay',
//   init: () => {},
//   destroy: () => {},
//   play: () => {},
//   stop: () => {},
//   reset: () => {},
// });
