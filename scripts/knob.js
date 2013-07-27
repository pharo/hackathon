define(["lib/jquery", "lib/underscore"], function($, _) {
    var Knob = function(echonest, dom_element, attr) {
        this.scale = 20;

        this.music_value = null;

        this.include = false;
        this.echonest = echonest;
        this.dom_element = dom_element;
        this.music_attr = attr;
        this.init();
    };

    Knob.prototype = {
        init: function() {
            this.knob_value = this.dom_element.find("#" + this.music_attr);
            this.knob_include = this.dom_element.find("#" + this.music_attr + "-include");
            this.knob_down = this.dom_element.find("#" + this.music_attr + "-down");
            this.knob_up = this.dom_element.find("#" + this.music_attr + "-up");
            this.knob_track = this.dom_element.find(".track");

            var _this = this;
            this.knob_value.val("");
            this.music_value = parseInt(this.knob_value.val(), 10);
            this.knob_value.on("change", function() {
                if ($(this).val() != "") {
                    _this.music_value = parseInt($(this).val(), 10);
                } else {
                    _this.music_value = null;
                }
                _this.update(true);
            });
            this.knob_include.on("click", function() {
                _this.include = !_this.include;
                if (_this.include) {
                    $(this).html("O");
                } else  {
                    $(this).html("X");
                }
                _this.update();
            });
            this.knob_down.on("click", function() {
                _this.music_value = _this.music_value - (1000 / _this.scale);
                _this.update();
            });
            this.knob_up.on("click", function() {
                _this.music_value = _this.music_value + (1000 / _this.scale);
                _this.update();
            });
            this.knob_track.on("click", ".track-percent", function() {
                _this.music_value = (1000 * ($(this).parent().find(".track-percent").index(this) / _this.scale));
                _this.update();
            });

        },

        update: function(force) {
            if (this.music_value === null) {
                this.knob_value.val("");
            } else {
                this.knob_value.val(this.music_value || "");
            }

            //set lights
            var light_to = this.music_value / (1000 / this.scale);
            this.knob_track.find(".track-percent").each(function(i) {
                if (i <= light_to) {
                    $(this).addClass("on");
                } else {
                    $(this).removeClass("on");
                }
            });

            if (this.include || force) {
                this.echonest.setSearch(this.music_attr, (this.include) ? this.music_value : null);
                this.echonest.search();
            }
        }
    };

    return Knob;
});