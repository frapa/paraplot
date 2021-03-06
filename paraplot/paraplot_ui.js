var menus;
var contents;
    
var drag = false;
var pos_x = 0;
var pos_y = 0;

var sliders = new Object();

// i don't know why this is there but make thinks
// work on firefox!!!
var event;

// state vars
var selected_input;
// parameters_inputs
var para_input = {};

function menu_select (id) {
    for (c in contents) {
        var content = contents[c];
        var menu = menus[c.replace('content', 'menu')]
        
        content.style.display = 'none';
        menu.style.backgroundColor = '';
    }
    
    var content = contents[id + '_content'];
    var menu = menus[id + '_menu']
    
    content.style.display = 'block';
    menu.style.backgroundColor = '#fff';
}

function box_mod(id) {
    var box = document.getElementById('box_' + id);
    
    if (Number(box.value) != NaN) {
        if (id == 'sx') {
            view.rect.x = Number(box.value);
            
            var box2 = document.getElementById('box_ex');
            view.rect.w = Number(box2.value) - view.rect.x;
        } else if (id == 'sy') {
            view.rect.y = Number(box.value);
            
            var box2 = document.getElementById('box_ey');
            view.rect.h = Number(box2.value) - view.rect.y;
        } else if (id == 'ex') {
            view.rect.w = Number(box.value) - view.rect.x;
        } else if (id == 'ey') {
            view.rect.h = Number(box.value) - view.rect.y;
        }
        
        view.scale.x = view.pix.w / view.rect.w;
        view.scale.y = view.pix.h / view.rect.h;
        
        redraw();
        draw_grid();
    }
}

function box_write() {
    var box_sx = document.getElementById("box_sx");
    var box_ex = document.getElementById("box_ex");
    var box_sy = document.getElementById("box_sy");
    var box_ey = document.getElementById("box_ey");
    
    box_sx.value = (view.rect.x).toPrecision(3);
    box_ex.value = (view.rect.x + view.rect.w).toPrecision(3);
    box_sy.value = (view.rect.y).toPrecision(3);
    box_ey.value = (view.rect.y + view.rect.h).toPrecision(3);
}

function init_ui() {
    box_write();
    
    svg.addEventListener('mousedown', plot_mouse_down);
    document.addEventListener('mousemove', plot_mouse_move);
    document.addEventListener('mouseup', plot_mouse_up);
    window.onresize = on_resize_window;
    
    if (navigator.userAgent.indexOf('Firefox') != -1) {
        svg.addEventListener('wheel', wheel, true);
    } else {
        svg.addEventListener('mousewheel', wheel, true);
    }

    menus = {
        'function_menu': document.getElementById('function_menu'),
        'settings_menu': document.getElementById('settings_menu'),
        'tools_menu': document.getElementById('tools_menu')
    };
    
    contents = {
        'function_content': document.getElementById('function_content'),
        'settings_content': document.getElementById('settings_content'),
        'tools_content': document.getElementById('tools_content')
    };

    menu_select('function');
    func_add();
}

function getMouseX(event) {
    return view.rect.x + (event.clientX / view.scale.x);
}

function getMouseY(event) {
    return view.rect.y + (view.rect.h - event.clientY / view.scale.y);
}

// change position of slider after input box has changed
function editParameter(para_id, event) {
    var value = document.getElementById("para_input_" + para_id).value;

    if (value != "") {
        parameters[para_id] = Parser.evaluate(value, parameters);
        sliders[para_id].setValue(value, false);
    
        redraw();
    }
}

// change the value of the input box after slider has been moved
function changeParameter(para_id, value) {
    parameters[para_id] = value;

    para_input[para_id].value = value.toPrecision(3);
    
    redraw();
}

function addParameterSlider(p) {
    var list = document.getElementById("funclist");

    var new_func_div = document.createElement("div");
    new_func_div.setAttribute("class", "funcbox");
    list.appendChild(new_func_div);

    var para_div = document.createElement("div");
    para_div.innerHTML = p + " = ";
    
    var val = document.createElement("input");
    val.type = "number";
    val.value = 1;
    val.id = "para_input_" + p;
    val.addEventListener("input", function (e) {editParameter(p, e)});
    para_div.appendChild(val);
    para_input[p] = val;
    
    new_func_div.appendChild(para_div);

    var slider_div = document.createElement("div");
    new_func_div.appendChild(slider_div);

    slider_div.setAttribute("id", "slider_" + p);

    slider = new Slider("slider_" + p, -10, 10, 0.1);
    slider.onChange = function (value) {changeParameter(p, value);};
	slider.setValue(1);

    sliders[p] = slider;
}
