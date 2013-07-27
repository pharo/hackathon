define(["lib/jquery", "lib/underscore"], function($, _) {
    var Knob = function(echonest, dom_element, attr) {
        this.scale = 50;
        this.max = 1000;
        this.subtract = 0;

        if (attr == "loudness") {
            this.max = 200;
            this.subtract = 100;
        }

        this.music_value = 0;

        this.include = true;
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

            this.knob_include.on("click", function() {
                _this.include = !_this.include;
                if (_this.include) {
                    $(this).html("O");
                } else  {
                    $(this).html("X");
                }
                _this.update(true);
            });
            this.knob_down.on("click", function() {
                _this.music_value = _this.music_value - (_this.max / _this.scale);
                _this.update();
            });
            this.knob_up.on("click", function() {
                _this.music_value = _this.music_value + (_this.max/ _this.scale);
                _this.update();
            });
            this.knob_track.on("click", ".track-percent", function() {
                _this.music_value = (_this.max * ($(this).parent().find(".track-percent").index(this) / _this.scale));
                _this.update();
            });

        },

        setValue: function(new_value) {
            this.music_value = new_value;
            this.update();
        },

        update: function(force) {
            this.knob_value.val(this.music_value);

            //set lights
            var light_to = this.music_value / (this.max / this.scale);
            this.knob_track.find(".track-percent").each(function(i) {
                if (i <= light_to) {
                    $(this).addClass("on");
                } else {
                    $(this).removeClass("on");
                }
            });

            this.echonest.setSearch(this.music_attr, (this.include) ? this.music_value - this.subtract : null, this.max - this.subtract, 0 - this.subtract);
            if (this.include || force) {
                this.echonest.search();
            }
        }
    };

    return Knob;
});