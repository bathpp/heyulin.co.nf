
function randint(n) {
	return Math.round(Math.random()*n);
}

function Paint(canvas){
	this.canvas=canvas; // The canvas this instance of Paint is working on
	this.context=this.canvas.getContext("2d");
	var tmpcanvas=document.getElementById("tmpCanvas");
	this.tmpctx = tmpcanvas.getContext('2d');
	this.tmpctx.width = this.canvas.width;
	this.tmpctx.height = this.canvas.height;
	
 	// Strategy design pattern. 
	// strategy is used to map some canvas events to operations on a command being constructed
	// change strategies to construct a SquiggleCommand, a RectangleCommand, a CircleCommand, ...
	this.strategy=null;

	// The Command design pattern
 	// a list of commands which can be used to repaint the whole canvas. 
	this.commands=[];
	
}

Paint.prototype.draw=function(){
	for(var i=0;i<this.commands.length;i++){
		this.commands[i].draw(this.context);
	}
}
Paint.prototype.undo=function(){
	// context.clearRect ( 0 , 0 , this.width , this.height ); // clear the canvas
	this.canvas.width=this.canvas.width; // clear the canvas
	this.commands.pop();
	this.draw();
}



Paint.prototype.mapToCanvas=function(e){
	// From: http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
	var rect = this.canvas.getBoundingClientRect();
	// decided I would modify the event, by adding some attributes
       e.canvasX=e.clientX - rect.left;
       e.canvasY=e.clientY - rect.top;
	return e;
}

Paint.prototype.choosestrategy=function(){
	var tmpwat =document.getElementById("whatodraw");
	var whatodraw = tmpwat.innerHTML;
	if(whatodraw=="line"){
		this.strategy=new SquiggleStrategy(this);
	}
	if(whatodraw=="rectangle"){
		this.strategy=new RectangleStrategy(this);
	}
	if(whatodraw=="oval"){
		this.strategy=new OvalStrategy(this);
	}
	if(whatodraw=="polygon"){
		this.strategy=new PolygonStrategy(this);
	}
	if(whatodraw=="erase"){
		this.strategy=new EraseStrategy(this);
	}
	
}
Paint.prototype.blur=function(){
	var i, x, y;
	
		this.context.globalAlpha=0.125;
		for (y = -1; y < 2; y++) {
			for (x = -1; x < 2; x++) {
				this.context.drawImage(this.canvas, x, y);
			}
		}	
		
		this.context.globalAlpha = 1.0;
	
	
}

/** A strategy used to capture events and construct a Squiggle command **/
function SquiggleStrategy(paint){
	this.command=null; // the current command this is building
	this.paint=paint; // the instance of paint this.command is being added to
	
}
SquiggleStrategy.prototype.mousedown=function(event){
	
	var red=document.getElementById("info-r").value;
	var green=document.getElementById("info-g").value;
	var blue=document.getElementById("info-b").value;
	var intensity=document.getElementById("intensity").value;
	var strokeStyle = 'rgba('+red+','+green+','+blue+','+intensity+')';
	var lineWidth=document.getElementById("linewidth").value;
	this.command=new SquiggleCommand(strokeStyle, lineWidth);
	this.command.addPoint({x:event.canvasX, y:event.canvasY});
	this.paint.commands.push(this.command);
}


SquiggleStrategy.prototype.mouseup=function(event){
	if(this.command!=null){
		this.command.addPoint({x:event.canvasX, y:event.canvasY});
		this.command.draw(this.paint.context);
		this.paint.tmpctx.clearRect(0, 0, this.paint.tmpctx.width, this.paint.tmpctx.height);
		this.command=null;
	}
} 

SquiggleStrategy.prototype.mousemove=function(event){
	if(this.command!=null){
		this.command.addPoint({x:event.canvasX, y:event.canvasY});
		this.command.drawtmp(this.paint.tmpctx);
	}
}

SquiggleStrategy.prototype.mouseout=function(event){
	this.mouseup(event);
}

/**------------RecStra----------------------------**/
function RectangleStrategy(paint){
	this.command=null; // the current command this is building
	this.paint=paint; // the instance of paint this.command is being added to
}
RectangleStrategy.prototype.mousedown=function(event){
	
	var red=document.getElementById("info-r").value;
	var green=document.getElementById("info-g").value;
	var blue=document.getElementById("info-b").value;
	var intensity=document.getElementById("intensity").value;
	var strokeStyle = 'rgba('+red+','+green+','+blue+','+intensity+')';
	var lineWidth=document.getElementById("linewidth").value;
	this.command=new RectangleCommand(strokeStyle, lineWidth, this.paint.tmpcanvas);
	this.command.addPoint({x:event.canvasX, y:event.canvasY});
	this.paint.commands.push(this.command);
}


