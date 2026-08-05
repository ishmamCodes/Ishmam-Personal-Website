!function (s) {
	"use strict";
	s(".switch").on("click", function () {
		s("body").hasClass("light")
			? (s("body").removeClass("light"), s(".switch").removeClass("switched"))
			: (s("body").addClass("light"), s(".switch").addClass("switched"));
	});
	s(document).ready(function () {
		var e = document.querySelector(".progress-wrap path");
		var t = e.getTotalLength();
		e.style.transition = e.style.WebkitTransition = "none";
		e.style.strokeDasharray = t + " " + t;
		e.style.strokeDashoffset = t;
		e.getBoundingClientRect();
		e.style.transition = e.style.WebkitTransition = "stroke-dashoffset 10ms linear";

		// Cache the scrollable range instead of re-querying document/window
		// height on every scroll event (each call forces a synchronous
		// layout) — recompute only when the page actually resizes.
		var scrollRange = 0;
		function updateScrollRange() {
			scrollRange = s(document).height() - s(window).height();
		}
		updateScrollRange();
		s(window).on("resize", updateScrollRange);

		var progressWrap = s(".progress-wrap");
		function update() {
			var scrollTop = s(window).scrollTop();
			var offset = t - (scrollTop * t) / (scrollRange || 1);
			e.style.strokeDashoffset = offset;

			if (scrollTop > 50) {
				progressWrap.addClass("active-progress");
			} else {
				progressWrap.removeClass("active-progress");
			}
		}
		update();

		// A single rAF-throttled scroll handler instead of three separate
		// unthrottled ones, so the DOM only gets touched once per frame
		// no matter how many scroll events the browser fires.
		var ticking = false;
		s(window).on("scroll", function () {
			if (!ticking) {
				ticking = true;
				window.requestAnimationFrame(function () {
					update();
					ticking = false;
				});
			}
		});

		progressWrap.on("click", function (evt) {
			evt.preventDefault();
			window.scrollTo({ top: 0, behavior: "smooth" });
			return false;
		});
	});
}(jQuery);
