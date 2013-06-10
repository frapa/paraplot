var menus = {'function_menu': document.getElementById('function_menu'),
    'settings_menu': document.getElementById('settings_menu'),
    'tools_menu': document.getElementById('tools_menu')};

var contents = {'function_content': document.getElementById('function_content'),
    'settings_content': document.getElementById('settings_content'),
    'tools_content': document.getElementById('tools_content')};
    
var drag = false;
var pos_x = 0;
var pos_y = 0;

var sliders = new Object();

// i don't know why this is there but make thinks
// work on firefox!!!
var event;


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

    menu_select('function');
    func_add();
}

function input_key_down(input_id, event) {
    if (event.keyCode == 13) {
        func_evaluate(input_id);
    } else if (event.keyCode == 40) {
        func_add();
    }
}

function on_resize_window(event) {
    view.pix.w = window.innerWidth - sidebar_width
    view.pix.h = window.innerHeight;
    
    center_view();
        
    svg.style.width = view.pix.w;
    svg.style.height = view.pix.h;
    
    redraw();
    draw_grid();
}

function getMouseX(event) {
    return view.rect.x + (event.clientX / view.scale.x);
}

function getMouseY(event) {
    return view.rect.y + (view.rect.h - event.clientY / view.scale.y);
}

function wheel(event) {
    if (!event) var event = window.event;
    
    var dY;
    if (navigator.userAgent.indexOf('Firefox') != -1) {
        dY = event.deltaY / 30;
    } else {
        dY = event.wheelDeltaY / 1200;
    }

    cx = view.rect.x + view.rect.w / 2;
    cy = view.rect.y + view.rect.h / 2;

    view.rect.w *= Math.exp(dY);
    view.rect.h *= Math.exp(dY);
    
    view.rect.x = cx - view.rect.w / 2;
    view.rect.y = cy - view.rect.h / 2;
    
    view.scale.x = view.pix.w / view.rect.w;
    view.scale.y = view.pix.h / view.rect.h;
    
    redraw();
    box_write();
    draw_grid();
}

function plot_mouse_down (event) {
    if (event.button === 0) {
        // disable text select
        event.preventDefault();

        drag = true;
    }
}

function plot_mouse_move (event) {
    if (!event) var event = window.event;
    
    if (drag) {
        view.rect.x += -(event.clientX - pos_x) / view.scale.x;
        view.rect.y += (event.clientY - pos_y) / view.scale.y;
        
        redraw();
        box_write();
        draw_grid();
    }
    
    pos_x = event.clientX;
    pos_y = event.clientY;
}

function plot_mouse_up () {
    drag = false;
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

    var val_input = document.getElementById("para_input_" + para_id);
    val_input.value = value.toPrecision(3);
    
    redraw();
}

function addParameterSlider(p) {
    var list = document.getElementById("funclist");

    var new_func_div = document.createElement("div");
    list.appendChild(new_func_div);
    new_func_div.setAttribute("class", "funcbox");

    var para_div = document.createElement("div");
    para_div.innerHTML = p + " = ";
    
    var val = document.createElement("input");
    val.type = "number";
    val.value = 1;
    val.id = "para_input_" + p;
    val.addEventListener("input", function (e) {editParameter(p, e)});
    para_div.appendChild(val);
    
    new_func_div.appendChild(para_div);

    var slider_div = document.createElement("div");
    new_func_div.appendChild(slider_div);

    slider_div.setAttribute("id", "slider_" + p);

    slider = new Slider("slider_" + p, -10, 10, 0.1);
    slider.onChange = function (value) {changeParameter(p, value);};
	slider.setValue(1);

    sliders[p] = slider;
}

init();
init_ui();
