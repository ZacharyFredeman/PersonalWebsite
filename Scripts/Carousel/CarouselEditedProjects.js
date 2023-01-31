const $J = carouselJ => document.querySelector(carouselJ);
const $$J = carouselJ => document.querySelectorAll(carouselJ);

(function() {
    if (!window.app) {
        window.app = {};
    }
    app.carouselJ = {
        removeClass: function(el, classname='') {
            if (el) {
                if (classname === '') {
                    el.className = '';
                } else {
                    el.classList.remove(classname);
                }
                return el;
            }
            return;
        },
        reorder: function() {
            let childcnt = $J("#carouselJ").children.length;
            let childs = $J("#carouselJ").children;

            for (let j=0; j< childcnt; j++) {
                childs[j].dataset.pos = j;
            }
        },
        move: function(el) {
            let selected = el;

            if (typeof el === "string") {
            console.log(`got string: ${el}`);
                selected = (el == "next") ? $J(".selectedJ").nextElementSibling : $J(".selectedJ").previousElementSibling;
                console.dir(selected);
            }

            let curpos = parseInt(app.selected.dataset.pos);
            let tgtpos = parseInt(selected.dataset.pos);

            let cnt = curpos - tgtpos;
            let dir = (cnt < 0) ? -1 : 1;
            let shift = Math.abs(cnt);

            for (let i=0; i<shift; i++) {
                let el = (dir == -1) ? $J("#carouselJ").firstElementChild : $J("#carouselJ").lastElementChild;

                if (dir == -1) {
                    el.dataset.pos = $J("#carouselJ").children.length;
                    $J('#carouselJ').append(el);
                } else {
                    el.dataset.pos = 0;
                    $J('#carouselJ').prepend(el);
                }

                app.carouselJ.reorder();
            }


            app.selected = selected;
            let next = selected.nextElementSibling;// ? selected.nextElementSibling : selected.parentElement.firstElementChild;
            var prev = selected.previousElementSibling; // ? selected.previousElementSibling : selected.parentElement.lastElementChild;
            // var prevSecond = prev ? prev.previousElementSibling : selected.parentElement.lastElementChild;
            // var nextSecond = next ? next.nextElementSibling : selected.parentElement.firstElementChild;

            selected.className = '';
            selected.classList.add("selectedJ");
            selected.classList.add("card");

            app.carouselJ.removeClass(prev).classList.add('prevJ');
            app.carouselJ.removeClass(next).classList.add('nextJ');

            // app.carousel.removeClass(nextSecond).classList.add("nextRightSecond");
            // app.carousel.removeClass(prevSecond).classList.add("prevLeftSecond");

            // app.carousel.nextAll(nextSecond).forEach(item=>{ item.className = ''; item.classList.add('hideRight') });
            // app.carousel.prevAll(prevSecond).forEach(item=>{ item.className = ''; item.classList.add('hideLeft') });

        },
        nextAll: function(el) {
            let els = [];

            if (el) {
                while (el = el.nextElementSibling) { els.push(el); }
            }

            return els;

        },
        prevAll: function(el) {
            let els = [];

            if (el) {
                while (el = el.previousElementSibling) { els.push(el); }
            }


            return els;
        },
        select: function(e) {
        console.log(`select: ${e}`);
            let tgt = e.target;
            while (!tgt.parentElement.classList.contains('carouselJ')) {
                tgt = tgt.parentElement;
            }

            app.carouselJ.move(tgt);

        },
        previous: function(e) {
            app.carouselJ.move('prevJ');
        },
        next: function(e) {
            app.carouselJ.move('nextJ');
        },
        doDown: function(e) {
        console.log(`down: ${e.x}`);
            app.carouselJ.state.downX = e.x;
        },
        doUp: function(e) {
        console.log(`up: ${e.x}`);
            let direction = 0,
                velocity = 0;

            if (app.carouselJ.state.downX) {
                direction = (app.carouselJ.state.downX > e.x) ? -1 : 1;
                velocity = app.carouselJ.state.downX - e.x;

                if (Math.abs(app.carouselJ.state.downX - e.x) < 10) {
                    app.carouselJ.select(e);
                    return false;
                }
                if (direction === -1) {
                    app.carouselJ.move('nextJ');
                } else {
                    app.carouselJ.move('prevJ');
                }
                app.carouselJ.state.downX = 0;
            }
        },
        init: function() {
            document.addEventListener("keydown", app.carouselJ.keypress);
           // $('#carousel').addEventListener("click", app.carousel.select, true);
            $J("#carouselJ").addEventListener("mousedown", app.carouselJ.doDown);
            $J("#carouselJ").addEventListener("touchstart", app.carouselJ.doDown);
            $J("#carouselJ").addEventListener("mouseup", app.carouselJ.doUp);
            $J("#carouselJ").addEventListener("touchend", app.carouselJ.doup);

            app.carouselJ.reorder();
            $J('#prevJ').addEventListener("click", app.carouselJ.previous);
            $J('#nextJ').addEventListener("click", app.carouselJ.next);
            app.selected = $J(".selectedJ");

        },
        state: {}

    }
    app.carouselJ.init();
})();