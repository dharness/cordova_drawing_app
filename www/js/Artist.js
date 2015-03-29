function Artist(canvas) {

    this.mode = 'select';
    ctx = canvas.getContext("2d");
    mouse = {
        x: 0,
        y: 0
    };

    canvas.addEventListener('mousemove', function(e) {
        mouse.x = e.layerX;
        mouse.y = e.layerY;
    }, false);

    function brushMode() {

        var tmp_canvas = document.getElementById('tmp_canvas');
        var sketch = document.querySelector('#sketch');

        // Creating a tmp canvas if there isnt one
        if (!tmp_canvas) {
            var canvasRect = canvas.getBoundingClientRect();
            var tmp_canvas = $(canvas).clone()[0];
            tmp_canvas.id = 'tmp_canvas';
            tmp_canvas.style.position = 'absolute';
            // tmp_canvas.style.zIndex = '16000';
            tmp_canvas.style.background = 'transparent';
            tmp_canvas.style.top = $(canvas).position().top;
            tmp_canvas.style.left = $(canvas).position().left;

            // var tmp_canvas = document.getElementById('tmp_canvas');
            var tmp_ctx = tmp_canvas.getContext('2d');
            // tmp_canvas.id = 'tmp_canvas';
            tmp_canvas.width = canvas.width;
            tmp_canvas.height = canvas.height;

            sketch.appendChild(tmp_canvas);
        }


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


        var colours = document.getElementsByName('colours')[0];
        /* Drawing on Paint App */
        tmp_ctx.lineWidth = 5;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = colours.options[colours.options.selectedIndex].text;
        tmp_ctx.fillStyle = colours.options[colours.options.selectedIndex].text;

        tmp_canvas.addEventListener('mousedown', function(e) {
            tmp_canvas.addEventListener('mousemove', onPaint, false);

            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            ppts.push({
                x: mouse.x,
                y: mouse.y
            });

            onPaint();
        }, false);

        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', onPaint, false);

            // Writing down to real canvas now
            ctx.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            // Emptying up Pencil Points
            ppts = [];
        }, false);

        var onPaint = function() {

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
        var tmp_canvas = document.getElementById('tmp_canvas');
        var sketch = document.querySelector('#sketch');

        // Creating a tmp canvas if there isnt one
        if (!tmp_canvas) {
            var canvasRect = canvas.getBoundingClientRect();
            var tmp_canvas = $(canvas).clone()[0];
            tmp_canvas.id = 'tmp_canvas';
            tmp_canvas.style.position = 'absolute';
            // tmp_canvas.style.zIndex = '16000';
            tmp_canvas.style.background = 'transparent';
            tmp_canvas.style.top = $(canvas).position().top;
            tmp_canvas.style.left = $(canvas).position().left;

            // var tmp_canvas = document.getElementById('tmp_canvas');
            var tmp_ctx = tmp_canvas.getContext('2d');
            // tmp_canvas.id = 'tmp_canvas';
            tmp_canvas.width = canvas.width;
            tmp_canvas.height = canvas.height;

            sketch.appendChild(tmp_canvas);
        }

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

        var colours = document.getElementsByName('colours')[0];
        /* Drawing on Paint App */
        tmp_ctx.lineWidth = 5;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = colours.options[colours.options.selectedIndex].text;
        tmp_ctx.fillStyle = colours.options[colours.options.selectedIndex].text;



        tmp_canvas.addEventListener('mousedown', function(e) {
            tmp_canvas.addEventListener('mousemove', onPaint, false);

            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            start_mouse.x = mouse.x;
            start_mouse.y = mouse.y;

            onPaint();
        }, false);

        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', onPaint, false);

            // Writing down to real canvas now
            ctx.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        }, false);

        var onPaint = function() {

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
        var tmp_canvas = document.getElementById('tmp_canvas');
        var sketch = document.querySelector('#sketch');

        // Creating a tmp canvas if there isnt one
        if (!tmp_canvas) {
            var canvasRect = canvas.getBoundingClientRect();
            var tmp_canvas = $(canvas).clone()[0];
            tmp_canvas.id = 'tmp_canvas';
            tmp_canvas.style.position = 'absolute';
            // tmp_canvas.style.zIndex = '16000';
            tmp_canvas.style.background = 'transparent';
            tmp_canvas.style.top = $(canvas).position().top;
            tmp_canvas.style.left = $(canvas).position().left;

            // var tmp_canvas = document.getElementById('tmp_canvas');
            var tmp_ctx = tmp_canvas.getContext('2d');
            // tmp_canvas.id = 'tmp_canvas';
            tmp_canvas.width = canvas.width;
            tmp_canvas.height = canvas.height;

            sketch.appendChild(tmp_canvas);
        }

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



        var colours = document.getElementsByName('colours')[0];
        /* Drawing on Paint App */
        tmp_ctx.lineWidth = 5;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = colours.options[colours.options.selectedIndex].text;
        tmp_ctx.fillStyle = colours.options[colours.options.selectedIndex].text;

        tmp_canvas.addEventListener('mousedown', function(e) {
            tmp_canvas.addEventListener('mousemove', onPaint, false);

            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            start_mouse.x = mouse.x;
            start_mouse.y = mouse.y;

            onPaint();
        }, false);

        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', onPaint, false);

            // Writing down to real canvas now
            ctx.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        }, false);

        var onPaint = function() {

            // Tmp canvas is always cleared up before drawing.
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            var x = Math.min(mouse.x, start_mouse.x);
            var y = Math.min(mouse.y, start_mouse.y);
            var width = Math.abs(mouse.x - start_mouse.x);
            var height = Math.abs(mouse.y - start_mouse.y);
            tmp_ctx.strokeRect(x, y, width, height);

        };

    }

    function ellipseMode() {

        var tmp_canvas = document.getElementById('tmp_canvas');
        var sketch = document.querySelector('#sketch');

        // Creating a tmp canvas if there isnt one
        if (!tmp_canvas) {
            var canvasRect = canvas.getBoundingClientRect();
            var tmp_canvas = $(canvas).clone()[0];
            tmp_canvas.id = 'tmp_canvas';
            tmp_canvas.style.position = 'absolute';
            // tmp_canvas.style.zIndex = '16000';
            tmp_canvas.style.background = 'transparent';
            tmp_canvas.style.top = $(canvas).position().top;
            tmp_canvas.style.left = $(canvas).position().left;

            // var tmp_canvas = document.getElementById('tmp_canvas');
            var tmp_ctx = tmp_canvas.getContext('2d');
            // tmp_canvas.id = 'tmp_canvas';
            tmp_canvas.width = canvas.width;
            tmp_canvas.height = canvas.height;

            sketch.appendChild(tmp_canvas);
        }
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


        var colours = document.getElementsByName('colours')[0];
        /* Drawing on Paint App */
        tmp_ctx.lineWidth = 5;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = colours.options[colours.options.selectedIndex].text;
        tmp_ctx.fillStyle = colours.options[colours.options.selectedIndex].text;

        tmp_canvas.addEventListener('mousedown', function(e) {
            tmp_canvas.addEventListener('mousemove', onPaint, false);

            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            start_mouse.x = mouse.x;
            start_mouse.y = mouse.y;

            onPaint();
        }, false);

        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', onPaint, false);

            // Writing down to real canvas now
            ctx.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        }, false);

        var onPaint = function() {

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
        var tmp_canvas = document.getElementById('tmp_canvas');
        var sketch = document.querySelector('#sketch');

        // Creating a tmp canvas if there isnt one
        if (!tmp_canvas) {
            var canvasRect = canvas.getBoundingClientRect();
            var tmp_canvas = $(canvas).clone()[0];
            tmp_canvas.id = 'tmp_canvas';
            tmp_canvas.style.position = 'absolute';
            // tmp_canvas.style.zIndex = '16000';
            tmp_canvas.style.background = 'transparent';
            tmp_canvas.style.top = $(canvas).position().top;
            tmp_canvas.style.left = $(canvas).position().left;

            // var tmp_canvas = document.getElementById('tmp_canvas');
            var tmp_ctx = tmp_canvas.getContext('2d');
            // tmp_canvas.id = 'tmp_canvas';
            tmp_canvas.width = canvas.width;
            tmp_canvas.height = canvas.height;

            sketch.appendChild(tmp_canvas);
        }

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


        var colours = document.getElementsByName('colours')[0];
        /* Drawing on Paint App */
        tmp_ctx.lineWidth = 5;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = colours.options[colours.options.selectedIndex].text;
        tmp_ctx.fillStyle = colours.options[colours.options.selectedIndex].text;

        tmp_canvas.addEventListener('mousedown', function(e) {
            tmp_canvas.addEventListener('mousemove', onPaint, false);

            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            start_mouse.x = mouse.x;
            start_mouse.y = mouse.y;

            onPaint();
        }, false);

        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', onPaint, false);

            // Writing down to real canvas now
            ctx.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        }, false);

        var onPaint = function() {

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

    function squareMode() {

    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function swapToolFor(newTool) {
        _artist['draw' + newTool]();
    }


    return {
        brushMode: brushMode,
        lineMode: lineMode,
        rectangleMode: rectangleMode,
        ellipseMode: ellipseMode,
        clear: clear,
        swapToolFor: swapToolFor
    }

}

_artist = new Artist(document.getElementById('thecanvas'));
// _artist.drawBrush();