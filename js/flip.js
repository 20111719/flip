/**
 * 保存加载图片信息
 */
var img = {
	imgArray: [],
	numArray: [],
	check: [],
	xy: []
};
/*
游戏所需数据
 */
var game = {
	play: false,
	level: 1,
	time: 5,
	levelup: 0,
	timeId: null
};

$(function(){
	init();
	$(".btn").bind("click",function(){
		gameStart();
	})
});

/**
 * 初始化
 */
function init(){
	img.imgArray = [];
	img.numArray = [];
	game.levelup = 0;
	$(".level .text").html(game.level);
	$(".container").html();
	layout();
	time();
	/*
	根据agme.level选择合适的布局方式
	 */
	switch (game.level) {
		case 1: {
			$(".container .row").addClass("row2x2");
			$(".container .block").addClass("block2x2");
			break;
		}
		case 2: {
			$(".container .row").addClass("row4x4");
			$(".container .block").addClass("block4x4");
			break;
		}
		case 3: {
			$(".container .row").addClass("row6x6");
			$(".container .block").addClass("block6x6");
			break;
		}
		case 4: {
			$(".container .row").addClass("row8x8");
			$(".container .block").addClass("block8x8");
			break;
		}
		case 5: {
			$(".container .row").addClass("row10x10");
			$(".container .block").addClass("block10x10");
			break;
		}
		default:
			break;
	}
}
/*
 * 加载图片
 */
function layout(){
	var html = "";
	/**
	 * 保存图片数据
	 */
	for (var i = 0; i < powFun(game.level*2)/2; i++) {
		img.imgArray.push(randomFun(21)+1);
		img.numArray.push(2);
	}
	/*
	 *随机摆放图片
	 */
	for (var j = 0; j < game.level*2; j++){
		html += '<div class="row">';
		for(var i = 0; i < game.level*2; i++){
			var index = randomFun(powFun(game.level*2)/2);
			while(img.numArray[index]==0){
				index = randomFun(powFun(game.level*2)/2);
			}
			img.numArray[index] -= 1;
			html += '<div class="block">'+
					'<div class="cover"></div>'+
					'<img src="img/p'+img.imgArray[index]+'.png"/></div>';
		}
		html += "</div>";
	}
	$(".container").html(html);
	bindFun();
}

/**
 * 倒计时
 */
function time(){
	$(".time .text").html(game.time);
	if(game.play){
		if(game.time != 0){
			game.time -= 1;
			timeId = setTimeout(time,1000);
		}else{
			clearTimeout(timeId);
			$(".time .text").html(game.time);
			game.play = false;
			gameOver();
		}
	}
}

/*
绑定方法
 */
function bindFun(){
	if(game.play){
		$(".container .block").bind("click",function(){
			$(".cover",this).animate({
				width: 0,
				left: "70%"
			},200);
			$('img',this).animate({
				width: "100%",
				left: 0
			},300);

			var x = $(this).index();
			var y = $(this).parent().index();
			if(img.xy.length == 0){
				img.xy.push({x:x,y:y});
				img.check.push($("img",this).attr("src"));
			//	console.log(img.xy);
			}else{
				if(img.xy[0].x != x || img.xy[0].y != y){
					img.xy.push({x:x,y:y});
				//	console.log(img.xy);
					check($("img",this).attr("src"));
				}
			}
		});
		$(".container").unbind("click");
	}else{
		$(".container").bind("click",function(){
			$(".warning").html("请点击 - 开始游戏 - 按钮！").fadeIn().delay(300).fadeOut();
		})
	}
}

/*
游戏开始方法
 */
function gameStart(){
	$(".btn").unbind("click").css({"background-color":"#ccc","cursor":"default"});
	game.play = true;
	init();
}

/*
游戏结束方法
 */
function gameOver(){
	game.play = false;
	game.time = 5;
	game.level = 1;
	$(".btn").css({
		"background-color":"#428bca",
		"cursor":"pointer"}).html("重新开始").bind("click",function(){gameStart()});
	$(".container .block").unbind("click");
	$(".container").bind("click",function(){
		$(".warning").html("请点击 - 重新开始 - 按钮！").fadeIn().delay(300).fadeOut();
	})
	$(".danger").fadeIn().delay(700).fadeOut();
}

/*
升级或通关
 */
function win(){
	if(game.levelup == powFun(game.level*2)){
		if(game.levelup == 64){
			clearTimeout(timeId);
			$(".success").fadeIn().delay(1000).fadeOut(function(){reset();});
		}else{
			clearTimeout(timeId);
			game.time += 60;
			game.level += 1;
			$(".info").html("第"+game.level+"关，限时"+game.time+"秒").fadeIn().delay(300).fadeOut();
			init();
		}
	}
}
/*
重置方法
 */
function reset(){
	game.play = false;
	game.time = 5;
	game.level = 1;
	init();
	$(".btn").css({
		"background-color":"#428bca",
		"cursor":"pointer"}).html("开始游戏").bind("click",function(){gameStart()});
}
/*
判定图片是否相同
 */
function check(src){
	if(img.check[0] == src){
			$(".container .row").eq(img.xy[0].y).find('.block').eq(img.xy[0].x).css("visibility","hidden");
			$(".container .row").eq(img.xy[1].y).find('.block').eq(img.xy[1].x).css("visibility","hidden");
			game.levelup += 2;
			win();
	}else{
		$(".container .row").eq(img.xy[0].y).find(".block").eq(img.xy[0].x).find("img").delay(300).animate({
			width: 0,
			left: "70%"
		},200);
		$(".container .row").eq(img.xy[0].y).find(".block").eq(img.xy[0].x).find(".cover").delay(300).animate({
			width: "100%",
			left: 0
		},300);
		$(".container .row").eq(img.xy[1].y).find(".block").eq(img.xy[1].x).find("img").delay(300).animate({
			width: 0,
			left: "70%"
		},200);
		$(".container .row").eq(img.xy[1].y).find(".block").eq(img.xy[1].x).find(".cover").delay(300).animate({
			width: "100%",
			left: 0
		},300);
	}
		img.xy = [];
		img.check = [];
}
/*
随机函数
 */
function randomFun(num){
	var result = Math.floor(Math.random()*num);
	return result;
}
/*
平方函数
 */
function powFun(num){
	var result = Math.pow(num,2);
	return result;
}