(function() {

    window.validate = {
        size: function(id, form, min, max) {
            var element = $("#"+id, form);
            var size = parseInt(element.val());
            if (isNaN(size) || size < min || size > max) {
                element.addClass("error");
                size = null;
            } else {
                element.removeClass("error");
            }
            return size;
        },

        real: function(id, form, min, max) {
            var element = $("#"+id, form);
            var size = parseFloat(element.val());
            if (isNaN(size) || size < min || size > max) {
                element.addClass("error");
                size = null;
            } else {
                element.removeClass("error");
            }
            return size;
        },

        color: function(id, form) {
            var element = $("#"+id, form);
            var color = element.val();
            // TODO: Validate that it is correct.
            return color;
        },

        font: function(id, form) {
            var element = $("#"+id, form);
            var font = element.val();
            // TODO: Validate that it is correct.
            return font;
        }
    }

    window.footerCopyright = function(c, w, h, copyright) {
        if (copyright) {
            var textHeight = 10;
            if (h < 20) textHeight = h*0.5;

            c.font = "" + textHeight + "px sans-serif";
            c.fillStyle = "rgba(0,0,0,0.5)";
            c.fillText(copyright, w*0.5, h-1);
            c.fillStyle = "rgba(255,255,255,0.25)";
            c.fillText(copyright, w*0.5, h-1);
        }
    };

})();    
(function() {
        var createCanvas = function() {
            var controls = $("#controls");
            var canvas = $("#output").get(0);
            var c = canvas.getContext('2d');

            // Find the size.
            var w = validate.size("width", controls, 0, 5000);
            var h = validate.size("height", controls, 0, 5000);
            var points = validate.size("points", controls, 3, 1000);
            var burstX = validate.size("burstX", controls, -5000, 10000);
            var burstY = validate.size("burstY", controls, -5000, 10000);
            var bg = validate.color("background", controls);
            var center = validate.color("center", controls);
            var tip = validate.color("tip", controls);
            var copyright = $("#copyright", controls).val();
            if (w === null || h === null || points === null ||
                burstX === null || burstY === null || center === null ||
                tip === null || bg === null) {
                return;
            }

            // Set the size.
            $(canvas).attr("width", w);
            $(canvas).attr("height", h);

            // Set global configuration
            c.textAlign = "center";
            c.textBaseline = "bottom";

            // Fill the background
            c.fillStyle = bg;
            c.fillRect(0, 0, w, h);

            // Add the burst
            var d = function(x, y) {
                x -= burstX; y -= burstY;
                return Math.sqrt(x*x+y*y);
            };
            var ds = [d(0,0), d(w,0), d(w,h), d(0,h)];
            ds.sort(function(a,b) { return a-b; })

            var gradient = c.createRadialGradient(
                burstX, burstY, 0, burstX, burstY, ds[1]
            );
            gradient.addColorStop(0, center);
            gradient.addColorStop(1, tip);
            c.fillStyle = gradient;

            var r = ds[3];
            c.beginPath();
            var perPoint = Math.PI/points
            var theta = perPoint*0.5;
            for (var i = 0; i < points; i++) {
                c.moveTo(burstX, burstY);
                c.lineTo(burstX+Math.sin(theta)*r, burstY+Math.cos(theta)*r);
                theta += perPoint;
                c.lineTo(burstX+Math.sin(theta)*r, burstY+Math.cos(theta)*r);
                c.closePath();
                theta += perPoint;
            }
            c.fill();

            // Add the copyright
            footerCopyright(c, w, h, copyright);

            // Save the result
            $("#result").attr("href", canvas.toDataURL());
        };

        $(function() {
            createCanvas();
            $("#controls").submit(function(event) {
                event.preventDefault();
                event.stopPropagation();
                createCanvas();
                return false;
            });
            $("#output").click(function(event) {
                var canvasPos = $("#output").offset();
                var controls = $("#controls");
                                console.info(event);
                $("#burstX", controls).val(event.pageX - canvasPos.left);
                $("#burstY", controls).val(event.pageY - canvasPos.top);
                controls.submit();
            });
        });
    })();
