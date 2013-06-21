var sidebar_width = 320;

// This objects tells the rectangle to be viewed
// and the dimensions of the window in pixels.
// Moreover it keeps track of the scale of the view.
var view = {
    scale: {x:100, y:100},
    rect: {x: 0, y:0, w:0, h:0},
    pix: {w: window.innerWidth - sidebar_width, h:window.innerHeight}
};

var step;
var step_pix = 5;

var functions = new Array();
var function_count = 0;
var parameters = {'pi': 3.141592, 'e': 2.718281};
var forbidden_parameters = ['random', 'fac', 'min', 'max', 'pyt', 'pow', 'atan2'];

var svg;
var graph;
var xaxis;
var yaxis;

var grid_lines = {x: new Array(), y: new Array(), x_labels: new Array(), y_labels: new Array()};
var pix_major_tick = 120;

var temp = new Array();

// Saves some dom elements and sets the view and the grid.
function init () {
    svg = document.getElementById("plot");
    graph = document.getElementById("graph");
    xaxis = document.getElementById("xaxis");
    yaxis = document.getElementById("yaxis");
    
    center_view();
    
    svg.style.width = view.pix.w;
    svg.style.height = view.pix.h;
    
    draw_grid();
}

// Centers view on x, y coordinates.
// It uses the size of the window in pixels and the scale factor.
function center_view(x, y) {
    if (x === undefined) x = 0;
    if (y === undefined) y = 0;

    // compute view
    view.rect.w = view.pix.w / view.scale.x;
    view.rect.h = view.pix.h / view.scale.y;
    view.rect.x = x - view.rect.w / 2;
    view.rect.y = y - view.rect.h / 2;
        
    step = step_pix / view.scale.x;
}

function func_add () {
    var color = generate_color();
    var css_color = "rgb(" + Math.floor(color[0]*255) + ", " + Math.floor(color[1]*255) + ", " + Math.floor(color[2]*255) +  ")";
    
    var list = document.getElementById("funclist");

    var new_func_div = document.createElement("div");
    list.appendChild(new_func_div);
    new_func_div.setAttribute("class", "funcbox");

    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "input" + function_count);
    input.setAttribute("class", "func");
    //input.addEventListener("input", function (e) {func_evaluate(e.target.id.replace("input", ""))});
    input.addEventListener("keydown", input_key_down);
    new_func_div.appendChild(input);
    input.focus();
    // which input is selected
    selected_input = function_count;

    // add command table (with the color and the "plot" button)
    var tab = document.createElement("table");
    tab.className = "commands"
    var tr = document.createElement("tr");
    tab.appendChild(tr);

    // add cells
    var td_color = document.createElement("td");
    td_color.style.width = "99%";
    tr.appendChild(td_color);
    var td_button = document.createElement("td");
    tr.appendChild(td_button);
    
    var color_div = document.createElement("div");
    color_div.className = "color";
    color_div.style.background = css_color;
    td_color.appendChild(color_div);

    var button = document.createElement("button");
    button.setAttribute("onclick", "func_evaluate(" + function_count + ")");
    button.innerHTML = "Plot";
    td_button.appendChild(button);

    new_func_div.appendChild(tab);

    var path = document.createElementNS('http://www.w3.org/2000/svg', "path");
    graph.appendChild(path);
    path.setAttribute("id", "function" + function_count);
    path.style.stroke = css_color;

    functions.push({id: function_count, style: {color: css_color}})
    function_count++;
}

function redraw() {
    step = step_pix / view.scale.x;
    
    for (var i = 0; i < functions.length; i++) {
        func_evaluate(i);
    }
}
