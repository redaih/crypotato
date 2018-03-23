var com="BTC";
var cur="USD";
var cur_symbol;
var live_price_url="https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP&tsyms=USD,EUR,GBP,JPY,CNY";
var top_exchange_url = "https://min-api.cryptocompare.com/data/top/exchanges?fsym="+ com + "&tsym=" + cur;
var news_url="https://min-api.cryptocompare.com/data/news/?lang=EN";
var limit ="366" ;
var found;
var historical_info_1day_url="https://min-api.cryptocompare.com/data/histoday?fsym=" + com + "&tsym=" + cur + "&limit=" + limit;
var historical_info_1hour_url;
var historical_info_1minute_url;
var hday_value;
var news_filter_array = [];
var chart_url = historical_info_1day_url;


function historical_url_selrctor(chart_type_url,limitt){
	limit=limitt;
	historical_info_1day_url="https://min-api.cryptocompare.com/data/histoday?fsym=" + com + "&tsym=" + cur + "&limit=" + limit;
	historical_info_1hour_url="https://min-api.cryptocompare.com/data/histohour?fsym=" + com +"&tsym=" + cur + "&limit=" +limit;
	historical_info_1minute_url = "https://min-api.cryptocompare.com/data/histominute?fsym="+com+"&tsym="+cur+"&limit=" +limit;
	chart_url =window[chart_type_url];
	console.log(chart_url);
	$.getJSON(chart_url, draw_chart);
}




function comp(data){
	com=data;
	top_exchange_url = "https://min-api.cryptocompare.com/data/top/exchanges?fsym="+ com + "&tsym=" + cur;
	top_exchange_function(top_exchange_url);
	live_price_function();
	$.getJSON(chart_url, draw_chart);
}

function curr(data){
	cur=data;
	top_exchange_url = "https://min-api.cryptocompare.com/data/top/exchanges?fsym="+ com + "&tsym=" + cur;
	top_exchange_function(top_exchange_url);
	live_price_function();
	$.getJSON(chart_url, draw_chart);
}

function live_price_function() {
$.getJSON(live_price_url, function (response){		
	var Display = response["DISPLAY"];
	cur_symbol=Display[com][cur]["TOSYMBOL"]
	document.getElementById("price").innerHTML=Display[com][cur]["PRICE"];
	document.getElementById("price-open").innerHTML=Display[com][cur]["OPENDAY"];
	document.getElementById("price-high").innerHTML=Display[com][cur]["HIGHDAY"];
	document.getElementById("price-low").innerHTML=Display[com][cur]["LOWDAY"];
	document.getElementById("price-change").innerHTML=Display[com][cur]["CHANGEDAY"];
	document.getElementById("price-market-cap").innerHTML=Display[com][cur]["MKTCAP"];
		document.getElementById("price-supply").innerHTML=Display[com][cur]["SUPPLY"];
		
	});
    setTimeout("live_price_function()",60000);
}

live_price_function();

function draw_chart(response) {
	var Display = response["Data"];
		hday_value=Display.map(function(val){
			ttime=new Date(val["time"]*1000);
			return { x:ttime,y:val["close"]};
		})
	var dataPoints = hday_value;
	
	var options =  {
	animationEnabled: true,
	theme: "light2",
	title: {
		text: com +"/" + cur
	},
	axisY: {
		includeZero: false
	},
	data: [{
		type: "line", 
		yValueFormatString: cur_symbol + "#,###.##",
		dataPoints: dataPoints
	}]
	};
	$("#chartContainer").CanvasJSChart(options);
}


window.onload = function() {

	$.getJSON(chart_url, draw_chart);
}








function top_exchange_function(url) {


	$.getJSON(url, function (response){
		$("#exchange-top-1").text(response["Data"][0]["exchange"]);
		$("#from-top-1").text(response["Data"][0]["fromSymbol"]);
		$("#to-top-1").text(response["Data"][0]["toSymbol"]);
		$("#value-top-1").text(parseFloat(response["Data"][0]["volume24h"]).toFixed(2));
		
		$("#exchange-top-2").text(response["Data"][1]["exchange"]);
		$("#from-top-2").text(response["Data"][1]["fromSymbol"]);
		$("#to-top-2").text(response["Data"][1]["toSymbol"]);
		$("#value-top-2").text(parseFloat(response["Data"][1]["volume24h"]).toFixed(2));
		
		$("#exchange-top-3").text(response["Data"][2]["exchange"]);
		$("#from-top-3").text(response["Data"][2]["fromSymbol"]);
		$("#to-top-3").text(response["Data"][2]["toSymbol"]);
		$("#value-top-3").text(parseFloat(response["Data"][2]["volume24h"]).toFixed(2));
		
		$("#exchange-top-4").text(response["Data"][3]["exchange"]);
		$("#from-top-4").text(response["Data"][3]["fromSymbol"]);
		$("#to-top-4").text(response["Data"][3]["toSymbol"]);
		$("#value-top-4").text(parseFloat(response["Data"][3]["volume24h"]).toFixed(2));
		
		$("#exchange-top-5").text(response["Data"][4]["exchange"]);
		$("#from-top-5").text(response["Data"][4]["fromSymbol"]);
		$("#to-top-5").text(response["Data"][4]["toSymbol"]);
		$("#value-top-5").text(parseFloat(response["Data"][4]["volume24h"]).toFixed(2));
		

	});
}
top_exchange_function(top_exchange_url);


function news() {
	$.getJSON(news_url, function (response){
		
		var filtered=response.filter(function(e){return this.indexOf(e["source"])<0;},news_filter_array);
		
		$.each(filtered, function(index, value){	
			ttime=moment.unix(filtered[index]["published_on"]).format('MMMM Do YYYY, h:mm:ss a');	
			$("#news_wrapper").children().eq(index).children().eq(0).children().eq(0).children().eq(0).text(filtered[index]["title"]);

			$("#news_wrapper").children().eq(index).children().eq(1).children().eq(0).children().eq(0).children().eq(0).attr("src",filtered[index]["imageurl"]);
			
			$("#news_wrapper").children().eq(index).children().eq(2).children().eq(0).children().eq(0).text(ttime);
			
			$("#news_wrapper").children().eq(index).children().eq(2).children().eq(0).children().eq(1).text(filtered[index]["source"]);
			$("#news_wrapper").children().eq(index).children().eq(2).children().eq(0).children().eq(2).attr("id",filtered[index]["source"]);
			
			$("#news_wrapper").children().eq(index).children().eq(1).children().eq(1).children().eq(0).text(filtered[index]["body"]);
			if(index === 9) {
				return false; 
			}	
		});	
		
	});
}
news();

function news_filter_fun(news_source){
	news_filter_array.push(news_source);
	news();
	news_filter_filtered_pupilator();
}


function news_filter_filtered_pupilator(){
	$("#filtered_sources").empty();
	$("#filtered_sources").append("<option default>filtered sources</option>");
	$.each(news_filter_array,function(index,value){
			$("#filtered_sources").append("<option>" + news_filter_array[index] + "</option>");
	});
	
}
news_filter_filtered_pupilator();

function news_filter_filtered_depupilator(filtered_value){
	
	news_filter_array = jQuery.grep(news_filter_array, function(value) {
		return value != filtered_value;
	});
	
	news();
	news_filter_filtered_pupilator();
}



$(document).ready(function () {

    $('#custom_time_stamp_collapse').on('click', function () {
        $('#custom_time_stamp').toggleClass('active');
    });

});


function custome_timestamp_validation(time_stamp_value) {
	console.log(time_stamp_value);
}