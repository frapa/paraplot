var event;

function Slider(ele_id, min_val, max_val, step) {
    this.drag = false;
    var _this = this;
    
    // methods
    this.mouse_down = function (event) {
        if (event.button === 0) {
            // disable text select
            event.preventDefault();

            _this.drag = true;
        }
    }

    // called when mouse has been moved
    this.mouse_move = function (event) {
        if (!event) var event = window.event;
        
        if (_this.drag) {
            var new_pos = event.clientX - _this.button.offsetParent.offsetLeft - 8;

            if (new_pos < 0) {
                new_pos = 0;
            } else if (new_pos > _this.width) { 
                new_pos = _this.width;
            }

            _this.button.style.left = new_pos + "px";

            var new_val = (new_pos / _this.pix_step) * _this.step + _this.min;

            if (new_val != _this.value) {
                _this.value = new_val;
                _this.onChange(new_val);
            }
        }
    }

    this.mouse_up = function () {
        _this.drag = false;
    }

    this.setValue = function (new_val) {
        if (new_val < _this.min) {
            new_pos = _this.min;
        } else if (new_pos > _this.max) { 
            new_pos = _this.max;
        }

        var new_pos = (new_val - _this.min) / _this.step * _this.pix_step;

        _this.value = new_val;
        _this.button.style.left = new_pos + "px";

        _this.onChange(new_val);
    }
    
    this.onChange = function (value) {
    }
    
    // initialize class
    this.min = min_val;
    this.max = max_val;
    this.value = min_val;
    this.step = step;
    this.steps = (this.max - this.min) / this.step;
    this.butt_size = 16;
    
    ele = document.getElementById(ele_id);
    ele.className = "slider";
    
    var bar = document.createElement("div");
    bar.className = "slider-bar";
    ele.appendChild(bar);
    
    this.button = document.createElement("div");
    this.button.className = "slider-button";
    ele.appendChild(this.button);

    this.width = ele.clientWidth - this.butt_size;
    this.pix_step = this.width / this.steps;
    
    // add event listeners to element and document
    this.button.addEventListener('mousedown', _this.mouse_down);
    document.addEventListener('mousemove', _this.mouse_move);
    document.addEventListener('mouseup', _this.mouse_up);
}
