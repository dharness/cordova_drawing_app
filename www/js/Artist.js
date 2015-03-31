function Artist() {

    // Artist.prototype.canvas = canvas;

    //////////////////////////////////////////////////////
    //                  Initialization                  //
    //////////////////////////////////////////////////////
    function init() {
        _canvas = _artist.canvas;
        this.mode = 'select';
        ctx = _artist.canvas.getContext("2d");
        mouse = {
            x: 0,
            y: 0
        };

        this.canvas.addEventListener('mousemove', function(e) {
            mouse.x = e.layerX;
            mouse.y = e.layerY;
        }, false);

        window.mode = 'selectMode';

        window.canvases = [];
        window.canvases.push(_canvas);
    }


    //////////////////////////////////////////////////////
    //                Utility Functions                 //
    //////////////////////////////////////////////////////

    function createTmpCanvas() {
        var tmp_canvas = document.getElementById('tmp_canvas');
        var sketch = document.querySelector('#sketch');

        // Creating a tmp canvas if there isnt one
        if (!tmp_canvas) {
            var canvasRect = _canvas.getBoundingClientRect();
            var tmp_canvas = $(_canvas).clone()[0];
            tmp_canvas.id = 'tmp_canvas';
            tmp_canvas.style.position = 'absolute';
            tmp_canvas.style.background = 'transparent';
            tmp_canvas.style.zIndex = '1000';
            tmp_canvas.style.top = $(_canvas).position().top;
            tmp_canvas.style.left = $(_canvas).position().left;

            tmp_canvas.width = _canvas.width;
            tmp_canvas.height = _canvas.height;

            sketch.appendChild(tmp_canvas);
        }
        $(tmp_canvas).off();
        return tmp_canvas;
    }

    function configureContext(tmp_ctx) {
        tmp_ctx.lineWidth = 5;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        var colour = $("#colourpicker").val();
        tmp_ctx.strokeStyle = colour;
        tmp_ctx.fillStyle = colour;
    }

    // the white one is at 0, blue is at 1
    function setLayer(otherNum) {
        var e = document.getElementById('layers');
        if (otherNum) {
            e.value = otherNum;
        }

        var layerNum = e.options[e.selectedIndex].value;
        var top = Number(_canvas.style.zIndex) + 1;
        _canvas = window.canvases[layerNum];
        _canvas.style.zIndex = top;
        if (layerNum == 0) {
            _canvas.style.background = 'transparent';
        }

        ctx = _canvas.getContext("2d");
        _artist[window.mode]();
    }

    function addLayer() {
        //Create a nondescript canvas which represents a layer
        var sketch = document.querySelector('#sketch');
        var canvasRect = _canvas.getBoundingClientRect();
        var dummy_canvas = $(_canvas).clone()[0];
        dummy_canvas.id = 'dummy_canvas_' + window.canvases.length;
        dummy_canvas.style.position = 'absolute';
        dummy_canvas.style.background = 'transparent';
        dummy_canvas.style.zIndex = '500' + window.canvases.length;
        dummy_canvas.style.top = $(_canvas).position().top;
        dummy_canvas.style.left = $(_canvas).position().left;

        dummy_canvas.width = _canvas.width;
        dummy_canvas.height = _canvas.height;

        var option = document.createElement("option");
        option.text = "Layer: " + window.canvases.length;
        option.value = window.canvases.length;
        document.getElementById('layers').add(option)

        sketch.appendChild(dummy_canvas);
        window.canvases.push(dummy_canvas);
    }

    //////////////////////////////////////////////////////
    //                  Drawing Modes                   //
    //////////////////////////////////////////////////////

    function brushMode() {
        window.mode = 'brushMode';
        var tmp_canvas = createTmpCanvas();
        var tmp_ctx = tmp_canvas.getContext('2d');

        var mouse = {
            x: 0,
            y: 0
        };
        var last_mouse = {
            x: 0,
            y: 0
        };

        // Pencil Points
        var ppts = [];

        /* Mouse Capturing Work */
        tmp_canvas.addEventListener('mousemove', function(e) {
            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
        }, false);

        tmp_canvas.addEventListener('mousedown', function(e) {
            tmp_canvas.addEventListener('mousemove', draw, false);

            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            ppts.push({
                x: mouse.x,
                y: mouse.y
            });

            draw();
        }, false);

        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', draw, false);

            // Writing down to real canvas now
            ctx.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            // Emptying up Pencil Points
            ppts = [];
        }, false);

        draw = function() {
            configureContext(tmp_ctx);

            // Saving all the points in an array
            ppts.push({
                x: mouse.x,
                y: mouse.y
            });

            if (ppts.length < 3) {
                var b = ppts[0];
                tmp_ctx.beginPath();
                //ctx.moveTo(b.x, b.y);
                //ctx.lineTo(b.x+50, b.y+50);
                tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
                tmp_ctx.fill();
                tmp_ctx.closePath();

                return;
            }

            // Tmp canvas is always cleared up before drawing.
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            tmp_ctx.beginPath();
            tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

            for (var i = 1; i < ppts.length - 2; i++) {
                var c = (ppts[i].x + ppts[i + 1].x) / 2;
                var d = (ppts[i].y + ppts[i + 1].y) / 2;

                tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
            }

            // For the last 2 points
            tmp_ctx.quadraticCurveTo(
                ppts[i].x,
                ppts[i].y,
                ppts[i + 1].x,
                ppts[i + 1].y
            );
            tmp_ctx.stroke();

        };
    }

    function lineMode() {
        window.mode = 'lineMode';
        var tmp_canvas = createTmpCanvas();
        var tmp_ctx = tmp_canvas.getContext('2d');

        var mouse = {
            x: 0,
            y: 0
        };
        var start_mouse = {
            x: 0,
            y: 0
        };


        /* Mouse Capturing Work */
        tmp_canvas.addEventListener('mousemove', function(e) {
            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
        }, false);


        tmp_canvas.addEventListener('mousedown', function(e) {
            tmp_canvas.addEventListener('mousemove', draw, false);

            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            start_mouse.x = mouse.x;
            start_mouse.y = mouse.y;

            draw();
        }, false);

        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', draw, false);

            // Writing down to real canvas now
            ctx.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        }, false);

        draw = function() {

            configureContext(tmp_ctx);

            // Tmp canvas is always cleared up before drawing.
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            tmp_ctx.beginPath();
            tmp_ctx.moveTo(start_mouse.x, start_mouse.y);
            tmp_ctx.lineTo(mouse.x, mouse.y);
            tmp_ctx.stroke();
            tmp_ctx.closePath();

        }
    }

    function rectangleMode() {
        window.mode = 'rectangleMode';
        //Swap the button to present square mode
        $('#square_rectangleButton').attr('icon', 'sketch-icons:square-tool');
        $('#square_rectangleButton').attr('onclick', '_artist.squareMode()');
        $('#square_rectangleButton').attr('label', 'Square');


        var tmp_canvas = createTmpCanvas();
        var tmp_ctx = tmp_canvas.getContext('2d');

        var mouse = {
            x: 0,
            y: 0
        };
        var start_mouse = {
            x: 0,
            y: 0
        };


        /* Mouse Capturing Work */
        tmp_canvas.addEventListener('mousemove', function(e) {
            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
        }, false);

        tmp_canvas.addEventListener('mousedown', function(e) {
            tmp_canvas.addEventListener('mousemove', draw, false);

            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            start_mouse.x = mouse.x;
            start_mouse.y = mouse.y;

            draw();
        }, false);

        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', draw, false);

            // Writing down to real canvas now
            ctx.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        }, false);

        draw = function() {
            configureContext(tmp_ctx);
            // Tmp canvas is always cleared up before drawing.
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            var x = Math.min(mouse.x, start_mouse.x);
            var y = Math.min(mouse.y, start_mouse.y);
            var width = Math.abs(mouse.x - start_mouse.x);
            var height = Math.abs(mouse.y - start_mouse.y);
            tmp_ctx.strokeRect(x, y, width, height);

        };
    }

    function squareMode() {
        window.mode = 'squareMode';
        //Swap the button to present square mode
        $('#square_rectangleButton').attr('icon', 'sketch-icons:rectangle-tool');
        $('#square_rectangleButton').attr('onclick', '_artist.rectangleMode()');
        $('#square_rectangleButton').attr('label', 'Rectangle');

        var tmp_canvas = createTmpCanvas();
        var tmp_ctx = tmp_canvas.getContext('2d');

        var mouse = {
            x: 0,
            y: 0
        };
        var start_mouse = {
            x: 0,
            y: 0
        };


        /* Mouse Capturing Work */
        tmp_canvas.addEventListener('mousemove', function(e) {
            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
        }, false);

        tmp_canvas.addEventListener('mousedown', function(e) {
            tmp_canvas.addEventListener('mousemove', draw, false);

            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            start_mouse.x = mouse.x;
            start_mouse.y = mouse.y;

            draw();
        }, false);

        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', draw, false);

            // Writing down to real canvas now
            ctx.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        }, false);

        draw = function() {
            configureContext(tmp_ctx);
            // Tmp canvas is always cleared up before drawing.
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            var x = Math.min(mouse.x, start_mouse.x);
            var y = Math.min(mouse.y, start_mouse.y);
            var width = Math.abs(mouse.x - start_mouse.x);
            var height = Math.abs(mouse.y - start_mouse.y);
            width = height = Math.min(width, height);
            tmp_ctx.fillRect(x, y, width, height);

        };
    }

    function ellipseMode() {
        window.mode = 'ellipseMode';
        //Swap the button to present circle mode
        $('#circle_ellipseButton').attr('icon', 'sketch-icons:circle-tool');
        $('#circle_ellipseButton').attr('onclick', '_artist.circleMode()');
        $('#circle_ellipseButton').attr('label', 'Circle');

        var tmp_canvas = createTmpCanvas();
        var tmp_ctx = tmp_canvas.getContext('2d');

        var mouse = {
            x: 0,
            y: 0
        };
        var start_mouse = {
            x: 0,
            y: 0
        };
        var last_mouse = {
            x: 0,
            y: 0
        };


        /* Mouse Capturing Work */
        tmp_canvas.addEventListener('mousemove', function(e) {
            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
        }, false);

        tmp_canvas.addEventListener('mousedown', function(e) {
            tmp_canvas.addEventListener('mousemove', draw, false);

            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            start_mouse.x = mouse.x;
            start_mouse.y = mouse.y;

            draw();
        }, false);

        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', draw, false);

            // Writing down to real canvas now
            ctx.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        }, false);

        draw = function() {

            configureContext(tmp_ctx);

            // Tmp canvas is always cleared up before drawing.
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            var x = Math.min(mouse.x, start_mouse.x);
            var y = Math.min(mouse.y, start_mouse.y);

            var w = Math.abs(mouse.x - start_mouse.x);
            var h = Math.abs(mouse.y - start_mouse.y);

            drawEllipse(tmp_ctx, x, y, w, h);
        };

        function drawEllipse(ctx, x, y, w, h) {
            var kappa = .5522848,
                ox = (w / 2) * kappa, // control point offset horizontal
                oy = (h / 2) * kappa, // control point offset vertical
                xe = x + w, // x-end
                ye = y + h, // y-end
                xm = x + w / 2, // x-middle
                ym = y + h / 2; // y-middle

            ctx.beginPath();
            ctx.moveTo(x, ym);
            ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
            ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
            ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
            ctx.closePath();
            ctx.stroke();
        }
    }

    function circleMode() {
        window.mode = 'circleMode';
        //Swap the button to present ellipse mode
        $('#circle_ellipseButton').attr('icon', 'sketch-icons:ellipse-tool');
        $('#circle_ellipseButton').attr('onclick', '_artist.ellipseMode()');
        $('#circle_ellipseButton').attr('label', 'Ellipse');

        var tmp_canvas = createTmpCanvas();
        var tmp_ctx = tmp_canvas.getContext('2d');

        var mouse = {
            x: 0,
            y: 0
        };
        var start_mouse = {
            x: 0,
            y: 0
        };
        var last_mouse = {
            x: 0,
            y: 0
        };


        /* Mouse Capturing Work */
        tmp_canvas.addEventListener('mousemove', function(e) {
            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
        }, false);

        tmp_canvas.addEventListener('mousedown', function(e) {
            tmp_canvas.addEventListener('mousemove', draw, false);

            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            start_mouse.x = mouse.x;
            start_mouse.y = mouse.y;

            draw();
        }, false);

        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', draw, false);

            // Writing down to real canvas now
            ctx.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        }, false);

        draw = function() {

            configureContext(tmp_ctx);

            // Tmp canvas is always cleared up before drawing.
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            var x = (mouse.x + start_mouse.x) / 2;
            var y = (mouse.y + start_mouse.y) / 2;

            var radius = Math.max(
                Math.abs(mouse.x - start_mouse.x),
                Math.abs(mouse.y - start_mouse.y)
            ) / 2;

            tmp_ctx.beginPath();
            tmp_ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            // tmp_ctx.arc(x, y, 5, 0, Math.PI*2, false);
            tmp_ctx.stroke();
            tmp_ctx.closePath();

        };
    }

    function penMode(isStart) {
        window.mode = 'penMode';

        var tmp_canvas = createTmpCanvas();
        var tmp_ctx = tmp_canvas.getContext('2d');

        var mouse = {
            x: 0,
            y: 0
        };
        var start_mouse = {
            x: 0,
            y: 0
        };

        var ppts = [];

        tmp_canvas.addEventListener('mousemove', function(e) {
            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
        }, false);

        $(tmp_canvas).dblclick(function() {
            console.log('double clicking')
            closePoly();
        });

        var drawBtwNodes = function(e) {

            tmp_canvas.addEventListener('mousemove', draw, false);

            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
            draw();
            start_mouse.x = mouse.x;
            start_mouse.y = mouse.y;

            ppts.push(mouse.x);
            ppts.push(mouse.y);

            //draw a lil' node! how cute >.<
            tmp_ctx.beginPath();
            tmp_ctx.arc(mouse.x, mouse.y, 3, 0, 2 * Math.PI, false);
            tmp_ctx.fillStyle = 'green';
            tmp_ctx.fill();
            tmp_ctx.lineWidth = 0.5;
            tmp_ctx.strokeStyle = '#003300';
            tmp_ctx.stroke();
            tmp_ctx.closePath();

            if (mouse.x >= ppts[0] - 5 && mouse.x <= ppts[0] + 5 && ppts.length > 2) {
                closePoly();
            }
        }

        tmp_canvas.addEventListener('mousedown', drawBtwNodes, false);

        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', draw, false);
        }, false);

        function closePoly() {
            configureContext(tmp_ctx);
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
            tmp_ctx.beginPath();

            tmp_ctx.moveTo(ppts[0], ppts[1]);
            for (item = 2; item < ppts.length - 1; item += 2) {
                tmp_ctx.lineTo(ppts[item], ppts[item + 1])
            }

            tmp_ctx.closePath();
            tmp_ctx.fill();
            // Writing down to real canvas now
            ctx.drawImage(tmp_canvas, 0, 0);
            selectMode();
            ppts = [];
            _artist['penMode'](true);

            $(tmp_canvas).remove();
            _artist[window.mode]();
        }


        draw = function() {

            //Configure a custom context for pen mode
            tmp_ctx.lineWidth = 1;
            tmp_ctx.lineJoin = 'round';
            tmp_ctx.lineCap = 'round';
            var colour = 'red';
            tmp_ctx.strokeStyle = colour;
            tmp_ctx.fillStyle = colour;
            if (start_mouse.x == 0 && start_mouse.y == 0) {
                return;
            };
            tmp_ctx.beginPath();
            tmp_ctx.moveTo(start_mouse.x, start_mouse.y);
            tmp_ctx.lineTo(mouse.x, mouse.y);
            tmp_ctx.stroke();
            tmp_ctx.closePath();

        }
    }

    function selectMode1() {
        var tmp_canvas = createTmpCanvas();
        var tmp_ctx = tmp_canvas.getContext('2d');

        var mouse = {
            x: 0,
            y: 0
        };
        var start_mouse = {
            x: 0,
            y: 0
        };


        /* Mouse Capturing Work */
        tmp_canvas.addEventListener('mousemove', function(e) {
            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
        }, false);

        tmp_canvas.addEventListener('mousedown', function(e) {
            tmp_canvas.addEventListener('mousemove', draw, false);

            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            start_mouse.x = mouse.x;
            start_mouse.y = mouse.y;

            draw();
        }, false);

        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', draw, false);

            // Writing down to real canvas now
            // ctx.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        }, false);

        draw = function() {
            // Set custom context for select mode
            tmp_ctx.lineWidth = 1;
            tmp_ctx.lineJoin = 'round';
            tmp_ctx.lineCap = 'round';
            tmp_ctx.strokeStyle = 'black';
            tmp_ctx.setLineDash([5, 2]);
            tmp_ctx.fillStyle = 'black';

            // Tmp canvas is always cleared up before drawing.
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            var x = Math.min(mouse.x, start_mouse.x);
            var y = Math.min(mouse.y, start_mouse.y);
            var width = Math.abs(mouse.x - start_mouse.x);
            var height = Math.abs(mouse.y - start_mouse.y);
            tmp_ctx.strokeRect(x, y, width, height);

        };
    }

    function selectMode() {
        draw = function() {

        }
    }

    function cut() {
        window.clipboard = _canvas;
        // clear();
    }

    function paste() {
        ctx.drawImage(window.clipboard, 0, 0);
    }

    function clear() {
        ctx.clearRect(0, 0, _canvas.width, _canvas.height);
        $(tmp_canvas).remove();
        _artist[window.mode]();
    }


    //////////////////////////////////////////////////////
    //                Public Functions                  //
    //////////////////////////////////////////////////////

    return {
        init: init,
        brushMode: brushMode,
        lineMode: lineMode,
        rectangleMode: rectangleMode,
        squareMode: squareMode,
        ellipseMode: ellipseMode,
        circleMode: circleMode,
        penMode: penMode,
        selectMode: selectMode,
        setLayer: setLayer,
        addLayer: addLayer,
        cut: cut,
        paste: paste,
        clear: clear
    }

}

// create a global artist
_artist = new Artist();
_artist.canvas = document.getElementById('thecanvas');
_artist.init();