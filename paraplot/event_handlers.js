function input_key_down(event) {
    if (event.keyCode == 13) { // enter
        func_evaluate(functions[selected_input].id);
    } else if (event.keyCode == 40) {  // down arrow
        // if we are at the top of the list of function
        // add a new function, otherwise move
        // the cursor to the next function input box
        if (selected_input < functions.length - 1) {
            selected_input++;
            document.getElementById("input" + functions[selected_input].id).focus();
        } else {
            func_add();
        }
    } else if (event.keyCode == 38) { // up arrow
        // if we are not at the top of the list of function
        // move the cursor to the previous function input box
        if (selected_input > 0) {
            selected_input--;
            document.getElementById("input" + functions[selected_input].id).focus();
        } 
    }
}

// Called when window is resized.
// It updates the view and redraw the scene.
function on_resize_window(event) {
    view.pix.w = window.innerWidth - sidebar_width
    view.pix.h = window.innerHeight;
    
    // compute new view rect, centered on the current center
    center_view(view.rect.x + view.rect.w/2, view.rect.y + view.rect.h/2);

    // resize svg element
    svg.style.width = view.pix.w;
    svg.style.height = view.pix.h;
    
    // redraw
    redraw();
    draw_grid();
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


