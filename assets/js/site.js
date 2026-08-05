(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var mobile = document.getElementById("navMobile");

  function closeMobile() {
    mobile.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      var open = mobile.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobile);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && revealEls.length && !reduceMotion) {
    revealEls.forEach(function (el) {
      el.classList.add("reveal-pending");
    });

    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });

    // Safety net: a paused/background tab, or any observer that never
    // fires, must not leave content permanently invisible.
    setTimeout(function () {
      document.querySelectorAll(".reveal.reveal-pending").forEach(function (el) {
        el.classList.remove("reveal-pending");
        el.classList.add("is-visible");
      });
    }, 2500);
  }

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      function () {
        backToTop.classList.toggle("is-visible", window.scrollY > 480);
      },
      { passive: true }
    );
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Teaching video: autoplay muted on scroll into view, click to unmute ---------- */
  var video = document.getElementById("teachingVideo");
  var muteToggle = document.getElementById("muteToggle");
  var muteIconUse = document.getElementById("muteIconUse");

  if (video && muteToggle) {
    video.removeAttribute("controls");

    if ("IntersectionObserver" in window) {
      var videoObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              video.play().catch(function () {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.3 }
      );
      videoObserver.observe(video);
    }

    function setMuteIcon(muted) {
      if (!muteIconUse) return;
      muteIconUse.setAttribute(
        "href",
        muted ? "#icon-volume-mute" : "#icon-volume-up"
      );
      muteToggle.title = muted ? "Click to unmute" : "Click to mute";
    }

    muteToggle.addEventListener("click", function () {
      video.muted = !video.muted;
      if (!video.muted) video.volume = 1.0;
      setMuteIcon(video.muted);
    });

    video.addEventListener("volumechange", function () {
      setMuteIcon(video.muted);
    });
  }
})();
