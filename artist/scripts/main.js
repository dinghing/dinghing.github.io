(function() {
  if (typeof mixpanel !== "undefined" && mixpanel !== null) {
    mixpanel.track("pageview: " + document.URL);
  }

}).call(this);
