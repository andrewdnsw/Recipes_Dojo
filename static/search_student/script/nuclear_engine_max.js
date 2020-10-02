// Глобальные переменные для работы DBpedia и прочего
var anim, child, $alert, queries_ok, dbpedia_queries;
win_opened = []; voice = {}; queries = []; options = {};
img_opened_is_grab = []; img_opened_no_grab = []; had = [];
var max_images_is_grab, max_images_no_grab;
var fire_grab = function(){ $('#dijit_layout_StackController_3_s_grab').click(); };	// запуск панели контекстного поиска
// Генератор сетевых адресов серверов для их оперативного переключения, без повторов
function spot_generator(spot_arr, spot_opened, deep) { 
	deep = deep || spot_arr.length - 1;
	deep = (deep < 0) ? 0 : deep;
	var stop = spot_opened.length;
	var start = stop - deep;
	start = (start < 0) ? 0 : start;
	var random_index;
	do {
		random_index = Math.floor(( Math.random() * (spot_arr.length * 1000 - 1)) / 1000);
		var unic_index = false; var unic_x = true;
		for(var n = start; n < stop; n++) { if(random_index == spot_opened[n]) unic_x = false; }
		if(unic_x) unic_index = true;
	} while(!unic_index);
	spot_opened.push(random_index);
	return "http://" + spot_arr[random_index] + ".appspot.com";
}

