// ==UserScript==
// @name        TaoPic
// @namespace   rc
// @include     http://detail.tmall.com/*
// @include     https://detail.tmall.com/*
// @include     http://item.taobao.com/*
// @include     https://item.taobao.com/*
// @include			http://detail.1688.com/*
// @include			https://detail.1688.com/*
// @grant		GM_xmlhttpRequest
// @grant		GM_registerMenuCommand
// @grant		GM_addStyle
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js
// @version     0.4 альфа
// ==/UserScript==

function getTaoPics(){

	console.log("Start 'getTaoPics'");
    var url = null;
    var myregexp = /dsc\.taobaocdn\.com\/([^'|"]+)/i;
    if(window.location.host=='detail.tmall.com'){
        var subject = $('body').text();
        url = "http://" + myregexp.exec(subject)
    } else if(window.location.host=='detail.1688.com') {
        url = $('#desc-lazyload-container').attr('data-tfs-url');
    } else {
        var subject = $('body').html();
        url = "http://" + myregexp.exec(subject)
	}
	if (url != null) {
		console.log(url);

        GM_addStyle("body { background: none repeat scroll 0 0 black !important }");
        GM_addStyle("#header { text-align: center; height: 100% !important; background: none repeat scroll 0 0 black !important }");
        $('#header').empty();

        if(window.location.host=='detail.tmall.com'){
            $('#sn-bd').remove();
            $('#J_CommonBottomBar').remove();
		}

		$('#J_UlThumb img').each(function(indx, element){
			//var style = $(element).attr('src');
			var src = $(element).attr('src').slice(0, -10);
			if (src != null){
				console.log(src);
				$('#header').append('<img class="selectable selected" src="'+src+'" />');
			}
		});

        var t = $('#header');
        t.detach();
		$('body').empty().unbind();
        t.appendTo('body');

		var script=document.createElement('script');
		script.async = false;
		script.src = url;
        script.type = "text/javascript";
        if (window.location.host == 'detail.1688.com') {
            script.onload = function () {
                $('body').append('<div id="desc" style="display: none">'+offer_details.content+'</div><div id="header"></div>');


                $('#desc :not(a)>img').each(function(indx, element){
                    //var src = $(element).attr('src');
                    $('#header').append('<img class="selectable selected" src="'+$(element).attr('src')+'" />');
                });

                $('#header').prevAll().remove();
                $('#header').nextAll().remove();

                // берем все необходимые нам картинки
                var $img = $('#header img');

                // ждем загрузки картинки браузером
                $img.load(function(){
                    console.log("$img.load: "+$(this).attr('src'));
                    // удаляем атрибуты width и height
                    $(this).removeAttr("width")
                        .removeAttr("height")
                        .css({ width: "", height: "" });

                    // получаем заветные цифры
                    var width  = $(this).width();
                    var height = $(this).height();
                    if(width>50 && height>100){
                        // если картинка шире 450 и выше 250 пикселей, то используем ее
                    } else $(this).remove();
                });

                $('#header').append('<br /><textarea id="imgs" rows="20" cols="150"></textarea>');
                $('img:first').click();
            };
        }

        if(window.location.host=='detail.tmall.com'){
            document.getElementsByTagName('body')[0].appendChild(script);
        } else {
            document.getElementsByTagName('head')[0].appendChild(script);
		}
        if (window.location.host != 'detail.1688.com') {
            GM_xmlhttpRequest({ method: "GET", url: url, onload: function(desc) {

                $('body').append('<div id="desc" style="display: none">'+desc.responseText+'</div><div id="header"></div>');


                $('#desc :not(a)>img').each(function(indx, element){
                    //var src = $(element).attr('src');
                    $('#header').append('<img class="selectable selected" src="'+$(element).attr('src')+'" />');
                });

                $('#header').prevAll().remove();
                $('#header').nextAll().remove();

                // берем все необходимые нам картинки
                var $img = $('#header img');

                // ждем загрузки картинки браузером
                $img.load(function(){
                    console.log("$img.load: "+$(this).attr('src'));
                    // удаляем атрибуты width и height
                    $(this).removeAttr("width")
                        .removeAttr("height")
                        .css({ width: "", height: "" });

                    // получаем заветные цифры
                    var width  = $(this).width();
                    var height = $(this).height();
                    if(width>50 && height>100){
                        // если картинка шире 450 и выше 250 пикселей, то используем ее
                    } else $(this).remove();
                });

                // для тех браузеров, у который поглюкивает работа с кешем, раскоментировать следующий код
                /*			$img.each(function() {
				var src = $(this).attr('src');
				$(this).attr('src', '');
				$(this).attr('src', src);
			});
*/
                $('#header').append('<br /><textarea id="imgs" rows="20" cols="150"></textarea>');
                $('img:first').click();
            }});  // GM_xmlhttpRequest
        }

	} else {
		alert("TaoPic\nА вот и какая-то фигня вылезла, кликай Ctrl+R, если не поможет жалуйся Ролу");
	}
}

function collectImgs(){
    $(this).toggleClass('selected');
    $('#imgs').empty(); var pics = [];
    $('img.selected').each(function(){
        pics.push($(this).attr('src'));
    });
    $('#imgs').val('<img src="'+pics.join('">'+"\n"+'<img src="')+'">');
}

GM_addStyle("#gettaopics {background-color: black;color: white;font-weight: bold;padding: 5px 15px;position: fixed;right: 0;top: 0;z-index: 100000001;}");
GM_addStyle(".selectable {display: inline;opacity: 0.25;}");
GM_addStyle(".selectable.selected {display: inline;opacity: 1.0;}");

GM_registerMenuCommand("Выкусить картинки", getTaoPics);

$(document).ready(function(){
    $('body').prepend('<a id="gettaopics" href="#">Выкусить<br>картинки</a>');
    $('#gettaopics').on('click',getTaoPics);
    $(document).on('click','.selectable',collectImgs);
});
