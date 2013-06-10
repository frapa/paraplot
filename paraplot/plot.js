// basic function for plotting stuff
function plot(points, path_id, style) {
    if (points.length > 0) {
        var path;
        if (path_id === undefined) {
            path = document.createElementNS('http://www.w3.org/2000/svg', "path");
            graph.appendChild(path);
        } else {
            path = document.getElementById(path_id);
        }

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
            
        path.setAttribute("d", data);
    }
}

function func_evaluate (func_num) {
    var input = document.getElementById("input" + func_num);
    
    if (input.value != '') {
        var f; // in case it is a function
        var data = new Array(); // in case it is csv
        try {
            f = Parser.parse(input.value);
        } catch (err) {
            plot([0, 0], "function" + func_num);

            // exit from function
            return 0;
        }
        
        var type = "";
        var para = new Array();
        var para_def = true;
        for (var vi = 0; vi < f.variables().length; vi++) {
            if (f.variables()[vi] == "x") {
                type += "x";
            }
            
            if (f.variables()[vi] == "y") {
                type += "y";
            }
            
            if (f.variables()[vi] != "x" && f.variables()[vi] != "y") {            
                para.push(f.variables()[vi]);
                
                if (!(f.variables()[vi] in parameters)) {
                    para_def = false;
                } 
            }
        }
        
        // add parameter sliders
        var points = new Array();
        if (!para_def) {
            for (var i = 0; i < para.length; i++) {
                if (!(para[i] in parameters)) {
                    addParameterSlider(para[i]);
                    parameters[para[i]] = 1;
                }
            }
        }

        // evaluate points
        for (var x = view.rect.x; x <= (view.rect.x + view.rect.w + step); x += step) {
            parameters['x'] = x;
            
            points.push({x: x, y: f.evaluate(parameters)});
        }
        
        // plot
        if (func_num >= functions.length) {
            functions.push({f: f, points: points, type: type, parameters: para});
        } else {
            functions[func_num] = {f: f, points: points, type: type, parameters: para};
        }
        
        plot(points, 'function' + func_num);
    } else { // input string was empty
        plot([0, 0], "function" + func_num);
    }
}

 /*if (what_to_do === 1) {
            var points = new Array();
            
            for (var lid in data) {
                points[lid] = {x: data[lid][0], y: data[lid][1]};
            }
            
            if (func_num >= functions.length) {
                functions.push({points: points});
            } else {
                functions[func_num] = {points: points};
            }
            
            plot(points, 'function' + func_num);
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
