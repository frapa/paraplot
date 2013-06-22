// basic function for plotting stuff
function plot(object) {
    // check if points is valid
    if (points.length > 0) {
        var path = document.getElementById(path_id);
        
        if (style.lines) {
            var start_y_pix = view.pix.h - (points[0].y - view.rect.y) * view.scale.y;
            
            var started = false;
            var data = "";
            var out_of_screen = (start_y_pix < 0 || start_y_pix > view.pix.h);
            for (var i = 0; i < points.length; i++) {
                if (isFinite(points[i].y)) {
                    var x_pix = (points[i].x - view.rect.x) * view.scale.x;
                    var y_pix = view.pix.h - (points[i].y - view.rect.y) * view.scale.y;
                    
                    if (y_pix < 0 || y_pix > view.pix.h) {
                        if (!out_of_screen) {
                            data += "L " + x_pix + ", " + y_pix;
                        }

                        out_of_screen = true;
                    } else {
                        if (out_of_screen) {
                            var last_x_pix = (points[i - 1].x - view.rect.x) * view.scale.x;
                            var last_y_pix = view.pix.h - (points[i - 1].y - view.rect.y) * view.scale.y;

                            data += "M " + last_x_pix + ", " + last_y_pix + " ";
                            started = true;
                        }

                        if (!started) {
                            data += "M " + x_pix + ", " + y_pix + " ";
                            started = true;
                        } else {
                            data += "L " + x_pix + ", " + y_pix + " ";
                        }

                        out_of_screen = false;
                    }
                }
            }
        } else if (style.markers) {
            for (var i = 0; i < points.length; i++) {
                if (isFinite(points[i].y)) {
                    var x_pix = (points[i].x - view.rect.x) * view.scale.x;
                    var y_pix = view.pix.h - (points[i].y - view.rect.y) * view.scale.y;
                    
                    if (y_pix > 0 && y_pix < view.pix.h) {
                        var circle = document.createElementNS('http://www.w3.org/2000/svg', "circle");

                        circle.setAttribute('cx', x_pix);
                        circle.setAttribute('cy', y_pix);
                        circle.setAttribute('r', '5px');
                        circle.setAttribute('fill', style.color);

                        graph.appendChild(circle);
                        temp.push(circle);
                    }
                }
            }
        }
            
        path.setAttribute("d", data);
    }
}

// sets path data to [0, 0] to hide it
function deplot(object) {
    object.path = document.getElementById(path_id);
    object.path.setAttribute("d", "M 0,0");
}

function func_evaluate (func_id) {
    var func = objects[func_id]; 
    //var input = document.getElementById("input" + func_id);
    
    if (func.input.value != '') {
        var f; // in case it is a function

        try {
            f = Parser.parse(func.input.value);
        } catch (err) {
            deplot(func);

            // exit from function
            return 0;
        }
        
        // Type of function. Can be:
        //   'x' -> function f(x) of one real variable
        //   'y' -> function f(y) of one real variable
        //   'xy' -> function f(x, y) in two real variables
        //   'n' -> function f(n) of one integer variable
        func.type = "";
        var new_parameters = new Array();
        for (var vi = 0; vi < f.variables().length; vi++) {
            var v = f.variables()[vi];

            if (variables.indexOf(v) != -1) {
                func.type += v;   
            } else (forbidden_parameters.indexOf(v) == -1 && !(v in parameters)) {            
                new_parameters.push(v);
            }
        }
        
        // add parameter sliders
        for (var i = 0; i < new_parameters.length; i++) {
            addParameterSlider(para[i]);
            parameters[new_parameters[i]] = 1;
        }

        // evaluate points
        func.points = new Array();
        if (func.type == 'x') {
            // continuous function
            for (var x = view.rect.x; x <= (view.rect.x + view.rect.w + step); x += step) {
                parameters['x'] = x;
                func.points.push({x: x, y: f.evaluate(parameters)});

                // set style, function should be plotted as lines
                func.style.lines = true;
                func.style.markers = false;
            }
        } else if (func.type == 'n') {
            // discrete function
            for (var n = Math.floor(view.rect.x); n <= Math.ceil(view.rect.x + view.rect.w); n++) {
                parameters['n'] = n;
                func.points.push({x: n, y: f.evaluate(parameters)});

                // set style, function should be plotted as dots
                func.style.lines = false;
                func.style.markers = true;
            }
        } else {
            // not yet implemented type
            deplot(func);
        }
        
        plot(func);
    } else { // input string was empty
        // hide path
        deplot(func);
    }
}

 /*if (what_to_do === 1) {
            var points = new Array();
            
            for (var lid in data) {
                points[lid] = {x: data[lid][0], y: data[lid][1]};
            }
            
            if (func_id >= functions.length) {
                functions.push({points: points});
            } else {
                functions[func_id] = {points: points};
            }
            
            plot(points, 'function' + func_id);
        }*/

/*if (input.value.indexOf('\n') != -1) {
                // maybe it is a csv!
                var lines = input.value.replace(/[ \t\r]/g, "").split('\n')
                var cols = lines[0].match(/,/g).length + 1;
                               
                var is_csv = true;
                var pattern = /^([\d.]+,)+[\d.]+$/;
                for (var lid in lines) {
                    is_csv = pattern.test(lines[lid]);
                    
                    if (!is_csv) {
                        break;
                    }
                }
                
                if (is_csv) {
                    what_to_do = 1;
                    
                    for (var lid in lines) {
                        var nums = lines[lid].split(',');
                        
                        data[lid] = new Array();
                        
                        for (var n in nums) {
                            data[lid][n] = Number(nums[n]);
                        }
                    }
                } else {
                    what_to_do = 2;
                }
            } else {
                what_to_do = 3;
          }*/
