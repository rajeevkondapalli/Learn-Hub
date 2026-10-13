// ============================================
// CSE LEARNHUB - SHARED UI SCRIPT
// ============================================

(function () {
    "use strict";

    // --------------------------------------------
    // Custom cursor (dot + trailing ring + glow)
    // --------------------------------------------

    var cursorGlow = document.querySelector(".cursor-glow");
    var finePointer = window.matchMedia("(pointer: fine)").matches;

    if (finePointer) {

        var dot = document.createElement("div");
        dot.className = "cursor-dot";

        var ring = document.createElement("div");
        ring.className = "cursor-ring";

        document.body.appendChild(dot);
        document.body.appendChild(ring);

        var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        var dotPos = { x: mouse.x, y: mouse.y };
        var ringPos = { x: mouse.x, y: mouse.y };
        var glowPos = { x: mouse.x, y: mouse.y };

        var last = { x: mouse.x, y: mouse.y };
        var speed = 0;

        var prevRing = { x: mouse.x, y: mouse.y };
        var ringRX = 0;
        var ringRY = 0;

        var interactiveSelector =
            "a, button, input, select, textarea, " +
            "[role='button'], .tilt3d, .lesson, .option";

        function updateHover(target) {

            if (!target || !target.closest) {
                target = document.body;
            }

            var overField =
                target.closest("input, textarea, select");

            var overInteractive =
                !overField && target.closest(interactiveSelector);

            ring.classList.toggle("active", Boolean(overInteractive));
            ring.classList.toggle("hidden", Boolean(overField));
            dot.classList.toggle("hidden", Boolean(overField));

        }

        document.addEventListener("mousemove", function (event) {

            mouse.x = event.clientX;
            mouse.y = event.clientY;

            var dx = mouse.x - last.x;
            var dy = mouse.y - last.y;

            speed = Math.min(Math.sqrt(dx * dx + dy * dy), 60);

            last.x = mouse.x;
            last.y = mouse.y;

            if (!document.body.classList.contains("custom-cursor")) {

                dotPos.x = ringPos.x = glowPos.x = mouse.x;
                dotPos.y = ringPos.y = glowPos.y = mouse.y;

                document.body.classList.add("custom-cursor");

            }

        });

        document.addEventListener("mouseover", function (event) {
            updateHover(event.target);
        });

        document.addEventListener("mouseout", function (event) {
            updateHover(event.relatedTarget);
        });

        document.addEventListener("mousedown", function (event) {

            var pulse = document.createElement("div");
            pulse.className = "cursor-pulse";
            pulse.style.left = event.clientX + "px";
            pulse.style.top = event.clientY + "px";

            document.body.appendChild(pulse);

            window.setTimeout(function () {
                pulse.remove();
            }, 520);

        });

        (function animateCursor() {

            dotPos.x += (mouse.x - dotPos.x) * 0.6;
            dotPos.y += (mouse.y - dotPos.y) * 0.6;

            ringPos.x += (mouse.x - ringPos.x) * 0.18;
            ringPos.y += (mouse.y - ringPos.y) * 0.18;

            glowPos.x += (mouse.x - glowPos.x) * 0.09;
            glowPos.y += (mouse.y - glowPos.y) * 0.09;

            // 3D lean: tilt the ring toward its direction of travel
            var ringVX = ringPos.x - prevRing.x;
            var ringVY = ringPos.y - prevRing.y;

            prevRing.x = ringPos.x;
            prevRing.y = ringPos.y;

            var targetRX = Math.max(-32, Math.min(32, -ringVY * 2.2));
            var targetRY = Math.max(-32, Math.min(32, ringVX * 2.2));

            ringRX += (targetRX - ringRX) * 0.2;
            ringRY += (targetRY - ringRY) * 0.2;

            var ringScale = 1 + speed / 220;

            var glowScale = 1 + speed / 120;

            if (cursorGlow) {
                cursorGlow.style.transform =
                    "translate3d(" + glowPos.x + "px," + glowPos.y + "px,0)" +
                    " translate(-50%, -50%) scale(" + glowScale.toFixed(3) + ")";
            }

            dot.style.transform =
                "translate3d(" + dotPos.x + "px," + dotPos.y + "px,0)" +
                " translate(-50%, -50%)";

            ring.style.transform =
                "translate3d(" + ringPos.x + "px," + ringPos.y + "px,0)" +
                " translate(-50%, -50%)" +
                " perspective(600px)" +
                " rotateX(" + ringRX.toFixed(2) + "deg)" +
                " rotateY(" + ringRY.toFixed(2) + "deg)" +
                " scale(" + ringScale.toFixed(3) + ")";

            speed *= 0.9;

            requestAnimationFrame(animateCursor);

        })();

    }


    // --------------------------------------------
    // Mobile menu toggle
    // --------------------------------------------

    var navbar = document.querySelector(".navbar");
    var menuToggle = document.querySelector(".menu-toggle");

    if (navbar && menuToggle) {

        menuToggle.addEventListener("click", function () {

            var open = navbar.classList.toggle("menu-open");

            menuToggle.setAttribute("aria-expanded", String(open));

        });

        var navLinks = document.querySelectorAll(".nav-links a");

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                navbar.classList.remove("menu-open");

                menuToggle.setAttribute("aria-expanded", "false");

            });

        });

    }


    // --------------------------------------------
    // Back to top button
    // --------------------------------------------

    var topButton = document.createElement("button");

    topButton.className = "back-to-top";
    topButton.type = "button";
    topButton.setAttribute("aria-label", "Back to top");
    topButton.innerHTML = "&#8593;";

    document.body.appendChild(topButton);

    topButton.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

    window.addEventListener("scroll", function () {

        topButton.classList.toggle("show", window.scrollY > 400);

    });


    // --------------------------------------------
    // Reveal elements on scroll
    // --------------------------------------------

    var reveals = document.querySelectorAll(".reveal");

    if (reveals.length) {

        if ("IntersectionObserver" in window) {

            var observer = new IntersectionObserver(function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            }, { threshold: 0.12 });

            reveals.forEach(function (element) {
                observer.observe(element);
            });

        } else {

            reveals.forEach(function (element) {
                element.classList.add("visible");
            });

        }

    }


    // --------------------------------------------
    // 3D hero parallax (mouse-follow depth)
    // --------------------------------------------

    var scene = document.querySelector(".hero-visual");

    if (scene) {

        var heroWrap = scene.closest(".hero") || document;

        var setSceneTilt = function (rx, ry) {
            scene.style.setProperty("--vrx", rx + "deg");
            scene.style.setProperty("--vry", ry + "deg");
        };

        heroWrap.addEventListener("mousemove", function (event) {

            var rect = scene.getBoundingClientRect();

            var nx = (event.clientX - rect.left) / rect.width - 0.5;
            var ny = (event.clientY - rect.top) / rect.height - 0.5;

            setSceneTilt(-ny * 12, nx * 12);

        });

        heroWrap.addEventListener("mouseleave", function () {
            setSceneTilt(0, 0);
        });

    }


    // --------------------------------------------
    // 3D tilt cards (mouse-follow rotation)
    // --------------------------------------------

    document.querySelectorAll(".tilt3d").forEach(function (card) {

        var settle = function () {
            card.classList.add("settle");
            card.style.setProperty("--rx", "0deg");
            card.style.setProperty("--ry", "0deg");
        };

        card.addEventListener("mousemove", function (event) {

            var rect = card.getBoundingClientRect();

            var nx = (event.clientX - rect.left) / rect.width - 0.5;
            var ny = (event.clientY - rect.top) / rect.height - 0.5;

            card.classList.remove("settle");

            card.style.setProperty(
                "--rx",
                (-ny * 12).toFixed(2) + "deg"
            );

            card.style.setProperty(
                "--ry",
                (nx * 12).toFixed(2) + "deg"
            );

        });

        card.addEventListener("mouseleave", settle);

    });

})();
