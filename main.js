let canvas = new fabric.Canvas("canvas", {
  width: window.innerWidth,
  height: window.innerHeight,
});

let addingLineBtn = document.getElementById("adding-line-button");
let addingLineBtnClicked = false;

addingLineBtn.addEventListener("click", activateAddingLine);

function activateAddingLine() {
  if (addingLineBtnClicked === false) {
    addingLineBtnClicked = true;
    //events for adding connecting lines on mouse
    canvas.on("mouse:down", startAddingLine);
    canvas.on("mouse:move", startDrawingLine);
    canvas.on("mouse:up", stopDrawingLine);
    canvas.selection = false;
    canvas.hoverCursor = "auto";
    objectSelectability("added-line", false);
  }
}
let line;
let mouseDown = false;

function startAddingLine(o) {
  mouseDown = true;
  let pointer = canvas.getPointer(o.e);

  line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
    id: "added-line",
    stroke: "orange",
    strokeWidth: 3,
    selectable: false,
  });
  canvas.add(line);
  canvas.requestRenderAll();
}

function startDrawingLine(o) {
  if (mouseDown === true) {
    let pointer = canvas.getPointer(o.e);
    line.set({
      x2: pointer.x,
      y2: pointer.y,
    });
    canvas.requestRenderAll();
  }
}

function stopDrawingLine() {
  line.setCoords(); //for selecting the line
  mouseDown = false;
}

let deacativateAddingShapeBtn = document.getElementById(
  "deactivate-adding-shape-btn"
);

deacativateAddingShapeBtn.addEventListener("click", deacativateAddingShape);

function deacativateAddingShape() {
  //for off the events
  canvas.off("mouse:down", startAddingLine);
  canvas.off("mouse:move", startDrawingLine);
  canvas.off("mouse:up", stopDrawingLine);

  objectSelectability("added-line", true);

  canvas.hoverCursor = "all-scroll";
  addingLineBtnClicked = false;
}

function objectSelectability(id, value) {
  canvas.getObjects().forEach((o) => {
    if (o.id === id) {
      o.set({
        selectable: value,
      });
    }
  });
}

canvas.on({
  "object:moved": updateNewLineCoordinates,
  // "selection:created": updateNewLineCoordinates,
  // "selecttion:updated": updateNewLineCoordinates,
  "mouse:dblclick": addingControlPoints,
});

// canvas.on("mouse:dblclick", addingControlPoints);
// canvas.on("object:moved", updateNewLineCoordinates);

let newLineCoords = {};

function updateNewLineCoordinates(o) {
  let obj = o.target;

  if (obj.id === "added-line") {
    let centerX = obj.getCenterPoint().x;
    let centerY = obj.getCenterPoint().y;

    let x1offset = obj.calcLinePoints().x1;
    let y1offset = obj.calcLinePoints().y1;
    let x2offset = obj.calcLinePoints().x2;
    let y2offset = obj.calcLinePoints().y2;

    newLineCoords = {
      x1: centerX + x1offset,
      y1: centerY + y1offset,
      x2: centerX + x2offset,
      y2: centerY + y2offset,
    };
  }
}

function addingControlPoints(o) {
  let obj = o.target;

  if (!obj) {
    return;
  } else {
    if (obj.id === "added-line") {
      let pointer1 = new fabric.Circle({
        radius: obj.strokeWidth * 3,
        fill: "blue",
        opacity: 0.5,
        top: obj.y1,
        left: obj.x1,
        originX: "center", //seting line starting from mid of circle
        originY: "center",
      });

      let pointer2 = new fabric.Circle({
        radius: obj.strokeWidth * 3,
        fill: "blue",
        opacity: 0.5,
        top: obj.y2,
        left: obj.x2,
        originX: "center",
        originY: "center",
      });

      canvas.add(pointer1, pointer2);
      canvas.requestRenderAll();
    }
  }
}
