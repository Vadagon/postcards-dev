(function(){
	var style = document.createElement('style');
	style.innerHTML = `
		#constructor-cast-container{
		    height: 100%;
		    width: 100%;
		    overflow: hidden;
		    display: block;
		    position: absolute;
		    top: 0;
		    left: 0;
		}
		#constructor-cast-main{
			background-color: blue; 
			position: absolute; 
			vertical-align: middle; 
			border-style: none;

			background-position: center:
			background-size: cover;
			font-size: 16px;
			text-align: left;
		}
		#constructor-cast-fake{
			font-size: 16px;
			width: 0;
			position: absolute; 
			top: 0;
			left: 0;
			height: 0;
		}
		.text-insertation-tool{
			top: 25px;
			left: 25px;
			padding: 5px;
			border: 1px solid black;
			cursor: pointer;
			display: inline-block;
		}
		.box {
		  border: 2px solid black;
		  width: 100px;
		  height: 100px;
		  background-color: green;
		  margin: 27px;
		  position: relative;
		}

		.ui-rotatable-handle {
		  background: url("https://cdn.jsdelivr.net/jquery.ui.rotatable/1.0.1/rotate.png");
		  background-repeat: no-repeat;
		  background-size: 100% 100%;
		  height: 25px;
		  width: 25px;
		  position: absolute;
		}

		.ui-rotatable-handle-sw {
		  bottom: -27px;
		  left: -27px;
		}

		.ui-rotatable-handle-nw {
		  top: -27px;
		  left: -27px;
		}

		.ui-rotatable-handle-se {
		  bottom: -27px;
		  right: -27px;
		}

		.ui-rotatable-handle-ne {
		  top: -27px;
		  right: -27px;
		}
		.text-insertation-tool{
			top: 50px;
			left: 50px;
			padding: 10px;
			background: none;
			box-sizing: border-box;
			position: relative;
		}
		.text-insertation-tool .insertation-content{
			// resize: both;
			width: 100%;
			height: 100%;
			display: inline-block;
			overflow: hidden;
		}
		.text-insertation-tool > div:not(.ui-resizable-handle){
		    background-position: 0 center;
		    background-repeat: no-repeat;
		    margin-right: 20px;
		    background-image: url(img/icons/cancel.png);
		    background-size: contain;
		    height: 25px;
		    width: 25px;
		    position: absolute;
		}
		.text-insertation-tool div.insertation-moving-tool{
			top: -20px;
		    left: -20px; 
		}
		.text-insertation-tool .ui-rotatable-handle.ui-draggable{
			bottom: -20px;
		    left: -20px;
		}
		.text-insertation-tool div.insertation-editing-tool{
			top: -20px;
		    right: -20px;
		}
		.text-insertation-tool:not(.editable){
			border: none;
		}
		.text-insertation-tool:not(.editable) > div{
			display: none;
		}
		.text-insertation-tool:not(.editable) .insertation-content {
			// resize: none;
		}

	`;
	document.body.appendChild(style);

	var c = {
		width: 661,
		height: 420,
		position: '',
		activeTool: 'bg',
		listeners: function(){
			$('.creation__tool').click(function(){
				c.activeTool = $(this).attr('class').replace('creation__tool', '').replace('tool_', '').replace('active', '').trim();
			})
			$('.creation__tool .creation__gallery_img').click(function(){
				c.blur(c.fake.find('*'))
				c.tools[c.activeTool]($(this).data('bg'))
			})
			c.fake.on('click', '.text-insertation-tool .insertation-content', function(){
				console.log($(this).parent().hasClass('editable'))
				if(!$(this).parent().hasClass('editable')){
					c.blur(c.fake.find('*'))
					c.focus($(this).parent())
				}
			})
			c.c.click(function(){
				c.blur(c.fake.find('*'))
			})
		},
		tools: {
			design: function(){

			},
			img: function(e){
				console.log(e)
				$(`<div class="text-insertation-tool editable">
					<img src="${e}" class="insertation-content">
					<div class="insertation-moving-tool"></div>
					<div class="insertation-editing-tool"></div>
					</div>`).appendTo(c.fake)
				.draggable({
					containment: "#constructor-cast-main",
					handle: ".insertation-moving-tool"
				}).on('click', '.insertation-editing-tool', function(){
					// c.blur($(this).parent())
					$(this).parent().remove()
				})
				.rotatable()
				.resizable({
					containment: "#constructor-cast-main"
				});
			},
			bg: function(e){
				c.c.css({backgroundImage: 'url('+e+')'})
			},
			text: function(){
				$(`<div class="text-insertation-tool editable">
					<content contenteditable="true" class="insertation-content">23456</content>
					<div class="insertation-moving-tool"></div>
					<div class="insertation-editing-tool"></div>
					</div>`).appendTo(c.fake)
				.resizable({
					containment: "#constructor-cast-main"
				})
				.draggable({
					containment: "#constructor-cast-main",
					handle: ".insertation-moving-tool"
				}).on('click', '.insertation-editing-tool', function(){
					// c.blur($(this).parent())
					$(this).parent().remove()
				}).rotatable();
			}
		},
		blur: function(e){
			e.removeClass('editable').find('.insertation-content').attr('contenteditable', 'false')
		},
		focus: function(e){
			e.addClass('editable').find('.insertation-content').attr('contenteditable', 'true')
		},
		toolSwitching: function(){

		},
		reposition: function(){
			c.width = $('.creation_playground img').width()
			c.height = $('.creation_playground img').css('opacity', '0').height()	
			c.position = $('.creation_playground img').position()
			console.log(c)
		},
		init: function(){
			c.reposition()
			$('.creation_playground').append(`<div id="constructor-cast-container"><div id="constructor-cast-main" style="height: ${c.height}px; width: ${c.width}px; left: ${c.position.left}px; top: ${c.position.top}px;"></div><div id="constructor-cast-fake"></div>`);
			c.c = $('#constructor-cast-main').eq(0)
			c.fake = $('#constructor-cast-fake').eq(0)
			c.tools.img('img/main_bg.png')
		}
	}



	c.init()
	c.listeners()
})();