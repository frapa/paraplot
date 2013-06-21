var colors = new Array();
var colors = new Array();

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

