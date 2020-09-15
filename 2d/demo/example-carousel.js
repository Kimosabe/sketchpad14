
Examples.corousel = { }

// --- Constraint Defs -------------------------------------------------------

function ClippingBox(x, y, w, h) {
    this.position = new Point(x, y);
    this.width = w;
    this.height = h;
}

sketchpad.addClass(ClippingBox);

ClippingBox.prototype.draw = function(canvas, origin, options) {
    var context = canvas.ctxt;
    context.beginPath();
    context.rect(this.position.x, this.position.y, this.width, this.height);
    context.clip();
}

examples['carousel'] = function() {

    // --- Data ----------------------------------------------------------------
    var values = {
        spacing: 20,
        currentIndex: 0,
        startingX: 600,
        solutionJoins: function() {
            return {
                currentIndex: function(curr, solutions) {
                    var newValue = Math.round(solutions[0]);
                    if (newValue < -3)
                        newValue = -3;
                    else if (newValue > 0)
                        newValue = 0;
                    return newValue;
                },
            }
        },
    };

    rc.add(new ClippingBox(600, 300, 60*3 + values.spacing*2, 40));

    var leftButton = rc.add(new TextBox(new Point(580, 400), "<", false, 20, 20, 40, '#CCCCCC'));
    var elem1 = rc.add(new TextBox(new Point(600, 300), "elem1", false, 20, 60, 40, '#f6ceec'));
    var elem2 = rc.add(new TextBox(new Point(680, 300), "elem2", false, 20, 60, 40, '#f6ceec'));
    var elem3 = rc.add(new TextBox(new Point(760, 300), "elem3", false, 20, 60, 40, '#f6ceec'));
    var elem4 = rc.add(new TextBox(new Point(770, 300), "elem4", false, 20, 60, 40, '#f6ceec'));
    var elem5 = rc.add(new TextBox(new Point(780, 300), "elem5", false, 20, 60, 40, '#f6ceec'));
    var rightButton = rc.add(new TextBox(new Point(780, 400), ">", false, 20, 20, 40, '#CCCCCC'));

    var elems = new Set([elem1, elem2, elem3, elem4, elem5]);


    // --- Constraints ---------------------------------------------------------
    var indices = [3]
    var soft = undefined;
    //var hard = rc.addConstraint(Sketchpad.arith.SumRelation, undefined,  {obj: values, prop: 'startingX'},  {obj: values, prop: 'currentIndex'}, {obj: elem1.position, prop: 'x'}, [3], 1, 80, 1, 0);
    var hard = rc.addConstraint(Sketchpad.arith.SumRelation, undefined,  {obj: values, prop: 'startingX'},  {obj: values, prop: 'currentIndex'}, {obj: elem1.position, prop: 'x'}, indices, 1, 80, 1, 0);
    rc.addConstraint(Sketchpad.arith.SumRelation, undefined,  {obj: elem1, prop: 'width'},  {obj: elem1.position, prop: 'x'}, {obj: elem2.position, prop: 'x'}, [2, 3], 1, 1, 1, -values.spacing);
    rc.addConstraint(Sketchpad.arith.SumRelation, undefined,  {obj: elem2, prop: 'width'},  {obj: elem2.position, prop: 'x'}, {obj: elem3.position, prop: 'x'}, [2, 3], 1, 1, 1, -values.spacing);
    rc.addConstraint(Sketchpad.arith.SumRelation, undefined,  {obj: elem3, prop: 'width'},  {obj: elem3.position, prop: 'x'}, {obj: elem4.position, prop: 'x'}, [2, 3], 1, 1, 1, -values.spacing);
    rc.addConstraint(Sketchpad.arith.SumRelation, undefined,  {obj: elem4, prop: 'width'},  {obj: elem4.position, prop: 'x'}, {obj: elem5.position, prop: 'x'}, [2, 3], 1, 1, 1, -values.spacing);


    // --- Time / Event Handling ---------------------------------------------
    sketchpad.registerEvent('pointerdown', function(e) {
    	if (rc.selection == leftButton) {
            if (values.currentIndex <= -3)
                values.currentIndex = 0;
            else
                values.currentIndex -= 1;
    	    rc.redraw();
    	} else if (rc.selection == rightButton) {
            if (values.currentIndex === 0)
                values.currentIndex = -3;
            else
                values.currentIndex += 1;
            rc.redraw();
        } else if (elems.has(rc.selection)) {
            indices.length = 2;
            indices[0] = 2;
            indices[1] = 3;
            /*rc.removeConstraint(hard);
            soft = rc.addConstraint(Sketchpad.arith.SumRelation, undefined,  {obj: values, prop: 'startingX'},  {obj: values, prop: 'currentIndex'}, {obj: elem1.position, prop: 'x'}, [2, 3], 1, 80, 1, 0);*/
        }
    })

    sketchpad.registerEvent('pointerup', function(e) {
        if (indices.length === 2) {
            indices.length = 1;
            indices[0] = 3;
        }
        if (soft) {
            /*rc.removeConstraint(soft);
            soft = undefined;
            hard = rc.addConstraint(Sketchpad.arith.SumRelation, undefined,  {obj: values, prop: 'startingX'},  {obj: values, prop: 'currentIndex'}, {obj: elem1.position, prop: 'x'}, [3], 1, 80, 1, 0);*/
        }
    });
}

