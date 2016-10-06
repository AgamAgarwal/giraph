max_fps = 30;
running = false;
start_x = -5;
end_x = 5;
start_y = -5;
end_y = 5;
n_points = 100;
graph_canvas = document.getElementById("canvas1");
canvas_context = graph_canvas.getContext("2d");
present_time = 0;
function start_pressed(){ 
	running = true;
}
function stop_pressed() {
	running = false;
}
function draw_frame(timestamp) {
	present_time = timestamp/100;
	canvas_context.clearRect(0,0,graph_canvas.width, graph_canvas.height);
	canvas_context.beginPath();
	expr = document.getElementById("expression1").value;
	if(expr == "")
		expr = "0";
	first_point = true;
	canvas_context.moveTo(0,0);
	for(i=start_x;i<=end_x;i+=(end_x-start_x)/n_points){
		x=i;
		t=present_time;
		with(Math){
			try{
				y=eval(expr);
			}catch(err){
				return;
			}
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
	canvas_context.strokeStyle="red";
	canvas_context.stroke();
}

last_time = 0;
function update_fps(timestamp){
	document.getElementById("fps_meter").innerHTML = Math.round(1000/(timestamp-last_time)) + " fps" ;
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
frame_driver();