// Начало кода движка Семантической паутины 
(function() {
var very_scroll, lodlive_was, context_was, dbpedia_was, wdqs_was, $wdqs_div, annotation_was, dbpedia_semantic, annotation_semantic, lodlive_semantic, wdqs_semantic;
var space = ' '; var the_dot = '.'; var the_comma = ','; var the_s = 's_'; var the_sharp = '#'; var the_defis = ' - ';
var ff, make_semantic, close_btn, lodlive_window_x, lodlive_window_y, chromeFirst;
max_images_is_grab = 5;
max_images_no_grab = 8;
var panes_stack, dbpedia_invite, dbpedia_window, annotation_queries, wd_select_val, $wdqs, $s_wdqs, $lodlive, $s_lodlive;
var $anSelect, $anStartBtn, $anStopBtn, $anResult, $an, br = '<br>';
var area, loader_gray = '<img class = "loaderGray" src="' + software_holder + 'lodlive/img/ajax-loader-gray.gif" style="margin-left:6px;margin-top:2px"/><br>';
var doAn_arr = [];
var urlToAnnotate, anStopBtnPushed;
var dojo_select_lodlive_dialog, dojo_select_wdqs_dialog, dojo_search_engines_dialog, dojo_select_context_dialog, dojo_select_show_dialog, dojo_select_sort_dialog, dojo_select_pareto_dialog, dojo_select_levenstain_dialog, site_url;
var search_engines_dialog, search_engines_dialog_tt, context_dialog, context_dialog_tt, context_dialog_tt_id, show_dialog, show_dialog_tt, sort_dialog, sort_dialog_tt, pareto_dialog, pareto_dialog_tt, levenstain_dialog, levenstain_dialog_tt;
var lodlive_dialog, wdqs_dialog;
var temp, dummy, selected, user_access_level, $img_x, $img_y, $img_z, $img_lod, $img_wdqs;
var _grand_user, choice_menu_make, choice_menu_place, trees = {};
var dojo_dialog_constructor, sort_attr, sort_attr_tempo, sort_attr_last;
var frame, iframe, invisible_div, the_web = 'web';
var the_search, the_logo, the_grab = 'grab';
var wel_com, rating, preloader_handle, search_selected = the_web;
var lbl_1, lbl_2, lbl_clone, request, request_clone, header_wrap, make_fine, coming_search, req_text = space;
var from_meta_keywords = ''; var from_meta_categories = ''; 
// опции поиска
the_context = {};
context_obj = {};
tokens_obj = {};
req_text_obj = {};
meta_keywords_obj = {};
meta_categories_obj = {};
// Запущенные задачи поисковых машин на вкладках
var search_tabs = {web:{},images:{},video:{},blogs:{},news:{},books:{},patent:{},local:{},progr:{},network:{},micro:{},common:{},lib:{},project:{}};	//вкладки
aspects = {};	// relevance, pertinence, relevance_meta, pertinence_meta, meta_keywords, meta_categories;
// r - чистая релевантность, p - чистая пертинентность, m_k - мера соответствия ключевым словам из тегов meta, m_c - мера соответствия категориям из тегов meta
//d_aspects = ["r", "p", "r_m", "p_m", "m_k", "m_c"]; 
d_aspects = [];
var max_aspects, select_context_tt_was = false;
// panes - упорядоченный массив визуальных панелей и активных вкладок на этих панелях; обслуживается функций panes_stack(...)
panes = [{'id':'semantic','tab':'grab','z':4}, {'id':'global','tab':'web','z':3}, {'id':'docs','tab':'progr','z':2}, {'id':'libs','tab':'lib','z':1}, {'id':'frame','tab':'frame','z':0}];
search_divs = ['global', 'docs', 'libs'];
var max_z = panes.length;
tokens = []; 
var links, links_size;
var search_site, last_tab = '#s_grab';
var form_ok, voice_ok, context_dialog_ok, ya_child_ok;
var form, navigation, ya_child, image_animator_x, image_animator_y, image_animator_z, image_animator_lod, image_animator_wdqs;
var regex_url_pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
var regex_url = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/;
var reg_host = /(.+:\/\/)?([^\/]+)(\/.*)*/i;
//var reg_html = /<[^>]*>|\n|\f|[\;\?\.\,\(\)\:\"\!\*\%\&\«\»]/gi;
var reg_html = /<[^>]*>|\n|\f|[\;\?\,\(\)\"\!\*\%\&\«\»]/gi;
//var reg_word = /[a-z0-9_]+|[а-яё]+/gi;
var reg_punct = /[^\w+|\u0400-\u04FF]+/gi;
var reg_union = /только|также|обычно|или|для|как|что|когда|при(?=\s)|все(?=\s)|and(?=\s)|for(?=\s)/gi;
var reg_quot = /quot/gi; var reg_quot_replace = '"';
var reg_cookies = /\[|\]|"|'/gi;
var reg_the_dot = /\./gi;
var reg_space = / /gi;
var reg_many_space = / {1,}/gi;
var reg_special = /\"/gi;
var the_special = '%#%#%#%#%';
var x_pane, z;
var dojo_prefix = '#dijit_layout_StackController_'
var snippets_makers = {};
var engine_makers = {};
var yandexuid, yandexuid_last;
yandex_appspot_opened = [];
mailru_appspot_opened = [];
yahoo_appspot_opened = [];
yandexuid_arr = ['4775440541', '6539080821', '9918290441', '2239940301', '7545070271']
$alert = $('#alert');
var img_size = 142; var img_radius = 10;
var vid_size = 142; var vid_radius = 71;
// Это нужно для подгона внешнего скролла
var scroll_api, clone, tree_scroll_api, minus_h, iframe_handler, interval_handler;

very_scroll = function(x) { $(function() { 
	x = x || last_tab;
	x = (x.substr(0,1) == the_sharp) ? x : the_sharp + x;
	scroll_api = $(x).jScrollPane().data('jsp'); }); 
	adjust_scroll(); 
	last_tab = x; 
}

function adjust_scroll() { 
	make_fine.cssText = "position:absolute;top:10px;bottom:0px;left:12px;right:12px;font-size:13px;"; 
	if(interval_handler) clearInterval(interval_handler);
	interval_handler = setInterval(do_adjust, 200);
}

function fast_scroll_work() {
	if (scroll_api.getContentPositionY() > 200) $('#back-top').fadeIn();
	else $('#back-top').fadeOut();
}

var do_adjust = function() { 
	$(function() { 
		$(window).unbind('scroll');
		if(scroll_api) scroll_api.reinitialise(); 
		fast_scroll_work();
		$(window).bind('scroll', fast_scroll_work);
	}); 
}

var random_digit = function() { return Math.floor(( Math.random() * 9999) / 1000); }

function get_yandexuid_pair() {		// случайный yandexuid
	z = yandexuid_arr[Math.floor(( Math.random() * 4999) / 1000)];
	for(var k = 0; k < 8; k++) z += random_digit();
	return "yandexuid="+z;
}
	// Готовит текст запроса для поисковых машин
	function make_req_text(req_text, blogs, blogs_text) {
		var text = (blogs ? (blogs_text + space + req_text) : req_text).replace(reg_special, the_special);
		return ((search_site) ? "site:" + search_site + space + text : text).replace(reg_space,'+');
	}

//	Начало работы с Yahoo через Google App Engine
	engine_makers.Yahoo_task_constructor = function(search_type, make_snippets, machine) {
		var x_pane = search_tabs[search_type].x_pane;
		var shippets_in_serp, appspot, search_machine_post_data = {};
		var self = this;			// внутренняя ссылка на объект
		self.active = true;			// флажок немедленного останова
		self.the_counter = 0;		// счетчик запросов к Yahoo Search
		self.blogs = false;			// поиск в блогах?
		self.shippets = 0;
		search_machine_post_data.search_engine_name = machine;
		search_machine_post_data.search_type = search_type;
		var addon = voice.yahoo_ylt + voice.yahoo_ylu;
		if(search_type == the_web) search_machine_post_data.search_engine_url = voice.yahoo_web_engine_url + addon;
		else if (search_type == 'images') search_machine_post_data.search_engine_url = voice.yahoo_images_engine_url + addon;
		else if (search_type == 'video') search_machine_post_data.search_engine_url = voice.yahoo_video_engine_url + addon;
		else if (search_type == 'blogs') { search_machine_post_data.search_engine_url = voice.yahoo_web_engine_url + addon; self.blogs = true; }
		else { this.active = false; empty_search(search_type, x_pane); return; }
		search_machine_post_data.request_text = make_req_text(req_text, self.blogs, 'блог');
//		Предварительная работа с куками для Yahoo	
		var document_cookie = document.cookie.replace(/;/gi,the_comma).replace(reg_space,''); 
		if (document_cookie.indexOf('ymuid') < 0) {
			if (document_cookie.length > 0) document_cookie += the_comma;
			document_cookie += voice.yahoo_ymuid;
		}
		if (document_cookie.indexOf('sSN') < 0) document_cookie += (the_comma + voice.yahoo_sSN);
		search_machine_post_data.cookies = document_cookie;
		appspot = spot_generator(voice.appspot_arr, yahoo_appspot_opened, 2);
//		appspot = voice.grab;		// так Yahoo почему-то работает устойчивее, через один прокси
		machine_start(search_type, machine, appspot);
		get_8_yahoo(0);			// начать поиск	в Yahoo Search
// 		Делаем поиск, получаем порции фидов
		function get_8_yahoo(n) {		// поиск окончен, принудительный выход из рекурсии
			if(!self.active) { 
				machine_stop(search_type, machine); 
				machine_done(search_type, machine, self.the_counter);
				return; 
			} else if(n >= Number(options.search_engines.Yahoo) || self.the_counter >= voice.mail_counter_max || shippets_in_serp == 0) { 		// поиск окончен, нормальный выход из рекурсии
				if(self.blogs) {		// это поиск в блогах?
					search_machine_post_data.request_text = make_req_text(req_text, self.blogs, 'blog');
					self.blogs = false;
					get_8_yahoo(0);			// второй раз поиск в Yahoo Search
					return;
				} else {
					self.active = false;
					machine_done(search_type, machine, self.the_counter);
					if (self.shippets > 0) fine_search(search_type, x_pane);
					else empty_search(search_type, x_pane);
					return; 
				}
			}			
			search_machine_post_data.serp_number = n
			var jqXHR = $.ajax({
				type: "POST",
				url: appspot,
				data: JSON.stringify(search_machine_post_data),
				dataType: "json",
				contentType: "application/json",
				cache: false,
				crossDomain: true
			});
			jqXHR.done(function(response) {
				var reply_word = response.reply_word;
				var serp_number = response.serp_number;
				search_tabs[search_type].calls++;			// количество успешно сделанных запросов ко всем поисковым машинам
				self.the_counter++;							// количество успешно сделанных запросов к данной поисковой машине
				if(reply_word == 'normal') {
					shippets_in_serp = 0;
					var received_data = response.response_data;
					normal_serp(search_type, machine, serp_number);
					//	работа с куками, которые пришли с Google App Engine
					var received_cookies = response.received_cookies.toString().replace(reg_cookies, '').replace(reg_space,'');		
					received_cookies = received_cookies.toString().replace(reg_cookies, '').replace(reg_space,'');
					if (received_cookies.indexOf('ymuid') < 0) {
						if (received_cookies.length > 0) received_cookies += the_comma;
						received_cookies += voice.yahoo_ymuid;
					}
					if (received_cookies.indexOf('sSN') < 0) received_cookies += (the_comma + voice.yahoo_sSN);
					search_machine_post_data.cookies = received_cookies;	// установим свежие куки
					shippets_in_serp += make_snippets(JSON.parse(received_data), x_pane, search_type, search_tabs[search_type].had);	// делаем сниппеты
					self.shippets += shippets_in_serp;
					search_tabs[search_type].snippets += shippets_in_serp;
					get_8_yahoo(n + 1);							// продолжим поиск рекурсивно
				} else if(reply_word == 'denied'){ 				// если Yahoo брыкается
					if(self.the_counter > voice.mail_counter_max) { // поисковая машина временно недоступна (исчерпан лимит запросов)
						machine_denied(search_type, machine);
						self.active = false; 
						console.log(voice.s_err_limit);
						machine_done(search_type, machine, self.the_counter);
						forbidden_search(search_type, x_pane);
						return; 
					}			
					appspot = spot_generator(voice.appspot_arr, yahoo_appspot_opened, 2);				// сменим прокси-сервер
					empty_serp(search_type, machine, serp_number, appspot);
					search_machine_post_data.cookies = document_cookie;
					get_8_yahoo(n);						// попробуем с другим прокси					
				} else if(reply_word == 'empty') {
					if(self.blogs) {					// это поиск в блогах?
						search_machine_post_data.request_text = make_req_text(req_text, self.blogs, 'blog');
						self.blogs = false;
						get_8_yahoo(0);					// ещё раз поиск в Yahoo Search
						return;
					} else {
						self.active = false; 
						console.log(voice.s_err_serp);
						machine_done(search_type, machine, self.the_counter);
						empty_search(search_type, x_pane);
						return;
					}
				} else if(reply_word == 'error') {		// Ошибка сервера, обнаружено исключение
					console.log(machine + the_defis + voice.server_err + response.exception);
					if(self.the_counter > voice.mail_counter_max) { // поисковая машина временно недоступна (исчерпан лимит запросов)
						machine_denied(search_type, machine);
						self.active = false; 
						console.log(voice.s_err_limit);
						machine_done(search_type, machine, self.the_counter);
						forbidden_search(search_type, x_pane);
						return; 
					}
					search_machine_post_data.cookies = document_cookie;
					get_8_yahoo(n);						// попробуем с другим прокси
/*
					self.active = false;
					console.log(voice.s_err_exception);
					machine_done(search_type, machine, self.the_counter);
					forbidden_search(search_type, x_pane);
					return;	
*/					
				}
			});
			jqXHR.fail(function(obj, status) { 
				ajax_fail(search_type, machine, status, jqXHR.readyState); 
				self.active = false;
				console.log(voice.s_err_post);
				machine_done(search_type, machine, self.the_counter); 
				forbidden_search(search_type, x_pane);
				return;										// ошибка поисковой машины
			});
			setTimeout(function() { 						// если вообще нет ответа от сервера
				if(!self.active) return;
				if(jqXHR.readyState < 4) { 
					self.active = false; 
					console.log(voice.s_err_long);
					machine_done(search_type, machine, self.the_counter);
					forbidden_search(search_type, x_pane); 
				}
			}, 7000);
		}		
	}
//	Конец работы с Yahoo через Google App Engine

//	Начало работы с Mail.ru через Google App Engine
	engine_makers.MailRu_task_constructor = function(search_type, make_snippets, machine) {
		var x_pane = search_tabs[search_type].x_pane;
		var shippets_in_serp, appspot, search_machine_post_data = {};
		req_text = req_text.replace(reg_special, the_special);
		search_machine_post_data.request_text = ((search_site) ? "site:" + search_site + space + req_text : req_text).replace(reg_space,'+');
		search_machine_post_data.search_engine_name = machine;
		search_machine_post_data.search_type = search_type;
		if(search_type == the_web) search_machine_post_data.search_engine_url = voice.mailru_web_engine_url;
		else if (search_type == 'images') search_machine_post_data.search_engine_url = voice.mailru_images_engine_url;
		else if (search_type == 'video') search_machine_post_data.search_engine_url = voice.mailru_video_engine_url;
		else { this.active = false; empty_search(search_type, x_pane); return; }
		var self = this;			// внутренняя ссылка на объект
		self.active = true;			// флажок немедленного останова
		self.the_counter = 0;		// счетчик запросов к Mail.ru Search
		self.shippets = 0;
//		Предварительная работа с куками для Mail.ru	
		var document_cookie = document.cookie.replace(/;/gi,',').replace(reg_space,''); 
		if (document_cookie.indexOf('sid') < 0) {
			if (document_cookie.length > 0) document_cookie += the_comma;
			document_cookie += voice.mailru_sid;
		}
		if (document_cookie.indexOf('searchuid') < 0) document_cookie += (the_comma + voice.mailru_searchuid);
		search_machine_post_data.cookies = document_cookie;
		appspot = spot_generator(voice.appspot_arr, mailru_appspot_opened, 2);
//		appspot = voice.grab;
		machine_start(search_type, machine, appspot);
		get_8_mailru(0);			// начать поиск	в Mail.ru Search
// 		Делаем поиск, получаем порции фидов
		function get_8_mailru(n, antirobot) {		// поиск окончен, принудительный выход из рекурсии
			if(antirobot);
			else if(!self.active) { 
				machine_stop(search_type, machine); 
				machine_done(search_type, machine, self.the_counter);
				return; 
			} else if(n >= Number(options.search_engines.MailRu) || self.the_counter >= Number(voice.mail_counter_max) /* || shippets_in_serp == 0 */) { 		// поиск окончен, нормальный выход из рекурсии
				self.active = false;
				machine_done(search_type, machine, self.the_counter);
				if (self.shippets > 0) fine_search(search_type, x_pane);
				else { empty_search(search_type, x_pane); }
				return; 
			}			
			search_machine_post_data.serp_number = n
			var jqXHR = $.ajax({
				type: "POST",
				url: appspot,
				data: JSON.stringify(search_machine_post_data),
				dataType: "json",					// тип данных, которые ожидаются с сервера
				contentType: "application/json",	// тип данных, которые отсылаются на сервер
				cache: false,
				crossDomain: true
			});
			jqXHR.done(function(response) {
				search_tabs[search_type].calls++;			// количество успешно сделанных запросов ко всем поисковым машинам
				self.the_counter++;							// количество успешно сделанных запросов к данной поисковой машине
				var iframe_load = false;					// индикатор успешной загрузки контента в динамический iframe
				var reply_word = response.reply_word;
				var serp_number = response.serp_number;
				var $iframe, timer, tab_timer, inner_timer, the_tab;
				if(reply_word == 'normal') {
					var received_cookies = response.received_cookies;		//	работа с куками, которые пришли с Google App Engine
					received_cookies = received_cookies.toString().replace(reg_cookies, '').replace(reg_space,'');
					if (received_cookies.indexOf('sid') < 0) {
						if (received_cookies.length > 0) received_cookies += the_comma;
						received_cookies += voice.mailru_sid;
					}
					if (received_cookies.indexOf('sid') < 0) received_cookies += (the_comma + voice.mailru_searchuid);
					search_machine_post_data.cookies = received_cookies;	// установим свежие куки
//					console.log('search_machine_post_data.cookies = ' + search_machine_post_data.cookies);
					if(ff) {		// Браузер Mozilla Firefox (Gecko)
//						var the_tab = window.open('','_blank');		// Контрольное окно
						if(search_type == 'images' || search_type == 'video'){				// картинки обслужим во всплывающем окне (иначе не получается)
						the_tab = window.open('',search_type, 'left=9999,top=9999,width=50,height=50,location=no,directories=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no,alwaysRaised=no');
						tab_timer = setInterval(function(){
							if(the_tab) { 
								clearInterval(tab_timer);
								the_tab.document.open("text/html", "replace");
								the_tab.document.write(response.serp);  
								the_tab.document.close();
								var js_result, denied;
								$(the_tab.document).ready(function(){
									inner_timer = setInterval(function(){
										js_result = the_tab.document.getElementById("mediaResponsesList");
										if(js_result && js_result.innerHTML.length > 0) {
											clearInterval(inner_timer);
											temp.innerHTML = js_result.innerHTML; 
											the_tab.close();
											iframe_load = true;
											firefox(temp);
										}
									},5);
								});
							}
						},10);
						} else if(search_type == the_web) {		// глобальный поиск обслужим в динамическом iframe, с изысками для FF
						var z = response.serp.replace(/window/g,"document");
						var pos = z.indexOf('<head>');		// подавление выдачи ошибок из Iframe
						if(pos>0) z = (z.substr(0,pos+6) + "<script type='text/javascript'>" + voice.console_script + '</s' + 'cript>' + z.substr(pos+6));
						$iframe = $('<iframe/>').appendTo('body').on('load',function(){
							$(this).contents().find('body').html('Я'); 
							var iframe = this;
							var invisible_doc = iframe.contentDocument || iframe.contentWindow.document;
							invisible_doc.designMode = 'on';
							invisible_doc.open("text/html", "replace");
							invisible_doc.write(z); 
							invisible_doc.close();
							timer = setInterval(function(){
								temp.innerHTML = '';
								temp.innerHTML = $(iframe).contents().find('body').find('#js-result').html();
								if((temp.innerHTML.indexOf('js-result') > -1) || (temp.innerHTML.indexOf('mediaResponsesList') > -1)){
									clearInterval(timer);
									iframe_load = true;
									firefox(temp);
									$iframe.remove();						// удалим временный iframe
								}
							},10);
						});
						} else { 		// остальные виды поиска не обслуживаем
							self.active = false; 
							console.log(voice.s_err_serp);
							machine_done(search_type, machine, self.the_counter);
							empty_search(search_type, x_pane);
							return; 
						}
					} else {		// Браузеры с движком Webkit
						// Откроем пришедший serp в невидимлм iframe и там с ним разберемся...
						var invisible_iframe = document.createElement('iframe');
//						invisible_iframe.className = 'invisible';
						invisible_div.appendChild(invisible_iframe);			// создадим временный iframe
						var invisible_doc = invisible_iframe.contentDocument || invisible_iframe.contentWindow.document;
						var z = response.serp ? response.serp.replace(/window/g,"document").replace(new RegExp('/n', 'g'), '') : 'Пустой серп';
// начало отладочного кода				
/*				
//				alert(JSON.stringify(response.received_cookies) + '   ' + JSON.stringify(response.serp)));
//				console.log('received_cookies = ' + JSON.stringify(response.received_cookies));
				var the_tab = window.open('','_blank');		// Контрольное окно 
				var tab_timer = setInterval(function(){
					if(the_tab) { 
						clearInterval(tab_timer);
						the_tab.document.open("text/html", "replace");
						the_tab.document.write(z);  
						the_tab.document.close();
					}
				},10);
*/			
// конец отладочного кода						
						var pos = z.indexOf('<head>');		// подавление выдачи ошибок из Iframe
						if(pos>0) z = (z.substr(0,pos+6) + "<script type='text/javascript'>" + voice.console_script + '</s' + 'cript>' + z.substr(pos+6));
						invisible_doc.open("text/html", "replace");
						try { invisible_doc.write(z); } catch(e) {};
						invisible_doc.close();	
						$(invisible_iframe).load(function() {
							iframe_load = true;
							firefox(invisible_doc);
							invisible_iframe.parentNode.removeChild(invisible_iframe);			// удалим временный iframe
						});
					}
				} else if(reply_word == 'denied'){ 									// если Mail.ru брыкается
//					ситуация обработана выше					
				} else if(reply_word == 'empty') {
					self.active = false; 
					console.log(voice.s_err_serp);
					machine_done(search_type, machine, self.the_counter);
					empty_search(search_type, x_pane);
					return;
				} else if(reply_word == 'error') {			// Ошибка сервера, обнаружено исключение
					console.log(machine + the_defis + voice.server_err + response.exception);
					self.active = false;
					console.log(voice.s_err_exception);
					machine_done(search_type, machine, self.the_counter);
					forbidden_search(search_type, x_pane);
					return;	
				}
				if(true){
					setTimeout(function() { 						// если динамический iframe долго не загружается (ошибки Mail.ru?)
//					if(the_tab) the_tab.close();
					if(!iframe_load) {
						if(timer) clearInterval(timer);
						if($iframe) $iframe.remove();						// удалим временный iframe
						console.log(voice.s_err_iframe);		// Ошибка при загрузке контента в динамический iframe (Mail.ru)
						if(self.the_counter > voice.mail_counter_max) { 	// поисковая машина временно недоступна (исчерпан лимит запросов)
							machine_denied(search_type, machine);
							self.active = false; 
							console.log(voice.s_err_limit);
							machine_done(search_type, machine, self.the_counter); 
							forbidden_search(search_type, x_pane);
							return; 
						}			
						appspot = spot_generator(voice.appspot_arr, mailru_appspot_opened, 2);		// сменим прокси-сервер
						self.the_counter++;
						get_8_mailru(n, true);							// попробуем с другим прокси
					}
					}, 3000);
				}
//				Здесь выполняется парсинг серпа				
				function firefox(doc){
						var the_feed, feeds = {responseData:{results:[]}};
						shippets_in_serp = 0;
						var anti = dojo.query('#antirobot', doc)[0];
						var deny = false;
						if(doc.innerHTML) deny = (doc.innerHTML.indexOf('antirobot') > -1) ? true : ((doc.innerHTML.indexOf(voice.mailru_denied) > -1) ? true : false);
						if (anti || deny) {
							if(self.the_counter > voice.mail_counter_max) { 	// поисковая машина временно недоступна (исчерпан лимит запросов)
								machine_denied(search_type, machine);
								self.active = false; 
								console.log(voice.s_err_limit);
								machine_done(search_type, machine, self.the_counter); 
								forbidden_search(search_type, x_pane);
								return; 
							}			
							appspot = spot_generator(voice.appspot_arr, mailru_appspot_opened, 2);		// сменим прокси-сервер
							empty_serp(search_type, machine, serp_number, appspot);
							get_8_mailru(n, true);							// попробуем с другим прокси
						} else {
							normal_serp(search_type, machine, serp_number);
							if(search_type == the_web) {
								dojo.query('.result__li', doc).forEach(function(item){ 
									var a_title = dojo.query('h3.result__title a.light-link', item)[0];
									if(a_title) {
										var link = a_title.href;
										if ($(a_title).hasClass('never-visited')) link = link.replace(location.hostname, 'go.mail.ru');
										var unescapedUrl = link;
										var titleNoFormatting = a_title.innerHTML;
										if (unescapedUrl && titleNoFormatting) {
											the_feed = {'unescapedUrl':unescapedUrl, 'titleNoFormatting':titleNoFormatting};
											var text = dojo.query('div.result__snp', item)[0];
											the_feed.content = text ? text.innerHTML : voice.no_content;
											feeds.responseData.results.push(the_feed);
											shippets_in_serp++;
										}
									}
								})
								
							} else if (search_type == 'images') {
								dojo.query('.js-images-item.images-item', doc).forEach(function(item){ 
									var the_img = dojo.query('img', item)[0];
									var link = the_img.getAttribute('rel');
									var title = the_img.getAttribute('data-content');
									if (link && title) {
										var content = the_img.getAttribute('data-pretty');
										var tbUrl = the_img.src;
										the_feed = {'unescapedUrl':link, 'contentNoFormatting':title};
										the_feed.titleNoFormatting = content || title;
										the_feed.tbUrl = tbUrl || link;
										feeds.responseData.results.push(the_feed);
										shippets_in_serp++;
									}
								})
							} else if (search_type == 'video') {
								dojo.query('.js-video-item.video-item', doc).forEach(function(item){ 
									var the_video = dojo.query('img', item)[0];
									var url = the_video.getAttribute('data-url');
									if (url.indexOf('youtube') >= 0) {
										var title = the_video.getAttribute('data-title');
										if (url && title) {
											var content = the_video.getAttribute('data-pretty');
											the_feed = {'url':url, 'titleNoFormatting':title};
											the_feed.content = title;
											feeds.responseData.results.push(the_feed);
											shippets_in_serp++;
										}
									}
								})
							}
							if (shippets_in_serp) make_snippets(feeds, x_pane, search_type, search_tabs[search_type].had);	// делаем сниппеты
							self.shippets += shippets_in_serp;
							search_tabs[search_type].snippets += shippets_in_serp;
							if (response.request_text) console.log(machine + ' - request_text = ' + response.request_text);
							get_8_mailru(n + 1, false);					// продолжим поиск рекурсивно	
						}					
				}
				
			});
			jqXHR.fail(function(obj, status) { 
				ajax_fail(search_type, machine, status, jqXHR.readyState); 
				self.active = false;
				console.log(voice.s_err_post);
				machine_done(search_type, machine, self.the_counter); 
				forbidden_search(search_type, x_pane);
				return;										// ошибка поисковой машины
			});
			setTimeout(function() { 						// если вообще нет ответа от сервера
				if(!self.active) return;
				if(jqXHR.readyState < 4) { 
					self.active = false; 
					console.log(voice.s_err_long);
					machine_done(search_type, machine, self.the_counter);
					forbidden_search(search_type, x_pane); 
				}
			}, 7000);
		}		
	}
	//	Конец работы с Mail.ru через Google App Engine

//	Начало работы с Yandex Search через Google App Engine
	engine_makers.Yandex_task_constructor = function(search_type, make_snippets, machine) {
		var shippets_in_serp, appspot, search_machine_post_data = {};
		req_text = req_text.replace(reg_special, the_special);
		search_machine_post_data.request_text = ((search_site) ? "site:" + search_site + " " + req_text : req_text);
		search_machine_post_data.search_engine_name = machine;
		search_machine_post_data.search_type = search_type;
		var x_pane = search_tabs[search_type].x_pane;
		if(search_type == the_web) {
			search_machine_post_data.search_engine_url = voice.yandex_web_engine_url;
		} else if(search_type == 'images') {
			search_machine_post_data.search_engine_url = voice.yandex_images_engine_url;
		} else if (search_type == 'video') {
			search_machine_post_data.search_engine_url = voice.yandex_video_engine_url;
		} else { this.active = false; empty_search(search_type, x_pane); return; }
		var self = this;			// внутренняя ссылка на объект
		self.active = true;			// флажок немедленного останова
		self.the_counter = 0;		// счетчик запросов к Yandex Search
		self.shippets = 0;
//		Предварительная работа с куками для Яндекс	
		var document_cookie = document.cookie.replace(/;/gi,',').replace(reg_space,''); 
		yandexuid_pair = get_cookie_pair('yandexuid');   			// возьмем куку Яндекса yandexuid, если она есть
		if(!yandexuid_pair) yandexuid_pair = 'yandexuid=9423843411535993331';
//		if(!yandexuid_pair) yandexuid_pair = get_yandexuid_pair(); 	// случайный yandexuid
//		search_machine_post_data.cookies = yandexuid_last = yandexuid_pair + the_comma + document_cookie;
		search_machine_post_data.cookies = voice.y_cookie_start;
		appspot = spot_generator(voice.appspot_arr, yandex_appspot_opened, 2);
//		appspot = voice.grab;
		machine_start(search_type, machine, appspot);
		get_8_yandex(0);			// начать поиск	в Yandex Search
// 		Делаем поиск, получаем порции фидов
		function get_8_yandex(n) {
			if(!self.active) { 			// поиск окончен, принудительный выход из рекурсии
				machine_stop(search_type, machine); 
				machine_done(search_type, machine, self.the_counter);
//				console.log('Выход 1');
				return; 
			} else if(n >= Number(options.search_engines.Yandex) || shippets_in_serp == 0) { 		// поиск окончен, нормальный выход из рекурсии
				self.active = false;
				machine_done(search_type, machine, self.the_counter);
				if (self.shippets > 0) fine_search(search_type, x_pane);
				else empty_search(search_type, x_pane);
//				console.log('Выход 2');
				return; 
			}			
			search_machine_post_data.serp_number = n
			var jqXHR = $.ajax({
				type: "POST",
				url: appspot,
				data: JSON.stringify(search_machine_post_data),
				dataType: "json",
				contentType: "application/json",
				cache: false,
				crossDomain: true
			});
			jqXHR.done(function(response) {
// начало отладочного кода				
/*				
				console.log('reply_word = ' + response.reply_word);
				console.log('serp_number = ' + response.serp_number);
				console.log('received_cookies = ' + response.received_cookies);
				console.log('response_data = ' + response.response_data);
				console.log('exception = ' + response.exception);
				alert(JSON.stringify(response.reply_word) + '   ' + JSON.stringify(response.received_cookies));
				var the_tab = window.open('','_blank');		// Контрольное окно 
				var tab_timer = setInterval(function(){
					if(the_tab) { 
						clearInterval(tab_timer);
						the_tab.document.open("text/html", "replace");
						the_tab.document.write(JSON.stringify(response.response_data));  
						the_tab.document.close();
					}
				},10);
*/				
// конец отладочного кода				
				search_tabs[search_type].calls++;			// количество успешно сделанных запросов ко всем поисковым машинам
				self.the_counter++;							// количество успешно сделанных запросов к данной поисковой машине
				var reply_word = response.reply_word;
				var serp_number = response.serp_number;
				if(reply_word == 'normal') {
					shippets_in_serp = 0;
					var received_cookies = response.received_cookies ? response.received_cookies.toString().replace(reg_cookies, '').replace(reg_space,'') : voice.y_cookie_start;
					var received_data = response.response_data;
					normal_serp(search_type, machine, serp_number);
					//	Работа с куками, которые пришли с Google App Engine
					received_arr = received_cookies.split(',');
					if(received_cookies.indexOf('yandexuid') >= 0) {		// найдем и сохраним свежий yandexuid
						for(var k = 0; k < received_arr.length; k++) {
							if(received_arr[k].indexOf('yandexuid') >= 0) yandexuid_last = received_arr[k].replace(reg_space,'');
						}
//						search_machine_post_data.cookies = received_cookies + the_comma + document_cookie;	// установим свежие куки
						search_machine_post_data.cookies = voice.y_cookie_start;
					} else {  
//						search_machine_post_data.cookies = received_cookies + the_comma + yandexuid_last + the_comma + document_cookie; // установим свежие куки
						search_machine_post_data.cookies = voice.y_cookie_start;
					}
					shippets_in_serp += make_snippets(JSON.parse(received_data), x_pane, search_type, search_tabs[search_type].had);	// делаем сниппеты
					self.shippets += shippets_in_serp;
					search_tabs[search_type].snippets += shippets_in_serp;
					get_8_yandex(n + 1);					// продолжим поиск рекурсивно	
				} else if(reply_word == 'denied'){ 									// если Яндекс брыкается
					if(self.the_counter > voice.y_counter_max) { // поисковая машина временно недоступна (исчерпан лимит запросов)
						machine_denied(search_type, machine);
						self.active = false; 
						console.log(voice.s_err_limit);
						machine_done(search_type, machine, self.the_counter);
						forbidden_search(search_type, x_pane);
//						console.log('Выход 3');
						return; 
					}			
					appspot = spot_generator(voice.appspot_arr, yandex_appspot_opened, 2);				// сменим прокси-сервер
					empty_serp(search_type, machine, serp_number, appspot);
					search_machine_post_data.cookies = yandexuid_last = get_yandexuid_pair(); 	// сменим yandexuid
					get_8_yandex(n);						// попробуем с другим прокси
				} else if(reply_word == 'empty') {
					self.active = false; 
					console.log(voice.s_err_serp);
					machine_done(search_type, machine, self.the_counter);
					empty_search(search_type, x_pane);
//					console.log('Выход 4');
					return;
				} else if(reply_word == 'error') {			// Ошибка сервера, обнаружено исключение
					console.log(machine + the_defis + voice.server_err + response.exception);
					self.active = false;
					console.log(voice.s_err_exception);
//					get_8_yandex(n+1);
					machine_done(search_type, machine, self.the_counter);
					forbidden_search(search_type, x_pane);
					return;	
				}
			});
			jqXHR.fail(function(obj, status) { 
				ajax_fail(search_type, machine, status, jqXHR.readyState);
				self.active = false;
				console.log(voice.s_err_post);
				machine_done(search_type, machine, self.the_counter);
				forbidden_search(search_type, x_pane);
				return;										// ошибка поисковой машины
			});
			setTimeout(function() { 						// если вообще нет ответа от сервера
				if(!self.active) return;
				if(jqXHR.readyState < 4) { 
					self.active = false; 
					console.log(voice.s_err_long);
					machine_done(search_type, machine, self.the_counter);
					forbidden_search(search_type, x_pane); 
				}
			}, 7000);
		}		
	}
	//	Конец работы с Yandex Search через Google App Engine

	// Начало работы с Google Ajax Search, получаем порции по 8 фидов - сейчас бесплатно не работает
	engine_makers.Google_task_constructor = function(search_type, make_snippets, machine) {
		var x_pane = search_tabs[search_type].x_pane;
		this.active = true;							// флажок немедленного останова
		var shippets_in_serp, status, self = this;	// внутренняя ссылка на объект
		self.shippets = 0;							// счетчик сгенерированных сниппетов
		self.the_counter = 0;							// счетчик запросов к Google Ajax Search
		var url_1 = voice.google_engine_url + search_type + "?v=1.0&key=" + voice.google_key + "&hl=ru&safe=active&callback=?&rsz=8&start=";
		var url_2 = "&q=" + ((search_site) ? "site:" + search_site + " " + req_text : req_text);
		get_8(url_1, 0, url_2);								// начать поиск
		function get_8(url_1, n, url_2) {
			if(!self.active) { 			// поиск окончен, принудительный выход из рекурсии
				machine_done(search_type, machine, self.the_counter); 
				return; 
			} 		
			var	jqXHR = $.getJSON(url_1 + n + url_2)		// запрос к поисковой машине
			.done(function(data) { 							// callback-функция
				search_tabs[search_type].calls++;			// количество успешно сделанных запросов ко всем поисковым машинам
				self.the_counter++;							// количество успешно сделанных запросов к данной поисковой машине
				shippets_in_serp = 0;
				status = data.responseStatus;
				if(status == '403' || status == '503') { 
					self.active = false;
					machine_done(search_type, machine, self.the_counter);
					forbidden_search(search_type, x_pane);
					return; 								// поиск окончен, поисковая машина недоступна
				}
				if(!data.responseData || data.responseData.results.length == 0 || Number(self.the_counter) >= Number(options.search_engines.Google)) {
					if(!n) { 
						self.active = false;
						machine_done(search_type, machine, self.the_counter);
						empty_search(search_type, x_pane); 
						return; 							// поиск окончен, ничего не найдено 
					} else {								// поиск окончен, нормальный выход из рекурсии
						self.active = false;
						machine_done(search_type, machine, self.the_counter); 
						if (self.shippets > 0) fine_search(search_type, x_pane);
						else empty_search(search_type, x_pane);
						return; 					
					}
				}
				shippets_in_serp += make_snippets(data, x_pane, search_type, search_tabs[search_type].had);
				self.shippets += shippets_in_serp;
				search_tabs[search_type].snippets += shippets_in_serp;
				get_8(url_1, n + 8, url_2);					// продолжим поиск рекурсивно
			})
			.fail(function(obj, status) {
				ajax_fail(search_type, machine, status, jqXHR.readyState);
				self.active = false;
				machine_done(search_type, machine, self.the_counter);
				forbidden_search(search_type, x_pane);
				return;										// ошибка поисковой машины
			});
			setTimeout(function() { 						// если вообще нет ответа от сервера
				if(jqXHR.readyState < 4) { 
					self.active = false; 
					machine_done(search_type, machine, self.the_counter);
					forbidden_search(search_type, x_pane); 
				}
			}, 7000);
		}
	}
	// Конец работы с Google Ajax Search

// Сообщения о работе поисковых машин	
function tab_done(search_type) { console.log('Всего сделано запросов - ' + search_type + ' - ' + search_tabs[search_type].calls); }
function machine_done(search_type, machine, the_counter) { console.log(machine + ' - ' + search_type + ' - Всего сделано запросов: '+ the_counter); }
function ajax_fail(search_type, machine, status, readyState) { console.log(machine + " - $.ajax error: " + status + ". jqXHR.readyState: " + readyState); }
function empty_serp(search_type, machine, serp_number, appspot) { console.log(machine + ' - запрос ' + serp_number + the_defis + search_type + ' - пустой serp. ' + appspot); }
function normal_serp(search_type, machine, serp_number) { console.log(machine + ' - запрос ' + serp_number + the_defis + search_type +' - нормальный serp.'); }
function machine_denied(search_type, machine) { console.log(machine + ' - поисковая машина временно недоступна.'); }
function machine_start(search_type, machine, appspot) { console.log(machine + ' - начат новый поиск ' + search_type + the_defis + appspot); }
function machine_stop(search_type, machine) { console.log(machine + ' - работа принудительно закончена.'); }

// Создать (если их нет) и запустить объекты для глобального поиска. Их конструкторы - в объекте engine_makers.
function make_search(tab) {
	var new_search = !tab			// если нет аргументов, необходимо запускать новый поиск на вкладке
	var the_tab = the_web;
	for (var k = 0; k < panes.length; k++) {
		if(panes[k].id == 'global') {				// найдем нужную панель
			the_tab = panes[k].tab;			// обновим активную вкладку, если она задана
			break;	
		}
	}
	search_type = tab ? tab.substr(2) : the_tab;
	x_pane = dojo.byId(search_type);
	panes_stack('global', tab);
	
	if (!new_search) {					// это переключение вкладок
		if (search_tabs[search_type].status) {
			if(search_tabs[search_type].status == 'started') show_coming_search(search_type, x_pane);	// на этой вкладке сейчас работают поисковые машины?
			else hide_coming_search(search_type, x_pane);
			return;							// с этой вкладкой начата работа, для неё обозначен статус, пусть продолжается начатый поиск и/или отображаются результаты.
		}
	}
	
	// Это начало нового поиска. Остановим работающие поисковые машины, если такие найдутся
	if(new_search) {
		for(var tab in search_tabs) {
			search_tabs[tab].snippets = 0; 
			search_tabs[tab].status = null; 
			if(!search_tabs[tab].engines) search_tabs[tab].engines = {};
			else stop_search_engines(tab);
		}
	} else 	search_tabs[search_type].snippets = 0;									// это переключение на вкладку, с которой ещё не работали, но сейчас начнем...								
	search_tabs[search_type].calls = 0;												// количество сделанных обращений к прокси-серверам
	search_tabs[search_type].had = [];												// массив имен найденных ресурсов (чтобы не повторялись)
	search_tabs[search_type].x_pane = x_pane										// панель для выдачи сниппетов
	x_pane.innerHTML = voice.preloader; 											// прелоадер
	show_coming_search(search_type, x_pane);										// показать кнопку останова поиска
	
	// для нужной вкладки запустим необходимые поисковые машины
	search_tabs[search_type].status = 'started';
	for(var machine in options.search_engines) {
		if(Number(options.search_engines[machine]) > 0) {
			search_tabs[search_type].engines[machine] = new engine_makers[machine + '_task_constructor'](search_type, snippets_makers['make_'+search_type+'_snippets'], machine); 
		}
	}
}	
	
// Все ли поисковые машины закончили работу на вкладке?
function all_done(search_type) { 
	var done = true;
	for(var engine in search_tabs[search_type].engines) {
		if(search_tabs[search_type].engines[engine].active) done = false;
	}
	return done;
}
	
// Варианты удачного и неудачного поиска	
function fine_search(search_type, x_pane) { 
	if(all_done(search_type)) {
		if($('div:not(.search_forbidden)', $(x_pane)).is(':empty')) {}		// есть ли сниппеты?
		else $('div.search_forbidden', $(x_pane)).remove();					// если есть, тогда удалим затесавшиеся сюда voice.forbidden
//		if(sort_attr == 'd') web_snippets_dominance(x_pane, search_type); 	// cортирует сниппеты по доминированию
		if(options.sort.d) web_snippets_dominance(x_pane, search_type); 	// cортирует сниппеты по доминированию
		x_pane.lastChild.innerHTML = '<br><br>';
		hide_coming_search(search_type);
		search_tabs[search_type].status = 'fine';
		tab_done(search_type);
	}
}
function forbidden_search(search_type, x_pane) { 
	if(all_done(search_type)) {
		$('div.search_forbidden', $(x_pane)).remove();						// удалим ранее затесавшиеся voice.forbidden
		coming_search.style.zIndex = -1;
		search_tabs[search_type].coming_search = false;	
		if(x_pane) $('.preloader', $(x_pane)).remove();
		$(x_pane).append($('<div/>').addClass('search_forbidden').html(voice.forbidden)); 
		$(x_pane).append($('<br/>'));
		search_tabs[search_type].status = 'forbidden';
		tab_done(search_type);
	}	
}
function empty_search(search_type, x_pane) { 
	if(all_done(search_type)) {
		hide_coming_search(search_type, x_pane);
		if(search_tabs[search_type].snippets == 0) $(x_pane).empty().append($('<div/>').addClass('search_empty').html(voice.not_found)); 
		search_tabs[search_type].status = 'empty';
		tab_done(search_type);
	}
}
// остановим работающие поисковые машины, если такие найдутся
function stop_search_engines(search_type, x_pane) {
	for(var engine in search_tabs[search_type].engines) search_tabs[search_type].engines[engine].active = false;
	hide_coming_search(search_type);
	if(x_pane) $('.preloader', $(x_pane)).html('<br>');
}
// показать / скрыть кнопку останова поиска
function show_coming_search(search_type, x_pane) {
	coming_search.style.zIndex = 1;
	search_tabs[search_type].coming_search = true;	
	$(coming_search).unbind('mouseup').bind('mouseup', function() { stop_search_engines(search_type, x_pane); });	
}
function hide_coming_search(search_type, x_pane) {
	coming_search.style.zIndex = -1;
	search_tabs[search_type].coming_search = false;	
	if(x_pane) $('.preloader', $(x_pane)).html('<br>');
}
	
// Специальные части поисковых посредников
	// Вспомогательные функции для вычисления показателя доминирования
	function alpha(x, y, the_aspect) {
		if( Number(x.getAttribute(the_aspect)) > Number(y.getAttribute(the_aspect)) ) return 1;
		else if( Number(x.getAttribute(the_aspect)) < Number(y.getAttribute(the_aspect)) ) return 0;
		else return null;
	}
	function d_y_x(_y, _x) {	// чило аспектов, по которым _y превосходит _x
		var alpha_tempo, alpha_sum = 0;
		for(var k = 0; k < d_aspects.length; k++) {
			alpha_tempo = alpha(_y, _x, d_aspects[k]);
			if(alpha_tempo) alpha_sum += alpha_tempo;
		}
		return alpha_sum;
	}
	// Конец вспомогательных функций для вычисления показателя доминирования
	
	// Вычисляет показатели доминирования и затем сортирует сниппеты по доминированию и двум вторичным аспектам
	function web_snippets_dominance(x_pane, search_type) {
		var x_cur, x_cur_tempo, x_previous, x_previous_tempo, x_next, first = sort_attr_last.substr(0,1);
		var second = (first == 'r') ? 'p' : 'r';
//		console.log('first = ' + first + '  second = ' + second);
		// В два прохода вычислим показатели доминирования (атрибут 'd') для всех x_element
		var $x_pane_tempo = $('<div/>').html('<br>');	// временный див с результатами поиска (не отображается)
		var x_pane_tempo = $x_pane_tempo.get(0);
		var x_element, $x_element, x_element_d_all, d_y_x_value, x_element_dominir;
		tempo_arr = [];			// вспомогательный массив ссылок на элементы, проходы будут делаться по нему
		$(the_dot + search_type + '_snippet', $(x_pane)).each(function(i, element) { tempo_arr[i] = element; });
		for(var x = 0; x < tempo_arr.length; x++) {
			x_element_d_all = 0;
			for(var y = 0; y < tempo_arr.length; y++) {
				d_y_x_value = d_y_x(tempo_arr[y], tempo_arr[x]);
				if(d_y_x_value > x_element_d_all) x_element_d_all = d_y_x_value;
			};
			x_element = tempo_arr[x];
			$x_element = $(x_element);
			// добавим в сниппет значение "Доминирование" = max_aspects - Показатель доминирования
			x_element_dominir = max_aspects - x_element_d_all;			// количество не улучшаемых аспектов
			$x_element.attr('d', x_element_dominir);
			if(search_type == 'images' || search_type == 'video') {
				var $anc = $('a', $x_element);
				$anc.attr('title', $anc.attr('title') + voice.domin + x_element_dominir);
			}
			else $('.rel_per', $x_element)[0].insertAdjacentHTML('beforeEnd', voice.dominance + x_element_dominir);
			// Теперь собственно сортировка вставкой (в $x_pane_tempo) и пузырьком (комбинированно)
			x_cur = x_pane_tempo.lastChild; 
			x_previous = pSib(x_cur); 
			while( x_previous && x_previous.hasAttribute('d') && (Number(x_previous.getAttribute('d')) < Number(x_element.getAttribute('d'))) ) { 
				x_cur = x_previous; 
				x_previous = pSib(x_cur); 
			}
			x_pane_tempo.insertBefore(x_element, x_cur); 				// ставим сниппет на нужное место во временный див
		};
	
		// Вторичная сортировка (поднятие) сниппетов по двум вторичным аспектам	
		$(x_pane).empty().append($('<br/>'));							// добавим пустую строку	
		x_element = x_pane_tempo.firstChild;
		while(x_element) {
			x_cur = x_pane.lastChild;
			x_previous = pSib(x_cur); 
			while( x_previous
				&& (Number(x_element.getAttribute('d')) == Number(x_previous.getAttribute('d'))) 
				&& (Number(x_element.getAttribute(first)) == Number(x_previous.getAttribute(first))) 
				&& (Number(x_element.getAttribute(second)) > Number(x_previous.getAttribute(second))) 
			) { 
				x_cur = x_previous; 
				x_previous = pSib(x_cur);  
			}
			x_pane.insertBefore(x_element, x_cur); 				// ставим сниппет на нужное место в результирующий див
			x_element = x_pane_tempo.firstChild;
		};
	}	
	// Найдем для сниппета нужное место - вспомогательная функция
	function put_snippet(x_div, x_pane) {
		if(!sort_attr || sort_attr == 'n') { x_pane.insertBefore(x_div, x_pane.lastChild); return; }
		$(x_div).attr('r', aspects.relevance)
			.attr('p', aspects.pertinence)
			.attr('r_m', aspects.relevance_meta)
			.attr('p_m', aspects.pertinence_meta)
			.attr('m_k', aspects.meta_keywords)
			.attr('m_c', aspects.meta_categories);
		var x_cur = x_pane.lastChild; 
		var x_previous = pSib(x_cur); 
		sort_attr_tempo = (sort_attr == 'd') ? sort_attr_last: sort_attr;
		while( x_previous && x_previous.hasAttribute(sort_attr_tempo) && (Number(x_previous.getAttribute(sort_attr_tempo)) < Number(x_div.getAttribute(sort_attr_tempo))) ) { 
			x_cur = x_previous; 
			x_previous = pSib(x_cur); 
		}
		// Вторичная сортировка (поднятие) сниппета	
		if(sort_attr == 'p' || sort_attr == 'p_m') {
			while( x_previous && x_previous.hasAttribute(sort_attr_tempo) && (Number(x_previous.getAttribute(sort_attr_tempo)) == Number(x_div.getAttribute(sort_attr_tempo))) && (Number(x_previous.getAttribute('r')) < Number(x_div.getAttribute('r'))) ) { 
				x_cur = x_previous; 
				x_previous = pSib(x_cur); 
			}
		} else if(sort_attr == 'r' || sort_attr == 'r_m') {
			while( x_previous && x_previous.hasAttribute(sort_attr_tempo) && (Number(x_previous.getAttribute(sort_attr_tempo)) == Number(x_div.getAttribute(sort_attr_tempo))) && (Number(x_previous.getAttribute('p')) < Number(x_div.getAttribute('p'))) ) { 
				x_cur = x_previous; 
				x_previous = pSib(x_cur); 
			}
		}
		x_pane.insertBefore(x_div, x_cur); 		// добавим сниппет в div с результатами поиска
	}
	// Проверка сниппета на уникальность - вспомогательная функция
	function unic_snippet(x_unic, had) {
		var has = false;
		for(k = 0; k < had.length; k++) if(x_unic == had[k]) has = true; 	// этот ресурс уже появлялся ранее?		
		if(has) return true;	// да, появлялся
		else { had.push(x_unic); return false; } 	// 	нет, не появлялся	
	}
	// Делает порции сниппетов для глобального поиска web
	snippets_makers.make_web_snippets = function(data, x_pane, search_type, had) { 
		var snippets = 0;
		for (i in data.responseData.results) {									// обработка порции фидов
			var x_data = data.responseData.results[i]; 							// очередной фид
			var x_title = x_data.titleNoFormatting.replace(reg_html,"").replace(reg_quot, reg_quot_replace); 		// имя ресурса, очищенное от разметки
			x_data.content = x_data.content || x_title							// если content ресурса не задан
			var x_content = x_data.content.replace(reg_html,'').replace(' Скрыть','');				// content ресурса
			var x_url = x_data.unescapedUrl;									// url ресурса
			var x_unic = x_url;
			var x_domain = reg_host.exec(x_data.unescapedUrl)[2];				// домен ресурса
			if(x_unic.indexOf(voice.y_images_search) > -1) x_unic = voice.y_images_search;
			if(x_unic.indexOf(voice.y_video_search) > -1) x_unic = voice.y_video_search;
			if(unic_snippet(x_unic + x_title, had)) continue;				// не повторять сниппеты
			calc_aspects(x_title + space + x_content + space + x_domain.replace(reg_the_dot,space));		// вычисление аспектов сниппета 
			var x_div = document.createElement("div");							// дальше - создаем сниппет
			var x_name = document.createElement("div");
			var favicon = voice.favicon_1 + x_domain + voice.favicon_2;
			x_name.innerHTML = favicon + x_title;
			$(x_name).addClass('my_link');
			var x_inn = '<div>' + x_content + '</div>';
			var x_hostname = '<div class="hostname">' + x_domain + '<div class="info rel_per">' + voice.relevance + ((sort_attr=='r_m')?aspects.relevance_meta:aspects.relevance) + voice.pertinence + ((sort_attr=='p_m')?aspects.pertinence_meta:aspects.pertinence); /*+ ' r_m = '+aspects.relevance_meta + ' p_m = '+aspects.pertinence_meta + ' m_k = '+aspects.meta_keywords + ' m_c = '+aspects.meta_categories*/ + '</div></div>';
			$(x_div).html(x_inn+x_hostname);
			$(x_div).prepend($(x_name));
			// зададим атрибуты url и hostname, они понадобятся обработчику onmouseup
			x_name.setAttribute('url', x_url);
			x_name.setAttribute('hostname', x_domain);
			if(x_name.firstChild && x_name.firstChild.setAttribute) {
				x_name.firstChild.setAttribute('url', x_url);
				x_name.firstChild.setAttribute('hostname', x_domain);
			}
			dojo.connect(x_name, "onmouseup", null, on_search_up);				// цепляем обработчик onmouseup
			$(x_div).addClass(search_type + '_snippet').addClass('my_snippet');
			put_snippet(x_div, x_pane);			// Найдем для сниппета нужное место
			snippets++;
		}
		return snippets;
	}
	
	// Делает порции сниппетов для глобального поиска images
	snippets_makers.make_images_snippets = function(data, x_pane, search_type, had) { 
		var snippets = 0;
		for (i in data.responseData.results) {								// обработка порции фидов
			var x_data = data.responseData.results[i]; 						// очередной фид
			var x_title = x_data.titleNoFormatting.replace(reg_html,"").replace(reg_quot, reg_quot_replace); 	// имя ресурса, очищенное от разметки
			var x_url = x_data.unescapedUrl;								// url ресурса
			var x_content = x_data.contentNoFormatting.replace(reg_html,"");// content ресурса
			x_content = x_content.replace(reg_quot, reg_quot_replace);		// поставим нормальные кавычки
			if(unic_snippet(x_url, had)) continue;							// не повторять сниппеты
			calc_aspects(x_title + space + x_content);						// вычисление аспектов сниппета 
			var x_tb_url = x_data.tbUrl;									// url фото миниатюры
			light_image(x_pane);
		}
		// Сниппет - картинка
		function light_image(x_pane) {
			var img = new Image();
				img.src = x_tb_url;
				img.alt = '';
				img.style.cssText = 'margin:0;vertical-align:middle;height:'+img_size+'px;width:'+img_size+'px;border-radius:'+(img_radius-3)+'px;border:0';
			var anchor = document.createElement('a');
				anchor.href = x_url; 
				anchor.title = x_content + the_dot + voice.relevan + ((sort_attr=='r_m')?aspects.relevance_meta:aspects.relevance) + voice.pertinen + ((sort_attr=='p_m')?aspects.pertinence_meta:aspects.pertinence); 
				anchor.setAttribute("tb_url", x_tb_url);					// фото миниатюра, если полное фото не загрузится
				$(anchor).colorbox({rel:'image', slideshow:true, photo:true, maxWidth:"95%", maxHeight:"95%"});
			var x_div = document.createElement('div'); 
				x_div.style.cssText = "display:inline-block;border:3px solid gainsboro;margin:5px;border-radius:"+img_radius+"px;-webkit-border-radius:"+img_radius+"px;-moz-border-radius:"+img_radius+"px;box-shadow:4px 5px 3px gray;border-style:inset";
			anchor.appendChild(img);
			x_div.appendChild(anchor);
			$(x_div).addClass(search_type + '_snippet').css('margin','3px');
			put_snippet(x_div, x_pane);			// Найдем для сниппета нужное место
			snippets++;
			$(x_pane).abs_animate( { properties:{ height:1.1, width:1.1 } }, img);
		}
		return snippets;
	}

	// Делает порции сниппетов для глобального поиска video
	snippets_makers.make_video_snippets = function(data, x_pane, search_type, had) {
		var snippets = 0;
		for (i in data.responseData.results) {								// обработка порции фидов
			var x_data = data.responseData.results[i]; 						// очередной фид
			var x_title = x_data.titleNoFormatting.replace(reg_html,"").replace(reg_quot, reg_quot_replace); 	// имя ресурса, очищенное от разметки
			var x_url = x_data.url;											// url ресурса
			var x_content = x_data.content.replace(reg_html,"");			// content ресурса
			if(unic_snippet(x_url, had)) continue;							// не повторять сниппеты
			calc_aspects(x_title + space + x_content);						// вычисление аспектов сниппета
			var x = x_url.indexOf("\u003d");								// ищем начало короткого адреса видео на youtube
			var vid = x_url.substring(x + 1, x + 12);						// берем короткий адрес видео на youtube
			light_video(x_pane);
		}
		// Сниппет - видео
		function light_video(x_pane) {
			var img = new Image();
				img.src = 'http://i.ytimg.com/vi/'+vid+'/mqdefault.jpg';
				img.alt = '';
				img.style.cssText = 'margin:0;vertical-align:middle;height:'+vid_size+'px;width:'+vid_size+'px;border-radius:'+(vid_radius-3)+'px;border:0';
			var anchor = document.createElement('a');
				anchor.href = 'http://www.youtube.com/embed/'+vid+'?rel=1&amp;wmode=transparent';
				anchor.title = x_title + the_dot + voice.relevan + ((sort_attr=='r_m')?aspects.relevance_meta:aspects.relevance) + voice.pertinen + ((sort_attr=='p_m')?aspects.pertinence_meta:aspects.pertinence); 
				anchor.title = anchor.title.replace(reg_quot, reg_quot_replace);	// поставим нормальные кавычки
				$(anchor).colorbox({rel:'video', iframe:true, innerWidth:720, innerHeight:480, maxWidth:"95%", maxHeight:"95%"});
			var x_div = document.createElement('div'); 
				x_div.style.cssText = "display:inline-block;border:3px solid gainsboro;margin:5px;border-radius:"+vid_radius+"px;-webkit-border-radius:"+vid_radius+"px;-moz-border-radius:"+vid_radius+"px;box-shadow:4px 5px 3px gray;border-style:inset";
			anchor.appendChild(img);
			x_div.appendChild(anchor);
			$(x_div).addClass(search_type + '_snippet').css('margin','3px');;
			put_snippet(x_div, x_pane);			// Найдем для сниппета нужное место
			snippets++;
			$(x_pane).abs_animate( { properties:{ height:1.1, width:1.1 } }, img);
		}
		return snippets;
	}
	// Делает порции сниппетов для глобального поиска blogs
	snippets_makers.make_blogs_snippets = function(data, x_pane, search_type, had) {
		var snippets = 0;
		for (i in data.responseData.results) {						// обработка порции фидов
			var x_data = data.responseData.results[i]; 				// очередной фид
			var x_host = reg_host.exec(x_data.postUrl)[2];
			var x_title = x_data.titleNoFormatting.replace(reg_html,"").replace(reg_quot, reg_quot_replace); // имя ресурса, очищенное от разметки
			var x_url = x_data.postUrl;		// url ресурса
			var x_content = x_data.content.replace(reg_html,"");	// content ресурса
			if(unic_snippet(x_url + x_title, had)) continue;	// не повторять сниппеты
			calc_aspects(x_title + space + x_content);				// вычисление аспектов сниппета
			var x_div = document.createElement("div");				// дальше - создаем сниппет
			var x_name = document.createElement("div");
			var favicon = voice.favicon_1 + x_host + voice.favicon_2;
			x_name.innerHTML = favicon + x_title;
			$(x_name).addClass('my_link');
			var x_inn = '<div>' + x_data.content + '</div>';
			x_data.author = x_data.author || voice.unknown;
			var the_data = x_data.publishedDate ? x_data.publishedDate.substring(0, x_data.publishedDate.indexOf('-') - 1) : voice.unknown;
			x_inn += '<div class="info">Автор: ' + x_data.author + '.&nbsp;&nbsp;Дата публикации: ' + the_data + '</div>';
			var x_hostname = '<div class="hostname">' + x_host + '<div class="info rel_per">' + voice.relevance + ((sort_attr=='r_m')?aspects.relevance_meta:aspects.relevance) + voice.pertinence + ((sort_attr=='p_m')?aspects.pertinence_meta:aspects.pertinence)+'</div></div>';
			$(x_div).html(x_inn+x_hostname);
			$(x_div).prepend($(x_name));
			// зададим атрибуты url и hostname, они понадобятся обработчику onmouseup
			x_name.setAttribute('url', x_url);
			x_name.setAttribute('hostname', x_host);
			if(x_name.firstChild && x_name.firstChild.setAttribute) {
				x_name.firstChild.setAttribute('url', x_url);
				x_name.firstChild.setAttribute('hostname', x_host);
			}
			dojo.connect(x_name, "onmouseup", null, on_search_up);	// цепляем обработчик onmouseup
			$(x_div).addClass('my_snippet').addClass(search_type + '_snippet');
			put_snippet(x_div, x_pane);			// Найдем для сниппета нужное место
			snippets++;
		}
		if(snippets > 0) $('div.search_empty', x_pane).removeClass('search_empty')
		return snippets;
	}
	// Делает порции сниппетов для глобального поиска news
	snippets_makers.make_news_snippets = function(data, x_pane, search_type, had) {
		var snippets = 0;
		for (i in data.responseData.results) {				// обработка порции фидов
			var x_data = data.responseData.results[i]; 		// очередной фид
			var x_host = reg_host.exec(x_data.unescapedUrl)[2];
			var x_title = x_data.titleNoFormatting.replace(reg_html,"").replace(reg_quot, reg_quot_replace); // имя ресурса, очищенное от разметки
			var x_url = x_data.unescapedUrl;		// url новости
			var x_content = x_data.content.replace(reg_html,"");	// content ресурса
			if(unic_snippet(x_url + x_title, had)) continue;	// не повторять сниппеты
			calc_aspects(x_title + space + x_content);				// вычисление аспектов сниппета	
			var x_div = document.createElement("div");				// дальше - создаем сниппет
			var x_name = document.createElement("div");
			var favicon = voice.favicon_1 + x_host + voice.favicon_2;
			x_name.innerHTML = favicon + x_title;
			$(x_name).addClass('my_link');
			var x_inn = '<div>' + x_data.content + '</div>';
			x_inn += '<div class="info">Источник: ' + x_data.publisher + '.&nbsp;&nbsp;Дата публикации: ' + x_data.publishedDate.substring(0, x_data.publishedDate.indexOf('-') - 1) + '</div>';
			var x_hostname = '<div class="hostname">' + x_host + '<div class="info rel_per">' + voice.relevance + ((sort_attr=='r_m')?aspects.relevance_meta:aspects.relevance) + voice.pertinence + ((sort_attr=='p_m')?aspects.pertinence_meta:aspects.pertinence)+'</div></div>';
			$(x_div).html(x_inn+x_hostname);
			$(x_div).prepend($(x_name));
			// зададим атрибуты url и hostname, они понадобятся обработчику onmouseup
			x_name.setAttribute('url', x_url);
			x_name.setAttribute('hostname', x_host);
			if(x_name.firstChild && x_name.firstChild.setAttribute) {
				x_name.firstChild.setAttribute('url', x_url);
				x_name.firstChild.setAttribute('hostname', x_host);
			}
			dojo.connect(x_name, "onmouseup", null, on_search_up);	// цепляем обработчик onmouseup
			$(x_div).addClass('my_snippet').addClass(search_type + '_snippet');
			put_snippet(x_div, x_pane);			// Найдем для сниппета нужное место
			snippets++;
		}
		return snippets;
	}
	// Делает порции сниппетов для глобального поиска books
	snippets_makers.make_books_snippets = function(data, x_pane, search_type, had) {
		var snippets = 0;
		for (i in data.responseData.results) {							// обработка порции фидов
			var x_data = data.responseData.results[i]; 					// очередной фид
			var x_host = reg_host.exec(x_data.unescapedUrl)[2];
			var x_title = x_data.titleNoFormatting.replace(reg_html,"").replace(reg_quot, reg_quot_replace);	// имя ресурса, очищенное от разметки
			var x_url = x_data.unescapedUrl;							// url книги
			var x_tbUrl = x_data.tbUrl;									// обложка
			var x_authors = x_data.authors;								// авторы
			if(unic_snippet(x_host + x_title, had)) continue;	// не повторять сниппеты
			calc_aspects(x_title + space + x_authors);					// вычисление аспектов сниппета	
			// дальше - создаем сниппет
			var x_img = new Image();
				x_img.src = x_tbUrl;
				x_img.alt = '';
				x_img.style.cssText = 'float:left;height:'+x_data.tbHeight+'px;width:'+x_data.tbWidth+'px;border:0;margin-right:5px;margin-bottom:5px;';		
			$x_div = $('<div/>').css({'clear':'left', 'min-height':'80px'});
			var x_div = $x_div.get(0);
			var x_name = document.createElement("div");
			x_name.innerHTML = x_title;
			$(x_name).addClass('my_link');
			var x_inn = '<div>Авторы:&nbsp;' + x_authors + '</div>';
			x_inn += '<div class="info">Книжный номер:&nbsp;' + x_data.bookId + '.&nbsp;Год издания:&nbsp;' + x_data.publishedYear + '.&nbsp;Страниц:&nbsp;' + (x_data.pageCount!=0?x_data.pageCount:voice.unknown) + '.</div>';
			var x_hostname = '<div class="hostname">' + x_host + '<div class="info rel_per">' + voice.relevance + ((sort_attr=='r_m')?aspects.relevance_meta:aspects.relevance) + voice.pertinence + ((sort_attr=='p_m')?aspects.pertinence_meta:aspects.pertinence)+'</div></div>';
			$x_div.html(x_inn+x_hostname);
			$x_div.prepend($(x_name));
			$x_div.prepend($(x_img));
			// зададим атрибуты url и hostname, они понадобятся обработчику onmouseup
			x_name.setAttribute('url', x_url);
			x_name.setAttribute('hostname', x_host);
			if(x_name.firstChild && x_name.firstChild.setAttribute) {
				x_name.firstChild.setAttribute('url', x_url);
				x_name.firstChild.setAttribute('hostname', x_host);
			}
			dojo.connect(x_name, "onmouseup", null, on_search_up);		// цепляем обработчик onmouseup
			$x_div.addClass('my_snippet').addClass(search_type + '_snippet');
			put_snippet(x_div, x_pane);			// Найдем для сниппета нужное место
			snippets++;
		}
		return snippets;
	}
	// Делает порции сниппетов для глобального поиска patent
	snippets_makers.make_patent_snippets = function(data, x_pane, search_type, had) {
		var snippets = 0;
		for (i in data.responseData.results) {							// обработка порции фидов
			var x_data = data.responseData.results[i]; 					// очередной фид
			var x_host = reg_host.exec(x_data.unescapedUrl)[2];
			var x_title = x_data.title.replace(reg_html,"").replace(reg_quot, reg_quot_replace);  			// имя ресурса, очищенное от разметки
			var x_url = x_data.unescapedUrl;							// url ресурса
			var x_content = x_data.content;								// content ресурса
			var x_patentNumber = x_data.patentNumber;					// patentNumber ресурса
			if(unic_snippet(x_patentNumber + x_title, had)) continue;	// не повторять сниппеты
			calc_aspects(x_title + space + x_content);					// вычисление аспектов сниппета	
			if(x_url.indexOf(x_patentNumber) < 0) continue;
			// дальше - создаем сниппет
			var $x_div = $('<div/>').addClass('my_snippet');
			var x_div = $x_div.get(0);
			var $x_name = $('<div/>').addClass('my_link');
			$x_name.attr('url', x_url).attr('hostname', x_host);	// зададим атрибуты url и hostname, они понадобятся обработчику onmouseup
			var $child = $x_name.children[0];
			if($child) $child.attr('url', x_url).attr('hostname', x_host);
			$x_name.bind("mouseup", on_search_up);					// цепляем обработчик onmouseup
			var favicon = voice.favicon_1 + x_host + voice.favicon_2;
			$x_name.html(favicon + x_title);
			var x_inn = '<div>' + x_content + '</div>';
			x_inn += '<div class="info">Номер патента:&nbsp;' + x_data.patentNumber + '.&nbsp;Статус патента:&nbsp;' + x_data.patentStatus + '.</div>';
			var x_hostname = '<div class="hostname">' + x_host + '<div class="info rel_per">' + voice.relevance + ((sort_attr=='r_m')?aspects.relevance_meta:aspects.relevance) + voice.pertinence + ((sort_attr=='p_m')?aspects.pertinence_meta:aspects.pertinence)+'</div></div>';
			$x_div.html(x_inn + x_hostname);
			$x_div.prepend($x_name).addClass(search_type + '_snippet');
			put_snippet(x_div, x_pane);			// Найдем для сниппета нужное место
			snippets++;
		}
		return snippets;
	}
	// Делает порции сниппетов для глобального поиска local
	snippets_makers.make_local_snippets = function(data, x_pane, search_type, had) {}

	// Измеряет меру близости между obj_1 и obj_2. Используется расстояние Левенштейна
	function measure(obj_1, obj_2) {	// свойствами каждого из obj_1 и obj_2 являются лексемы, их значениями - количество повторений данной лексемы
		var distance, count = 0;
		for(var name_1 in obj_1) {
			for(var name_2 in obj_2) {
				distance = levenshtein(name_1, name_2);				// расстояние Левенштейна
				if(isNaN(distance)) continue;
				if(Number(distance) >= Number(options.levenstain.equal)) continue;
				count += (options.levenstain.equal - distance) * obj_1[name_1] * obj_2[name_2];
			}
		}
		return count;
	}
	// Расстояние Левенштейна - алгоритм с настройкой цен операций
	function levenshtein(s1, s2) {
		var s, l = (s = s1.split("")).length, t = (s2 = s2.split("")).length, i, j, m, n;
		if(!(l || t)) return Math.max(l, t);
		for(var a = [], i = l + options.levenstain.insert; i; a[--i] = [i]);
		for(i = t + options.levenstain.remove; a[0][--i] = i;);
		for(i = -1, m = s.length; ++i < m;){
			for(j = -1, n = s2.length; ++j < n;){
				a[(i *= 1) + 1][(j *= 1) + 1] = Math.min(a[i][j + 1] + options.levenstain.remove, a[i + 1][j] + options.levenstain.insert, a[i][j] + ((s[i] != s2[j])?options.levenstain.replace:0));
			}
		}
		return a[l][t];
	}

	// Формируем tokens_obj, пройдя по всем лексамам text. Лексемы образуют свойства tokens_obj, а количество повторов этих лексем есть значение соответствующего свойства
	function make_tokens_obj(obj, text) {
		for(var name in obj) delete obj[name];
		var the_text = text.toLowerCase().replace(reg_punct, ' ').replace(reg_union, ' ').replace(/[\r\n\f]/g, ' ');
		var arr = the_text.split(space);
			for(var k = 0; k < arr.length; k++) {
				var x_token = arr[k];
				if(x_token.length > options.levenstain.max) x_token = x_token.substr(0, options.levenstain.max);
				if(x_token.length < options.levenstain.min) continue;
				if(obj[x_token]) obj[x_token]++;
				else obj[x_token] = 1;
			}
	}
	//Вычисляет значения всех аспектов, характеризующих сниппет (объект aspects)
	function calc_aspects(text) {
		aspects = {};
		make_tokens_obj(tokens_obj, text);
		aspects.relevance = measure(tokens_obj, req_text_obj);				// релевантность сниппета text на основе текста поискового запроса; этот вызов должен стоять первым, ибо он готовит массив tokens[]
		aspects.pertinence = measure(tokens_obj, context_obj);				// пертинентность сниппета text на основе контекста поиска
		aspects.meta_keywords = measure(tokens_obj, meta_keywords_obj);		// мера соответствия сниппета text тексту meta_keywords
		aspects.meta_categories = measure(tokens_obj, meta_categories_obj);	// мера соответствия сниппета text тексту meta_categories
		var addon = aspects.meta_keywords + aspects.meta_categories;
		aspects.relevance_meta = aspects.relevance + addon; 	// релевантность сниппета text на основе текста поискового запроса, keywords и categories со страницы 
		aspects.pertinence_meta = aspects.pertinence + addon; 	// пертинентность сниппета text на основе контекста поиска, keywords и categories со страницы
	}

	// panes - упорядоченный массив визуальных панелей и активных вкладок на этих панелях; обслуживается функций panes_stack(...)
	// panes = [{'id':'semantic','tab':'grab','z':4}, {'id':'global','tab':'web','z':3}, {'id':'docs','tab':'progr','z':2}, {'id':'libs','tab':'lib','z':1}, {'id':'frame','tab':'frame','z':0}];
	 panes_stack = function(pane, tab) {
		alert_hide();
		var the_pane = panes[0];
		if(!arguments.length) {		
			if(search_divs.indexOf(the_pane.id) > -1) { 	// если ушли с панелей поиска
				choice_menu_make(voice.choice_tuning, voice.choice_context, show_context_search);
				for (var k = 0; k < panes.length; k++) {
					the_pane = panes[k];
					if(the_pane.id == 'semantic') break;
				}
			} else the_pane = panes[1];						// если функцию вызвали без аргументов, берем панель под текущей
		} else {						
			for (var k = 0; k < panes.length; k++) {
				the_pane = panes[k];
				if(the_pane.id == pane) {					// найдем нужную панель
					if(tab) the_pane.tab = tab.substr(2);	// обновим активную вкладку, если она задана
					break;									// выскакиваем из цикла
				}
//				the_pane = panes[0];						// есди не нашли нужную панель (этого не должно быть)
			}
		}
		view_pane(the_pane);								// отображение активной панели
		if(the_pane.id == 'global') {
			if(search_tabs[the_pane.tab].coming_search) coming_search.style.zIndex = 1;
			else coming_search.style.zIndex = -1;
		}
		the_pane.z = ++max_z;								// даем панели максимальный zIndex
		panes.sort(pane_comparator);						// теперь эта активная панель первая в массиве
//		console.log('panes_stack: panes = ' + JSON.stringify(panes));
	}
	// Компаратор для визуальных панелей из массива panes[]
	function pane_comparator(a, b) {
		if (a.z < b.z) return 1;
		else return -1;
	}
	// Активирует визуальную панель и вкладку на ней
	function view_pane(pane) {
		// сначала все панели и вкладки сделаем невидимыми
		dojo.query(".fine").forEach(function(item){ 
			item.style.zIndex = -1;
			dojo.query(".centerPanel > div", item).forEach(function(tab){ 
				tab.style.zIndex = -1;
			});
		});
		// Активируем нужную панель и вкладку
		view_tab(pane);
		if(pane.id == 'semantic') close_btn.style.zIndex = -1;
		else {
			close_btn.style.zIndex = 1;
			if(pane.id == 'frame') close_btn.setAttribute('title',voice.close_doc);
			else close_btn.setAttribute('title',voice.close_search);
		}
	}
	// Мягко открывает активную вкладку на панели, каждый раз подгоняя внешний скролл
	function view_tab(pane) {
		$(the_s + pane.tab).css('opacity','0').css('zIndex','0');
		setTimeout(function(){
        anim({
            node: pane.tab,
            properties: { opacity: { start: 0, end: 1 } },
            duration: 200
        }).play();
		dojo.byId(pane.id).style.zIndex = 0;
		},200);
		var skrepka = dojo.query(the_sharp + the_s + pane.tab + ' > .skrepka_fixed')[0];
		if(skrepka && (skrepka.style.visibility == 'visible')) very_scroll(pane.tab); // скролл только панели результатов
		else { 											// скролл всей панели
			var the_pane = (pane.id == 'frame') ? pane.id : (the_s + pane.tab);
			very_scroll(the_pane);
		}
		if(pane.tab.indexOf(the_grab) > -1) {
			get_img($img_z, image_animator_z, 400, pane.tab);
			request.style.display = 'none';
			the_search.style.display = 'none';
			the_logo.style.display = 'inline-block';
		} else {
			request.style.display = 'inline-block';
			the_search.style.display = 'inline-block';
			the_logo.style.display = 'none';
		}
	}
	
// 	Обеспечивает переключение основных панелей (lodlive, dbpedia, wdqs, grab, annotation)	
	make_semantic = function(type) {
		dojo.byId('preloader_start').style.display = 'none';
//		У lodlive исчезает скролл при переключении вкладок, посему немного дёргаем размер iframe
		if(type.indexOf('lodlive') < 0) lodlive_scroll_save();	
		if(type.indexOf('lodlive') > -1) { 
			if(!lodlive_was) lodlive_load(); 
			else { 
				var lodlive_frame = dojo.query('#lodlive > iframe')[0];
				lodlive_frame.style.width = '99%';
				setTimeout(function(){
					lodlive_frame.style.width = '100%';
					if(ff) {
						var iframe_doc = lodlive_frame.contentDocument || lodlive_frame.contentWindow.document;
						var z = dojo.query('.boxTitle', iframe_doc)[0];
						z.scrollIntoView();
						lodlive_frame.contentWindow.scrollBy(200,-100)
					}
				},9);
			}
		} 
		else if(type.indexOf('dbpedia') > -1) { if(!dbpedia_was) dbpedia_start(type); else if(!dbpedia_semantic) get_img($img_x, image_animator_x, 400, type); }
		else if(type.indexOf('wdqs') > -1) { 
			if(!wdqs_was) wdqs_start(type); 
			else if(!wdqs_semantic) get_img($img_wdqs, image_animator_wdqs, 400, type); 
				else {
					var wdqs_frame = dojo.query('#wdqs > iframe')[0];
					wdqs_frame.style.width = '99%';
					setTimeout(function(){wdqs_frame.style.width = '100%';},9);
				}
		}
		else if(type.indexOf('annotation') > -1) { if(!annotation_was) annotation_start(type); else if(!annotation_semantic) get_img($img_y, image_animator_y, 400, type); else  $('#annotation_queryText')[0].focus(); }
		else if(type.indexOf(the_grab) > -1) { get_img($img_z, image_animator_z, 400, type); }
		panes_stack('semantic', type);
	}
	
// Начало функции start
function start() {
	ff = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
	var login = function() { location = voice.login; }
	var registry = function() { location = voice.registry; }
	var logout = function() { location = voice.logout; }
	request = dojo.byId("request");
	var $request = $(request);
	$request.val('').mouseover(function(){$request.unbind('focus'); $request.focus();});
	request_clone = dojo.byId("request_clone");
	var $request_clone = $(request_clone);
	$request_clone.val('').mouseover(function(){$request_clone.unbind('focus'); $request_clone.focus();});
	coming_search = dojo.byId('coming_search');
	the_search = dojo.byId("search");
	the_logo = dojo.byId("logo");
	temp = dojo.byId('invisible_ff');
	$(close_btn).unbind('mouseup').bind('mouseup', function(){
		panes_stack(); 
		coming_search.style.zIndex = -1;
	});
	_grand_user = false; chromeFirst = true; child = null;

	// Кнопки активации панелей dijit.layout.StackContainer
	dojo.query(".demoLayout").forEach(function(item){ 
		var pane_id = item.id;
		dojo.query(".centerPanel > div", item).forEach(function(s_pane){ 
//			console.log('pane_id = ' + pane_id + ' s_pane.id = ' + s_pane.id);
			if (pane_id == 'docs') {
				$(dojo_prefix + '0_' + s_pane.id).parent().parent().unbind('click').bind('click', function() { panes_stack(pane_id, s_pane.id); do_search(true); });
			} else if (pane_id == 'libs') {
				$(dojo_prefix + '1_' + s_pane.id).parent().parent().unbind('click').bind('click', function() { panes_stack(pane_id, s_pane.id); do_search(true); });
			} else if (pane_id == 'global') {
				$(dojo_prefix + '2_' + s_pane.id).parent().parent().unbind('click').bind('click', function() { make_search(s_pane.id); });
			} else if (pane_id == 'semantic') {
				$(dojo_prefix + '3_' + s_pane.id).parent().parent().unbind('click').bind('click', function() { make_semantic(s_pane.id); });
			}
		});
	});
	
	dojo.connect(window, "onresize", null, function(){ 
		if(wdqs_semantic) $wdqs.height($s_wdqs.height() - 3);			// подровнять размеры дивов, чтобы не было внешнего скролла
		if(lodlive_semantic) $lodlive.height($s_lodlive.height() - 3);
		very_scroll();
	});
	set_access();
	// Настроим панель управления
	choice_menu_place = dojo.byId("choice");
	require(["dijit/Menu", "dijit/MenuItem","dijit/form/DropDownButton","dijit/form/TextBox","dojo/domReady!"],
	function(Menu, MenuItem, DropDownButton){
//Меню "Приступая к работе"	
		var begin = new Menu({ style: "display: none;"});
		var show_help_semantic_0 = new MenuItem({
			label: voice.help_semantic_0,
			onMouseUp: help_semantic_0
		});
		begin.addChild(show_help_semantic_0);
		var show_help_semantic_1 = new MenuItem({
			label: voice.help_semantic_1,
			onMouseUp: help_semantic_1
		});
		begin.addChild(show_help_semantic_1);
		var show_help_semantic_2 = new MenuItem({
			label: voice.help_semantic_2,
			onMouseUp: help_semantic_2
		});
		begin.addChild(show_help_semantic_2);
		var show_help_semantic_3 = new MenuItem({
			label: voice.help_semantic_3,
			onMouseUp: help_semantic_3
		});
		begin.addChild(show_help_semantic_3);
		var show_help_semantic_4 = new MenuItem({
			label: voice.help_semantic_4,
			onMouseUp: help_semantic_4
		});
		begin.addChild(show_help_semantic_4);
		var show_help_semantic_5 = new MenuItem({
			label: voice.help_semantic_5,
			onMouseUp: help_semantic_5
		});
		begin.addChild(show_help_semantic_5);
		var show_help_semantic_6 = new MenuItem({
			label: voice.help_semantic_6,
			onMouseUp: help_semantic_6
		});
		begin.addChild(show_help_semantic_6);
		var show_help_semantic_7 = new MenuItem({
			label: voice.help_semantic_7,
			onMouseUp: help_semantic_7
		});
		begin.addChild(show_help_semantic_7);
		var show_help_semantic_8 = new MenuItem({
			label: voice.help_semantic_8,
			onMouseUp: help_semantic_8
		});
		begin.addChild(show_help_semantic_8);
		var show_help_semantic_9 = new MenuItem({
			label: voice.help_semantic_9,
			onMouseUp: help_semantic_9
		});
		begin.addChild(show_help_semantic_9);
		var show_help_context = new MenuItem({
			label: voice.help_context,
			onMouseUp: help_context
		});
		begin.addChild(show_help_context);
		var begin_button = new DropDownButton({
			label: voice.begining,
			dropDown: begin
		});
		begin_button.placeAt(dojo.byId("begin"));
//Меню "Настройки"
	choice_menu_make = function(main_label, label, onMouseUp) {
		choice = new Menu({ style: "display: none;"});
		
		choice_lodlive = new MenuItem({
			label: voice.select_lodlive_option,
			onMouseUp: set_lodlive_opt
		});
		choice.addChild(choice_lodlive);
		
		choice_wdqs = new MenuItem({
			label: voice.select_wdqs_option,
			onMouseUp: set_wdqs_opt
		});
		choice.addChild(choice_wdqs);
		
		var choice_show = new MenuItem({
			label: voice.select_show_short,
			onMouseUp: select_show
		});
		choice.addChild(choice_show);

		var choice_search_engines = new MenuItem({
			label: voice.select_search_engines_short,
			onMouseUp: select_search_engines
		});
		choice.addChild(choice_search_engines);
		
		var choice_context = new MenuItem({
			label: voice.select_context_short,
			onMouseUp: select_context
		});
		choice.addChild(choice_context);
		
		var choice_sort = new MenuItem({
			label: voice.select_sort_short,
			onMouseUp: select_sort
		});
		choice.addChild(choice_sort);
		
		var choice_pareto = new MenuItem({
			label: voice.select_pareto_short,
			onMouseUp: select_pareto
		});
		choice.addChild(choice_pareto);
		
		var choice_levenstain = new MenuItem({
			label: voice.select_levenstain_short,
			onMouseUp: select_levenstain
		});
		choice.addChild(choice_levenstain);
		
		var choice_button = new DropDownButton({
			label: main_label,
			dropDown: choice
		});
		$(choice_menu_place).empty();
		choice_button.placeAt(choice_menu_place);
		lbl_1 = choice_menu_place.querySelector('.dijitButtonText');
	}	
	choice_menu_make(voice.choice_tuning, voice.choice_context, show_context_search);
		
//Меню "Поиск"	
		var search_menu = new Menu({ style: "display: none;"});
		var searchWeb = new MenuItem({
			label: voice.web,
			onMouseUp: function(){ search_selected = the_web; do_search(); }
		});
		search_menu.addChild(searchWeb);
		var searchDocs = new MenuItem({
			label: voice.docs,
			onMouseUp: function(){ search_selected = 'docs'; do_search(); }
		});
		search_menu.addChild(searchDocs);
		var searchLibrary = new MenuItem({
			label: voice.libs,
			onMouseUp: function(){ search_selected = 'libs'; do_search(); }
		});
		search_menu.addChild(searchLibrary);
		var search_leninka = new MenuItem({
			label: voice.leninka,
			onMouseUp: function(){ search_selected = 'leninka'; do_search(); }
		});
		search_menu.addChild(search_leninka);
		var searchWiki_en = new MenuItem({
			label: voice.wiki_en,
			onMouseUp: function(){ search_selected = 'wiki_en'; do_search(); }
		});
		search_menu.addChild(searchWiki_en);
		var searchWiki_ru = new MenuItem({
			label: voice.wiki_ru,
			onMouseUp: function(){ search_selected = 'wiki_ru'; do_search(); }
		});
		search_menu.addChild(searchWiki_ru);
		var searchАcademy = new MenuItem({
			label: voice.academy,
			onMouseUp: function(){ search_selected = 'academy'; do_search(); }
		});
		search_menu.addChild(searchАcademy);
		var searchScopus = new MenuItem({
			label: voice.scopus,
			onMouseUp: function(){ search_selected = 'scopus'; do_search(); }
		});
		search_menu.addChild(searchScopus);
		var searchWoS = new MenuItem({
			label: voice.WoS,
			onMouseUp: function(){ search_selected = 'WoS'; do_search(); }
		});
		search_menu.addChild(searchWoS);
		var searchMIT = new MenuItem({
			label: voice.MIT,
			onMouseUp: function(){ search_selected = 'MIT'; do_search(); }
		});
		search_menu.addChild(searchMIT);
		
		var search_menu_button = new DropDownButton({
			label: voice.s ,
			dropDown: search_menu
		});
		var search_menu_button_clone = new DropDownButton({
			label: voice.s ,
			dropDown: search_menu
		});  
		
		search_menu_button.placeAt(the_search);
		search_menu_button_clone.placeAt(dojo.byId("search_menu_button_clone"));
		lbl_2 = dojo.byId("dijit_form_DropDownButton_2_label");
		lbl_clone = dojo.byId("dijit_form_DropDownButton_3_label");
	});
	// Начальная установка опций контекстного поиска
	var optoins_cookie = get_cookie_pair(voice.options_name);   			// возьмем куку options, если она есть
	if(optoins_cookie) {
		var the_cookie = optoins_cookie.split('=')[1];
		options = JSON.parse(the_cookie);
	} else options = eval("("+voice.options+")");							// иначе возьмем options по умолчанию
	if(options.lodlive && options.lodlive && options.wdqs && options.search_engines && options.context && options.sort && options.show && options.levenstain && options.pareto) ;
	else options = eval("("+voice.options+")");								// возьмем options по умолчанию, если что-то пропущено
	for(var name in options.sort) {
		if(options.sort[name]) {
			sort_attr_last = 'r';
			sort_attr = name;
		}
	}
	d_aspects = [];
	for(var aspect in options.pareto) if(options.pareto[aspect]) d_aspects.push(aspect); 	// выбор аспектов для показателя доминирования
	max_aspects = d_aspects.length;
	lodlive_dialog = dojo.query('div#_lodlive_dialog', dummy)[0]; 
	wdqs_dialog = dojo.query('div#_wdqs_dialog', dummy)[0]; 
	search_engines_dialog = dojo.query('div#_search_engines_dialog', dummy)[0];
	context_dialog = dojo.query('div#_context_dialog', dummy)[0];  
	sort_dialog = dojo.query('div#_sort_dialog', dummy)[0]; 
	show_dialog = dojo.query('div#_show_dialog', dummy)[0]; 
	pareto_dialog = dojo.query('div#_pareto_dialog', dummy)[0]; 
	levenstain_dialog = dojo.query('div#_levenstain_dialog', dummy)[0]; 
	context_dialog_tt_id = 'select_context_tt';
	select_search_engines(false);											// начальная установка поисковых машин
	select_context(false);													// начальная установка контекста поиска
	select_sort(false);														// начальная установка сортировки результатов
	select_show(false);														// начальная установка отображения документов
	select_pareto(false);													// начальная установка показателя доминирования
	select_levenstain(false);												// начальная установка метрик и прочего
	grab_start(the_grab);													// создание Tooltip для настроек поисковых машин
	make_semantic('s_lodlive');												// запуск первой активной панели - LodLive
	panes_stack('semantic');
	// настройка полей ввода поисковых зппросов
	dojo.connect(request, "onchange", null, function() { request_clone.value = request.value; });
	dojo.connect(request_clone, "onchange", null, function() { request.value = request_clone.value; });
	dojo.connect(request, "onkeydown", null, function(e) { e = e || window.event; request_clone.value = request.value; if(e.keyCode==13) do_search();});
	dojo.connect(request_clone, "onkeydown", null, function(e) { e = e || window.event; request.value = request_clone.value; if(e.keyCode==13) do_search();});
	// Конец начальной установки опций контекстного поиска
	window.onbeforeunload = function() { 
		for(n = 0; n < win_opened.length; n++) win_opened[n].win.close(); 	// закроем все дочерние окна
		document.cookie = voice.options_name + "=" + JSON.stringify(options) + ";expires=" + (new Date(2050,1)).toUTCString() + ";";		// сохраним опции поиска options в куках
	};  
	function help_semantic_0(){show_help(voice.help_semantic_0_url,'$help_semantic_0');}
	function help_semantic_1(){show_help(voice.help_semantic_1_url,'$help_semantic_1');}
	function help_semantic_2(){show_help(voice.help_semantic_2_url,'$help_semantic_2');}
	function help_semantic_3(){show_help(voice.help_semantic_3_url,'$help_semantic_3');}
	function help_semantic_4(){show_help(voice.help_semantic_4_url,'$help_semantic_4');}
	function help_semantic_5(){show_help(voice.help_semantic_5_url,'$help_semantic_5');}
	function help_semantic_6(){show_help(voice.help_semantic_6_url,'$help_semantic_6');}
	function help_semantic_7(){show_help(voice.help_semantic_7_url,'$help_semantic_7');}
	function help_semantic_8(){show_help(voice.help_semantic_8_url,'$help_semantic_8');}
	function help_semantic_9(){show_help(voice.help_semantic_9_url,'$help_semantic_9');}
	function help_context(){ show_help(voice.help_context_url, '$help_context_doc$'); }
	function search_about(){ show_help(voice.search_about_doc, '$search_about_doc$'); }
	function show_help(url, name) {
		for(n = 0; n < win_opened.length; n++) { if(name == win_opened[n].name) { win_opened[n].win.close(); win_opened.splice(n,1); } }
		show_doc(url, name);
	}
	/* Начало кода для кнопки "Наверх" */
	$("#back-top").hide(); $("#back-top a").css('opacity','1');
//	$(function() { $('#back-top a').mouseup(function() { scroll_api.positionDragY(0, true); return false; }); });
	$('#back-top a').unbind('mouseup').bind('mouseup', function() { scroll_api.positionDragY(0, true); return false; });
	/* Конец кода для кнопки "Наверх" */
//	$.fn.activate_grab = function() { console.log('top fire_grab'); make_semantic('s_grab'); } 			// запуск панели контекстного поиска
}
// Конец функции start	

// Показать панели контекстного поиска
function show_context_search() {
	if(!context_was) { do_search(); return; }
	if(search_selected == "docs") panes_stack('docs');
	else if(search_selected == "libs") panes_stack('libs');
	else panes_stack('global');
	choice_menu_make(voice.choice_tuning, voice.choice_semantic, to_semantic);
}

// Делать контекстный поиск
	function do_search(in_tab) {
		for(var name in options.sort) {		// повторная, контрольная установка опций сортировки сниппетов, иначе бяка ...
			if(options.sort[name]) {
				sort_attr_last = (sort_attr == 'd' || sort_attr == 'n') ? sort_attr_last : sort_attr;
				sort_attr = name;
			}
		}
		context_was = true;
		if(!request.value || request.value == "") req_text = request.value = request_clone.value = voice.ksst;
		lbl_2.innerHTML = lbl_clone.innerHTML = voice[search_selected];
		var z = request.value;										// нет очистки от знаков препинания и прочего
		req_text = request.value = z.replace(reg_union, space).replace(reg_many_space, space);		// очистка от союзов, местоимений и лишних пробелов
		make_tokens_obj(req_text_obj, req_text);
		choice_menu_make(voice.choice_tuning, voice.choice_semantic, to_semantic);					// покажем панели контекстного поиска
		$('.dijitTooltipDialogPopup').css('display','none');										// скроем панели Tooltip, вдруг они были видны ...
		if(search_selected == "docs" || search_selected == "libs") {								// поиск в Облачном кабинете
			if(!in_tab) panes_stack(search_selected);
			dojo.byId(panes[0].tab).innerHTML = voice.preloader;
			coming_search.style.zIndex = -1;
			setTimeout(function(){
				fetch_tree(panes[0].tab, trees[panes[0].tab].treeStore, req_text);
			},300);
		} else {		
			search_site = null;
			if(search_selected == "wiki_en") { search_site = 'en.wikipedia.org'; make_search(); }
			else if(search_selected == "wiki_ru") { search_site = 'ru.wikipedia.org'; make_search(); }
			else if(search_selected == "academy") { search_site = 'scholar.google.com'; make_search(); }
			else if(search_selected == "scopus") { search_site = 'scimagojr.com/journalrank.php'; make_search(); }
			else if(search_selected == "WoS") { search_site = 'ip-science.thomsonreuters.com/cgi-bin/jrnlst/jlresults.cgi'; make_search(); }
			else if(search_selected == "MIT") { search_site = 'ocw.mit.edu'; make_search(); }
			else if(search_selected == "leninka") { search_site = 'cyberleninka.ru'; make_search(); }
			else make_search();
		}
	}
// Сохранит позиции скроллов для lodlive
	function lodlive_scroll_save() {
		var lodlive_frame = dojo.query('#lodlive > iframe')[0]; 
		if(lodlive_frame){
			var lodlive_window = lodlive_frame.contentWindow;
			lodlive_window_x = lodlive_window.pageXOffset;
			lodlive_window_y = lodlive_window.pageYOffset;
		}
	}
// Делать семантический поиск
	function to_semantic() { 
		panes_stack('semantic');
		coming_search.style.zIndex = -1;
		choice_menu_make(voice.choice_tuning, voice.choice_context, show_context_search);
	}

function dbpedia_start(type) {}
function wdqs_start(type) {}
function wdqs_load() {}
function annotation_start(type) {}
function annotation_load() {}

	function doAnSelect() {
		var text = annotation_queries[$anSelect.val()].url;
		if(!text.length) return;
		area.value += (text + '\n');
		$anSelect[0].selectedIndex = 0;
		alert_hide();
	}
	function doAnStartBtn() {
		$anStartBtn.css('display', 'none');
		$anStopBtn.css('display', 'block');	
		anStopBtnPushed = false;
		var arr = area.value.split('\n');
		urlToAnnotate = [];
		for (var n=0; n < arr.length; n++) {
			var url = $.trim(arr[n]);
			if (regex_url.test(url)) urlToAnnotate.push({"url":url,"done":false});
		}
		area.value = '';
		if(!urlToAnnotate.length) { browserMessage(voice.noUrlToAnnotate); doAnStopBtn(); return; }
		for (var n=0; n < urlToAnnotate.length; n++) {
			area.value += (urlToAnnotate[n].url +'\n');
		}
		// В textarea сдвинем курсов в конец текста
		if (area.selectionStart) {
			var len=area.value.length;
			area.focus();
			area.setSelectionRange(len,len);
			area.focus();
		}
		$anResult.empty().html('<label style="font-size:1.15em;">' + voice.an_result + '</label>' + br);
		for (var n=0; n < urlToAnnotate.length; n++) {
			var url = urlToAnnotate[n].url;
			var d = reg_host.exec(url)[2];				// домен ресурса
			var $z = $('<div class="an_link" url="' + url + '" hostname="' + d + '"><img src="http://favicon.yandex.net/favicon/' + d + '" style="border:0px;float:left;margin-right:5px;" alt="" url="' + url + '" hostname="' + d + '">' + url + '</div><br>');
			$anResult.append($z);
			$anResult.append($('<div id="anres_' + n + '">' + loader_gray + '</div>'));
			$z.bind('mouseup', on_search_up);			// цепляем обработчик onmouseup
			new doAn(n);
		}
		var timer = setInterval(function(){
			var all_ok = true;
			for (var n=0; n < urlToAnnotate.length; n++) {
				if(!urlToAnnotate[n].done) all_ok = false;
			}
			if(all_ok) {
				clearInterval(timer); 
				doAnStopBtn();
			}
		},10);
	}
	function doAnStopBtn() {
		$anStartBtn.css('display', 'block');
		$anStopBtn.css('display', 'none');
		anStopBtnPushed = true;
//		$('img.loaderGray', $anResult).remove();
	}
	
// Конструктор объектов для обращений к Ontotext News Analytics
	function doAn(n) {}

// Установим разрешенный уровень доступа пользователя (user_access_level)
function set_access() {    
    if( user_authorized != 'true' ) {
        user_name = 'Гость';
        welcom(voice.authorized_no);
        user_access_level = 0;
    }
    else if (user_authorized == 'true' && user_has_rank != 'true' ) {
        welcom(voice.authorized_ok);
        user_access_level = 1;
    }
    else if (user_authorized == 'true' && user_has_rank == 'true' ) {
        welcom(voice.authorized_ok);
        user_access_level = 1;
        for(var i=0; i<voice.grand_users.length; i++) {
            if(user_rank_name == voice.grand_users[i]) {
                _grand_user = true;
                user_access_level = 2;
            }
        }
    }
    else {
        user_name = 'Гость';
        welcom(voice.authorized_no);
        user_access_level = 0;
    }
}

// Каков уровень защиты документа (access) ?
function get_access(store, item) { 
    var doc_level = 0;
    if(store.hasAttribute(item, "access")) {
        var access =  store.getValue(item, "access", null);
        if(access=='0' || access=='common' || access=='public') doc_level=0;
        else if(access=='1' || access=='student') doc_level=1;
        else if(access=='2' || access=='professor') doc_level=2;
        else doc_level=3;
    }
    return doc_level;
}
// Приветствие - работает при входе на страницу, и потом тоже может использоваться для выдачи сообщений
function welcom(mess, delay) {}

// Открываем документ во всплывающем окне
function show_doc(src, name, text) {
	var page_size = getPageSize();
	var width = (page_size[2]*6/8).toFixed(0);
	var height = (page_size[3]*10/12).toFixed(0);
	var left_margin = (page_size[2]/8).toFixed(0);
	var top_margin = (page_size[3]/8).toFixed(0);
	child = window.open(src,name,
    'left='+left_margin+',top='+top_margin+',width='+width+',height='+height+',location=no,directories=no,menubar=no,resizable=yes'+',scrollbars=yes,status=no,toolbar=no,alwaysRaised=yes');
    if(text) {var timer = setInterval(function(){if(child) {clearInterval(timer); if(child.document.body) child.document.body.innerHTML=''; child.document.writeln(text);}},10);}
	childIsOK(name);
}
function load_doc(store, item) {
    if(store.hasAttribute(item, "children")) return;        // это был клик по папке, ничего не делаем ...
	var has_owner = store.hasAttribute(item, "owner");      // у документа есть владелец?
    var url =  store.getValue(item, "url", null);           // у документа есть url ?
    var source = ( (url == '') || (url == null) || (url == undefined) ) ? 'http://vt.obninsk.ru/search_student/stock/no_doc.html' : url ;
    var doc_level = get_access(store, item);                // получим уровень защиты документу (из access)
    if(user_access_level >= doc_level || user_name=='admin' || (has_owner && user_name == store.getValue(item, "owner", null)) ) ; // есть доступ к документу
    else {                                                  // нет доступа к документу
        if(user_authorized != 'true') source = stock_holder + 'no_access.html';  // не авторизован
        else if(doc_level == 2) source = stock_holder + 'no_student.html';       // документ для преподавателей
        else if(doc_level == 3) {                                                                       // документ для членов проектных групп
            var access_atr = store.getValue(item, "access", null);
            if(access_atr.indexOf(user_name) == -1) source = stock_holder + 'no_level.html';
        }
        else alert(voice.err);     // какая-то ошибка
    }
	for(n = 0; n < win_opened.length; n++) { if(source == win_opened[n].name) { win_opened[n].win.close(); win_opened.splice(n,1); } }
    if(options.show.popup) show_doc(source, source);
    else if(options.show.tabs) { child = window.open(source,'_blank'); childIsOK(source); } 
    else activate_frame(source);
}
// Открывать контент в новых вкладках
function tab() {
    options.show.popup = false;
    options.show.tabs = true;
    options.show.frame = false;
}
// Открывать контент в том же окне
function toframe() { 
    options.show.popup = false;
    options.show.tabs = false;
    options.show.frame = true;
}
// Открывать контент во всплывающем окне
function popup() {  
    options.show.popup = true;
    options.show.tabs = false;
    options.show.frame = false;
}

// Асинхронно грузит баннеры для плохих браузеров
function ajax_get(from, to) {
dojo.xhrGet({
    url: from,
    load: function(result) { to.innerHTML = result; },
    error: function(response, ioArgs) { console.log(voice.ajaxError + ioArgs.xhr.status); }  
});
}
// Плохие браузеры, которых мы не любим
function test_browser() {
    if( (navigator.vendor.toLowerCase().indexOf('apple') > -1) || navigator.userAgent.toLowerCase().indexOf("trident") > -1 )
	{ 
		ajax_get(stock_holder + 'bad_semantic.html', document.getElementById('banner'));
		return false;
    }
    return true;
}
// Асинхронно грузит ресурсы, нужные для работы
function ajax_start(from) {
    dojo.xhrGet({
        url: from,
        load: function(result) {
			if(from.indexOf('form_navigation') >= 0) { 
				navigation.innerHTML = result; 
				form.appendChild(dojo.query('form#_footer_form_to_post', navigation)[0]);
				form_ok = true; 
			} else if(from.indexOf('tree_voice') >= 0) { 
				voice = JSON.parse(result.replace(/[\r\n\t]/g,''));
				voice_ok = true; 
			} else if(from.indexOf('context_dialogs') >= 0) { 
				dummy.innerHTML = result;
				context_dialog_ok = true; 
			}
        },
        error: function(response, ioArgs) { browserMessage(voice.ajaxError + ioArgs.xhr.status); }  
    });
}

// Асинхронно грузим софт dojo и строим хранилища  ya_child.innerHTML = result;
require(["dojo/_base/fx","dijit/Dialog","dojo/domReady!","dojo/data/ItemFileWriteStore"], function(fx, dialog) {
	function initTree() {
		// Строятся деревья dojo FileWriteStore и офорляется объект trees = { progr:{fetch:false,treeStore:null},...
		dojo.query("#make_fine .centerPanel.cloud > div").forEach(function(item){
			var tab = item.id.substr(2);
			trees[tab] = {};
			trees[tab].fetch = false;
			trees[tab].treeStore = new dojo.data.ItemFileWriteStore({url: cloud_holder + tab + '.json'});
			trees[tab].treeStore.fetch({
				query: {name:'$'},
				queryOptions: {deep:false},
				onComplete: function(){}
			});
		});
	}
	
// DOM построен. Асинхронно затащим с сервера тексты разговоров.
dojo.ready(function(){
	anim = fx.animateProperty;
	dummy = dojo.byId('dummy');
	form = dojo.byId('_footer_callback');
	navigation = dojo.byId('_footer_navigation');
	ajax_start(stock_holder + 'form_navigation.html');
	ajax_start(stock_holder + 'tree_voice.json');
	ajax_start(stock_holder + 'context_dialogs.html');
	initTree();
	dojo_dialog_constructor = dialog;
    if( test_browser() ) {
		make_fine = dojo.byId('make_fine');
		frame = dojo.byId('frame');
		invisible_div = dojo.byId('invisible_div');
		close_btn = dojo.byId('close_btn');
		header_wrap = dojo.byId('header_wrap');
		wel_com = dojo.byId('welcom');
		// Ждем, когда весь контент, нужный для работы, подгрузится	 && ya_child_ok
		var timer = setInterval(function(){
			if(form_ok && voice_ok && context_dialog_ok) { clearInterval(timer); $.getScript(software_holder + 'script/add_engine.js', start); } 	// добавим ещё немного скрипта
		},10);
    }
}); 
});
// Случайное изображение, без повторов
function get_img($img, image_animator, delay, type) {
	var is_grab = false;
	delay = delay || 500;
	$img.css({'opacity':'0','margin-top':'-999', 'display':'none'});
	$img.unbind('load').bind('load', function(){ image_animator.stop().play(delay); setTimeout(function(){$img.css('display','block');},delay); });
	$img.css('cursor', 'pointer');
	if(type.indexOf('dbpedia') > -1) { $img.unbind('mouseup').bind('mouseup', dbpedia_load); $img.attr('title', voice.mes_dbpedia_go); }
	else if(type.indexOf('wdqs') > -1) { $img.unbind('mouseup').bind('mouseup', wdqs_load); $img.attr('title', voice.mes_wdqs_go); }
	else if(type.indexOf('annotation') > -1) { $img.unbind('mouseup').bind('mouseup', annotation_load); $img.attr('title', voice.mes_annotation_go); }
	else if(type.indexOf(the_grab) > -1) { $img.unbind('mouseup').bind('mouseup', function(){do_search(null);}); $img.attr('title', voice.mes_grab_go); is_grab = true; }
	var random, unic_img, unic_x;
	if(is_grab) {
		do {
			random = Math.floor(( Math.random() * (max_images_is_grab * 1000 - 1)) / 1000);
			unic_img = false; unic_x = true;
			for(var n = img_opened_is_grab.length; (n > 0) && (n > img_opened_is_grab.length-3); n--) { if(random == img_opened_is_grab[n-1]) { unic_x = false; break; }}
			if(unic_x) unic_img = true;
		} while(!unic_img);
		img_opened_is_grab.push(random);
	} else {
		do {
			random = Math.floor(max_images_is_grab + (( Math.random() * (max_images_no_grab * 1000 - 1)) / 1000));
			unic_img = false; unic_x = true;
			for(var n = img_opened_no_grab.length; (n > 0) && (n > img_opened_no_grab.length-2); n--) { if(random == img_opened_no_grab[n-1]) { unic_x = false; break; }}
			if(unic_x) unic_img = true;
		} while(!unic_img);
		img_opened_no_grab.push(random);
	}
	$img.attr('src', 'http://vt.obninsk.ru/docs/xs/ksst_search_' + random + '.png');
}

// Отображаем контент в iframe - новая версия функции, при необходимости работает через pythongrab
	function activate_frame(url, host) {
		panes_stack('frame');								// всплытие нужного слоя
		frame.innerHTML = voice.preloader;					// preloader
		var hostname = host || reg_host.exec(url)[2];
		if(hostname.indexOf('google') > -1 ) {
			bad_site();										// google никогда не даёт себя показывать в iframe
			return;
		}
		var iframe = document.createElement('iframe');
//		iframe.className = 'invisible';
		iframe.className = 'iframe';
		frame.innerHTML = '';
		frame.appendChild(iframe);							// создадим временный iframe
		var iframe_doc = iframe.contentDocument || iframe.contentWindow.document;
		if(hostname.indexOf('youtu') >= 0) {				// youtube покажем через proxy, хотя всё равно может на сработать ...
			url = 'https://youtu.be/' + url.slice(-11);
//			url = 'https://www.youtube.com/watch?v=' + url.slice(-11);
			iframe.src = software_holder + 'php/iframe_page.php?url=' + url;
			return;
		}
//		
		dojo.xhrGet({
			url: software_holder + 'php/iframe_page_x_frame_opt.php?url=' + url,
			load: function(result) { 
				if(result.indexOf('true') > -1) {						// сайт не разрешает открывать себя в iframe
				console.log('Сайт не разрешает открывать себя в iframe');
				if(ff) {
					bad_site();
					return;
				}
//				Получим достуа к сайту по url через pythongrab	
					var z;												// site content
					var	jqXHR = $.get(voice.grab + '?url=' + url)		// GET-запрос к сайту по url через pythongrab
					.done(function(data) { 								// запрос прошел успешно
						if(data == '') bad_site();
						else {
							z = data;
							var pos = z.indexOf('<head>');				// подавление выдачи ошибок из iframe
							if(pos>0) z = (z.substr(0,pos+6) + "<script type='text/javascript'>" + voice.console_script + '</s' + 'cript>' + z.substr(pos+6));
							try {
							// Откроем пришедший с сайта конетент в iframe...
							iframe_doc.open("text/html", "replace");
							iframe_doc.write(z);  
							iframe_doc.close();
							$(iframe).load(function() {					// iframe подгрузился
								if(iframe_doc.body == '') bad_site();
								else console.log('Сайт подгружен в iframe через pythongrab: ' + url);						
							});
							} catch(e) { console.log('Ошибка ' + e.name + ": " + e.message + "\n" + e.stack); }
						}
					})
					.fail(function(obj, status) {
						browserMessage(voice.ajaxError + status);
						bad_site();
					});
//					
				} else {
					// Попробуем просто открыть сайт в iframe...
					iframe.src = url;
					$(iframe).load(function() {					// iframe подгрузился?
						if(iframe_doc.body == '') bad_site();
//						else console.log('iframe подгрузился: ' + url);						
					});
				}
			},
			error: function(response, ioArgs) { browserMessage(voice.ajaxError + ioArgs.xhr.status); }  
		});
//		
		// Не удалось открыть сайт в iframe
		function bad_site() {
			dojo.xhrGet({
				url: stock_holder + 'no_iframe.html',
				load: function(q) {
					console.log('q = ' + q);
					frame.innerHTML = q;
					$('.no_frame_close_me', $(frame)).unbind('mouseup').bind('mouseup', function(){panes_stack();});
				},
				error: function(response, ioArgs) { browserMessage(voice.ajaxError + ioArgs.xhr.status); }
			});
		}
	}
	
	function ru_access(a) {
		if(a == 'common' || a == "") return voice.common;
		else if(a == 'student') return voice.student;
		else if(a == 'professor') return voice.professor;
		else return voice.project;
	}
	
// Пользователь кликнул по псевдоссылке (документ из хранилищ Dojo)	
	function on_mouse_up(event) {
		event = event || window.event;
		if(event.button == 2 || event.button == 3) return;
		target = event.target || event.srcElement; 
		var has_owner = target.getAttribute("has_owner");	// у документа есть владелец?
		var url =  target.getAttribute("url");           	// у документа есть url ?
		var doc_level = target.getAttribute("doc_level");   // уровень защиты документа
		var hostname =  target.getAttribute("hostname"); 
		if(user_access_level >= doc_level || user_name=='admin' || (has_owner && user_name == target.getAttribute("owner")) ) ; // есть доступ к документу
		else {                                                  // нет доступа к документу
			if(user_authorized != 'true') url = stock_holder + 'no_access.html';  // не авторизован
			else if(doc_level == 2) url = stock_holder + 'no_student.html';       // документ для преподавателей
			else if(doc_level == 3) {							// документ для членов проектных групп
				var access = target.getAttribute("access");
				if(access.indexOf(user_name) == -1) url = stock_holder + 'no_level.html';
			}
			else alert(voice.err);     // какая-то ошибка
		}
		for(n = 0; n < win_opened.length; n++) if(url == win_opened[n].name) { win_opened[n].win.close(); win_opened.splice(n,1); }
		if(options.show.popup) show_doc(url, url);
		else if(options.show.tabs) { child = window.open(url,'_blank'); childIsOK(url); } 
		else activate_frame(url, hostname);
	}
	
// Пользователь кликнул по псевдоссылке (документ из глобальной сети)		
	function on_search_up(event) {
		var e = event || window.event;	// объект события
		if(e.button == 2 || e.button == 3) return;
		var target = e.target || e.srcElement; 		// по какому элементу кликнули?
		if(!target) return;
		var url =  target.getAttribute("url");    // должен быть атрибут "url" у самого элемента или его потомка
		var hostname =  target.getAttribute("hostname"); 
		if(target.firstChild && target.firstChild.getAttribute) {
			if(!url) url =  target.firstChild.getAttribute("url");
			if(!hostname) hostname =  target.firstChild.getAttribute("hostname");
		}
		// убираем дублирующие окна, вкладки
		for(n = 0; n < win_opened.length; n++) if(url == win_opened[n].name) { win_opened[n].win.close(); win_opened.splice(n,1); }
		if(options.show.popup) show_doc(url, url);	// открыть во всплывающем окне
		else if(options.show.tabs) { 				// открыть в отдельной вкладке
			child = window.open(url,'_blank'); 
			childIsOK(url); 
		} 
		else { 		// попытаться открыть в iframe
			activate_frame(url, hostname); 
		}
	}	
	
	// Поиск в дереве по наименованию и ключевым словам + формирование и выдача сниппетов
	function fetch_tree(tab, store, req) {
		coming_search.style.zIndex = 1;
		var x_pane = dojo.byId(tab); had = []; links = 0;
		var the_feed, feeds, queries = [];
		var phrase = req.replace(new RegExp("\\.+|,+|:+"),"");
		phrase = phrase.replace(new RegExp(" и | или | для | and | or | for "),space);
		tokens = phrase.split(space);     				// разделяем фразу на слова
		for(n = 0; n < tokens.length; n++) {
			queries.push({name:'*'+tokens[n]+'*'});
			queries.push({keywords:'*'+tokens[n]+'*'});
		}
		do_fetch(0);
		// Встроенный dojo-поиск в дереве
		function do_fetch(n) {
			if(n >= queries.length) {			// конец поиска, выход из рекурсии
				coming_search.style.zIndex = -1;
				if(links > 0) {
					if(sort_attr == 'd') web_snippets_dominance(x_pane, the_web); 	// cортирует сниппеты по доминированию
					$(x_pane.lastChild).removeClass('search_empty').html('<br><br>');
//					x_pane.lastChild.innerHTML = '<br><br>';
				} else {
					$mess = $('<div/>').addClass('search_empty').html(voice.not_found);
					$(x_pane).empty().append($mess);
				}
				return;
			}
			setTimeout(function() {
			store.fetch({
				query: queries[n],
				queryOptions: { deep: true, ignoreCase: true },
				onComplete: function(items) { 		// обработка результатов поиска
					feeds = {responseData:{results:[]}};
					dojo.forEach(items, function(item) {
						var the_url = store.getValue(item, "url", null);
						if(!store.hasAttribute(item, "children") && the_url != '') {
							var the_title = store.getValue(item, "name", null);
							var the_keywords = store.getValue(item, "keywords", null);
							var the_access = store.getValue(item, "access", null) || 'common';
							the_feed = {'unescapedUrl':the_url, 'titleNoFormatting':the_title};
							the_feed.content = voice.keywords + (the_keywords ? the_keywords : voice.unknown) + the_dot + space + ru_access(the_access);
							if($.inArray(the_feed, feeds.responseData.results)<0) feeds.responseData.results.push(the_feed);
							links++;
						}	
					});
					snippets_makers.make_web_snippets(feeds, x_pane, the_web, had);		// отображение найденных сниппетов
					do_fetch(n + 1);
				}
			});
			},10);
		}
	}

	// Визуальный эффект "оттяжка"
	function backOut(n) { n = n - 1; var s = 1.70158; return Math.pow(n, 2) * ((s + 1) * n + s) + 1; }
	// 	Исправленные previousSibling и nextSibling
	function pSib(obj) { while (obj = obj.previousSibling) if (obj.nodeType == 1) return obj; return null; }
	function pNext(obj) { while (obj = obj.nextSibling) if (obj.nodeType == 1) return obj; return null; }
	
	// Установка опций отображения LOD
	function set_lodlive_opt(){}
	
	// Установка опций отображения Wikidata Query Service
	function set_wdqs_opt(){}
	
	// Поисковые машины – установка количества обращений при отработке одного поискового запроса
	function select_search_engines(visible) {
		if(!dojo_search_engines_dialog) dojo_search_engines_dialog = new dojo_dialog_constructor({
			title: voice.select_search_engines,
			content: search_engines_dialog
		});
		for(var aspect in options.search_engines) { 				// по всем аспектам
			dojo.query(the_sharp + aspect + '_number', search_engines_dialog)[0].value = options.search_engines[aspect];
		}
		if(visible) dojo_search_engines_dialog.show();
		else dojo.query('button', dojo_search_engines_dialog.content).forEach(function(item){ item.onmouseup = select_search_engines_done; });
		function select_search_engines_done(e) {
			e = e || event;
			var target = e.target || e.srcElement;
			if(target.id == 'select_search_engines_done') {
				for(var aspect in options.search_engines) { 			// сохраним в options сделанный выбор
					options.search_engines[aspect] = dojo.query(the_sharp + aspect + '_number', search_engines_dialog)[0].value;
				}
			} else if(target.id == 'refresh_search_options') { var z = options.lodlive; options = eval("("+voice.options+")"); options.lodlive = z;}	// восстановим значения options по умолчанию
			dojo_search_engines_dialog.hide();
			alert_hide();
		}
	}
	// Задать контекст поиска
	function select_context(visible, repair) {
		if(!dojo_select_context_dialog) {
			dojo_select_context_dialog = new dojo_dialog_constructor({
				title: voice.select_context,
				content: context_dialog
			});
		}
		select_context_start(true);
		if(visible) {
			if(!repair) dojo_select_context_dialog.show();
			// дублируем имена файлов и сайтов в парные диалоги
			site_url = dojo.query(the_sharp + context_dialog_tt_id + space + the_sharp + 'handle_site_upload_text')[0];
			if(site_url) dojo.query('input#handle_site_upload_text', dojo_select_context_dialog.content)[0].value = site_url.value;
			var _files = dojo.query(the_sharp + context_dialog_tt_id + space + the_sharp + 'handle_file_upload')[0];
			if(_files) dojo.query('input#handle_file_upload', dojo_select_context_dialog.content)[0].files = _files.files;
		} else {
			$('span.dijitDialogCloseIcon').bind('mouseup', alert_hide);
			dojo.query('button#select_context_close', dojo_select_context_dialog.content)[0].onmouseup = hide;
			dojo.query('button#select_context_done', dojo_select_context_dialog.content)[0].onmouseup = function(){ select_context_done(); hide(); };
			dojo.query('input#handle_site_upload', dojo_select_context_dialog.content)[0].onmouseup = function(){ handle_site_upload(true, this); };
			dojo.query('input#handle_site_upload_text', dojo_select_context_dialog.content)[0].onkeydown = function(e){ e = e || event; if(e.keyCode==13) handle_site_upload(true, this); };
			dojo.query('input#handle_file_upload', dojo_select_context_dialog.content)[0].onchange = function(){ handle_file_upload(this.files, this); };
//			select_context_done();
		}
		function hide(){
			dojo_select_context_dialog.hide();
			alert_hide();
		}
	}
	// Оживление панели установки контекста
	function select_context_start(key) {
		var $p, $eye, _cbx, $_cbx;
		for(var name in options.context) { 				// по всем вариантам задания контекста
			if(key) _cbx = dojo.query(the_sharp + name + '_cbx', dojo_select_context_dialog.content)[0];		// ищем в верхнем диалоге
			else _cbx = dojo.query(the_sharp + context_dialog_tt_id + space + the_sharp + name + '_cbx')[0];	// ищем в тултипе, по id
			_cbx.checked = options.context[name];
			$_cbx = $(_cbx);							// checkbox
			$p = $(_cbx.parentNode);
			if(!$p.find('img').length) $p.append(voice.coming);
			$eye = $p.find('img');						// глазик
			eye_on($eye);		// ставим на глазик обработчик события mouseup
			cbx_change($_cbx);	// ставим обработчик событий ВКЛ/ВЫКЛ на checkbox
			if(name == 'file' || name == 'web') { $eye.attr('src', voice.eye); }
			if(_cbx.checked) {							// если выбран данный вид контекста
				$eye.css('display','inline');
				load_context(name, $eye[0]);			// перезагрузить данный вид контекста
			} else { 
				$eye.css('display','none');
				the_context[name] = null;
			}
		}
	}
	// ставим на глазик обработчик события mouseup
	function eye_on($eye) {
		$eye.unbind().mouseup(function(e){ 					
			e = e || window.event;
			var target = e.target || e.srcElement;
			var cbx = pSib(target);
			var id = cbx.id;
			var name = id.substr(0, id.indexOf('_'));
			alert_hide();
			if(the_context[name]) show_doc(null, name, the_context[name]);
			else browserMessage(voice.no_context);
		});
	}
	// обработчик событий ВКЛ/ВЫКЛ на checkbox
	function cbx_change($_cbx) {
		$_cbx.unbind().change(function(e) {					// обработчик событий ВКЛ/ВЫКЛ
			e = e || window.event;
			var target = e.target || e.srcElement;
			var id = target.id;
			var name = id.substr(0, id.indexOf('_'));
			options.context[name] = target.checked;
			var $p = $(target.parentNode);
			var $eye = $p.find('img');					// глазик
			if(target.checked) {
				load_context(name, $eye[0]);					// перезагрузить данный вид контекста 
				$eye.css('display','inline');
			}
			else $eye.css('display','none');
		});
	}
	
	// Завершена установка контекста
	function select_context_done() {
			context_obj = {};
			for(var name in options.context) { 			// формируем context_obj, пройдя по всем вариантам задания контекста
				if(options.context[name] && the_context[name]) {
					var text = the_context[name].toLowerCase().replace(reg_punct, ' ').replace(reg_union, ' ').replace(/[\r\n\f]/g, ' ');
					var arr = text.split(space);
					for(var k = 0; k < arr.length; k++) {
						var x_token = arr[k];
						if(x_token.length > options.levenstain.max) x_token = x_token.substr(0, options.levenstain.max);
						if(x_token.length < options.levenstain.min) continue;
						if(context_obj[x_token]) context_obj[x_token]++;
						else context_obj[x_token] = 1;
					}
				}
			}
			alert_hide();
		}
	// Загрузка контекста для ядерной физики
	function load_context(name, eye) {
		if(name == 'file' || name == 'web') return;
		var z = voice['nuclear_' + name];
		try {
		var	jqXHR = $.get(voice.grab + '?url=' + z + ';cleaning=true')			// запрос к сайту через прокси-сервер pythongrab
		.done(function(data) { 								// нормально отработал
			if(data == '') { eye.style.display = 'none'; alert(voice.bad_url + '. URL: ' + z); }
			else { the_context[name] = data; eye.src = './images/_show.png'; }
		})
		.fail(function(obj, status) {
//			alert(voice.ajaxError + status + '. URL: ' + z);
			eye.style.display = 'none';
		});
		} catch(e) {};
	}
/*		Старые варинаты загрузки контекста
		if(name == 'meta') {				// Ключевые слова образовательного портала
			from_meta_keywords = from_meta_categories = '';
			var metas = document.getElementsByTagName('meta');
			for (var k = 0, q = metas.length; k < q; k++) {
				var meta = metas[k]; 		// тег <meta name="keywords" content="..."/>
				if (meta.name) {
					if (meta.name.toLowerCase() == "keywords") {
						from_meta_keywords += meta.content;
					}
				}
				var itemprop = meta.getAttribute('itemprop');		// тег <meta itemprop="category" content="..."/>
				if(itemprop) {
					if(itemprop.toLowerCase() == "category") {
						var str = meta.content.replace(reg_punct, space);
						var tmp = str.split(space);     						// разбиваем на слова
						for(m = 0; m < tmp.length; m++) { from_meta_categories += tmp[m] + space; }
					}
				}
			}
			the_context.meta = (from_meta_keywords + space + from_meta_categories).replace(reg_punct, space); 		// очистка от знаков препинания
			make_tokens_obj(meta_keywords_obj, from_meta_keywords);
			make_tokens_obj(meta_categories_obj, from_meta_categories);
		} else if((name == 'file') || (name == 'web')) {
		;
		} else {					// деревья Облачного кабинета
			trees[name].fetch = options.context[name];
			var text = '';
					trees[name].treeStore.fetch({
						query: {name:'*'},
						queryOptions:{ deep:true, ignoreCase:true },
						onComplete:function (items) {
							dojo.forEach(items, function(item){text += (trees[name].treeStore.getValue(item, 'name', null) + space)});
							trees[name].treeStore.fetch({
								query: {keywords:'*'},
								queryOptions:{ deep:true, ignoreCase:true },
								onComplete:function (items) {
									dojo.forEach(items, function(item){text += (trees[name].treeStore.getValue(item, 'keywords', null) + space)});
								}
							});	
						}	
					});

			the_context[name] = text.replace(reg_punct, space); 		// очистка от знаков препинания
        }
*/		
	// Обработчик события "загрузка текстового файла с компьютера"
	function handle_file_upload(files, obj) {
//		console.log('navigator.userAgent = ' + navigator.userAgent.toLowerCase());
		var the_img = pSib(obj);				// индикатор загрузки файла
		the_img.style.display = 'inline-block';
		var form = new FormData();									// динамическое создание формы
		form.append('context_file_upload', files[0]);				// выбранный файл
		var jqXHR = $.ajax({
			url: software_holder + 'php/context_file_upload.php',
			type: 'POST',
			processData: false,
			contentType: false,
			cache: false,
			data: form
		})
		.done(function(data) {
            the_context.file = data;   
			the_img.style.display = 'none';	
			var _p = pSib(obj.parentNode);				// предыдущий параграф
			var _cbx = dojo.query('input', _p)[0];	
			_cbx.checked = options.context.file = true;	// установить checkbox
			cbx_change($(_cbx));						// ставим обработчик событий ВКЛ/ВЫКЛ на checkbox
			var _eye = dojo.query('img', _p)[0];		// глазик
			$(_eye).css('display','inline');
			eye_on($(_eye));							// ставим на глазик обработчик события mouseup
			if((_p.parentNode.parentNode.parentNode.className == 'dijitTooltipContainer')
				&& (navigator.userAgent.toLowerCase().indexOf('webkit') > -1)
			) select_context(true, true);	// небольшие ремонтные мероприятия при работе с tooltip в движке WebKit
		})
		.fail(function(obj, status) { 
			browserMessage(voice.ajaxError + status);
			the_img.style.display = 'none';
		});
	}
	// Обработчик события "загрузка сайта из глобальной сети интернет"
	function handle_site_upload(key, obj) {
		var the_img;
		if(key) {			// ищем в верхнем диалоге
			the_img = dojo.query('img#select_context_site_upload', dojo_select_context_dialog.content)[0];				
			site_url = dojo.query('input#handle_site_upload_text', dojo_select_context_dialog.content)[0];
		} else {			// ищем в тултипе, по id
			the_img = dojo.query(the_sharp + context_dialog_tt_id + space + the_sharp + 'select_context_site_upload')[0];	
			site_url = dojo.query(the_sharp + context_dialog_tt_id + space + the_sharp + 'handle_site_upload_text')[0];
		};
		the_img.style.display = 'inline-block';
		var	jqXHR = $.get(voice.grab + '?url=' + site_url.value + ';cleaning=true')			// запрос к сайту через прокси-сервер pythongrab
		.done(function(data) { 								// нормально отработал
			if(data == '') fail_site(voice.bad_url);
			else the_context.web = data;
			the_img.style.display = 'none';
			var _p = pSib(obj.parentNode);				// предыдущий параграф
			var _cbx = dojo.query('input', _p)[0];	
			_cbx.checked = options.context.web = true;	// установить checkbox
			cbx_change($(_cbx));						// ставим обработчик событий ВКЛ/ВЫКЛ на checkbox
			var _eye = dojo.query('img', _p)[0];		// глазик
			$(_eye).css('display','inline');
			eye_on($(_eye));							// ставим на глазик обработчик события mouseup
		})
		.fail(function(obj, status) {
			browserMessage(voice.ajaxError + status);
			fail_site(voice.bad_site);
			the_img.style.display = 'none';
		});
		function fail_site(mess) {
			site_url.value = mess;
			site_url.style.color = 'red';
			setTimeout(function(){ site_url.style.color = 'black'; site_url.value = ''; }, 2500);
		}
	}
	// Задать способ сортировки сниппетов
	function select_sort(visible) { 
		if(!dojo_select_sort_dialog) dojo_select_sort_dialog = new dojo_dialog_constructor({
			title: voice.select_sort,
			content: sort_dialog
		});
		for(var name in options.sort) { 					// по всем вариантам
			dojo.query('#_sort_dialog ' + the_sharp + name + '_radio')[0].checked = options.sort[name];
		}
		if(visible) dojo_select_sort_dialog.show();
		else dojo.query('button', dojo_select_sort_dialog.content).forEach(function(item){ item.onmouseup = select_sort_done; });
		function select_sort_done(e){
			e = e || event;
			var target = e.target || e.srcElement;
			if(target.id == 'select_sort_done') {  
				for(var name in options.sort) { 			// сохраним сделанный выбор
					options.sort[name] = dojo.query('#_sort_dialog ' + the_sharp + name + '_radio')[0].checked;
					console.log('select_sort_done: name = ' + name + ' value = ' + options.sort[name]);
					if(options.sort[name]) {
						sort_attr_last = (sort_attr == 'd' || sort_attr == 'n') ? sort_attr_last : sort_attr;
						sort_attr = name;
					}
				}
			}
			dojo_select_sort_dialog.hide();
			alert_hide();
		}
	}
	
	// Задать режим отображения документов
	function select_show(visible) {
		if(!dojo_select_show_dialog) dojo_select_show_dialog = new dojo_dialog_constructor({
			title: voice.select_show,
			content: show_dialog
		});
		for(var name in options.show) { 					// по всем вариантам
			dojo.query('#_show_dialog ' + the_sharp + name + '_radio')[0].checked = options.show[name];
		}
		if(visible) dojo_select_show_dialog.show();
		else dojo.query('button', dojo_select_show_dialog.content).forEach(function(item){ item.onmouseup = select_show_done; });
		function select_show_done(e) {
			e = e || event;
			var target = e.target || e.srcElement;
			if(target.id == 'select_show_done') {
				for(var name in options.show) { 			// сохраним сделанный выбор
					options.show[name] = dojo.query('#_show_dialog ' + the_sharp + name + '_radio')[0].checked;
				}
			}
			dojo_select_show_dialog.hide();
			alert_hide();
		}
	}
	// Задать аспекты для вычисления показателей доминирования
	function select_pareto(visible) {
		if(!dojo_select_pareto_dialog) dojo_select_pareto_dialog = new dojo_dialog_constructor({
			title: voice.select_pareto,
			content: pareto_dialog
		});
		for(var aspect in options.pareto) { 				// по всем аспектам
			dojo.query('#_pareto_dialog ' + the_sharp + aspect + '_cbx')[0].checked = options.pareto[aspect];
		}
		if(visible) dojo_select_pareto_dialog.show();
		else dojo.query('button', dojo_select_pareto_dialog.content).forEach(function(item){ item.onmouseup = select_pareto_done; });
		function select_pareto_done(e) {
			e = e || event;
			var target = e.target || e.srcElement;
			if(target.id == 'select_pareto_done') {
				d_aspects = [];
				for(var aspect in options.pareto) { 			// сохраним сделанный выбор
					options.pareto[aspect] = dojo.query('#_pareto_dialog ' + the_sharp + aspect + '_cbx')[0].checked;
					if(options.pareto[aspect]) d_aspects.push(aspect);
				}
				max_aspects = d_aspects.length;
			}
			dojo_select_pareto_dialog.hide();
			alert_hide();
		}
	}
	// Задать значения метрики Левенштейна и прочее...
	function select_levenstain(visible) {
		if(!dojo_select_levenstain_dialog) dojo_select_levenstain_dialog = new dojo_dialog_constructor({
			title: voice.select_levenstain,
			content: levenstain_dialog
		});
		for(var aspect in options.levenstain) { 				// по всем аспектам
			dojo.query('#_levenstain_dialog ' + the_sharp + aspect + '_number')[0].value = options.levenstain[aspect];
		}
		if(visible) dojo_select_levenstain_dialog.show();
		else dojo.query('button', dojo_select_levenstain_dialog.content).forEach(function(item){ item.onmouseup = select_levenstain_done; });
		function select_levenstain_done(e) {
			e = e || event;
			var target = e.target || e.srcElement;
			if(target.id == 'select_levenstain_done') {
				for(var aspect in options.levenstain) { 			// сохраним сделанный выбор
					options.levenstain[aspect] = dojo.query('#_levenstain_dialog ' + the_sharp + aspect + '_number')[0].value;
				}
			}
			dojo_select_levenstain_dialog.hide();
			alert_hide();
		}
	}

	// Готовим к работе tooltip-ы для select_search_engines, ...
	function grab_start(type) { 
	$img_z = $('<img>');			// картинки для главной страницы
	$('#grab').append($('<div>').attr('align','center').append($img_z));
	image_animator_z = new anim({ node:$img_z.get(0), easing:backOut,
		properties:{marginTop:{ start:960, end:30 }, opacity:{ start:0, end:1 }},
		duration:1200
	});
	get_img($img_z, image_animator_z, 400, type);
	require(["dijit/TooltipDialog","dojo/on"], function(TooltipDialog, on){
		// Поисковые машины
		require(["dijit/popup"], function(popup){
			var target, menu_item = dojo.byId('the_search_engines');
			var id = 'select_search_engines_tt';
			var leave = true;
			search_engines_dialog_tt = search_engines_dialog.cloneNode(true);
			var select_search_engines_tt = new TooltipDialog({
				id: id,
				content: search_engines_dialog_tt,
				onMouseLeave: function(){ 				// покидание TooltipDialog
					if(leave){
						anim_out(id);
						setTimeout(function(){popup.close(select_search_engines_tt);},400);
					}
				},	
				onMouseUp: function(e){ 											// событие onMouseUp на TooltipDialog
					e = e || event;
					target = e.target || e.srcElement;
					if(target.id == 'select_search_engines_done') {  
						dojo.query('input', search_engines_dialog_tt).forEach(function(item){
							var aspect = item.id.substring(0, item.id.indexOf('_'));
							options.search_engines[aspect] = item.value;
						});
					}
					else if(target.id == 'refresh_search_options') options = eval("("+voice.options+")");	// восстановим значения options по умолчанию
					if(target.tagName == 'BUTTON') {
						leave = false;
						anim_out(id);
						setTimeout(function(){popup.close(select_search_engines_tt); leave = true;},400); 
					}
				}		
			});
			on(menu_item, 'mouseover', function(e){ 
				e = e || event;
				target = e.target || e.srcElement;
				setTimeout(function(){ if($(target).is(':hover')) on_menu_item();},400);
			});
			function on_menu_item() {
				dojo.query('input', search_engines_dialog_tt).forEach(function(item){
					var aspect = item.id.substring(0, item.id.indexOf('_'));
					item.value = options.search_engines[aspect];
				});
				popup.open({ 
					popup: select_search_engines_tt,
					around: menu_item,
					orient:["below","after"]
				});
				anim_in(id);
			}
		});	
		// Контекст поиска
		require(["dijit/popup"], function(popup){
			var target, menu_item = dojo.byId('the_context');
			context_dialog_tt = context_dialog.cloneNode(true);
			var select_context_tt = new TooltipDialog({
				id: context_dialog_tt_id,
				content: context_dialog_tt,
				onMouseLeave: function(){ 				// покидание TooltipDialog
//					anim_out(context_dialog_tt_id);
//					setTimeout(function(){popup.close(select_context_tt);},400);
				},	
				onMouseUp: function(e){ 									// событие onMouseUp на TooltipDialog
					e = e || event;
					target = e.target || e.srcElement;
					if(target.id == 'select_context_done') select_context_done();
					if(target.tagName == 'BUTTON') {
						anim_out(context_dialog_tt_id);
						setTimeout(function(){popup.close(select_context_tt);},400);
					}
				}
			});
			on(menu_item, 'mouseover', function(e){ 
				e = e || event;
				target = e.target || e.srcElement;
				setTimeout(function(){ if($(target).is(':hover')) on_menu_item();},400);
			});
			function on_menu_item() {
				popup.open({ 
					popup: select_context_tt, 
					around: menu_item, 
					orient:["below","after"] 
				});
				select_context_start(false);
				anim_in(context_dialog_tt_id);
				// дублируем имена файлов и сайтов в парные диалоги
				if(site_url) dojo.query(the_sharp + context_dialog_tt_id + space + the_sharp + 'handle_site_upload_text')[0].value = site_url.value;
				var _files = dojo.query('input#handle_file_upload', dojo_select_context_dialog.content)[0];
				if(_files) dojo.query(the_sharp + context_dialog_tt_id + space + the_sharp + 'handle_file_upload')[0].files = _files.files;
				// установка обработчиков для загрузки контента из файлов и сайтов
				if(!select_context_tt_was) {
					dojo.query(the_sharp + context_dialog_tt_id + space + 'input#handle_site_upload')[0].onmouseup = function(){ handle_site_upload(false, this); };
					dojo.query(the_sharp + context_dialog_tt_id + space + 'input#handle_site_upload_text')[0].onkeydown = function(e){ e = e || event; if(e.keyCode==13) handle_site_upload(false, this); };
					dojo.query(the_sharp + context_dialog_tt_id + space + 'input#handle_file_upload')[0].onchange = function(){ handle_file_upload(this.files, this); };
					select_context_tt_was = true;
				}
			}
		});	
		// Сортировка результатов
		require(["dijit/popup"], function(popup){
			var target, menu_item = dojo.byId('the_sort');
			var id = 'select_sort_tt';
			var leave = true;
			sort_dialog_tt = sort_dialog.cloneNode(true);
			var select_sort_tt = new TooltipDialog({
				id: id,
				content: sort_dialog_tt,
				onMouseLeave: function(){ 				// покидание TooltipDialog
					if(leave){
						anim_out(id);
						setTimeout(function(){popup.close(select_sort_tt);},400);
					}
				},	
				onMouseUp: function(e){ 									// событие onMouseUp на TooltipDialog
					e = e || event;
					target = e.target || e.srcElement;
					if(target.id == 'select_sort_done') {  
						dojo.query('input', sort_dialog_tt).forEach(function(item){
							var aspect = item.id.substring(0, item.id.indexOf('_radio'));
							options.sort[aspect] = item.checked;
						});
					}
					if(target.tagName == 'BUTTON') {
						leave = false;
						anim_out(id);
						setTimeout(function(){popup.close(select_sort_tt); leave = true;},400);
					}	
				}
			});
			on(menu_item, 'mouseover', function(e){ 
				e = e || event;
				target = e.target || e.srcElement;
				setTimeout(function(){ if($(target).is(':hover')) on_menu_item();},400);
			});
			function on_menu_item() {
				dojo.query('input', sort_dialog_tt).forEach(function(item){
					var aspect = item.id.substring(0, item.id.indexOf('_radio'));
					item.checked = options.sort[aspect];
				});
				popup.open({ 
					popup: select_sort_tt, 
					around: menu_item, 
					orient:["below","before"] 
				});
				anim_in(id);
			}
		});
		// Отображение контента
		require(["dijit/popup"], function(popup){
			var target, menu_item = dojo.byId('the_show');
			var id = 'select_show_tt';
			var leave = true;
			show_dialog_tt = show_dialog.cloneNode(true);
			var select_show_tt = new TooltipDialog({
				id: id,
				content: show_dialog_tt,
				onMouseLeave: function(){ 				// покидание TooltipDialog
					if(leave){
						anim_out(id);
						setTimeout(function(){popup.close(select_show_tt);},400);
					}
				},	
				onMouseUp: function(e){ 									// событие onMouseUp на TooltipDialog
					e = e || event;
					target = e.target || e.srcElement;
					if(target.id == 'select_show_done') {  
						dojo.query('input', show_dialog_tt).forEach(function(item){
							var aspect = item.id.substring(0, item.id.indexOf('_radio'));
							options.show[aspect] = item.checked;
						});
					}
					if(target.tagName == 'BUTTON') {
						leave = false;
						anim_out(id);
						setTimeout(function(){popup.close(select_show_tt); leave = true;},400);
					}	
				}
			});
			on(menu_item, 'mouseover', function(e){ 
				e = e || event;
				target = e.target || e.srcElement;
				setTimeout(function(){ if($(target).is(':hover')) on_menu_item();},400);
			});
			function on_menu_item() {
				dojo.query('input', show_dialog_tt).forEach(function(item){
					var aspect = item.id.substring(0, item.id.indexOf('_radio'));
					item.checked = options.show[aspect];
				});
				popup.open({ 
					popup: select_show_tt, 
					around: menu_item, 
					orient:["below","after"] 
				});
				anim_in(id);
			}
		});
		// Показатели доминирования
		require(["dijit/popup"], function(popup){
			var target, menu_item = dojo.byId('the_pareto');
			var id = 'select_pareto_tt';
			var leave = true;
			pareto_dialog_tt = pareto_dialog.cloneNode(true);
			var select_pareto_tt = new TooltipDialog({
				id: id,
				content: pareto_dialog_tt,
				onMouseLeave: function(){ 				// покидание TooltipDialog
					if(leave){
						anim_out(id);
						setTimeout(function(){popup.close(select_pareto_tt);},400);
					}
				},	
				onMouseUp: function(e){ 									// событие onMouseUp на TooltipDialog
					e = e || event;
					target = e.target || e.srcElement;
					if(target.id == 'select_pareto_done') {  
						dojo.query('input', pareto_dialog_tt).forEach(function(item){
							var aspect = item.id.substring(0, item.id.indexOf('_cbx'));
							options.pareto[aspect] = item.checked;
						});
					}
					if(target.tagName == 'BUTTON') {
						leave = false;
						anim_out(id);
						setTimeout(function(){popup.close(select_pareto_tt); leave = true;},400);
					}	
				}
			});
			on(menu_item, 'mouseover', function(e){ 
				e = e || event;
				target = e.target || e.srcElement;
				setTimeout(function(){ if($(target).is(':hover')) on_menu_item();},400);
			});
			function on_menu_item() {
				dojo.query('input', pareto_dialog_tt).forEach(function(item){
					var aspect = item.id.substring(0, item.id.indexOf('_cbx'));
					item.checked = options.pareto[aspect];
				});
				popup.open({ 
					popup: select_pareto_tt, 
					around: menu_item, 
					orient:["below","after"] 
				});
				anim_in(id);
			}
		});
		// Лексемы и метрики
		require(["dijit/popup"], function(popup){
			var target, menu_item = dojo.byId('the_levenstain');
			var id = 'select_levenstain_tt';
			var leave = true;
			levenstain_dialog_tt = levenstain_dialog.cloneNode(true);
			var select_levenstain_tt = new TooltipDialog({
				id: id,
				content: levenstain_dialog_tt,
				onMouseLeave: function(){ 				// покидание TooltipDialog
					if(leave){
						anim_out(id);
						setTimeout(function(){popup.close(select_levenstain_tt);},400);
					}
				},	
				onMouseUp: function(e){ 									// событие onMouseUp на TooltipDialog
					e = e || event;
					target = e.target || e.srcElement;
					if(target.id == 'select_levenstain_done') {  
						dojo.query('input', levenstain_dialog_tt).forEach(function(item){
							var aspect = item.id.substring(0, item.id.indexOf('_number'));
							options.levenstain[aspect] = item.value;
						});
					}
					if(target.tagName == 'BUTTON') {
						leave = false;
						anim_out(id);
						setTimeout(function(){popup.close(select_levenstain_tt); leave = true;},400);
					}	
				}
			});
			on(menu_item, 'mouseover', function(e){ 
				e = e || event;
				target = e.target || e.srcElement;
				setTimeout(function(){ if($(target).is(':hover')) on_menu_item();},400);
			});
			function on_menu_item() {
				dojo.query('input', levenstain_dialog_tt).forEach(function(item){
					var aspect = item.id.substring(0, item.id.indexOf('_number'));
					item.value = options.levenstain[aspect];
				});
				popup.open({ 
					popup: select_levenstain_tt, 
					around: menu_item, 
					orient:["below","before"] 
				});
				anim_in(id);
			}
		});
	});	
}
	// Анимация виджетов TooltipDialog
	function anim_in(node) {
		anim({
			node: node,
			properties:{ opacity: { start:0, end:1 } },
			duration: 400
		}).stop().play();
	}
	function anim_out(node) {
		anim({
			node: node,
			properties:{ opacity: { start:1, end:0 } },
			duration: 400
		}).stop().play();
	}	
	// Получить куку с именем name с клиентского компьютера
	function get_cookie_pair(name) {
//		console.log('document.cookie = ' + document.cookie);
		var arr = document.cookie.split(';');
		for(var n = 0; n < arr.length; n++) {
			var z = arr[n];
			if(z.indexOf(name) > -1) return z.replace(space,'');
		}
		return null;
	}

// Конструктор объектов-манипуляторов для открепления/закрепления SPARQL-панелей
var semantic_pane_manipulator = function(semantic_type) {	
	var outer_text = the_s + semantic_type;
	var self = $(the_sharp + outer_text);
	self.css('overflow', 'visible');
	var inner_text = '#' + semantic_type;
	var outer = self;
	var inner = $(inner_text, self);
	var invite = $(inner_text + '_invite', self);
	var result = $(inner_text + '_result', self);
	var skrepka_float = $('.skrepka_float', self);
	var skrepka_fixed = $('.skrepka_fixed', self);
	var jsPane = $('.jspPane', outer);
	var clone, repetitor_handle, semantic_active_pane;
	var skrepka_bind = function() {
		$('.skrepka_float', self).unbind('mouseup').bind('mouseup', panel_fixed);
		$('.skrepka_fixed', self).unbind('mouseup').bind('mouseup', panel_float);
	}
	var semantic_scroll_alive = function() {
		if(skrepka_fixed.css('visibility') == 'visible') {
			if(repetitor_handle) clearInterval(repetitor_handle);
			inner.css({'height': outer.outerHeight(true) - invite.outerHeight(true) + 'px'});
		}
		else {
			if(repetitor_handle) clearInterval(repetitor_handle);
			repetitor_handle = setInterval(function(){
			inner.css({'height': invite.outerHeight(true) + result.outerHeight(true) + 'px'});}, 200);
		}
		panes_stack('semantic', outer_text);
	}
// Закрепить SPARQL-панель вверху страницы
    var panel_fixed = function() {
		semantic_active_pane = inner_text;
		clone = outer.children();
		outer.empty();
		inner.empty();
		outer.append(invite).append(skrepka_float).append(skrepka_fixed).append(inner);
		very_scroll(semantic_active_pane);
		var jspContainer = $('.jspContainer', inner);
		var jsPane = $('.jspPane', inner);
		var height = outer.outerHeight() - invite.outerHeight() + 'px';
		jspContainer.css({'position':'absolute', 'bottom':'0px', 'left':'0px', 'right':'0px', 'overflow':'hidden', 'height': height});
		selector_alive(semantic_type, invite);
		jsPane.append(result).append('<br>');
		skrepka_bind();
		skrepka_float.css({'visibility':'hidden', 'zIndex':'-5'});
		skrepka_fixed.css({'visibility':'visible', 'zIndex':'5'});
		semantic_scroll_alive();
    }
// Сделать SPARQL-панель плавающей
    var panel_float = function() {
		semantic_active_pane = outer_text;
		outer.empty();
		inner.empty();
		outer.append(clone);
		var jspContainer = $('.jspContainer', outer);
		inner.append(invite).append(result).append(skrepka_float).append(skrepka_fixed).append('<br>');
		jsPane.append(inner);
		selector_alive(semantic_type, invite);
		skrepka_bind();
		skrepka_float.css({'visibility':'visible', 'zIndex':'5'});
		skrepka_fixed.css({'visibility':'hidden', 'zIndex':'-5'});
		semantic_scroll_alive();
    }
	skrepka_bind();
	dojo.connect(window, "onresize", null, function() {
		if(skrepka_fixed.css('visibility') == 'visible') {
			semantic_active_pane = inner_text;
			var height = outer.outerHeight(true) - invite.outerHeight(true) + 'px';
			inner.css({'height': height});
		}
	});
}
function selector_alive(semantic_type, invite) {
	var $select = $('select', invite);
	if(semantic_type == 'dbpedia') $select.unbind('mouseup').bind('mouseup', function(){writer($select.val());});
	else if(semantic_type == 'annotation') {
		$anSelect.unbind('mouseup').bind('mouseup', doAnSelect);
		$anStartBtn.unbind('mouseup').bind('mouseup', doAnStartBtn);
		$anStopBtn.unbind('mouseup').bind('mouseup', doAnStopBtn);
	} else console.log('err!');	
}
		
function lodlive_load() {}
function wdqs_iframe_load() {}
function dbpedia_load() {}

// Стартовал ли агент в дочернем окне?
function agentIsOK(agent, name) {
    setTimeout(function(){ 
		if(agent == null || typeof agent == 'undefined' || typeof agent.closed == 'undefined') browserMessage(voice.mes_agent);
		else { agent.blur(); if(agent && name) win_opened.push({win:agent,name:name}); }
	},1500);	
}

// Появилось ли дочернее окно?
function childIsOK(name) {
//    if(chromeFirst && (window.chrome || window.opera)) { browserMessage(voice.mes1 + voice.gmes2); chromeFirst = false; }
    setTimeout(function(){ 
		if(child == null || typeof child == 'undefined' || typeof child.closed == 'undefined') browserMessage(voice.mes1 + voice.mes2);
		else child.focus();
	},800);	
	if(name) win_opened.push({win:child,name:name});
} 
})();
// Конец кода движка Семантической паутины 

// Глобальные функции
// Аварийные сообщения
function bounceOut(n) {		// Визуальный эффект "попрыгайчик"
	var s = 7.5625; var p = 2.75;  var l;
	if(n < (1 / p)){ l = s * Math.pow(n, 2);
	} else if(n < (2 / p)){ n -= (1.5 / p); l = s * Math.pow(n, 2) + .75;
	} else if(n < (2.5 / p)){ n -= (2.25 / p); l = s * Math.pow(n, 2) + .9375;
	} else{ n -= (2.625 / p); l = s * Math.pow(n, 2) + .984375; }
	return l;
}
function browserMessage(mess) {
	var height = getPageSize()[3];
	$alert = $('#alert');
	$alert.css('z-index','999').html(mess);
	$alert.append($('<div>').addClass('alert_close_btn'));
    anim({
        node:'alert', easing:bounceOut,
        properties:{ top: { start:0, end:height - 160 }, opacity: { start:0.1, end:1 } },
        duration: 1000
    }).stop().play();
	$alert.unbind('mouseup').bind('mouseup', alert_hide);
}
function alert_hide(){$alert.css('z-index','-1');}

function writer(n) { $('.queryText').val(queries[n].sparql); }	
function callBack_dbpedia(invite) {  
	dbpedia_invite = invite;
	$('#dbpedia_invite').append($(invite));
	$('.query').remove();
	var $select = $('<select>').addClass('align_right').addClass('special_field').addClass('selector_field');
	var timer = setInterval(function(){
		if(queries_ok) { 
			clearInterval(timer);  
			queries = dbpedia_queries.querySets.dbpedia;
			for (var q=0; q < queries.length; q++) {
				var $opt = $('<option>').text(queries[q].name).val(q);
				$select.append($opt);
			}
			$('.ui-combobox').empty().append($select);
			$select.unbind('mouseup').bind('mouseup', function(){writer($select.val());});
		}
	},10);
}
function  getPageSize(){
	var xScroll, yScroll, pageWidth, pageHeight, windowWidth, windowHeight;
	if (window.innerHeight && window.scrollMaxY) {
		xScroll = document.body.scrollWidth;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ 
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else if (document.documentElement && document.documentElement.scrollHeight > document.documentElement.offsetHeight){ 
		xScroll = document.documentElement.scrollWidth;
		yScroll = document.documentElement.scrollHeight;
	} else { 
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	if (self.innerHeight) { 
		windowWidth = self.innerWidth;
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { 
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { 
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	} else {
		pageHeight = yScroll;
	}
	if(xScroll < windowWidth){
		pageWidth = windowWidth;
	} else {
		pageWidth = xScroll;
	}
	return [pageWidth,pageHeight,windowWidth,windowHeight];
}
// Конец глобальных функций
