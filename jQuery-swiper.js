/*created by yuechen*/
			(function($) {
				$.fn.swipe = function(options) {
					var self = $(this);
					var opt = {};
					//将arguments参数传过来
					$.extend(opt, options);
					//方便获取Object对象里面内容
					var arr = Object.keys(opt);
					//要能滑动要先设置position属性
					$(this).css({
						position: "relative",
						"left": "0"
					});
					//为节省性能，避免每次追加，用createDocumentFragment创建节点一次性追加
					var frag = document.createDocumentFragment();
					var all_wid = 0;
					for (var i = 0; i < arr.length; i++) {
						//计算.append的宽度，此时为百分比
						all_wid += parseInt(opt[arr[i]].width);
						//向节点追加元素
						var el = document.createElement('strong');
						el.innerHTML = opt[arr[i]].content;
						var elwid = parseInt(opt[arr[i]].width) * 0.01 * $(this).width();
						$(el).css({
							"background-color": opt[arr[i]].backgroundColor,
							"width": elwid
						});

						//判断是否阻止默认事件，绑定事件，注入方法，注册事件需要用闭包保存变量，因为touchsstart事件是在for循环之后发生的
						(function(ele, index) {
							var isPreventDefault = opt[arr[index]].isPreventDefault;
							var clickFun = opt[arr[index]].clickFun;
							$(ele).on("touchstart", function(e) {
								isPreventDefault && e.preventDefault()
								isPreventDefault && e.stopImmediatePropagation()
								clickFun()
							})
						})(el, i)

						frag.appendChild(el);
					}
					//计算.append的宽度，此时为百分比，此时为px
					all_wid = all_wid * 0.01 * $(this).width()
					self.append("<div class='append'><div>");
					//追加的元素层级要高于父元素，因为它有touchstart事件
					var zIndex = $(this).css("z-index");
					if (typeof zIndex == "number") {
						zIndex += 1;
					} else {
						zIndex = 1
					}
					//此时不用.html()是应为 Zepto的.html()源码中使用了each方法，each的this指向了每一个对象,将每一个对象append一次，append源码中前n-1次是克隆节点，最后一次将该节点追加上去，导致each的下一个this无法找到对象。
					self.find(".append").empty().append(frag).css({
						"position": "absolute",
						"height": "100%",
						"width": all_wid,
						"top": "0",
						"right": -all_wid,
						"z-index": zIndex
					})
					var len = $(this).length;
					for (var i = 0; i < len; i++) {
						$(this).eq(i).on('touchstart', function(e) {
							self.css('left', '0');
                    //兼容Zepto和JQ的写法，兼容Zepto和JQ对event对象的封装不一样
							var evt = e;
							try {
								if (evt.originalEvent.targetTouches[0]) {
									//var touch = evt.touches[0];
									var touch = evt.originalEvent.targetTouches[0];
									startX = touch.clientX;
									startY = touch.clientY;
									left = 0;
									//console.log("jQuery")
								}
							} catch (e) {
								var touch = evt.touches[0];
								//var touch = evt.originalEvent.targetTouches[0];
								startX = touch.clientX;
								startY = touch.clientY;
								left = 0;
								//console.log("Zepto")
							}
						}).on('touchmove', function(e) {
							//console.log(11)
							var $this = $(this);
                     //兼容Zepto和JQ的写法，兼容Zepto和JQ对event对象的封装不一样
							var evt = e;
							try {
								if (evt.originalEvent.targetTouches[0]) {
									//var touch = evt.touches[0];
									var touch = evt.originalEvent.targetTouches[0];
									endX = touch.clientX;
									endY = touch.clientY;
									left = 0;
									//									console.log("jQuery")
								}
							} catch (e) {
								var touch = evt.touches[0];
								//var touch = evt.originalEvent.targetTouches[0];
								endX = touch.clientX;
								endY = touch.clientY;
								left = 0;
								//								console.log("Zepto")
							}
							var XNum = (endX - startX) < 0 ? startX - endX : endX - startX;
							var YNum = (endY - startY) < 0 ? startY - endY : endY - startY;
							if (XNum >= YNum) { //水平滑动
								e.preventDefault();
								if ((endX - startX) <= -10) { //从右往左
									flag = 0;
									$this.css("left", "0");
									$(this).css("left", -all_wid);
								} else if ((endX - startX) >= 10) { //从左往右
									$(this).css("left", "0")
								} else {
									new_left = '0px';
								}
							}

						}).on('touchend', function(e) {

						})
					}

				}

			})($);