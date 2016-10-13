max_fps = 60;
running = false;

n_points = 500;
graph_canvas = document.getElementById("canvas1");

graph_canvas.width = document.body.clientWidth;
graph_canvas.height = document.body.clientHeight;
canvas_context = graph_canvas.getContext("2d");
console.log(graph_canvas.width, graph_canvas.height);
start_x = -(graph_canvas.width)/2/10;
end_x = (graph_canvas.width)/2/10;
start_y = -(graph_canvas.height)/2/10;
end_y = (graph_canvas.height)/2/10;

present_time = 0;
function start_pressed(){
	running = true;
}
function stop_pressed() {
	running = false;
}

function create_function(expr) {
	if(expr == "")
		return function() { return 0; }
	return function(x, t) {
		with(Math){
			try{
				return eval(expr);
			} catch(err) {
				// TODO: Show an error to the user
				return;
			}
		}
	}
}

function plot(expr, timestamp, color) {
	func = create_function(expr);
	present_time = timestamp/100;
	canvas_context.fillStyle=color;
	for(i=0;i<=graph_canvas.width;i++){
		x = i*(end_x-start_x)/graph_canvas.width+start_x;
		y = func(x, present_time);
		if (isNaN(y)) {
			continue;
		}
		plot_x = Math.round((x-start_x)/(end_x-start_x)*graph_canvas.width);
		plot_y = Math.round(graph_canvas.height-(y-start_y)/(end_y-start_y)*graph_canvas.height);
		canvas_context.fillRect(plot_x, plot_y, 1, 1);
	}
	
}

function draw_frame(timestamp) {
	canvas_context.clearRect(0,0,graph_canvas.width, graph_canvas.height);
	expr = document.getElementById("expression1").value;
	plot(expr, timestamp,"red");
}

last_time = 0;
function update_fps(timestamp){
	fps = Math.round(1000/(timestamp-last_time));
	document.getElementById("fps_meter").innerHTML = fps + " fps, "+n_points + " points" ;
}
function frame_driver(timestamp){
	if(timestamp < last_time + (1000/max_fps)){
		requestAnimationFrame(frame_driver);
		return;
	}
	if(running || canvas_held){
		if(canvas_held)
			update_bounds();
		draw_frame(timestamp);
	}
	update_fps(timestamp);
	last_time = timestamp;
	requestAnimationFrame(frame_driver);
}


window.onresize=function(width, height){
	graph_canvas.width = document.body.clientWidth;
	graph_canvas.height = document.body.clientHeight;
	start_x = -(graph_canvas.width)/2/10;
	end_x = (graph_canvas.width)/2/10;
	start_y = -(graph_canvas.height)/2/10;
	end_y = (graph_canvas.height)/2/10;
}

requestAnimationFrame(frame_driver);


curr_mouse_x=0;
curr_mouse_y=0;
window.onmousemove=function(event){
	curr_mouse_x = event.screenX;
	curr_mouse_y = event.screenY;
}

canvas_down_x=0;
canvas_down_y=0;
canvas_down_start_x=0;
canvas_down_start_y=0;
canvas_down_end_x=0;
canvas_down_end_y=0;
canvas_held = false;
graph_canvas.onmousedown = function(event){
	canvas_down_x = curr_mouse_x;
	canvas_down_y = curr_mouse_y;
	canvas_down_start_x = start_x;
	canvas_down_start_y = start_y;
	canvas_down_end_x = end_x;
	canvas_down_end_y = end_y;
	canvas_held = true;
}

function update_bounds(){
	delta_x = curr_mouse_x - canvas_down_x;
	delta_y = curr_mouse_y - canvas_down_y;
	delta_x *= (canvas_down_end_x - canvas_down_start_x)/graph_canvas.width;
	delta_y *= (canvas_down_end_y - canvas_down_start_y)/graph_canvas.height;
	start_x = canvas_down_start_x - delta_x;
	start_y = canvas_down_start_y + delta_y;
	end_x = canvas_down_end_x - delta_x;
	end_y = canvas_down_end_y + delta_y;
}

graph_canvas.onmouseup = function(event){
	update_bounds();
	canvas_held = false;
}