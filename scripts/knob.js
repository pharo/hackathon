define(["lib/jquery", "lib/underscore"], function($, _) {
    var Knob = function(echonest, dom_element, attr) {
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

            var _this = this;
            this.knob_value.val("");
            this.music_value = parseInt(this.knob_value.val(), 10);
            this.knob_value.on("change", function() {
                if ($(this).val() != "") {
                    _this.music_value = parseInt($(this).val(), 10);
                } else {
                    _this.music_value = null;
                }
                if (_this.include) {
                    _this.update();
                }
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
                _this.music_value = _this.music_value - 10;
                if (_this.include) {
                    _this.update();
                }
            });
            this.knob_up.on("click", function() {
                _this.music_value = _this.music_value + 10;
                if (_this.include) {
                    _this.update();
                }
            });

        },

        update: function() {
            if (this.music_value === null) {
                this.knob_value.val("");
            } else {
                this.knob_value.val(this.music_value || "");
            }
            this.echonest.setSearch(this.music_attr, (this.include) ? this.music_value : null);
            this.echonest.search();
        }
    };

    return Knob;
});