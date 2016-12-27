(function(t) {
    "use strict";
    function e() {
        var t = document.createElement("bootstrap"),
        e = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"

        };
        for (var n in e) if (void 0 !== t.style[n]) return {
            end: e[n]

        };
        return ! 1

    }
    t.fn.emulateTransitionEnd = function(e) {
        var n = !1,
        i = this;
        t(this).one("bsTransitionEnd", 
        function() {
            n = !0

        });
        var o = function() {
            n || t(i).trigger(t.support.transition.end)

        };
        return setTimeout(o, e),
        this

    },
    t(function() {
        t.support.transition = e(),
        t.support.transition && (t.event.special.bsTransitionEnd = {
            bindType: t.support.transition.end,
            delegateType: t.support.transition.end,
            handle: function(e) {
                return t(e.target).is(this) ? e.handleObj.handler.apply(this, arguments) : void 0

            }

        })

    })

})(jQuery);
(function(t) {
    "use strict";
    function e(e) {
        return this.each(function() {
            var n = t(this),
            o = n.data("bs.alert");
            o || n.data("bs.alert", o = new i(this)),
            "string" == typeof e && o[e].call(n)

        })

    }
    var n = '[data-dismiss="alert"]',
    i = function(e) {
        t(e).on("click", n, this.close)

    };
    i.VERSION = "3.2.0",
    i.prototype.close = function(e) {
        function n() {
            r.detach().trigger("closed.bs.alert").remove()

        }
        var i = t(this),
        o = i.attr("data-target");
        o || (o = i.attr("href"), o = o && o.replace(/.*(?=#[^\s]*$)/, ""));
        var r = t(o);
        e && e.preventDefault(),
        r.length || (r = i.hasClass("alert") ? i: i.parent()),
        r.trigger(e = t.Event("close.bs.alert")),
        e.isDefaultPrevented() || (r.removeClass("in"), t.support.transition && r.hasClass("fade") ? r.one("bsTransitionEnd", n).emulateTransitionEnd(150) : n())

    };
    var o = t.fn.alert;
    t.fn.alert = e,
    t.fn.alert.Constructor = i,
    t.fn.alert.noConflict = function() {
        return t.fn.alert = o,
        this

    },
    t(document).on("click.bs.alert.data-api", n, i.prototype.close)

})(jQuery);
(function(t) {
    "use strict";
    function e(e) {
        return this.each(function() {
            var i = t(this),
            o = i.data("bs.button"),
            r = "object" == typeof e && e;
            o || i.data("bs.button", o = new n(this, r)),
            "toggle" == e ? o.toggle() : e && o.setState(e)

        })

    }
    var n = function(e, i) {
        this.$element = t(e),
        this.options = t.extend({},
        n.DEFAULTS, i),
        this.isLoading = !1

    };
    n.VERSION = "3.2.0",
    n.DEFAULTS = {
        loadingText: "loading..."

    },
    n.prototype.setState = function(e) {
        var n = "disabled",
        i = this.$element,
        o = i.is("input") ? "val": "html",
        r = i.data();
        e += "Text",
        null == r.resetText && i.data("resetText", i[o]()),
        i[o](null == r[e] ? this.options[e] : r[e]),
        setTimeout(t.proxy(function() {
            "loadingText" == e ? (this.isLoading = !0, i.addClass(n).attr(n, n)) : this.isLoading && (this.isLoading = !1, i.removeClass(n).removeAttr(n))

        },
        this), 0)

    },
    n.prototype.toggle = function() {
        var t = !0,
        e = this.$element.closest('[data-toggle="buttons"]');
        if (e.length) {
            var n = this.$element.find("input");
            "radio" == n.prop("type") && (n.prop("checked") && this.$element.hasClass("active") ? t = !1: e.find(".active").removeClass("active")),
            t && n.prop("checked", !this.$element.hasClass("active")).trigger("change")

        }
        t && this.$element.toggleClass("active")

    };
    var i = t.fn.button;
    t.fn.button = e,
    t.fn.button.Constructor = n,
    t.fn.button.noConflict = function() {
        return t.fn.button = i,
        this

    },
    t(document).on("click.bs.button.data-api", '[data-toggle^="button"]', 
    function(n) {
        var i = t(n.target);
        i.hasClass("btn") || (i = i.closest(".btn")),
        e.call(i, "toggle"),
        n.preventDefault()

    })

})(jQuery);
(function(t) {
    "use strict";
    function e(e) {
        return this.each(function() {
            var i = t(this),
            o = i.data("bs.carousel"),
            r = t.extend({},
            n.DEFAULTS, i.data(), "object" == typeof e && e),
            s = "string" == typeof e ? e: r.slide;
            o || i.data("bs.carousel", o = new n(this, r)),
            "number" == typeof e ? o.to(e) : s ? o[s]() : r.interval && o.pause().cycle()

        })

    }
    var n = function(e, n) {
        this.$element = t(e).on("keydown.bs.carousel", t.proxy(this.keydown, this)),
        this.$indicators = this.$element.find(".carousel-indicators"),
        this.options = n,
        this.paused = this.sliding = this.interval = this.$active = this.$items = null,
        "hover" == this.options.pause && this.$element.on("mouseenter.bs.carousel", t.proxy(this.pause, this)).on("mouseleave.bs.carousel", t.proxy(this.cycle, this))

    };
    n.VERSION = "3.2.0",
    n.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0

    },
    n.prototype.keydown = function(t) {
        switch (t.which) {
            case 37:
            this.prev();
            break;
            case 39:
            this.next();
            break;
            default:
            return

        }
        t.preventDefault()

    },
    n.prototype.cycle = function(e) {
        return e || (this.paused = !1),
        this.interval && clearInterval(this.interval),
        this.options.interval && !this.paused && (this.interval = setInterval(t.proxy(this.next, this), this.options.interval)),
        this

    },
    n.prototype.getItemIndex = function(t) {
        return this.$items = t.parent().children(".item"),
        this.$items.index(t || this.$active)

    },
    n.prototype.to = function(e) {
        var n = this,
        i = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        return e > this.$items.length - 1 || 0 > e ? void 0: this.sliding ? this.$element.one("slid.bs.carousel", 
        function() {
            n.to(e)

        }) : i == e ? this.pause().cycle() : this.slide(e > i ? "next": "prev", t(this.$items[e]))

    },
    n.prototype.pause = function(e) {
        return e || (this.paused = !0),
        this.$element.find(".next, .prev").length && t.support.transition && (this.$element.trigger(t.support.transition.end), this.cycle(!0)),
        this.interval = clearInterval(this.interval),
        this

    },
    n.prototype.next = function() {
        return this.sliding ? void 0: this.slide("next")

    },
    n.prototype.prev = function() {
        return this.sliding ? void 0: this.slide("prev")

    },
    n.prototype.slide = function(e, n) {
        var i = this.$element.find(".item.active"),
        o = n || i[e](),
        r = this.interval,
        s = "next" == e ? "left": "right",
        a = "next" == e ? "first": "last",
        l = this;
        if (!o.length) {
            if (!this.options.wrap) return;
            o = this.$element.find(".item")[a]()

        }
        if (o.hasClass("active")) return this.sliding = !1;
        var c = o[0],
        u = t.Event("slide.bs.carousel", {
            relatedTarget: c,
            direction: s

        });
        if (this.$element.trigger(u), !u.isDefaultPrevented()) {
            if (this.sliding = !0, r && this.pause(), this.$indicators.length) {
                this.$indicators.find(".active").removeClass("active");
                var p = t(this.$indicators.children()[this.getItemIndex(o)]);
                p && p.addClass("active")

            }
            var h = t.Event("slid.bs.carousel", {
                relatedTarget: c,
                direction: s

            });
            return t.support.transition && this.$element.hasClass("slide") ? (o.addClass(e), o[0].offsetWidth, i.addClass(s), o.addClass(s), i.one("bsTransitionEnd", 
            function() {
                o.removeClass([e, s].join(" ")).addClass("active"),
                i.removeClass(["active", s].join(" ")),
                l.sliding = !1,
                setTimeout(function() {
                    l.$element.trigger(h)

                },
                0)

            }).emulateTransitionEnd(1e3 * i.css("transition-duration").slice(0, -1))) : (i.removeClass("active"), o.addClass("active"), this.sliding = !1, this.$element.trigger(h)),
            r && this.cycle(),
            this

        }

    };
    var i = t.fn.carousel;
    t.fn.carousel = e,
    t.fn.carousel.Constructor = n,
    t.fn.carousel.noConflict = function() {
        return t.fn.carousel = i,
        this

    },
    t(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]", 
    function(n) {
        var i,
        o = t(this),
        r = t(o.attr("data-target") || (i = o.attr("href")) && i.replace(/.*(?=#[^\s]+$)/, ""));
        if (r.hasClass("carousel")) {
            var s = t.extend({},
            r.data(), o.data()),
            a = o.attr("data-slide-to");
            a && (s.interval = !1),
            e.call(r, s),
            a && r.data("bs.carousel").to(a),
            n.preventDefault()

        }

    }),
    t(window).on("load", 
    function() {
        t('[data-ride="carousel"]').each(function() {
            var n = t(this);
            e.call(n, n.data())

        })

    })

})(jQuery);
(function(t) {
    "use strict";
    function e(e) {
        return this.each(function() {
            var i = t(this),
            o = i.data("bs.collapse"),
            r = t.extend({},
            n.DEFAULTS, i.data(), "object" == typeof e && e); ! o && r.toggle && "show" == e && (e = !e),
            o || i.data("bs.collapse", o = new n(this, r)),
            "string" == typeof e && o[e]()

        })

    }
    var n = function(e, i) {
        this.$element = t(e),
        this.options = t.extend({},
        n.DEFAULTS, i),
        this.transitioning = null,
        this.options.parent && (this.$parent = t(this.options.parent)),
        this.options.toggle && this.toggle()

    };
    n.VERSION = "3.2.0",
    n.DEFAULTS = {
        toggle: !0

    },
    n.prototype.dimension = function() {
        var t = this.$element.hasClass("width");
        return t ? "width": "height"

    },
    n.prototype.show = function() {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var n = t.Event("show.bs.collapse");
            if (this.$element.trigger(n), !n.isDefaultPrevented()) {
                var i = this.$parent && this.$parent.find("> .panel > .in");
                if (i && i.length) {
                    var o = i.data("bs.collapse");
                    if (o && o.transitioning) return;
                    e.call(i, "hide"),
                    o || i.data("bs.collapse", null)

                }
                var r = this.dimension();
                this.$element.removeClass("collapse").addClass("collapsing")[r](0),
                this.transitioning = 1;
                var s = function() {
                    this.$element.removeClass("collapsing").addClass("collapse in")[r](""),
                    this.transitioning = 0,
                    this.$element.trigger("shown.bs.collapse")

                };
                if (!t.support.transition) return s.call(this);
                var a = t.camelCase(["scroll", r].join("-"));
                this.$element.one("bsTransitionEnd", t.proxy(s, this)).emulateTransitionEnd(350)[r](this.$element[0][a])

            }

        }

    },
    n.prototype.hide = function() {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var e = t.Event("hide.bs.collapse");
            if (this.$element.trigger(e), !e.isDefaultPrevented()) {
                var n = this.dimension();
                this.$element[n](this.$element[n]())[0].offsetHeight,
                this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),
                this.transitioning = 1;
                var i = function() {
                    this.transitioning = 0,
                    this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")

                };
                return t.support.transition ? void this.$element[n](0).one("bsTransitionEnd", t.proxy(i, this)).emulateTransitionEnd(350) : i.call(this)

            }

        }

    },
    n.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide": "show"]()

    };
    var i = t.fn.collapse;
    t.fn.collapse = e,
    t.fn.collapse.Constructor = n,
    t.fn.collapse.noConflict = function() {
        return t.fn.collapse = i,
        this

    },
    t(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', 
    function(n) {
        var i,
        o = t(this),
        r = o.attr("data-target") || n.preventDefault() || (i = o.attr("href")) && i.replace(/.*(?=#[^\s]+$)/, ""),
        s = t(r),
        a = s.data("bs.collapse"),
        l = a ? "toggle": o.data(),
        c = o.attr("data-parent"),
        u = c && t(c);
        a && a.transitioning || (u && u.find('[data-toggle="collapse"][data-parent="' + c + '"]').not(o).addClass("collapsed"), o[s.hasClass("in") ? "addClass": "removeClass"]("collapsed")),
        e.call(s, l)

    })

})(jQuery);

(function(t) {
    "use strict";
    function e(e) {
        e && 3 === e.which || (t(o).remove(), t(r).each(function() {
            var i = n(t(this)),
            o = {
                relatedTarget: this

            };
            i.hasClass("open") && (i.trigger(e = t.Event("hide.bs.dropdown", o)), e.isDefaultPrevented() || i.removeClass("open").trigger("hidden.bs.dropdown", o))

        }))

    }
    function n(e) {
        var n = e.attr("data-target");
        n || (n = e.attr("href"), n = n && /#[A-Za-z]/.test(n) && n.replace(/.*(?=#[^\s]*$)/, ""));
        var i = n && t(n);
        return i && i.length ? i: e.parent()

    }
    function i(e) {
        return this.each(function() {
            var n = t(this),
            i = n.data("bs.dropdown");
            i || n.data("bs.dropdown", i = new s(this)),
            "string" == typeof e && i[e].call(n)

        })

    }
    var o = ".dropdown-backdrop",
    r = '[data-toggle="dropdown"]',
    s = function(e) {
        t(e).on("click.bs.dropdown", this.toggle)

    };
    s.VERSION = "3.2.0",
    s.prototype.toggle = function(i) {
        var o = t(this);
        if (!o.is(".disabled, :disabled")) {
            var r = n(o),
            s = r.hasClass("open");
            if (e(), !s) {
                "ontouchstart" in document.documentElement && !r.closest(".navbar-nav").length && t('<div class="dropdown-backdrop"/>').insertAfter(t(this)).on("click", e);
                var a = {
                    relatedTarget: this

                };
                if (r.trigger(i = t.Event("show.bs.dropdown", a)), i.isDefaultPrevented()) return;
                o.trigger("focus"),
                r.toggleClass("open").trigger("shown.bs.dropdown", a)

            }
            return ! 1

        }

    },
    s.prototype.keydown = function(e) {
        if (/(38|40|27)/.test(e.keyCode)) {
            var i = t(this);
            if (e.preventDefault(), e.stopPropagation(), !i.is(".disabled, :disabled")) {
                var o = n(i),
                s = o.hasClass("open");
                if (!s || s && 27 == e.keyCode) return 27 == e.which && o.find(r).trigger("focus"),
                i.trigger("click");
                var a = " li:not(.divider):visible a",
                l = o.find('[role="menu"]' + a + ', [role="listbox"]' + a);
                if (l.length) {
                    var c = l.index(l.filter(":focus"));
                    38 == e.keyCode && c > 0 && c--,
                    40 == e.keyCode && c < l.length - 1 && c++,
                    ~c || (c = 0),
                    l.eq(c).trigger("focus")

                }

            }

        }

    };
    var a = t.fn.dropdown;
    t.fn.dropdown = i,
    t.fn.dropdown.Constructor = s,
    t.fn.dropdown.noConflict = function() {
        return t.fn.dropdown = a,
        this

    },
    t(document).on("click.bs.dropdown.data-api", e).on("click.bs.dropdown.data-api", ".dropdown form", 
    function(t) {
        t.stopPropagation()

    }).on("click.bs.dropdown.data-api", r, s.prototype.toggle).on("keydown.bs.dropdown.data-api", r + ', [role="menu"], [role="listbox"]', s.prototype.keydown)

})(jQuery);

(function(t) {
    "use strict";
    function e(e, i) {
        return this.each(function() {
            var o = t(this),
            r = o.data("bs.modal"),
            s = t.extend({},
            n.DEFAULTS, o.data(), "object" == typeof e && e);
            r || o.data("bs.modal", r = new n(this, s)),
            "string" == typeof e ? r[e](i) : s.show && r.show(i)

        })

    }
    var n = function(e, n) {
        this.options = n,
        this.$body = t(document.body),
        this.$element = t(e),
        this.$backdrop = this.isShown = null,
        this.scrollbarWidth = 0,
        this.options.remote && this.$element.find(".modal-content").load(this.options.remote, t.proxy(function() {
            this.$element.trigger("loaded.bs.modal")


        },
        this))

    };
    n.VERSION = "3.2.0",
    n.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0

    },
    n.prototype.toggle = function(t) {
        return this.isShown ? this.hide() : this.show(t)

    },
    n.prototype.show = function(e) {
        var n = this,
        i = t.Event("show.bs.modal", {
            relatedTarget: e

        });
        this.$element.trigger(i),
        this.isShown || i.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.$body.addClass("modal-open"), this.setScrollbar(), this.escape(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', t.proxy(this.hide, this)), this.backdrop(function() {
            var i = t.support.transition && n.$element.hasClass("fade");
            n.$element.parent().length || n.$element.appendTo(n.$body),
            n.$element.show().scrollTop(0),
            i && n.$element[0].offsetWidth,
            n.$element.addClass("in").attr("aria-hidden", !1),
            n.enforceFocus();
            var o = t.Event("shown.bs.modal", {
                relatedTarget: e

            });
            i ? n.$element.find(".modal-dialog").one("bsTransitionEnd", 
            function() {
                n.$element.trigger("focus").trigger(o)

            }).emulateTransitionEnd(300) : n.$element.trigger("focus").trigger(o)

        }))

    },
    n.prototype.hide = function(e) {
        e && e.preventDefault(),
        e = t.Event("hide.bs.modal"),
        this.$element.trigger(e),
        this.isShown && !e.isDefaultPrevented() && (this.isShown = !1, this.$body.removeClass("modal-open"), this.resetScrollbar(), this.escape(), t(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), t.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", t.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal())

    },
    n.prototype.enforceFocus = function() {
        t(document).off("focusin.bs.modal").on("focusin.bs.modal", t.proxy(function(t) {
            this.$element[0] === t.target || this.$element.has(t.target).length || this.$element.trigger("focus")

        },
        this))

    },
    n.prototype.escape = function() {
        this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.bs.modal", t.proxy(function(t) {
            27 == t.which && this.hide()

        },
        this)) : this.isShown || this.$element.off("keyup.dismiss.bs.modal")

    },
    n.prototype.hideModal = function() {
        var t = this;
        this.$element.hide(),
        this.backdrop(function() {
            t.$element.trigger("hidden.bs.modal")

        })

    },
    n.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove(),
        this.$backdrop = null

    },
    n.prototype.backdrop = function(e) {
        var n = this,
        i = this.$element.hasClass("fade") ? "fade": "";
        if (this.isShown && this.options.backdrop) {
            var o = t.support.transition && i;
            if (this.$backdrop = t('<div class="modal-backdrop ' + i + '" />').appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", t.proxy(function(t) {
                t.target === t.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))

            },
            this)), o && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !e) return;
            o ? this.$backdrop.one("bsTransitionEnd", e).emulateTransitionEnd(150) : e()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var r = function() {
                n.removeBackdrop(),
                e && e()

            };
            t.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", r).emulateTransitionEnd(150) : r()

        } else e && e()

    },
    n.prototype.checkScrollbar = function() {
        document.body.clientWidth >= window.innerWidth || (this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar())

    },
    n.prototype.setScrollbar = function() {
        var t = parseInt(this.$body.css("padding-right") || 0, 10);
        this.scrollbarWidth && this.$body.css("padding-right", t + this.scrollbarWidth)

    },
    n.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", "")

    },
    n.prototype.measureScrollbar = function() {
        var t = document.createElement("div");
        t.className = "modal-scrollbar-measure",
        this.$body.append(t);
        var e = t.offsetWidth - t.clientWidth;
        return this.$body[0].removeChild(t),
        e

    };
    var i = t.fn.modal;
    t.fn.modal = e,
    t.fn.modal.Constructor = n,
    t.fn.modal.noConflict = function() {
        return t.fn.modal = i,
        this

    },
    t(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', 
    function(n) {
        var i = t(this),
        o = i.attr("href"),
        r = t(i.attr("data-target") || o && o.replace(/.*(?=#[^\s]+$)/, "")),
        s = r.data("bs.modal") ? "toggle": t.extend({
            remote: !/#/.test(o) && o

        },
        r.data(), i.data());
        i.is("a") && n.preventDefault(),
        r.one("show.bs.modal", 
        function(t) {
            t.isDefaultPrevented() || r.one("hidden.bs.modal", 
            function() {
                i.is(":visible") && i.trigger("focus")

            })

        }),
        e.call(r, s, this)

    })

})(jQuery);
(function(t) {
    "use strict";
    function e(e) {
        return this.each(function() {
            var i = t(this),
            o = i.data("bs.tooltip"),
            r = "object" == typeof e && e; (o || "destroy" != e) && (o || i.data("bs.tooltip", o = new n(this, r)), "string" == typeof e && o[e]())

        })

    }
    var n = function(t, e) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null,
        this.init("tooltip", t, e)

    };
    n.VERSION = "3.2.0",
    n.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: {
            selector: "body",
            padding: 0

        }

    },
    n.prototype.init = function(e, n, i) {
        this.enabled = !0,
        this.type = e,
        this.$element = t(n),
        this.options = this.getOptions(i),
        this.$viewport = this.options.viewport && t(this.options.viewport.selector || this.options.viewport);
        for (var o = this.options.trigger.split(" "), r = o.length; r--;) {
            var s = o[r];
            if ("click" == s) this.$element.on("click." + this.type, this.options.selector, t.proxy(this.toggle, this));
            else if ("manual" != s) {
                var a = "hover" == s ? "mouseenter": "focusin",
                l = "hover" == s ? "mouseleave": "focusout";
                this.$element.on(a + "." + this.type, this.options.selector, t.proxy(this.enter, this)),
                this.$element.on(l + "." + this.type, this.options.selector, t.proxy(this.leave, this))

            }

        }
        this.options.selector ? this._options = t.extend({},
        this.options, {
            trigger: "manual",
            selector: ""

        }) : this.fixTitle()

    },
    n.prototype.getDefaults = function() {
        return n.DEFAULTS

    },
    n.prototype.getOptions = function(e) {
        return e = t.extend({},
        this.getDefaults(), this.$element.data(), e),
        e.delay && "number" == typeof e.delay && (e.delay = {
            show: e.delay,
            hide: e.delay

        }),
        e

    },
    n.prototype.getDelegateOptions = function() {
        var e = {},
        n = this.getDefaults();
        return this._options && t.each(this._options, 
        function(t, i) {
            n[t] != i && (e[t] = i)

        }),
        e

    },
    n.prototype.enter = function(e) {
        var n = e instanceof this.constructor ? e: t(e.currentTarget).data("bs." + this.type);
        return n || (n = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, n)),
        clearTimeout(n.timeout),
        n.hoverState = "in",
        n.options.delay && n.options.delay.show ? void(n.timeout = setTimeout(function() {
            "in" == n.hoverState && n.show()

        },
        n.options.delay.show)) : n.show()

    },
    n.prototype.leave = function(e) {
        var n = e instanceof this.constructor ? e: t(e.currentTarget).data("bs." + this.type);
        return n || (n = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, n)),
        clearTimeout(n.timeout),
        n.hoverState = "out",
        n.options.delay && n.options.delay.hide ? void(n.timeout = setTimeout(function() {
            "out" == n.hoverState && n.hide()

        },
        n.options.delay.hide)) : n.hide()

    },
    n.prototype.show = function() {
        var e = t.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e);
            var n = t.contains(document.documentElement, this.$element[0]);
            if (e.isDefaultPrevented() || !n) return;
            var i = this,
            o = this.tip(),
            r = this.getUID(this.type);
            this.setContent(),
            o.attr("id", r),
            this.$element.attr("aria-describedby", r),
            this.options.animation && o.addClass("fade");
            var s = "function" == typeof this.options.placement ? this.options.placement.call(this, o[0], this.$element[0]) : this.options.placement,
            a = /\s?auto?\s?/i,
            l = a.test(s);
            l && (s = s.replace(a, "") || "top"),
            o.detach().css({
                top: 0,
                left: 0,
                display: "block"

            }).addClass(s).data("bs." + this.type, this),
            this.options.container ? o.appendTo(this.options.container) : o.insertAfter(this.$element);
            var c = this.getPosition(),
            u = o[0].offsetWidth,
            p = o[0].offsetHeight;
            if (l) {
                var h = s,
                f = this.$element.parent(),
                d = this.getPosition(f);
                s = "bottom" == s && c.top + c.height + p - d.scroll > d.height ? "top": "top" == s && c.top - d.scroll - p < 0 ? "bottom": "right" == s && c.right + u > d.width ? "left": "left" == s && c.left - u < d.left ? "right": s,
                o.removeClass(h).addClass(s)

            }
            var g = this.getCalculatedOffset(s, c, u, p);
            this.applyPlacement(g, s);
            var m = function() {
                i.$element.trigger("shown.bs." + i.type),
                i.hoverState = null

            };
            t.support.transition && this.$tip.hasClass("fade") ? o.one("bsTransitionEnd", m).emulateTransitionEnd(150) : m()

        }

    },
    n.prototype.applyPlacement = function(e, n) {
        var i = this.tip(),
        o = i[0].offsetWidth,
        r = i[0].offsetHeight,
        s = parseInt(i.css("margin-top"), 10),
        a = parseInt(i.css("margin-left"), 10);
        isNaN(s) && (s = 0),
        isNaN(a) && (a = 0),
        e.top = e.top + s,
        e.left = e.left + a,
        t.offset.setOffset(i[0], t.extend({
            using: function(t) {
                i.css({
                    top: Math.round(t.top),
                    left: Math.round(t.left)

                })

            }

        },
        e), 0),
        i.addClass("in");
        var l = i[0].offsetWidth,
        c = i[0].offsetHeight;
        "top" == n && c != r && (e.top = e.top + r - c);
        var u = this.getViewportAdjustedDelta(n, e, l, c);
        u.left ? e.left += u.left: e.top += u.top;
        var p = u.left ? 2 * u.left - o + l: 2 * u.top - r + c,
        h = u.left ? "left": "top",
        f = u.left ? "offsetWidth": "offsetHeight";
        i.offset(e),
        this.replaceArrow(p, i[0][f], h)

    },
    n.prototype.replaceArrow = function(t, e, n) {
        this.arrow().css(n, t ? 50 * (1 - t / e) + "%": "")

    },
    n.prototype.setContent = function() {
        var t = this.tip(),
        e = this.getTitle();
        t.find(".tooltip-inner")[this.options.html ? "html": "text"](e),
        t.removeClass("fade in top bottom left right")

    },
    n.prototype.hide = function() {
        function e() {
            "in" != n.hoverState && i.detach(),
            n.$element.trigger("hidden.bs." + n.type)

        }
        var n = this,
        i = this.tip(),
        o = t.Event("hide.bs." + this.type);
        return this.$element.removeAttr("aria-describedby"),
        this.$element.trigger(o),
        o.isDefaultPrevented() ? void 0: (i.removeClass("in"), t.support.transition && this.$tip.hasClass("fade") ? i.one("bsTransitionEnd", e).emulateTransitionEnd(150) : e(), this.hoverState = null, this)

    },
    n.prototype.fixTitle = function() {
        var t = this.$element; (t.attr("title") || "string" != typeof t.attr("data-original-title")) && t.attr("data-original-title", t.attr("title") || "").attr("title", "")

    },
    n.prototype.hasContent = function() {
        return this.getTitle()

    },
    n.prototype.getPosition = function(e) {
        e = e || this.$element;
        var n = e[0],
        i = "BODY" == n.tagName;
        return t.extend({},
        "function" == typeof n.getBoundingClientRect ? n.getBoundingClientRect() : null, {
            scroll: i ? document.documentElement.scrollTop || document.body.scrollTop: e.scrollTop(),
            width: i ? t(window).width() : e.outerWidth(),
            height: i ? t(window).height() : e.outerHeight()

        },
        i ? {
            top: 0,
            left: 0

        }: e.offset())

    },
    n.prototype.getCalculatedOffset = function(t, e, n, i) {
        return "bottom" == t ? {
            top: e.top + e.height,
            left: e.left + e.width / 2 - n / 2

        }: "top" == t ? {
            top: e.top - i,
            left: e.left + e.width / 2 - n / 2

        }: "left" == t ? {
            top: e.top + e.height / 2 - i / 2,
            left: e.left - n

        }: {
            top: e.top + e.height / 2 - i / 2,
            left: e.left + e.width

        }

    },
    n.prototype.getViewportAdjustedDelta = function(t, e, n, i) {
        var o = {
            top: 0,
            left: 0

        };
        if (!this.$viewport) return o;
        var r = this.options.viewport && this.options.viewport.padding || 0,
        s = this.getPosition(this.$viewport);
        if (/right|left/.test(t)) {
            var a = e.top - r - s.scroll,
            l = e.top + r - s.scroll + i;
            a < s.top ? o.top = s.top - a: l > s.top + s.height && (o.top = s.top + s.height - l)

        } else {
            var c = e.left - r,
            u = e.left + r + n;
            c < s.left ? o.left = s.left - c: u > s.width && (o.left = s.left + s.width - u)

        }
        return o

    },
    n.prototype.getTitle = function() {
        var t,
        e = this.$element,
        n = this.options;
        return t = e.attr("data-original-title") || ("function" == typeof n.title ? n.title.call(e[0]) : n.title)

    },
    n.prototype.getUID = function(t) {
        do t += ~~ (1e6 * Math.random());
        while (document.getElementById(t));
        return t

    },
    n.prototype.tip = function() {
        return this.$tip = this.$tip || t(this.options.template)

    },
    n.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")

    },
    n.prototype.validate = function() {
        this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null)

    },
    n.prototype.enable = function() {
        this.enabled = !0

    },
    n.prototype.disable = function() {
        this.enabled = !1

    },
    n.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled

    },
    n.prototype.toggle = function(e) {
        var n = this;
        e && (n = t(e.currentTarget).data("bs." + this.type), n || (n = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, n))),
        n.tip().hasClass("in") ? n.leave(n) : n.enter(n)

    },
    n.prototype.destroy = function() {
        clearTimeout(this.timeout),
        this.hide().$element.off("." + this.type).removeData("bs." + this.type)

    };
    var i = t.fn.tooltip;
    t.fn.tooltip = e,
    t.fn.tooltip.Constructor = n,
    t.fn.tooltip.noConflict = function() {
        return t.fn.tooltip = i,
        this

    }

})(jQuery);
(function(t) {
    "use strict";
    function e(e) {
        return this.each(function() {
            var i = t(this),
            o = i.data("bs.popover"),
            r = "object" == typeof e && e; (o || "destroy" != e) && (o || i.data("bs.popover", o = new n(this, r)), "string" == typeof e && o[e]())

        })

    }
    var n = function(t, e) {
        this.init("popover", t, e)

    };
    if (!t.fn.tooltip) throw new Error("Popover requires tooltip.js");
    n.VERSION = "3.2.0",
    n.DEFAULTS = t.extend({},
    t.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'

    }),
    n.prototype = t.extend({},
    t.fn.tooltip.Constructor.prototype),
    n.prototype.constructor = n,
    n.prototype.getDefaults = function() {
        return n.DEFAULTS

    },
    n.prototype.setContent = function() {
        var t = this.tip(),
        e = this.getTitle(),
        n = this.getContent();
        t.find(".popover-title")[this.options.html ? "html": "text"](e),
        t.find(".popover-content").empty()[this.options.html ? "string" == typeof n ? "html": "append": "text"](n),
        t.removeClass("fade top bottom left right in"),
        t.find(".popover-title").html() || t.find(".popover-title").hide()

    },
    n.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()

    },
    n.prototype.getContent = function() {
        var t = this.$element,
        e = this.options;
        return t.attr("data-content") || ("function" == typeof e.content ? e.content.call(t[0]) : e.content)

    },
    n.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")

    },
    n.prototype.tip = function() {
        return this.$tip || (this.$tip = t(this.options.template)),
        this.$tip

    };
    var i = t.fn.popover;
    t.fn.popover = e,
    t.fn.popover.Constructor = n,
    t.fn.popover.noConflict = function() {
        return t.fn.popover = i,
        this

    }

})(jQuery);
(function(t) {
    "use strict";
    function e(n, i) {
        var o = t.proxy(this.process, this);
        this.$body = t("body"),
        this.$scrollElement = t(t(n).is("body") ? window: n),
        this.options = t.extend({},
        e.DEFAULTS, i),
        this.selector = (this.options.target || "") + " .nav li > a",
        this.offsets = [],
        this.targets = [],
        this.activeTarget = null,
        this.scrollHeight = 0,
        this.$scrollElement.on("scroll.bs.scrollspy", o),
        this.refresh(),
        this.process()

    }
    function n(n) {
        return this.each(function() {
            var i = t(this),
            o = i.data("bs.scrollspy"),
            r = "object" == typeof n && n;
            o || i.data("bs.scrollspy", o = new e(this, r)),
            "string" == typeof n && o[n]()

        })

    }
    e.VERSION = "3.2.0",
    e.DEFAULTS = {
        offset: 10

    },
    e.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)

    },
    e.prototype.refresh = function() {
        var e = "offset",
        n = 0;
        t.isWindow(this.$scrollElement[0]) || (e = "position", n = this.$scrollElement.scrollTop()),
        this.offsets = [],
        this.targets = [],
        this.scrollHeight = this.getScrollHeight();
        var i = this;
        this.$body.find(this.selector).map(function() {
            var i = t(this),
            o = i.data("target") || i.attr("href"),
            r = /^#./.test(o) && t(o);
            return r && r.length && r.is(":visible") && [[r[e]().top + n, o]] || null

        }).sort(function(t, e) {
            return t[0] - e[0]

        }).each(function() {
            i.offsets.push(this[0]),
            i.targets.push(this[1])

        })

    },
    e.prototype.process = function() {
        var t,
        e = this.$scrollElement.scrollTop() + this.options.offset,
        n = this.getScrollHeight(),
        i = this.options.offset + n - this.$scrollElement.height(),
        o = this.offsets,
        r = this.targets,
        s = this.activeTarget;
        if (this.scrollHeight != n && this.refresh(), e >= i) return s != (t = r[r.length - 1]) && this.activate(t);
        if (s && e <= o[0]) return s != (t = r[0]) && this.activate(t);
        for (t = o.length; t--;) s != r[t] && e >= o[t] && (!o[t + 1] || e <= o[t + 1]) && this.activate(r[t])

    },
    e.prototype.activate = function(e) {
        this.activeTarget = e,
        t(this.selector).parentsUntil(this.options.target, ".active").removeClass("active");
        var n = this.selector + '[data-target="' + e + '"],' + this.selector + '[href="' + e + '"]',
        i = t(n).parents("li").addClass("active");
        i.parent(".dropdown-menu").length && (i = i.closest("li.dropdown").addClass("active")),
        i.trigger("activate.bs.scrollspy")

    };
    var i = t.fn.scrollspy;
    t.fn.scrollspy = n,
    t.fn.scrollspy.Constructor = e,
    t.fn.scrollspy.noConflict = function() {
        return t.fn.scrollspy = i,
        this

    },
    t(window).on("load.bs.scrollspy.data-api", 
    function() {
        t('[data-spy="scroll"]').each(function() {
            var e = t(this);
            n.call(e, e.data())

        })

    })

})(jQuery);
(function(t) {
    "use strict";
    function e(e) {
        return this.each(function() {
            var i = t(this),
            o = i.data("bs.tab");
            o || i.data("bs.tab", o = new n(this)),
            "string" == typeof e && o[e]()

        })

    }
    var n = function(e) {
        this.element = t(e)

    };
    n.VERSION = "3.2.0",
    n.prototype.show = function() {
        var e = this.element,
        n = e.closest("ul:not(.dropdown-menu)"),
        i = e.data("target");
        if (i || (i = e.attr("href"), i = i && i.replace(/.*(?=#[^\s]*$)/, "")), !e.parent("li").hasClass("active")) {
            var o = n.find(".active:last a")[0],
            r = t.Event("show.bs.tab", {
                relatedTarget: o

            });
            if (e.trigger(r), !r.isDefaultPrevented()) {
                var s = t(i);
                this.activate(e.closest("li"), n),
                this.activate(s, s.parent(), 
                function() {
                    e.trigger({
                        type: "shown.bs.tab",
                        relatedTarget: o

                    })

                })

            }

        }

    },
    n.prototype.activate = function(e, n, i) {
        function o() {
            r.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),
            e.addClass("active"),
            s ? (e[0].offsetWidth, e.addClass("in")) : e.removeClass("fade"),
            e.parent(".dropdown-menu") && e.closest("li.dropdown").addClass("active"),
            i && i()

        }
        var r = n.find("> .active"),
        s = i && t.support.transition && r.hasClass("fade");
        s ? r.one("bsTransitionEnd", o).emulateTransitionEnd(150) : o(),
        r.removeClass("in")

    };
    var i = t.fn.tab;
    t.fn.tab = e,
    t.fn.tab.Constructor = n,
    t.fn.tab.noConflict = function() {
        return t.fn.tab = i,
        this

    },
    t(document).on("click.bs.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', 
    function(n) {
        n.preventDefault(),
        e.call(t(this), "show")

    })

})(jQuery);
(function(t) {
    "use strict";
    function e(e) {
        return this.each(function() {
            var i = t(this),
            o = i.data("bs.affix"),
            r = "object" == typeof e && e;
            o || i.data("bs.affix", o = new n(this, r)),
            "string" == typeof e && o[e]()

        })

    }
    var n = function(e, i) {
        this.options = t.extend({},
        n.DEFAULTS, i),
        this.$target = t(this.options.target).on("scroll.bs.affix.data-api", t.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", t.proxy(this.checkPositionWithEventLoop, this)),
        this.$element = t(e),
        this.affixed = this.unpin = this.pinnedOffset = null,
        this.checkPosition()

    };
    n.VERSION = "3.2.0",
    n.RESET = "affix affix-top affix-bottom",
    n.DEFAULTS = {
        offset: 0,
        target: window

    },
    n.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(n.RESET).addClass("affix");
        var t = this.$target.scrollTop(),
        e = this.$element.offset();
        return this.pinnedOffset = e.top - t

    },
    n.prototype.checkPositionWithEventLoop = function() {
        setTimeout(t.proxy(this.checkPosition, this), 1)

    },
    n.prototype.checkPosition = function() {
        if (this.$element.is(":visible")) {
            var e = t(document).height(),
            i = this.$target.scrollTop(),
            o = this.$element.offset(),
            r = this.options.offset,
            s = r.top,
            a = r.bottom;
            "object" != typeof r && (a = s = r),
            "function" == typeof s && (s = r.top(this.$element)),
            "function" == typeof a && (a = r.bottom(this.$element));
            var l = null != this.unpin && i + this.unpin <= o.top ? !1: null != a && o.top + this.$element.height() >= e - a ? "bottom": null != s && s >= i ? "top": !1;
            if (this.affixed !== l) {
                null != this.unpin && this.$element.css("top", "");
                var c = "affix" + (l ? "-" + l: ""),
                u = t.Event(c + ".bs.affix");
                this.$element.trigger(u),
                u.isDefaultPrevented() || (this.affixed = l, this.unpin = "bottom" == l ? this.getPinnedOffset() : null, this.$element.removeClass(n.RESET).addClass(c).trigger(t.Event(c.replace("affix", "affixed"))), "bottom" == l && this.$element.offset({
                    top: e - this.$element.height() - a

                }))

            }

        }

    };
    var i = t.fn.affix;
    t.fn.affix = e,
    t.fn.affix.Constructor = n,
    t.fn.affix.noConflict = function() {
        return t.fn.affix = i,
        this

    },
    t(window).on("load", 
    function() {
        t('[data-spy="affix"]').each(function() {
            var n = t(this),
            i = n.data();
            i.offset = i.offset || {},
            i.offsetBottom && (i.offset.bottom = i.offsetBottom),
            i.offsetTop && (i.offset.top = i.offsetTop),
            e.call(n, i)

        })

    })

})(jQuery);
(function(t) {
    "use strict";
    function e(t) {
        return t instanceof Number || "number" == typeof t

    }
    t.fn.borderLayout = function() {
        var n = function(n, i) {
            n.style.position = "absolute",
            n.style.boxSizing = "border-box";
            for (var o in i) {
                var r = i[o];
                e(r) && (r = parseInt(r) + "px"),
                n.style[o] = r

            }
            t(n).trigger("size.change")

        },
        i = function(t, e) {
            return "%" === t[t.length - 1] ? e * parseInt(t) / 100: parseInt(t)

        },
        o = function(t, e, n, o) {
            var r = i(t, e);
            return n && (n = i(n, e), n > r) ? n: o && (o = i(o, e), r > o) ? o: r

        };
        return this.each(function() {
            function e() {
                c && (b = c._data.width, b && (b = o(b, p, c._data["min-width"], c._data["max-width"]), k = b, x = parseInt(c._data.left) || 0, x && (w -= x, k += x), w -= b, n(c, {
                    top: T,
                    left: x,
                    width: b,
                    height: C

                }))),
                l && (b = l._data.width, b && (b = o(b, p, l._data["min-width"], l._data["max-width"]), x = parseInt(l._data.right) || 0, x && (w -= x), w -= b, n(l, {
                    top: T,
                    right: x,
                    width: b,
                    height: C

                })))

            }
            function i() {
                s && (b = s._data.height, b && (b = o(b, h, s._data["min-height"], s._data["max-height"]), C -= b, T = b, n(s, {
                    top: 0,
                    left: k,
                    width: w,
                    height: b

                }))),
                a && (b = a._data.height, b && (b = o(b, h, a._data["min-height"], a._data["max-height"]), C -= b, n(a, {
                    bottom: 0,
                    left: k,
                    height: b,
                    width: w

                })))

            }
            this.style.boxSizing = "border-box",
            this.style.overflow = "hidden",
            (this == document.body || t(this).hasClass("layout--body")) && n(this, {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0

            });
            for (var r, s, a, l, c, u = t(this).hasClass("layout--h"), p = this.clientWidth, h = this.clientHeight, f = 0, d = this.children; f < d.length;) {
                var g = d[f++],
                m = g.getAttribute("data-options");
                if (m) {
                    m = m.replace(/(['"])?([a-zA-Z0-9\-]+)(['"])?:/g, '"$2":'),
                    m = m.replace(/'/g, '"'),
                    m = "{" + m + "}";
                    try {
                        m = JSON.parse(m)

                    } catch(v) {
                        continue

                    }
                    var y = m.region;
                    y && (g._data = m, /center/i.test(y) ? r = g: /north/i.test(y) ? s = g: /south/i.test(y) ? a = g: /east/i.test(y) ? l = g: /west/i.test(y) && (c = g))

                }

            }
            var b,
            x,
            w = p,
            C = h,
            T = 0,
            k = 0;
            u ? (e(), i()) : (i(), e()),
            r && n(r, {
                top: T,
                left: k,
                width: w,
                height: C

            })

        })

    },
    t(function() {
        t(".layout").borderLayout(),
        t(window).resize(function() {
            t(".layout").borderLayout()

        })

    })

})(jQuery);
(function(t) {
    "use strict";
    var e = function(t) {
        this.value = {
            h: 0,
            s: 0,
            b: 0,
            a: 1

        },
        this.origFormat = null,
        t && (void 0 !== t.toLowerCase ? (t += "", this.setColor(t)) : void 0 !== t.h && (this.value = t))

    };
    e.prototype = {
        constructor: e,
        colors: {
            aliceblue: "#f0f8ff",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            aquamarine: "#7fffd4",
            azure: "#f0ffff",
            beige: "#f5f5dc",
            bisque: "#ffe4c4",
            black: "#000000",
            blanchedalmond: "#ffebcd",
            blue: "#0000ff",
            blueviolet: "#8a2be2",
            brown: "#a52a2a",
            burlywood: "#deb887",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            cornflowerblue: "#6495ed",
            cornsilk: "#fff8dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkgray: "#a9a9a9",
            darkgreen: "#006400",
            darkkhaki: "#bdb76b",
            darkmagenta: "#8b008b",
            darkolivegreen: "#556b2f",
            darkorange: "#ff8c00",
            darkorchid: "#9932cc",
            darkred: "#8b0000",
            darksalmon: "#e9967a",
            darkseagreen: "#8fbc8f",
            darkslateblue: "#483d8b",
            darkslategray: "#2f4f4f",
            darkturquoise: "#00ced1",
            darkviolet: "#9400d3",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            dimgray: "#696969",
            dodgerblue: "#1e90ff",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            forestgreen: "#228b22",
            fuchsia: "#ff00ff",
            gainsboro: "#dcdcdc",
            ghostwhite: "#f8f8ff",
            gold: "#ffd700",
            goldenrod: "#daa520",
            gray: "#808080",
            green: "#008000",
            greenyellow: "#adff2f",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            "indianred ": "#cd5c5c",
            "indigo ": "#4b0082",
            ivory: "#fffff0",
            khaki: "#f0e68c",
            lavender: "#e6e6fa",
            lavenderblush: "#fff0f5",
            lawngreen: "#7cfc00",
            lemonchiffon: "#fffacd",
            lightblue: "#add8e6",
            lightcoral: "#f08080",
            lightcyan: "#e0ffff",
            lightgoldenrodyellow: "#fafad2",
            lightgrey: "#d3d3d3",
            lightgreen: "#90ee90",
            lightpink: "#ffb6c1",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            lightskyblue: "#87cefa",
            lightslategray: "#778899",
            lightsteelblue: "#b0c4de",
            lightyellow: "#ffffe0",
            lime: "#00ff00",
            limegreen: "#32cd32",
            linen: "#faf0e6",
            magenta: "#ff00ff",
            maroon: "#800000",
            mediumaquamarine: "#66cdaa",
            mediumblue: "#0000cd",
            mediumorchid: "#ba55d3",
            mediumpurple: "#9370d8",
            mediumseagreen: "#3cb371",
            mediumslateblue: "#7b68ee",
            mediumspringgreen: "#00fa9a",
            mediumturquoise: "#48d1cc",
            mediumvioletred: "#c71585",
            midnightblue: "#191970",
            mintcream: "#f5fffa",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            navajowhite: "#ffdead",
            navy: "#000080",
            oldlace: "#fdf5e6",
            olive: "#808000",
            olivedrab: "#6b8e23",
            orange: "#ffa500",
            orangered: "#ff4500",
            orchid: "#da70d6",
            palegoldenrod: "#eee8aa",
            palegreen: "#98fb98",
            paleturquoise: "#afeeee",
            palevioletred: "#d87093",
            papayawhip: "#ffefd5",
            peachpuff: "#ffdab9",
            peru: "#cd853f",
            pink: "#ffc0cb",
            plum: "#dda0dd",
            powderblue: "#b0e0e6",
            purple: "#800080",
            red: "#ff0000",
            rosybrown: "#bc8f8f",
            royalblue: "#4169e1",
            saddlebrown: "#8b4513",
            salmon: "#fa8072",
            sandybrown: "#f4a460",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            sienna: "#a0522d",
            silver: "#c0c0c0",
            skyblue: "#87ceeb",
            slateblue: "#6a5acd",
            slategray: "#708090",
            snow: "#fffafa",
            springgreen: "#00ff7f",
            steelblue: "#4682b4",
            tan: "#d2b48c",
            teal: "#008080",
            thistle: "#d8bfd8",
            tomato: "#ff6347",
            turquoise: "#40e0d0",
            violet: "#ee82ee",
            wheat: "#f5deb3",
            white: "#ffffff",
            whitesmoke: "#f5f5f5",
            yellow: "#ffff00",
            yellowgreen: "#9acd32",
            transparent: "transparent"

        },
        _sanitizeNumber: function(t) {
            return "number" == typeof t ? t: isNaN(t) || null === t || "" === t || void 0 === t ? 1: void 0 !== t.toLowerCase ? parseFloat(t) : 1

        },
        isTransparent: function(t) {
            return t ? (t = t.toLowerCase().trim(), "transparent" == t || t.match(/#?00000000/) || t.match(/(rgba|hsla)\(0,0,0,0?\.?0\)/)) : !1

        },
        rgbaIsTransparent: function(t) {
            return 0 == t.r && 0 == t.g && 0 == t.b && 0 == t.a

        },
        setColor: function(t) {
            t = t.toLowerCase().trim(),
            t && (this.value = this.isTransparent(t) ? {
                h: 0,
                s: 0,
                b: 0,
                a: 0

            }: this.stringToHSB(t) || {
                h: 0,
                s: 0,
                b: 0,
                a: 1

            })

        },
        stringToHSB: function(e) {
            e = e.toLowerCase();
            var n = this,
            i = !1;
            return t.each(this.stringParsers, 
            function(t, o) {
                var r = o.re.exec(e),
                s = r && o.parse.apply(n, [r]),
                a = o.format || "rgba";
                return s ? (i = a.match(/hsla?/) ? n.RGBtoHSB.apply(n, n.HSLtoRGB.apply(n, s)) : n.RGBtoHSB.apply(n, s), n.origFormat = a, !1) : !0

            }),
            i

        },
        setHue: function(t) {
            this.value.h = 1 - t

        },
        setSaturation: function(t) {
            this.value.s = t

        },
        setBrightness: function(t) {
            this.value.b = 1 - t

        },
        setAlpha: function(t) {
            this.value.a = parseInt(100 * (1 - t), 10) / 100

        },
        toRGB: function(t, e, n, i) {
            t || (t = this.value.h, e = this.value.s, n = this.value.b),
            t *= 360;
            var o,
            r,
            s,
            a,
            l;
            return t = t % 360 / 60,
            l = n * e,
            a = l * (1 - Math.abs(t % 2 - 1)),
            o = r = s = n - l,
            t = ~~t,
            o += [l, a, 0, 0, a, l][t],
            r += [a, l, l, a, 0, 0][t],
            s += [0, 0, a, l, l, a][t],
            {
                r: Math.round(255 * o),
                g: Math.round(255 * r),
                b: Math.round(255 * s),
                a: i || this.value.a

            }

        },
        toHex: function(t, e, n, i) {
            var o = this.toRGB(t, e, n, i);
            return this.rgbaIsTransparent(o) ? "transparent": "#" + (1 << 24 | parseInt(o.r) << 16 | parseInt(o.g) << 8 | parseInt(o.b)).toString(16).substr(1)

        },
        toHSL: function(t, e, n, i) {
            t = t || this.value.h,
            e = e || this.value.s,
            n = n || this.value.b,
            i = i || this.value.a;
            var o = t,
            r = (2 - e) * n,
            s = e * n;
            return s /= r > 0 && 1 >= r ? r: 2 - r,
            r /= 2,
            s > 1 && (s = 1),
            {
                h: isNaN(o) ? 0: o,
                s: isNaN(s) ? 0: s,
                l: isNaN(r) ? 0: r,
                a: isNaN(i) ? 0: i

            }

        },
        toAlias: function(t, e, n, i) {
            var o = this.toHex(t, e, n, i);
            for (var r in this.colors) if (this.colors[r] == o) return r;
            return ! 1

        },
        RGBtoHSB: function(t, e, n, i) {
            t /= 255,
            e /= 255,
            n /= 255;
            var o,
            r,
            s,
            a;
            return s = Math.max(t, e, n),
            a = s - Math.min(t, e, n),
            o = 0 === a ? null: s === t ? (e - n) / a: s === e ? (n - t) / a + 2: (t - e) / a + 4,
            o = (o + 360) % 6 * 60 / 360,
            r = 0 === a ? 0: a / s,
            {
                h: this._sanitizeNumber(o),
                s: r,
                b: s,
                a: this._sanitizeNumber(i)

            }

        },
        HueToRGB: function(t, e, n) {
            return 0 > n ? n += 1: n > 1 && (n -= 1),
            1 > 6 * n ? t + (e - t) * n * 6: 1 > 2 * n ? e: 2 > 3 * n ? t + (e - t) * (2 / 3 - n) * 6: t

        },
        HSLtoRGB: function(t, e, n, i) {
            0 > e && (e = 0);
            var o;
            o = .5 >= n ? n * (1 + e) : n + e - n * e;
            var r = 2 * n - o,
            s = t + 1 / 3,
            a = t,
            l = t - 1 / 3,
            c = Math.round(255 * this.HueToRGB(r, o, s)),
            u = Math.round(255 * this.HueToRGB(r, o, a)),
            p = Math.round(255 * this.HueToRGB(r, o, l));
            return [c, u, p, this._sanitizeNumber(i)]

        },
        toString: function(t) {
            switch (t = t || "rgba") {
                case "rgb":
                var e = this.toRGB();
                return this.rgbaIsTransparent(e) ? "transparent": "rgb(" + e.r + "," + e.g + "," + e.b + ")";
                case "rgba":
                var e = this.toRGB();
                return "rgba(" + e.r + "," + e.g + "," + e.b + "," + e.a + ")";
                case "hsl":
                var n = this.toHSL();
                return "hsl(" + Math.round(360 * n.h) + "," + Math.round(100 * n.s) + "%," + Math.round(100 * n.l) + "%)";
                case "hsla":
                var n = this.toHSL();
                return "hsla(" + Math.round(360 * n.h) + "," + Math.round(100 * n.s) + "%," + Math.round(100 * n.l) + "%," + n.a + ")";
                case "hex":
                return this.toHex();
                case "alias":
                return this.toAlias() || this.toHex();
                default:
                return ! 1

            }

        },
        stringParsers: [{
            re: /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*?\)/,
            format: "rgb",
            parse: function(t) {
                return [t[1], t[2], t[3], 1]

            }

        },
        {
            re: /rgb\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*?\)/,
            format: "rgb",
            parse: function(t) {
                return [2.55 * t[1], 2.55 * t[2], 2.55 * t[3], 1]

            }

        },
        {
            re: /rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
            format: "rgba",
            parse: function(t) {
                return [t[1], t[2], t[3], t[4]]

            }

        },
        {
            re: /rgba\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
            format: "rgba",
            parse: function(t) {
                return [2.55 * t[1], 2.55 * t[2], 2.55 * t[3], t[4]]

            }

        },
        {
            re: /hsl\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*?\)/,
            format: "hsl",
            parse: function(t) {
                return [t[1] / 360, t[2] / 100, t[3] / 100, t[4]]

            }

        },
        {
            re: /hsla\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
            format: "hsla",
            parse: function(t) {
                return [t[1] / 360, t[2] / 100, t[3] / 100, t[4]]

            }

        },
        {
            re: /#?([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
            format: "hex",
            parse: function(t) {
                return [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16), 1]

            }

        },
        {
            re: /#?([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
            format: "hex",
            parse: function(t) {
                return [parseInt(t[1] + t[1], 16), parseInt(t[2] + t[2], 16), parseInt(t[3] + t[3], 16), 1]

            }

        },
        {
            re: /^([a-z]{3,})$/,
            format: "alias",
            parse: function(t) {
                var e = this.colorNameToHex(t[0]) || "#000000",
                n = this.stringParsers[6].re.exec(e),
                i = n && this.stringParsers[6].parse.apply(this, [n]);
                return i

            }

        }],
        colorNameToHex: function(t) {
            return "undefined" != typeof this.colors[t.toLowerCase()] ? this.colors[t.toLowerCase()] : !1

        }

    };
    var n = {
        horizontal: !1,
        inline: !1,
        color: !1,
        format: !1,
        input: "input",
        container: !1,
        component: ".add-on, .input-group-addon",
        sliders: {
            saturation: {
                maxLeft: 100,
                maxTop: 100,
                callLeft: "setSaturation",
                callTop: "setBrightness"

            },
            hue: {
                maxLeft: 0,
                maxTop: 100,
                callLeft: !1,
                callTop: "setHue"

            },
            alpha: {
                maxLeft: 0,
                maxTop: 100,
                callLeft: !1,
                callTop: "setAlpha"

            }

        },
        slidersHorz: {
            saturation: {
                maxLeft: 100,
                maxTop: 100,
                callLeft: "setSaturation",
                callTop: "setBrightness"

            },
            hue: {
                maxLeft: 100,
                maxTop: 0,
                callLeft: "setHue",
                callTop: !1

            },
            alpha: {
                maxLeft: 100,
                maxTop: 0,
                callLeft: "setAlpha",
                callTop: !1

            }

        },
        template: '<div class="colorpicker dropdown-menu"><div class="colorpicker-saturation"><i><b></b></i></div><div class="colorpicker-hue"><i></i></div><div class="colorpicker-alpha"><i></i></div><div class="colorpicker-color"><div /></div></div>'

    },
    i = function(i, o) {
        this.element = t(i).addClass("colorpicker-element"),
        this.options = t.extend({},
        n, this.element.data(), o),
        this.component = this.options.component,
        this.component = this.component !== !1 ? this.element.find(this.component) : !1,
        this.component && 0 === this.component.length && (this.component = !1),
        this.container = this.options.container === !0 ? this.element: this.options.container,
        this.container = this.container !== !1 ? t(this.container) : !1,
        this.input = this.element.is("input") ? this.element: this.options.input ? this.element.find(this.options.input) : !1,
        this.input && 0 === this.input.length && (this.input = !1),
        this.color = new e(this.options.color !== !1 ? this.options.color: this.getValue()),
        this.format = this.options.format !== !1 ? this.options.format: this.color.origFormat,
        this.picker = t(this.options.template),
        this.picker.addClass(this.options.inline ? "colorpicker-inline colorpicker-visible": "colorpicker-hidden"),
        this.options.horizontal && this.picker.addClass("colorpicker-horizontal"),
        ("rgba" === this.format || "hsla" === this.format) && this.picker.addClass("colorpicker-with-alpha"),
        "right" === this.options.align && this.picker.addClass("colorpicker-right"),
        this.picker.on("mousedown.colorpicker touchstart.colorpicker", t.proxy(this.mousedown, this)),
        this.picker.appendTo(this.container ? this.container: t("body")),
        this.input !== !1 && (this.input.on({
            "keyup.colorpicker": t.proxy(this.keyup, this)

        }), this.component === !1 && this.element.on({
            "focus.colorpicker": t.proxy(this.show, this)

        }), this.options.inline === !1 && this.element.on({
            "focusout.colorpicker": t.proxy(this.hide, this)

        })),
        this.component !== !1 && this.component.on({
            "click.colorpicker": t.proxy(this.show, this)

        }),
        this.input === !1 && this.component === !1 && this.element.on({
            "click.colorpicker": t.proxy(this.show, this)

        }),
        this.input !== !1 && this.component !== !1 && "color" === this.input.attr("type") && this.input.on({
            "click.colorpicker": t.proxy(this.show, this),
            "focus.colorpicker": t.proxy(this.show, this)

        }),
        this.update(),
        t(t.proxy(function() {
            this.element.trigger("create")

        },
        this))

    };
    i.Color = e,
    i.prototype = {
        constructor: i,
        destroy: function() {
            this.picker.remove(),
            this.element.removeData("colorpicker").off(".colorpicker"),
            this.input !== !1 && this.input.off(".colorpicker"),
            this.component !== !1 && this.component.off(".colorpicker"),
            this.element.removeClass("colorpicker-element"),
            this.element.trigger({
                type: "destroy"

            })


        },
        reposition: function() {
            if (this.options.inline !== !1 || this.options.container) return ! 1;
            var t = this.container && this.container[0] !== document.body ? "position": "offset",
            e = this.component || this.element,
            n = e[t]();
            "right" === this.options.align && (n.left -= this.picker.outerWidth() - e.outerWidth()),
            this.picker.css({
                top: n.top + e.outerHeight(),
                left: n.left

            })

        },
        show: function(e) {
            return this.isDisabled() ? !1: (this.picker.addClass("colorpicker-visible").removeClass("colorpicker-hidden"), this.reposition(), t(window).on("resize.colorpicker", t.proxy(this.reposition, this)), !e || this.hasInput() && "color" !== this.input.attr("type") || e.stopPropagation && e.preventDefault && (e.stopPropagation(), e.preventDefault()), this.options.inline === !1 && t(window.document).on({
                "mousedown.colorpicker": t.proxy(this.hide, this)

            }), void this.element.trigger({
                type: "showPicker",
                color: this.color

            }))

        },
        hide: function() {
            this.picker.addClass("colorpicker-hidden").removeClass("colorpicker-visible"),
            t(window).off("resize.colorpicker", this.reposition),
            t(document).off({
                "mousedown.colorpicker": this.hide

            }),
            this.update(),
            this.element.trigger({
                type: "hidePicker",
                color: this.color

            })

        },
        updateData: function(t) {
            return t = t || this.color.toString(this.format),
            this.element.data("color", t),
            t

        },
        updateInput: function(t) {
            return t = t || this.color.toString(this.format),
            this.input !== !1 && this.input.prop("value", t),
            t

        },
        updatePicker: function(t) {
            void 0 !== t && (this.color = new e(t));
            var n = this.options.horizontal === !1 ? this.options.sliders: this.options.slidersHorz,
            i = this.picker.find("i");
            return 0 !== i.length ? (this.options.horizontal === !1 ? (n = this.options.sliders, i.eq(1).css("top", n.hue.maxTop * (1 - this.color.value.h)).end().eq(2).css("top", n.alpha.maxTop * (1 - this.color.value.a))) : (n = this.options.slidersHorz, i.eq(1).css("left", n.hue.maxLeft * (1 - this.color.value.h)).end().eq(2).css("left", n.alpha.maxLeft * (1 - this.color.value.a))), i.eq(0).css({
                top: n.saturation.maxTop - this.color.value.b * n.saturation.maxTop,
                left: this.color.value.s * n.saturation.maxLeft

            }), this.picker.find(".colorpicker-saturation").css("backgroundColor", this.color.toHex(this.color.value.h, 1, 1, 1)), this.picker.find(".colorpicker-alpha").css("backgroundColor", this.color.toHex()), this.picker.find(".colorpicker-color, .colorpicker-color div").css("backgroundColor", this.color.toString(this.format)), t) : void 0

        },
        updateComponent: function(t) {
            if (t = t || this.color.toString(this.format), this.component !== !1) {
                var e = this.component.find("i").eq(0);
                e.length > 0 ? e.css({
                    backgroundColor: t

                }) : this.component.css({
                    backgroundColor: t

                })

            }
            return t

        },
        update: function(t) {
            var e;
            return (this.getValue(!1) !== !1 || t === !0) && (e = this.updateComponent(), this.updateInput(e), this.updateData(e), this.updatePicker()),
            e

        },
        setValue: function(t) {
            this.color = new e(t),
            this.update(),
            this.element.trigger({
                type: "changeColor",
                color: this.color,
                value: t

            })

        },
        getValue: function(t) {
            t = void 0 === t ? "#000000": t;
            var e;
            return e = this.hasInput() ? this.input.val() : this.element.data("color"),
            (void 0 === e || "" === e || null === e) && (e = t),
            e

        },
        hasInput: function() {
            return this.input !== !1

        },
        isDisabled: function() {
            return this.hasInput() ? this.input.prop("disabled") === !0: !1

        },
        disable: function() {
            return this.hasInput() ? (this.input.prop("disabled", !0), this.element.trigger({
                type: "disable",
                color: this.color,
                value: this.getValue()

            }), !0) : !1

        },
        enable: function() {
            return this.hasInput() ? (this.input.prop("disabled", !1), this.element.trigger({
                type: "enable",
                color: this.color,
                value: this.getValue()

            }), !0) : !1

        },
        currentSlider: null,
        mousePointer: {
            left: 0,
            top: 0

        },
        mousedown: function(e) {
            e.pageX || e.pageY || !e.originalEvent || (e.pageX = e.originalEvent.touches[0].pageX, e.pageY = e.originalEvent.touches[0].pageY),
            e.stopPropagation(),
            e.preventDefault();
            var n = t(e.target),
            i = n.closest("div"),
            o = this.options.horizontal ? this.options.slidersHorz: this.options.sliders;
            if (!i.is(".colorpicker")) {
                if (i.is(".colorpicker-saturation")) this.currentSlider = t.extend({},
                o.saturation);
                else if (i.is(".colorpicker-hue")) this.currentSlider = t.extend({},
                o.hue);
                else {
                    if (!i.is(".colorpicker-alpha")) return ! 1;
                    this.currentSlider = t.extend({},
                    o.alpha)

                }
                var r = i.offset();
                this.currentSlider.guide = i.find("i")[0].style,
                this.currentSlider.left = e.pageX - r.left,
                this.currentSlider.top = e.pageY - r.top,
                this.mousePointer = {
                    left: e.pageX,
                    top: e.pageY

                },
                t(document).on({
                    "mousemove.colorpicker": t.proxy(this.mousemove, this),
                    "touchmove.colorpicker": t.proxy(this.mousemove, this),
                    "mouseup.colorpicker": t.proxy(this.mouseup, this),
                    "touchend.colorpicker": t.proxy(this.mouseup, this)

                }).trigger("mousemove")

            }
            return ! 1

        },
        mousemove: function(t) {
            t.pageX || t.pageY || !t.originalEvent || (t.pageX = t.originalEvent.touches[0].pageX, t.pageY = t.originalEvent.touches[0].pageY),
            t.stopPropagation(),
            t.preventDefault();
            var e = Math.max(0, Math.min(this.currentSlider.maxLeft, this.currentSlider.left + ((t.pageX || this.mousePointer.left) - this.mousePointer.left))),
            n = Math.max(0, Math.min(this.currentSlider.maxTop, this.currentSlider.top + ((t.pageY || this.mousePointer.top) - this.mousePointer.top)));
            return this.currentSlider.guide.left = e + "px",
            this.currentSlider.guide.top = n + "px",
            this.currentSlider.callLeft && this.color[this.currentSlider.callLeft].call(this.color, e / this.currentSlider.maxLeft),
            this.currentSlider.callTop && this.color[this.currentSlider.callTop].call(this.color, n / this.currentSlider.maxTop),
            this.update(!0),
            this.element.trigger({
                type: "changeColor",
                color: this.color

            }),
            !1

        },
        mouseup: function(e) {
            return e.stopPropagation(),
            e.preventDefault(),
            t(document).off({
                "mousemove.colorpicker": this.mousemove,
                "touchmove.colorpicker": this.mousemove,
                "mouseup.colorpicker": this.mouseup,
                "touchend.colorpicker": this.mouseup

            }),
            !1

        },
        keyup: function(t) {
            if (38 === t.keyCode) this.color.value.a < 1 && (this.color.value.a = Math.round(100 * (this.color.value.a + .01)) / 100),
            this.update(!0);
            else if (40 === t.keyCode) this.color.value.a > 0 && (this.color.value.a = Math.round(100 * (this.color.value.a - .01)) / 100),
            this.update(!0);
            else {
                var n = this.input.val();
                this.color = new e(n),
                this.getValue(!1) !== !1 && (this.updateData(), this.updateComponent(), this.updatePicker())

            }
            this.element.trigger({
                type: "changeColor",
                color: this.color,
                value: n

            })

        }

    },
    t.colorpicker = i,
    t.fn.colorpicker = function(e) {
        var n,
        o = arguments,
        r = this.each(function() {
            var r = t(this),
            s = r.data("colorpicker"),
            a = "object" == typeof e ? e: {};
            s || "string" == typeof e ? "string" == typeof e && (n = s[e].apply(s, Array.prototype.slice.call(o, 1))) : r.data("colorpicker", new i(this, a))

        });
        return "getValue" === e ? n: r

    },
    t.fn.colorpicker.constructor = i

})(jQuery);
$(function() {
    $(".color-picker").colorpicker()
});