RectangleStrategy.prototype.mouseup=function(event){
	if(this.command!=null){
		this.command.addPoint({x:event.canvasX, y:event.canvasY});
		this.command.draw(this.paint.context);
		this.paint.tmpctx.clearRect(0, 0, this.paint.tmpctx.width, this.paint.tmpctx.height);
		this.command=null;
	}
	
} 

RectangleStrategy.prototype.mousemove=function(event){
	if(this.command!=null){
		this.command.addPoint({x:event.canvasX, y:event.canvasY});
		this.command.drawtmp(this.paint.tmpctx);
	}
}

RectangleStrategy.prototype.mouseout=function(event){
	this.mouseup(event);
}

/**---------------------OvalStra----------------------**/
function OvalStrategy(paint){
	this.command=null; // the current command this is building
	this.paint=paint; // the instance of paint this.command is being added to
}
OvalStrategy.prototype.mousedown=function(event){
	var red=document.getElementById("info-r").value;
	var green=document.getElementById("info-g").value;
	var blue=document.getElementById("info-b").value;
	var intensity=document.getElementById("intensity").value;
	var strokeStyle = 'rgba('+red+','+green+','+blue+','+intensity+')';
	var lineWidth=document.getElementById("linewidth").value;
	this.command=new OvalCommand(strokeStyle, lineWidth, this.paint.tmpcanvas);
	this.command.addPoint({x:event.canvasX, y:event.canvasY});
	this.paint.commands.push(this.command);
}


OvalStrategy.prototype.mouseup=function(event){
	if(this.command!=null){
		this.command.addPoint({x:event.canvasX, y:event.canvasY});
		this.command.draw(this.paint.context);
		this.paint.tmpctx.clearRect(0, 0, this.paint.tmpctx.width, this.paint.tmpctx.height);
		this.command=null;
	}

	
} 

OvalStrategy.prototype.mousemove=function(event){
	if(this.command!=null){
		this.command.addPoint({x:event.canvasX, y:event.canvasY});
		this.command.drawtmp(this.paint.tmpctx);
	}
}

OvalStrategy.prototype.mouseout=function(event){
	this.mouseup(event);
}

/**--------------PolyStra-----------**/
function PolygonStrategy(paint){
	this.command=null; // the current command this is building
	this.paint=paint; // the instance of paint this.command is being added to
	this.polyx=null;
	this.polyy=null;
	this.vertex=[];
}
PolygonStrategy.prototype.mousedown=function(event){
	var red=document.getElementById("info-r").value;
	var green=document.getElementById("info-g").value;
	var blue=document.getElementById("info-b").value;
	var intensity=document.getElementById("intensity").value;
	var strokeStyle = 'rgba('+red+','+green+','+blue+','+intensity+')';
	var fillStyle = 'rgba('+red+','+green+','+blue+','+intensity+')';
	var lineWidth=document.getElementById("linewidth").value;
	
	if(event.button==0){
		this.command=new PolygonCommand(strokeStyle, lineWidth, this.paint.tmpcanvas, this.polyx, this.polyy);
		this.command.addPoint({x:event.canvasX, y:event.canvasY});
		this.paint.commands.push(this.command);
		if(this.vertex.length==0){
			this.vertex.push({x:event.canvasX, y:event.canvasY});
		}
	}
	if(event.button==1){
		if(this.vertex.length!=0){
			this.command=new ConnectCommand(strokeStyle, lineWidth, this.vertex);
			this.command.draw(this.paint.context);
			this.paint.commands.push(this.command);	
		}	
	}
	
	
}


PolygonStrategy.prototype.mouseup=function(event){
	var red=document.getElementById("info-r").value;
	var green=document.getElementById("info-g").value;
	var blue=document.getElementById("info-b").value;
	var intensity=document.getElementById("intensity").value;
	var fillStyle = 'rgba('+red+','+green+','+blue+','+intensity+')';
	var lineWidth=document.getElementById("linewidth").value;
	if(this.command!=null){
		if(event.button==0){
			this.command.addPoint({x:event.canvasX, y:event.canvasY});
			this.command.draw(this.paint.context);
			this.paint.tmpctx.clearRect(0, 0, this.paint.tmpctx.width, this.paint.tmpctx.height);
			this.command=null;
			this.polyx=event.canvasX;
			this.polyy=event.canvasY;
			this.vertex.push({x:event.canvasX, y:event.canvasY});
		}
		if(event.button==1){
			if(document.getElementById("fill").checked){
				this.command=new FillCommand(fillStyle, lineWidth, this.vertex);
				this.command.draw(this.paint.context);
				this.paint.commands.push(this.command);	
			}
			this.paint.strategy=new PolygonStrategy(this.paint);
		}
	}
	
} 

