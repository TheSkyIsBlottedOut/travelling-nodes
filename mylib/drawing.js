var CANVAS_HEIGHT = 600;
var CANVAS_WIDTH = 800;
var mycanvas = Raphael("drawing", CANVAS_WIDTH, CANVAS_HEIGHT)
mycanvas.line = function(x1, y1, x2, y2){
	return this.path('M' + x1 + ',' + y1 + 'L' + x2 + ',' + y2);
}

function Circle(){
	this.x = (Math.random() * (CANVAS_WIDTH - 50)) + 50;
	this.y = (Math.random() * (CANVAS_HEIGHT - 50)) + 50;
	this.radius = (Math.random() * 50) + 25;
	this.direction = (Math.random() * 360);
	this.speed = 1;
	this.predictability = 0.9;
	this.red = 128;
	this.green = 128;
	this.blue = 128;
	
	this.check_bounces = function(){
		if (this.out_of_bounds()) this.direction = ((this.direction + 180) % 360);
	}
	
	this.connect = function(list){
		var neighbors = this.seek_neighbors(list);
		for (i in neighbors){
			mycanvas.line(this.x, this.y, neighbors[i].x, neighbors[i].y).attr({stroke: "#fff", 'stroke-width': 5});
		}
	}
	this.decide_movement_vector = function(){
		// Randomly veer in directions, sometimes, for fun
		if (Math.random() > this.predictability){
			this.direction = (this.direction + ((Math.random() - 0.5) * 2) % 360);
		}
		if (true){
			this.red = this.red + parseInt((Math.random() - 0.5) * 5) % 255;
			this.green = this.green + parseInt((Math.random() - 0.5) * 5) % 255;
			this.blue = this.blue + parseInt((Math.random() - 0.5) * 5) % 255;
		}
		if (Math.random() > this.predictability) this.predictability = Math.random();
	}
	
	this.display = function(){
		var color = this.generate_color(this.red, this.green, this.blue);
		console.log(color);
		mycanvas.circle(this.x, this.y, this.radius).attr({fill: color, 'stroke-width': 5, stroke: "#ddd"})
	}
	this.distance = function(x2, y2){
		return Math.sqrt(Math.pow((x2 - this.x), 2) + Math.pow((y2 - this.y), 2))
	}
	
	this.generate_color = function(){
		retval = '#'
		for (i in arguments){
			var l = arguments[i].toString(16);
			if (l.length < 2) l = '0' + l;
			retval += l
		}
		return retval;
	}
	
	this.out_of_bounds = function(){
		return (this.x < 0 || this.x > CANVAS_WIDTH || this.y < 0 || this.y > CANVAS_HEIGHT);
	}
	
	this.seek_neighbors = function(potential_neighbors){
		retval = [];
		for (i in potential_neighbors){
			var distance = this.distance(potential_neighbors[i].x, potential_neighbors[i].y);
			if (distance < 500) retval.push(potential_neighbors[i]);
		}
		return retval;
	}
	this.travel = function(){
		this.x += Math.cos(this.direction) * this.speed;
		this.y += Math.sin(this.direction) * this.speed;
		this.decide_movement_vector();
		this.check_bounces();
	}
}

function NodeMap(){
	this.circles = {
		buffer: [],
		add: function(){ this.buffer.push(new Circle()); },
		display: function(){for(i in this.buffer) this.buffer[i].display();},
		display_nodes: function(){ for(i in this.buffer) this.buffer[i].connect(this.buffer);},
		travel: function(){ for (i in this.buffer) this.buffer[i].travel(); }
	}
	
	this.blit = function(){
		mycanvas.clear();
		this.circles.travel();
		this.circles.display_nodes();
		this.circles.display();
	}
}

var node = new NodeMap();
for (x=1;x<10;x++) node.circles.add();

function main(){
	setTimeout("main()", 100);
	node.blit();
}

main();