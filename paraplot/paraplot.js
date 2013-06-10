var sidebar_width = 320;

var view = {
    scale: {x:100, y:100},
    rect: {x: 0, y:0, w:0, h:0},
    pix: {w: window.innerWidth - sidebar_width, h:window.innerHeight}
};

var step;
var step_pix = 5;

var functions = new Array();
var parameters = {'pi': 3.141592, 'e': 2.718281};
var colors = new Array();

var svg;
var graph;
var xaxis;
var yaxis;

var grid_lines = {x: new Array(), y: new Array(), x_labels: new Array(), y_labels: new Array()};
var pix_major_tick = 120;

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

function center_view() {
    // compute view
    view.rect.w = view.pix.w / view.scale.x;
    view.rect.h = view.pix.h / view.scale.y;
    view.rect.x = -view.rect.w / 2;
    view.rect.y = -view.rect.h / 2;
        
    step = step_pix / view.scale.x;
}

function HSV_to_RGB(H, S, V) {
    H = H % 360;
    var C = V * S;
    var h = H / 60;
    var X = C * (1 - Math.abs(h % 2 - 1));
    var m = V - C;

    if (!isFinite(h)) {
        return [m, m, m];
    } else if (h < 1) {
        return [C + m, X + m, m];
    } else if (h < 2) {
        return [X + m, C + m, m];
    } else if (h < 3) {
        return [m, C + m, X + m];
    } else if (h < 4) {
        return [m, X + m, C + m];
    } else if (h < 5) {
        return [X + m, m, C + m];
    } else if (h < 6) {
        return [C + m, m, X + m];
    }
}

function generate_color() {
    var disct = 7;
    var N = colors.length;
    var V = 1 - Math.floor(N / disct) * 0.25;
    var S = 1;
    var H = 360 / disct * (N % disct) + (360 / disct) * 0.5 * Math.floor(N / disct);

    var color = HSV_to_RGB(H, S, V);
    colors.push(color);
    return color;
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
    input.setAttribute("id", "input" + functions.length);
    input.setAttribute("class", "func");
    //input.addEventListener("input", function (e) {func_evaluate(e.target.id.replace("input", ""))});
    input.addEventListener("keydown", function (e) {input_key_down(e.target.id.replace("input", ""), e)});
    new_func_div.appendChild(input);
    input.focus();

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
    button.setAttribute("onclick", "func_evaluate(" + functions.length + ")");
    button.innerHTML = "Plot";
    td_button.appendChild(button);

    new_func_div.appendChild(tab);

    var path = document.createElementNS('http://www.w3.org/2000/svg', "path");
    graph.appendChild(path);
    path.setAttribute("id", "function" + functions.length);
    path.style.stroke = css_color;

    functions.length += 1;
}

function redraw() {
    step = step_pix / view.scale.x;
    
    for (var i = 0; i < functions.length; i++) {
        func_evaluate(i);
    }
}
