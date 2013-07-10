function log10(x) {
    return Math.log(x)/Math.log(10);
}

function nice_number(n) {
    // order of magnitude
    exponent = Math.floor(log10(n));
    fraction = n / Math.pow(10, exponent);
    
    var nice_fraction;
    if (fraction < 1.5) {
        nice_fraction = 1;
    } else if (fraction < 3) {
        nice_fraction = 2;
    } else if (fraction < 7) {
        nice_fraction = 5;
    } else {
        nice_fraction = 10;
    }
    
    return nice_fraction * Math.pow(10, exponent);
}

function get_ticks(a, b, mt) {
    var ticks = new Object();
    var range = b - a;
    var max_ticks = mt;
    
    ticks.major = new Array();
    ticks.minor = new Array();
    
    tick_spacing = nice_number(range / max_ticks);
    nice_min = Math.floor(a / tick_spacing) * tick_spacing;
    nice_max = Math.ceil(b / tick_spacing) * tick_spacing;
    nice_range = nice_max - nice_min;
    
    for (var i = 0; i <= (nice_range / tick_spacing); i++) {
        ticks.major[i] = nice_min + i * tick_spacing;
    }
    
    return ticks;
}

function remove_numbers() {
    for (var i = 0; i < grid_lines.x.length; i++) {
        grid_lines.x_labels[i].textContent = "";
    }

    for (var i = 0; i < grid_lines.y.length; i++) {
        grid_lines.y_labels[i].textContent = "";
    }
}

function simplified_draw_grid() {
    // 0.5 added to make line be 1 pixel in stroke, otherwise antialias is applied
    xaxis.setAttribute("d", "M 0 " + (Math.floor(view.pix.h + view.rect.y * view.scale.y) + 0.5) +
        " L " + view.pix.w + " " + (Math.floor(view.pix.h + view.rect.y * view.scale.y) + 0.5));
    yaxis.setAttribute("d", "M " + (Math.floor(-view.rect.x * view.scale.x) + 0.5) +
        " 0 L " + (Math.floor(-view.rect.x * view.scale.x) + 0.5) + " " + view.pix.h);
    
    var x_ticks = get_ticks(view.rect.x, view.rect.x + view.rect.w, view.pix.w / pix_major_tick);
    var y_ticks = get_ticks(view.rect.y, view.rect.y + view.rect.h, view.pix.h / pix_major_tick);
    
    for (var i = 0; i < grid_lines.x.length; i++) {
        grid_lines.x[i].setAttribute("d", "M 0,0");
    }
    
    for (var i = 0; i < x_ticks.major.length; i++) {
        var t = x_ticks.major[i];
        
        if (i == grid_lines.x.length) {
            grid_lines.x[i] = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            grid_lines.x[i].setAttribute("class", "major_tick");
            graph.appendChild(grid_lines.x[i]);
            
            grid_lines.x_labels[i] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            grid_lines.x_labels[i].setAttribute("class", "major_tick_label");
            graph.appendChild(grid_lines.x_labels[i]);
        }
        
        if (t != 0) {
            // 0.5 added to make line be 1 pixel thick, otherwise antialias is applied
            var x = Math.floor((t - view.rect.x) * view.scale.x) + 0.5;
            
            grid_lines.x[i].setAttribute("d", "M " + x + " 0 L " + x + " " + view.pix.h);
        }
    }
    
    for (var i = 0; i < grid_lines.y.length; i++) {
        grid_lines.y[i].setAttribute("d", "M 0,0");
    }
    
    for (var i = 0; i < y_ticks.major.length; i++) {
        var t = y_ticks.major[i];
        if (i == grid_lines.y.length) {
            grid_lines.y[i] = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            grid_lines.y[i].setAttribute("class", "major_tick");
            graph.appendChild(grid_lines.y[i]);
            
            grid_lines.y_labels[i] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            grid_lines.y_labels[i].setAttribute("class", "major_tick_label");
            graph.appendChild(grid_lines.y_labels[i]);
        }
        
        if (t != 0) {
            // 0.5 added to make line be 1 pixel thick, otherwise antialias is applied
            var y = Math.floor(view.pix.h - (t - view.rect.y) * view.scale.x) + 0.5;
            
            grid_lines.y[i].setAttribute("d", "M 0 " + y + " L " + view.pix.w + " " + y);
        }
    }

}

