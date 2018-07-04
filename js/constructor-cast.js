(function(){
	var style = document.createElement('link');
	style.rel = "stylesheet"
	style.href = "js/constructor/constructor.css"
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
				c.showAdditionalSettings(c.activeTool);
			})
			c.fake.on('click', '.text-insertation-tool .insertation-content', function(){
				console.log($(this).parent().hasClass('editable'))
				if(!$(this).parent().hasClass('editable')){
					c.blur(c.fake.find('*'))
					c.focus($(this).parent())
					c.showAdditionalSettings($(this).parent().data("creation__tool"));
				}
			})
			$('#constructor-settings-text :input').change(function(e){
				var css = {};
				switch ($(this).attr('type')){
					case 'select':
						css[$(this).data('option')] = $(this).val()
						c.fake.find('.editable').css(css);
						break;
					case 'radio':
						css[$(this).closest('fieldset').data('option')] = $(this).val()
						c.fake.find('.editable').css(css);
						break;
					default:
						console.log(1);
				}
				console.log(css)
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
				$(`<div class="text-insertation-tool editable" data-creation__tool="img">
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
					containment: "#constructor-cast-main",

				});
			},
			bg: function(e){
				c.c.css({backgroundImage: 'url('+e+')'})
			},
			text: function(){
				$(`<div class="text-insertation-tool editable" data-creation__tool="text">
					<font contenteditable="true" class="insertation-content">sample text</font>
					<div class="insertation-moving-tool"></div>
					<div class="insertation-editing-tool"></div>
					</div>`).appendTo(c.fake)
				.resizable({
					containment: "#constructor-cast-main",
					handles: 'e, w'
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
			c.showAdditionalSettings()
		},
		focus: function(e){
			e.addClass('editable').find('.insertation-content').attr('contenteditable', 'true')
		},
		toolSwitching: function(){

		},
		showAdditionalSettings: function(e){
			$('.constructor-additional-ui').hide();
			switch (e){
				case 'text':
					// start creating additional ui
					$('#constructor-settings-'+e).show()
					break;
				default:
					console.log('brakAll')	
			}
		},
		reposition: function(){
			c.width = $('.creation_playground img').width()
			c.height = $('.creation_playground img').css('opacity', '0').height()	
			c.position = $('.creation_playground img').position()
			console.log(c)
		},
		init: function(){
			c.reposition()
			$('.creation_playground').append(`
				<div id="constructor-cast-container">
					<div id="constructor-cast-main" style="height: ${c.height}px; width: ${c.width}px; left: ${c.position.left}px; top: ${c.position.top}px;"></div>
					<div id="constructor-cast-fake"></div>
					<div class="constructor-additional-ui" id="constructor-settings-text">
						<select type="select" data-option="font-family">
							<option value="Georgia, serif">Georgia, serif</option>
							<option value="Verdana, Geneva, sans-serif">Verdana, Geneva, sans-serif</option>
							<option value="'Courier New', Courier, monospace">'Courier New', Courier, monospace</option>
						</select>
						<select type="select" data-option="font-size">
							<option value="16px">16px</ption>
							<option value="11px">11px</option>
							<option value="32px">32px</option>
						</select>

						<fieldset data-option="text-align">
						    <legend>Text alignment</legend>

						    <div>
						        <input type="radio" name="text-align" value="left" id="huey"  checked>
						        <label for="huey">Left</label>
						    </div>

						    <div>
						        <input type="radio" name="text-align" value="center" id="dewey">
						        <label for="dewey">Center</label>
						    </div>

						    <div>
						        <input type="radio" name="text-align" value="right" id="louie">
						        <label for="louie">Right</label>
						    </div>

						</fieldset>

						<fieldset data-option="color">
						    <legend>Color</legend>

						    <div>
						        <input type="radio" name="color" value="black" id="huey1" checked>
						        <label for="huey1">Black</label>
						    </div>

						    <div>
						        <input type="radio" name="color" value="red" id="dewey1">
						        <label for="dewey1">Red</label>
						    </div>

						    <div>
						        <input type="radio" name="color" value="green" id="louie1">
						        <label for="louie1">Green</label>
						    </div>

						</fieldset>

					</div>
				</div>`);
			c.c = $('#constructor-cast-main').eq(0)
			c.fake = $('#constructor-cast-fake').eq(0)

			// c.tools.text('img/main_bg.png')
			// c.showAdditionalSettings('text')
		}
	}



	c.init()
	c.listeners()
})();