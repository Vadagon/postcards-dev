(function(){
	var style = document.createElement('link');
	style.rel = "stylesheet"
	style.href = "js/constructor/constructor.css"
	document.body.appendChild(style);

	var c = {
		width: 661,
		height: 420,
		position: '',
		activeTool: 'design',
		listeners: function(){
			$('.creation__tool').click(function(){
				c.activeTool = $(this).attr('class').replace('creation__tool', '').replace('tool_', '').replace('active', '').trim();
			})
			$('.creation__tool .creation__gallery_img').click(function(){
				c.blur()
				c.tools[c.activeTool]($(this).data('bg'))
				c.showAdditionalSettings(c.activeTool);
			})
			c.c.on('click', '.text-insertation-tool .insertation-content', function(){
				console.log($(this).parent().hasClass('editable'))
				if(!$(this).parent().hasClass('editable')){
					c.blur()
					c.focus($(this).parent())
					c.showAdditionalSettings($(this).parent().data("creation__tool"));
				}
			})
			$('#constructor-settings-text :input').on('change click hide.spectrum', function(e, d){
				var css = {};
				switch ($(this).attr('type')){
					case 'select':
						css[$(this).data('option')] = $(this).val()
						break;
					case 'radio':
						$(this).parent().find('button').removeClass('active');
						$(this).addClass('active');
						css[$(this).closest('.fieldset').data('option')] = $(this).val();
						break;
					case 'range':
						css[$(this).data('option')] = $(this).val()+$(this).data('suffix');
						break;
					// case 'button':
					// 	css[$(this).data('option')] = $(this).val();	
					case 'checkbox':
						if(!$(this).hasClass('active')){
							$(this).addClass('active')
							css[$(this).data('option')] = $(this).val();	
						}else{
							$(this).removeClass('active')
							css[$(this).data('option')] = 'initial';	
						}
						break;
					case 'colorpicker':
						css['color'] = '#'+$(this).spectrum('get').toHex()
					default:
						console.log(1);
				}
				c.c.find('.editable').css(css);	
				$(this).parent().find('.bindParams').text($(this).val())
				console.log(css)
			})
			c.fake.click(function(){
				c.blur()
			})
		},
		tools: {
			design: function(e){
				console.log(1)
				c.c.find('*:not(#constructor-cast-fake)').remove()
				e = JSON.parse('['+e+']');
				// console.log(e)
				e.forEach(function(el, id){
					if(!(id%2)){
						c.tools[e[id]](...e[id+1])
						console.log(e[id])
					}
				});
				c.blur();
			},
			img: function(e){
				var el = $(`<div class="text-insertation-tool editable" data-creation__tool="img">
					<img src="${e}" class="insertation-content">
					<div class="insertation-moving-tool"></div>
					<div class="insertation-editing-tool"></div>
					</div>`).appendTo(c.c)
				.css({
					width: '150px'
				})
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
			text: function(e, css){
				var div = $(`<div class="text-insertation-tool editable" data-creation__tool="text">
					<font contenteditable="true" class="insertation-content">${e?e:'sample text'}</font>
					<div class="insertation-moving-tool"></div>
					<div class="insertation-editing-tool"></div>
					</div>`).appendTo(c.c)
				.css({
					width: '150px'
				})
				.resizable({
					containment: "#constructor-cast-main"
					// handles: 'w'
				})
				.draggable({
					containment: "#constructor-cast-main",
					handle: ".insertation-moving-tool"
				}).on('click', '.insertation-editing-tool', function(){
					c.blur()
					$(this).parent().remove()
				}).rotatable();
				c.css(css, div)
			}
		},
		css: function(css, div){
			if(!css) return;
			var style = div.attr('style');
			div.attr('style', style+css)
			console.log(css)
			setTimeout(function() {
				var match;
				match = css.match(/[0-9]{1,}(?=%%w)/ig);
				match && match.forEach(function(el){
					var d = c.width / 100 * parseInt(el) - div.width()/2;
					var reg = new RegExp(el+'%%w',"ig");
					css = css.replace(reg, d+'px')
				})
				match = css.match(/[0-9]{1,}(?=%%h)/ig);
				match && match.forEach(function(el){
					var d = c.height / 100 * parseInt(el) - div.outerHeight()/2;
					var reg = new RegExp(el+'%%h',"ig");
					css = css.replace(reg, d+'px')
				})
				console.log(css)
				div.attr('style', style+css)
			}, 10);
		},
		blur: function(){
			c.c.find('.editable').removeClass('editable').find('.insertation-content').attr('contenteditable', 'false')
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
					<div id="constructor-cast-main" style="height: ${c.height}px; width: ${c.width}px; left: ${c.position.left}px; top: ${c.position.top}px;">
						<div id="constructor-cast-fake"></div>
					</div>
					<div class="constructor-additional-ui" id="constructor-settings-text">

						<div class="_panelWrapperOpen_1xf1s_54">
						    <div class="_panelWrapperOpenBorder_1xf1s_96"></div>
						    <div data-bubble-md="true">
						        <div>
						            <div class="_panelWrapperName_gx3ws_75" data-test="panelWrapperName">Text options</div>
						            <div class="_panelText_gx3ws_88">
						                <div class="_panelFontSize_gx3ws_99" data-test="panelFontSize">
						                    <div>
						                    	<select style="width: 100%;" type="select" data-option="font-family">
												    <option value="Georgia, serif">Georgia, serif</option>
												    <option value="Verdana, Geneva, sans-serif">Verdana, Geneva, sans-serif</option>
												    <option value="'Courier New', Courier, monospace">'Courier New', Courier, monospace</option>
												</select>

						                        <!-- 
						                        <div class="dd__wrapper _dd__wrapper_gx3ws_328">
						                            <div class="dd__selectControl _dd__selectControl_gx3ws_335">
						                                <div class="dd__selected _dd__selected_gx3ws_357">
						                                    <div class="_selectedValueRenderer_gx3ws_362" style="font-family: &quot;Open Sans&quot;;">Open Sans</div>
						                                </div>
						                                <svg class="dd__expandIcon _dd__expandIcon_gx3ws_350" viewBox="0 0 6 4" width="6px" height="4px">
						                                    <path d="M6,0,3,4,0,0Z" transform="translate(0 0)"></path>
						                                </svg>
						                            </div>
						                        </div> -->
						                    </div>
						                    <!-- <div class="_selectFontSizeWrapper_gx3ws_245">
						                        <input id="selectFontSize" type="number" class="_selectInput_gx3ws_49 _controlInputNumber_q0usp_1" min="6" max="400" step="1" value="44">
						                        <label for="selectFontSize" class="_selectFontSizeLabel_gx3ws_254">pt</label>
						                        <div class="dd__wrapper _textSize_gx3ws_261">
						                            <div class="dd__selectControl _selectControlSize_gx3ws_281">
						                                <div class="dd__selected _selectedSize_gx3ws_277">
						                                    <div class="dd__placeholder">Select ...</div>
						                                </div>
						                                <svg class="dd__expandIcon _expandIcon_gx3ws_322" viewBox="0 0 6 4" width="6px" height="4px">
						                                    <path d="M6,0,3,4,0,0Z" transform="translate(0 0)"></path>
						                                </svg>
						                            </div>
						                        </div>
						                    </div> -->
						                </div>
						            </div>
						            <div class="_panelTextLine_gx3ws_93"></div>
						            <div class="_panelText_gx3ws_88">
						                <div class="_topBtnWrapper_gx3ws_100 fieldset" data-option="text-align">
						                    <div class="_textStyle_gx3ws_114">
						                        <button type="checkbox" class="_textBold_gx3ws_121" data-option="font-weight" value="bold" data-categ="tools" data-subcateg="textPanel" data-value="bold">B</button>
						                        <button type="checkbox" class="_textItalic_gx3ws_122" data-option="font-style" value="italic" data-categ="tools" data-subcateg="textPanel" data-value="italic">I</button>
						                        <button type="checkbox" class="_textUnderline_gx3ws_123" data-option="text-decoration" value="underline" data-categ="tools" data-subcateg="textPanel" data-value="underline">U</button>
						                        <button type="checkbox" class="_textUppercase_gx3ws_124" data-option="text-transform" value="uppercase" data-categ="tools" data-subcateg="textPanel" data-value="uppercase">AA</button>
						                    </div>
						                    <div class="_textPosition_gx3ws_127">
						                        <button data-option="text-align" value="left" type="radio" class="_textPositionLeft_gx3ws_127 active" data-test="TextPositionLeft" data-categ="tools" data-subcateg="textPanel" data-value="positionLeft">
						                            <svg viewBox="0 0 16 13" style="width: 16px; height: 13px; display: inline-block;">
						                                <path d="M.5,12h6a.5.5,0,0,1,.5.5H7a.5.5,0,0,1-.5.5H.5a.5.5,0,0,1-.5-.5H0A.5.5,0,0,1,.5,12Z"></path>
						                                <path d="M.5,8h11a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5H.5A.5.5,0,0,1,0,8.5H0A.5.5,0,0,1,.5,8Z"></path>
						                                <path d="M.5,4h9a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5H.5A.5.5,0,0,1,0,4.5H0A.5.5,0,0,1,.5,4Z"></path>
						                                <path d="M.5,0h14a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5H.5A.5.5,0,0,1,0,.5H0A.5.5,0,0,1,.5,0Z"></path>
						                            </svg>
						                        </button>
						                        <button data-option="text-align" value="center" type="radio" class="_textPositionCenter_gx3ws_128" data-test="TextPositionCenter" data-categ="tools" data-subcateg="textPanel" data-value="positionCenter">
						                            <svg viewBox="0 0 16 13" style="width: 16px; height: 13px; display: inline-block;">
						                                <path d="M4.5,12h7a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5h-7a.5.5,0,0,1-.5-.5H4A.5.5,0,0,1,4.5,12Z"></path>
						                                <path d="M2.5,8h11a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5H2.5A.5.5,0,0,1,2,8.5H2A.5.5,0,0,1,2.5,8Z"></path>
						                                <path d="M3.5,4h9a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5h-9A.5.5,0,0,1,3,4.5H3A.5.5,0,0,1,3.5,4Z"></path>
						                                <path d="M.5,0h15a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5H.5A.5.5,0,0,1,0,.5H0A.5.5,0,0,1,.5,0Z"></path>
						                            </svg>
						                        </button>
						                        <button data-option="text-align" value="right" type="radio" class="_textPositionRight_gx3ws_129" data-test="TextPositionRight" data-categ="tools" data-subcateg="textPanel" data-value="positionRight">
						                            <svg viewBox="0 0 16 13" style="width: 16px; height: 13px; display: inline-block;">
						                                <path d="M8.5,12h6a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5h-6a.5.5,0,0,1-.5-.5H8A.5.5,0,0,1,8.5,12Z"></path>
						                                <path d="M3.5,8h11a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5H3.5A.5.5,0,0,1,3,8.5H3A.5.5,0,0,1,3.5,8Z"></path>
						                                <path d="M5.5,4h9a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5h-9A.5.5,0,0,1,5,4.5H5A.5.5,0,0,1,5.5,4Z"></path>
						                                <path d="M.5,0h14a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5H.5A.5.5,0,0,1,0,.5H0A.5.5,0,0,1,.5,0Z"></path>
						                            </svg>
						                        </button>
						                    </div>
						                </div>
						                <div class="_bottomBtnWrapper_gx3ws_171" data-bubble-md="true">
						                    <!-- <button class="_textPanelBtn_gx3ws_120" data-test="glyphs" data-categ="tools" data-value="openGlyphsPanel" data-subcateg="textPanel">Ã</button> -->
						                    <div class="_fontColor_gx3ws_191">
						                        <div class="_fontColorText_gx3ws_209">Font color</div>
						                        <!-- <button class="_fontColorBgr_gx3ws_219" data-test="fontColor" data-categ="tools" data-value="openColorPanel" data-subcateg="textPanel" style="background-color: rgb(248, 5, 34);"></button> -->
						                    	<input id='colorpicker' type="colorpicker" />
						                    </div>
						                </div>
						            </div>
						            <div class="_panelTextLine_gx3ws_93"></div>
						            <div class="_panelText_gx3ws_88">
						                <div class="_fontRanges_gx3ws_197">
						                    <div class="_fontSizeScroll_gx3ws_201">
						                        <div class="_fontSizeScrollText_gx3ws_210">Font size</div>
						                        <div class="_rangeWidth_gx3ws_239" data-test="fontSizeScroll">
						                            <input data-suffix="px" data-option="font-size" type="range" min="6" max="400" step="1" value="44">
						                            <label class="_rangeInput_gx3ws_61 _controlInputNumber_q0usp_1 bindParams">1</label>
						                        </div>
						                    </div>
						                    <div class="_fontLineHeight_gx3ws_203">
						                        <div class="_fontLineHeightText_gx3ws_212">Line height</div>
						                        <div class="_rangeWidth_gx3ws_239">
						                            <input data-suffix="" data-option="line-height" type="range" min="0.1" max="3" step="0.1" value="1">
						                            <label class="_rangeInput_gx3ws_61 _controlInputNumber_q0usp_1 bindParams">1</label>
						                        </div>
						                    </div>
						                    <div class="_fontLetterSpacing_gx3ws_202">
						                        <div class="_fontLetterSpacingText_gx3ws_211">Spacing</div>
						                        <div class="_rangeWidth_gx3ws_239" data-test="fontLetterSpacing">
						                            <input data-suffix="px" data-option="letter-spacing" type="range" min="-10" max="80" step="1" value="0">
						                            <label class="_rangeInput_gx3ws_61 _controlInputNumber_q0usp_1 bindParams">1</label>
						                        </div>
						                    </div>
						                </div>
						            </div>
						        </div>
						    </div>
						</div>
						
					</div>
				</div>`);
			$("#colorpicker").spectrum({
			    color: "#000000"
			});
			c.c = $('#constructor-cast-main').eq(0)
			c.fake = $('#constructor-cast-fake').eq(0)

			// c.tools.design('"text", ["ЦЕНТР", "text-align: center; width: 66%; font-size: 52px; text-decoration: underline; left: 50%%w; top: 50%%h;"], "bg", ["img/no_image.jpg"]')
			// c.tools.design('"text", ["top-left", "width: 140px; font-size: 22px; font-weight: bold; left: 2px; top: 2px"], "text", ["top-right", "text-align: right; width: 140px; font-size: 22px; font-weight: bold; right: 2px; top: 2px"], "text", ["bottom-left", "width: 160px; font-size: 22px; font-weight: bold; left: 2px; bottom: 2px;"], "text", ["bottom-right", "text-align: right; width: 180px; font-size: 22px; font-weight: bold; right: 2px; bottom: 2px;"], "bg", ["img/main_bg.png"]')
			// c.showAdditionalSettings('text')
		}
	}



	c.init()
	c.listeners()
})();