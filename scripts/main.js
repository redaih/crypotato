var api_status_array=[];
var com="BTC";
var cur="USD";
var from_t;
var to_t;

var lang_ob = { 'EN':{'stats':'stats',"now":"now","today's open:":"today's open:","today's high":"today's high", "today's low":"today's low", 		
					  "change":"change","market cap":"market cap","supply":"supply","top exchanges":"TOP EXCHANGES","filtred sources":"filtered sources","1h":"1h","1d":"1d","1w":"1w","1m":"1m","1y":"1y"},
			   'AR':{'stats':'احصائيات',
					 "now":"الان",
					 "today's open:":"افتتاح اليوم",
					 "today's high":"اعلى عرض اليوم",
					 "today's low":"اقل عرض اليوم", 
					 "change":"تغيير",
					 "market cap":"رأس مال السوق",
					 "supply":"المعروض",
					 "top exchanges":"اعلى تبادلات",
					 "filtred sources":"مصادر الاخبار المهملة",
					 "1h":"ساعة",
					 "1d":"يوم",
					 "1w":"اسبوع",
					 "1m":"شهر",
					 "1y":"سنة"}
			  };

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
var status;
var status_api=0;
var status_apireq = 0;
var status_eror = 0;
function historical_url_selrctor(chart_type_url,limitt){
	limit=limitt;
	historical_info_1day_url="https://min-api.cryptocompare.com/data/histoday?fsym=" + com + "&tsym=" + cur + "&limit=" + limit;
	historical_info_1hour_url="https://min-api.cryptocompare.com/data/histohour?fsym=" + com +"&tsym=" + cur + "&limit=" +limit;
	historical_info_1minute_url = "https://min-api.cryptocompare.com/data/histominute?fsym="+com+"&tsym="+cur+"&limit=" +limit;
	chart_url =window[chart_type_url];
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
$.get(live_price_url,function (response,status,xhr){
	apireqs();
	lastest_api_calls("live price", status);
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
	setTimeout("live_price_function()",10000)
}
live_price_function();

function draw_chart(response,status,xhr) {
	apireqs();
	historical_info_1minute_url
	lastest_api_calls("chart draw", status);
	
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


	$.getJSON(url,function (response,status,xhr){
		apireqs();
		lastest_api_calls("top exchanges", status);
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
	setTimeout("top_exchange_function(top_exchange_url)",5000);
}
top_exchange_function(top_exchange_url);


function news() {
	$.getJSON(news_url,function (response,status,xhr){
		apireqs();
		lastest_api_calls("news", status);
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

var w;

function startWorker() {
    if(typeof(Worker) !== "undefined") {
        if(typeof(w) == "undefined") {
            w = new Worker("scripts/worker.js");
        }
        w.onmessage = function(event) {
            document.getElementById("session_length").innerHTML =moment.duration(1, "minutes").humanize(); // a minute  event.data + ":" ;
        };
    } else {
        document.getElementById("result").innerHTML = "Sorry! No Web Worker support.";
    }
}

function stopWorker() { 
    w.terminate();
    w = undefined;
}
startWorker();

function apireqs(){
	status_apireq=status_apireq+1;
	show_stat();
}

function api_eror(){
	status_eror = status_eror +1;
}

function show_stat(){
	$("#successful_requests").html(status_apireq);
	$("#api_errors").html(status_eror);
}

function api_calls(){
	$.getJSON('https://min-api.cryptocompare.com/stats/rate/limit',function (response,status,xhr){
		//lastest_api_calls("api rates", status);
		document.getElementById("histo_hours_made").innerHTML = response['Hour']['CallsMade']['Histo'];
		document.getElementById("price_hours_made").innerHTML = response['Hour']['CallsMade']['Price'];
		document.getElementById("news_hours_made").innerHTML = response['Hour']['CallsMade']['News'];
		document.getElementById("strict_hours_made").innerHTML = response['Hour']['CallsMade']['Strict'];
		
		document.getElementById("histo_hours_remain").innerHTML = response['Hour']['CallsLeft']['Histo'];
		document.getElementById("price_hours_remain").innerHTML = response['Hour']['CallsLeft']['Price'];
		document.getElementById("news_hours_remain").innerHTML = response['Hour']['CallsLeft']['News'];
		document.getElementById("strict_hours_remain").innerHTML = response['Hour']['CallsLeft']['Strict'];
		
		document.getElementById("histo_minuts_made").innerHTML = response['Minute']['CallsMade']['Histo'];
		document.getElementById("price_minuts_made").innerHTML = response['Minute']['CallsMade']['Price'];
		document.getElementById("news_minuts_made").innerHTML = response['Minute']['CallsMade']['News'];
		document.getElementById("strict_minuts_made").innerHTML = response['Minute']['CallsMade']['Strict'];	
		
		document.getElementById("histo_minuts_remain").innerHTML = response['Minute']['CallsLeft']['Histo'];
		document.getElementById("price_minuts_remain").innerHTML = response['Minute']['CallsLeft']['Price'];
		document.getElementById("news_minuts_remain").innerHTML = response['Minute']['CallsLeft']['News'];
		document.getElementById("strict_minuts_remain").innerHTML = response['Minute']['CallsLeft']['Strict'];
		
		document.getElementById("histo_seconds_made").innerHTML = response['Second']['CallsMade']['Histo'];
		document.getElementById("price_seconds_made").innerHTML = response['Second']['CallsMade']['Price'];
		document.getElementById("news_seconds_made").innerHTML = response['Second']['CallsMade']['News'];
		document.getElementById("strict_seconds_made").innerHTML = response['Second']['CallsMade']['Strict'];
		
		document.getElementById("histo_seconds_remain").innerHTML = response['Second']['CallsLeft']['Histo'];
		document.getElementById("price_seconds_remain").innerHTML = response['Second']['CallsLeft']['Price'];
		document.getElementById("news_seconds_remain").innerHTML = response['Second']['CallsLeft']['News'];
		document.getElementById("strict_seconds_remain").innerHTML = response['Second']['CallsLeft']['Strict'];
	});
	setTimeout("api_calls()",10000);
}

api_calls();

function lastest_api_calls(api_call_name,api_call_status){
	api_status_array.push([api_call_name,api_call_status]);
	if(api_status_array.length>5)
		api_status_array.shift();
	ilength= api_status_array.length;
	//console.log(ilength);
	for(i=ilength;i>-1;i--){
		$("#latest_api_call_id").children().eq(ilength - i).text(api_status_array[i-1] );
	}
	//console.log("api status",api_status_array);
}

// language control function
/*$(function(){
	$("#translate").change(function(){
		var lang = $(this).attr("value");
		$(".lang").each(function(index,element){
			$(this).text(lang_ob[lang][$(this).attr('key')]);
		});
	});
});*/