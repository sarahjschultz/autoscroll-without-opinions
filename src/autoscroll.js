import EdgeDetector from "./edge-detector";

const AutoScroll = {
  initialize(options = {}){
    this.timerId = null;
    this.setScrollableContainer(options.scrollableContainer);
    this.setRecursionDelay(options.recursionDelay);
    this.setScrollDistance(options.scrollDistance);
    this.edgeDetector = new EdgeDetector(options);
  },

  // Container to scroll in autoScroll event
  // All offsets + threshholds measured from this
  setScrollableContainer(container){
    // Add guards for type before setting
    this.scrollableContainer = container || document.documentElement;
  },

  // Milliseconds
  setRecursionDelay(delay){
    // Add guards for type before setting
    this.recursionDelay = delay || 50;
  },

  // Distance autoScroller should increase scroll, each call
  // Measured in pixels
  setScrollDistance(distance){
    // Add guards for type before setting
    this.scrollDistance = distance || 10;
  },

  scroll(event) {
    const self = this;

    clearInterval(self.timerId);
    // Event location in document coordinates
    this.edgeDetector.translateEventCoords(event);

    // if event occurs close to the bottom, scroll down
    if (this.edgeDetector.eventWithinThreshholdFromBottom()) {
      clearInterval(self.timerId);
      self.timerId = setTimeout(function scrollBottom() {
        clearInterval(self.timerId);
        self.scrollableContainer.scrollBy(0, self.scrollDistance);
        self.timerId = setTimeout(scrollBottom, self.recursionDelay);
      }, self.recursionDelay);
    }

    // if event occurs close to the top, scroll up
    if (this.edgeDetector.eventWithinThreshholdFromTop()) {
      clearInterval(self.timerId);
      self.timerId = setTimeout(function scrollTop() {
        clearInterval(self.timerId);
        self.scrollableContainer.scrollBy(0, -self.scrollDistance);
        self.timerId = setTimeout(scrollTop, self.recursionDelay);
      }, self.recursionDelay);
    }

    //   if event occurs close to the left, scroll left
    if (this.edgeDetector.eventWithinThreshholdFromLeft()) {
      clearInterval(self.timerId);
      self.timerId = setTimeout(function scrollLeft() {
        clearInterval(self.timerId);
        self.scrollableContainer.scrollBy(-self.scrollDistance, 0);
        self.timerId = setTimeout(scrollLeft, self.recursionDelay);
      }, self.recursionDelay);
    }

    //   if event occurs close to the right, scroll right
    if (this.edgeDetector.eventWithinThreshholdFromRight()) {
      clearInterval(self.timerId);
      self.timerId = setTimeout(function scrollRight() {
        clearInterval(self.timerId);
        self.scrollableContainer.scrollBy(this.scrollDistance, 0);
        self.timerId = setTimeout(scrollRight, self.recursionDelay);
      }, self.recursionDelay);
    }
  },

  reset() {
    clearInterval(this.timerId);
    this.timerId = null;
    delete this.edgeDetector;
  }
};

export default AutoScroll;