PolygonStrategy.prototype.mousemove=function(event){
	if(this.command!=null){
		if(event.button==0){
			this.command.addPoint({x:event.canvasX, y:event.canvasY});
			this.command.drawtmp(this.paint.tmpctx);
		}
	}
}

PolygonStrategy.prototype.mouseout=function(event){
	this.mouseup(event);
}

/**---------EraseStra-----------**/
function EraseStrategy(paint){
	this.command=null; // the current command this is building
	this.paint=paint; // the instance of paint this.command is being added to
	
}

EraseStrategy.prototype.mousedown=function(event){
	
	var red=255;
	var green=255;;
	var blue=255;
	var intensity=1;
	var strokeStyle = 'rgba('+red+','+green+','+blue+','+intensity+')';
	var eraseWidth=document.getElementById("erasewidth").value;
	this.command=new SquiggleCommand(strokeStyle, eraseWidth);
	this.command.addPoint({x:event.canvasX, y:event.canvasY});
	this.paint.commands.push(this.command);
}


EraseStrategy.prototype.mouseup=function(event){
	if(this.command!=null){
		this.command.addPoint({x:event.canvasX, y:event.canvasY});
		this.command.draw(this.paint.context);
		this.paint.tmpctx.clearRect(0, 0, this.paint.tmpctx.width, this.paint.tmpctx.height);
		this.command=null;
	}
} 

EraseStrategy.prototype.mousemove=function(event){
	if(this.command!=null){
		this.command.addPoint({x:event.canvasX, y:event.canvasY});
		this.command.drawtmp(this.paint.tmpctx);
	}
}

EraseStrategy.prototype.mouseout=function(event){
	this.mouseup(event);
}

//--------Line command-------------
function SquiggleCommand(strokeStyle, lineWidth){
	this.strokeStyle=strokeStyle;
	this.lineWidth=lineWidth;
	this.points=[];
}
SquiggleCommand.prototype.addPoint=function(point){
	this.points.push(point);
}

SquiggleCommand.prototype.draw=function(context){
	// All commands understand draw, paint may ask us to do this.

	if(this.points.length==0){
		return;
	}
	context.beginPath(); 
	context.strokeStyle = this.strokeStyle;
	context.lineWidth=this.lineWidth;
	context.moveTo(this.points[0].x,this.points[0].y);
	for(var i=1;i<this.points.length;i++){
		context.lineTo(this.points[i].x, this.points[i].y);
	}
	context.stroke();
}
SquiggleCommand.prototype.drawtmp=function(tmpcontext){
	tmpcontext.clearRect(0, 0, tmpcontext.width, tmpcontext.height);
	this.draw(tmpcontext);
	
}


//-------Rectangle Command-----------
function RectangleCommand(strokeStyle, lineWidth, tmpcanvas){
	this.strokeStyle=strokeStyle;
	this.lineWidth=lineWidth;
	this.points=[];
	this.tmpcanvas=tmpcanvas;
}
RectangleCommand.prototype.addPoint=function(point){
	this.points.push(point);
}

RectangleCommand.prototype.draw=function(context){
	context.strokeStyle = this.strokeStyle;
	context.lineWidth=this.lineWidth;
	var x0 = this.points[0].x;
	var y0 = this.points[0].y;
	var x1 = this.points[this.points.length-1].x;
	var y1 = this.points[this.points.length-1].y;
	var x = Math.min(x0, x1);
	var y = Math.min(y0, y1);
	var width = Math.abs(x0-x1);
	var height = Math.abs(y0-y1);
	context.strokeRect(x, y, width, height);
}
RectangleCommand.prototype.drawtmp=function(tmpcontext){
		tmpcontext.clearRect(0, 0, tmpcontext.width, tmpcontext.height);
		this.draw(tmpcontext);

}

