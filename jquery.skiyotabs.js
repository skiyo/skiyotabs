/**
 * SkiyoTabs for jQuery
 *
 * @auth Jessica
 * @link http://demo.skiyo.cn/skiyotabs/
 *
 */
(function($) {
	$.fn.SkiyoTabs = function(options) {
		var opts = $.extend({}, $.fn.SkiyoTabs.defaults, options);
		return this.each(function() {
			var target = $(this);
			var div = target.find('div');  //所有的div
			var tabs = target.find('li');  //tabs
			var flag = false;
			now = new Date().valueOf();
			function Tabs() {
				if(flag) { //第一次必须执行
					if(new Date().valueOf() - now < 300) {  //阻止快速事件
						return false;
					}
				} else {
					select(div, $(this), opts.firstOn);
					flag = true;
					return false;
				}

				if($(this).hasClass(opts.className)) {  //如果当前被击中就终止
					return false;
				}
				select(div, $(this));
				now = new Date().valueOf();
				return false;  //防止url出现#
			}

			function select(div, li, index) {
				div.hide();
				if(typeof(index) == "number") {
					ajax(div, li);
					$(div[index]).fadeIn(opts.fadeIn);
					tabs.removeClass(opts.className);
					$(tabs[index]).addClass(opts.className);
					
				} else {
					var tab = div.filter(li.find("a").attr("href"));
					ajax(div, li);
					tab.fadeIn(opts.fadeIn);
					tabs.removeClass(opts.className);
					li.addClass(opts.className);

				}
			}

			function ajax(div, li) {
				var href = li.find("a").attr("href");
				var rel = li.find("a").attr("rel");  //ajax请求url
				var i = div.filter(href);          //当前div
				if(rel) {                          //如果ajax请求url不为空
					i.html(opts.loadName);
					$.ajax({
						url: rel,
						cache: false,
						success: function(html) {
							i.html(html);
						},
						error:function() {
							i.html('error');
						}
					});
					li.find("a").removeAttr("rel");  //第二次不再ajax
				}
			}
			if(opts.autoFade) {
				var index = opts.firstOn + 1;
				setInterval(function(){
					if(index >= div.length) {
						index=0;
					}
					select(div,$(this),index++);
				}, opts.autoFadeTime*1000);
			}
			//绑定并触发事件
			tabs.bind(opts.eventName == 'all' ? 'click mouseover' : opts.eventName, Tabs).filter(':first').trigger(opts.eventName == 'all' ? 'click' : opts.eventName);
		});
	};
	$.fn.SkiyoTabs.defaults = {
		firstOn : 0,
		className: 'selected',
		eventName: 'all',  //可以为click mouserover all
		loadName: 'loading...', //ajax等待字符串
		fadeIn: 'slow',
		autoFade:true,
		autoFadeTime:3
	};
})(jQuery);