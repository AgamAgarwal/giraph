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

	first_point = true;
	canvas_context.beginPath();
	canvas_context.moveTo(0,0);
	for(i=start_x;i<=end_x;i+=(end_x-start_x)/n_points){
		x = i;
		y = func(x, present_time);
		if (isNaN(y)) {
			continue;
		}
		plot_x = (x-start_x)/(end_x-start_x)*graph_canvas.width;
		plot_y = graph_canvas.height-(y-start_y)/(end_y-start_y)*graph_canvas.height;
		if(first_point){
			canvas_context.moveTo(plot_x, plot_y);
			first_point = false;
		}else{
			canvas_context.lineTo(plot_x, plot_y);
		}
	}
	canvas_context.strokeStyle = color;
	canvas_context.stroke();
}

function draw_frame(timestamp) {

	canvas_context.clearRect(0,0,graph_canvas.width, graph_canvas.height);

	expr = document.getElementById("expression1").value;

	plot(expr, timestamp, "red");
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
	if(running){
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