//---------Oval command----------------------
function OvalCommand(strokeStyle, lineWidth, tmpcanvas){
	this.strokeStyle=strokeStyle;
	this.lineWidth=lineWidth;
	this.points=[];
	this.tmpcanvas=tmpcanvas;
}
OvalCommand.prototype.addPoint=function(point){
	this.points.push(point);
}
//I Got this method from Stackoverflow
OvalCommand.prototype.draw=function(context){
	context.strokeStyle = this.strokeStyle;
	context.lineWidth=this.lineWidth;
	var x0 = this.points[0].x;
	var y0 = this.points[0].y;
	var x1 = this.points[this.points.length-1].x;
	var y1 = this.points[this.points.length-1].y;
	var x = Math.min(x0, x1);
	var y = Math.min(y0, y1);	
	var w = Math.abs(x1 - x0);
	var h = Math.abs(y1 - y0);
	var kappa = .5522848,
	ox = (w / 2) * kappa, // control point offset horizontal
    oy = (h / 2) * kappa, // control point offset vertical
    xe = x + w,           // x-end
    ye = y + h,           // y-end
    xm = x + w / 2,       // x-middle
    ym = y + h / 2;       // y-middle
		
	context.beginPath();
	context.moveTo(x, ym);
	context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	context.closePath();
	context.stroke();
	
}
OvalCommand.prototype.drawtmp=function(tmpcontext){
	tmpcontext.clearRect(0, 0, tmpcontext.width, tmpcontext.height);
	this.draw(tmpcontext);	
}

//-------Polygon command------------
function PolygonCommand(strokeStyle, lineWidth, tmpcanvas, polyx, polyy){
	this.polyx=polyx;
	this.polyy=polyy;
	this.strokeStyle=strokeStyle;
	this.lineWidth=lineWidth;
	this.points=[];
	this.tmpcanvas=tmpcanvas;
}
PolygonCommand.prototype.addPoint=function(point){
	this.points.push(point);
}

PolygonCommand.prototype.draw=function(context){
	context.strokeStyle = this.strokeStyle;
	context.lineWidth=this.lineWidth;
	context.lineJoin = 'round';
	context.lineCap = 'round';
	if(this.polyx==null){
		var x0=this.points[0].x;
		var y0=this.points[0].y;
	}
	else{
		var x0 = this.polyx;
		var y0 = this.polyy;
	}
	var x1 = this.points[this.points.length-1].x;
	var y1 = this.points[this.points.length-1].y;
	context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
}
PolygonCommand.prototype.drawtmp=function(tmpcontext){
	tmpcontext.clearRect(0, 0, tmpcontext.width, tmpcontext.height);
	this.draw(tmpcontext);	
}

//----------FillCommand--------------
function FillCommand(fillStyle, lineWidth, vertex){
	this.fillStyle=fillStyle;
	this.lineWidth=lineWidth;
	this.vertex=vertex;
}


FillCommand.prototype.draw=function(context){
	context.fillStyle = this.fillStyle;
	context.lineWidth=this.lineWidth;
	
	context.beginPath(); 
	context.moveTo(this.vertex[0].x, this.vertex[0].y);
	for(var i=1;i<this.vertex.length;i++){
		context.lineTo(this.vertex[i].x, this.vertex[i].y);
	}
	context.closePath();
	context.fill();
    
}


//-------ConnectCommand--------------
function ConnectCommand(strokeStyle, lineWidth, vertex){
	this.strokeStyle=strokeStyle;
	this.lineWidth=lineWidth;
	this.vertex=vertex;
	
}

ConnectCommand.prototype.draw=function(context){
	context.fillStyle = this.fillStyle;
	context.lineWidth=this.lineWidth;
	
	context.beginPath(); 
	context.moveTo(this.vertex[0].x, this.vertex[0].y);
	context.lineTo(this.vertex[this.vertex.length-1].x, this.vertex[this.vertex.length-1].y);
	//context.closePath();
	context.stroke();
    
}


function ol(){

	var canvas=document.getElementById("theCanvas");
	var tmpcanvas=document.getElementById("tmpCanvas");
	paint=new Paint(canvas);	
	paint.choosestrategy();	
	
	tmpcanvas.addEventListener("mousedown", function(event){ paint.strategy.mousedown(paint.mapToCanvas(event)); }, false);
	tmpcanvas.addEventListener("mouseup",   function(event){ paint.strategy.mouseup(paint.mapToCanvas(event)); }, false);
	tmpcanvas.addEventListener("mousemove", function(event){ paint.strategy.mousemove(paint.mapToCanvas(event)); }, false);
	tmpcanvas.addEventListener("mouseout",  function(event){ paint.strategy.mouseout(paint.mapToCanvas(event)); }, false);

	// canvas.addEventListener("mouseout",  paint.strategy.mouseout,  false);
}