function draw_grid () {
    // 0.5 added to make line be 1 pixel in stroke, otherwise antialias is applied
    xaxis.setAttribute("d", "M 0 " + (Math.floor(view.pix.h + view.rect.y * view.scale.y) + 0.5) +
        " L " + view.pix.w + " " + (Math.floor(view.pix.h + view.rect.y * view.scale.y) + 0.5));
    yaxis.setAttribute("d", "M " + (Math.floor(-view.rect.x * view.scale.x) + 0.5) +
        " 0 L " + (Math.floor(-view.rect.x * view.scale.x) + 0.5) + " " + view.pix.h);
    
    var x_ticks = get_ticks(view.rect.x, view.rect.x + view.rect.w, view.pix.w / pix_major_tick);
    var y_ticks = get_ticks(view.rect.y, view.rect.y + view.rect.h, view.pix.h / pix_major_tick);
    
    for (var i = 0; i < grid_lines.x.length; i++) {
        grid_lines.x[i].setAttribute("d", "M 0,0");
        grid_lines.x_labels[i].textContent = "";
    }
    
    for (var i = 0; i < x_ticks.major.length; i++) {
        var t = x_ticks.major[i];
        
        if (i == grid_lines.x.length) {
            grid_lines.x[i] = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            grid_lines.x[i].setAttribute("class", "major_tick");
            graph.appendChild(grid_lines.x[i]);
            
            grid_lines.x_labels[i] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            grid_lines.x_labels[i].setAttribute("class", "major_tick_label");
            graph.appendChild(grid_lines.x_labels[i]);
        }
        
        if (t != 0) {
            // 0.5 added to make line be 1 pixel thick, otherwise antialias is applied
            var x = Math.floor((t - view.rect.x) * view.scale.x) + 0.5;
            
            grid_lines.x[i].setAttribute("d", "M " + x + " 0 L " + x + " " + view.pix.h);
            
            grid_lines.x_labels[i].setAttribute("x", x);
            grid_lines.x_labels[i].textContent = t;
            
            if (view.rect.y > 0) {
                grid_lines.x_labels[i].setAttribute("y", view.pix.h - 10);
            } else if (view.rect.y + view.rect.h < 0) {
                grid_lines.x_labels[i].setAttribute("y", 10 + grid_lines.x_labels[i].clientHeight);
            } else {
                grid_lines.x_labels[i].setAttribute("y", view.pix.h + view.rect.y * view.scale.y);
            }
        }
    }
    
    for (var i = 0; i < grid_lines.y.length; i++) {
        grid_lines.y[i].setAttribute("d", "M 0,0");
        grid_lines.y_labels[i].textContent = "";
    }
    
    for (var i = 0; i < y_ticks.major.length; i++) {
        var t = y_ticks.major[i];
        if (i == grid_lines.y.length) {
            grid_lines.y[i] = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            grid_lines.y[i].setAttribute("class", "major_tick");
            graph.appendChild(grid_lines.y[i]);
            
            grid_lines.y_labels[i] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            grid_lines.y_labels[i].setAttribute("class", "major_tick_label");
            graph.appendChild(grid_lines.y_labels[i]);
        }
        
        if (t != 0) {
            // 0.5 added to make line be 1 pixel thick, otherwise antialias is applied
            var y = Math.floor(view.pix.h - (t - view.rect.y) * view.scale.x) + 0.5;
            
            grid_lines.y[i].setAttribute("d", "M 0 " + y + " L " + view.pix.w + " " + y);
            
            grid_lines.y_labels[i].setAttribute("y", y);
            grid_lines.y_labels[i].textContent = t;
            
            if (view.rect.x > 0) {
                grid_lines.y_labels[i].setAttribute("x", 10);
            } else if (view.rect.x + view.rect.w < 0) {
                grid_lines.y_labels[i].setAttribute("x", view.pix.w - grid_lines.y_labels[i].clientWidth - 10);
            } else {
                grid_lines.y_labels[i].setAttribute("x", -view.rect.x * view.scale.x);
            }
        }
    }
}
