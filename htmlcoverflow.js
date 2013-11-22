/*
 * @copyright		© Copyright 2013-2017, epages GmbH, All Rights Reserved.
 *
 * @module			ep.ui.htmlcoverflow
 *
 * @revision		$Revision: 1.16.2.1.2.3 $
 */

/*jslint nomen:true*/
/*globals define*/

/*  
++++++++++++++++++++++++++++++++++++++
+                                    +
+     ePSlider - ePages GmbH (R)     +
+                                    +
+      Version: 6.0_DEV              +
+      Developed by: Roman Asimov    +
+                                    +
+      Package Include:              +
+       - jQuery                     +
+       - jQuery mousewheel          +
+       - jQuery Swipe               +
+                                    +
++++++++++++++++++++++++++++++++++++++
*/

define("ep/ui/htmlcoverflow", [
	"jquery",
	"ep",

	"ep/ui/core",
	"jquery/ui/widget"
], function ($, ep) {
	'use strict';

	$.widget("ui.uiHtmlcoverflow", {
		cvsController: {},
		//slider:undefined,
		//prevButton:undefined,
		//nextButton:undefined,
		cur_index:0,
		old_index:0,

		options: {
			
			// meine eigenen Optionen bzw Variablen
			draggable: 				false,
			resizable: 				"se",
			max_images:     		11,
			canvas_width:   		200, // canvas width umbenennen
			canvas_height:  		400,
			autoslide:      		"false",
			slidespeed:     		1,     // 1 = 1 sec 60 = 1 min
			refreshscale:   		100,    //Load Images every 100 ms
			index:  				1,
			state:  				1,
			elements_css_style:    'style="visible: none;"', // define CSS3
			swipespeed: 			1,
			cur:  					3,
			grid:  					1,
			pw:  					300, 
			sf:  					0.1,
			startIndex:             4,

			newIndexAfterClick:          0,
			oldIndexAfterClick:          0,
			flag_changed:  				 0, // 0 No , 1 Yes
			widthAllCvs: 0,
			widthFixedWrapper: 600,

			// do not touch

			sk_width:  		0,			// scaled
			sk_height: 		0,		// scaled
			cvs_width: 		0,		
			cvs_height: 	0,
			opacity: {
                start: 0.8,
                end: 0.0
            },
            reflexion: {
                start: 0.0,
                end: 0.8
            }

		},

		_create: function () {
			var self = this,
				o = self.options;
				o.canvas_height = self.element.innerHeight()*0.8;

			// initialize indexes
			self.cur_index = self.old_index = o.startIndex;

			self.prevButton = $("#epslider-prev");
			self.nextButton = $("#epslider-next");
			self.setcurrentPicture = $("#inpslider");

			this._cvs_loader();
		},

		slide: function(newIndex){
			this.cur_index = newIndex;
			console.debug(this.cur_index);
			
			this._slide();
		},

		_slide: function(){
			var self = this,
				o = self.options,
				tmpWidth;

			// 	index = o.index;
			// var imgController = {};

			// for (var sload = 0; sload <= o.max_images; sload++){
			// imgController["image_" + index] = $('<img src="img/'+index+'.png" id="image_'+index+'" width="150" height="150"/>');
			// }

			// 1. Das Element mit dem cur_index soll nicht gedreht werden und voll angezeigt sein
			//$('body').append(self.cvsController["image_" + self.cur_index].cvsBuffer);

				self.cvsController["image_" + self.cur_index].ctx.clearRect(0, 0, o.canvas_width, o.canvas_height*2);
				// self.cvsController["image_" + self.cur_index].ctx.drawImage(loader, 0, 0, o.canvas_width, o.canvas_height);

				tmpWidth = self._skewWidth(self.cvsController["image_" + self.cur_index].ctx, self.cvsController["image_" + self.cur_index].cvsBuffer[0], 0);

				self.cvsController["image_" + self.cur_index].cvs.attr({
					width: tmpWidth,
				});

				self._skew(self.cvsController["image_" + self.cur_index].ctx, self.cvsController["image_" + self.cur_index].cvsBuffer[0], 0, self.cur_index);

				self._setMidPosition(self.cur_index);


			// 2. alles was größer ist als curindex soll rechts gedreht sein
			for (var posit_count = self.cur_index+1; posit_count <= o.max_images; posit_count++) {
				self.cvsController["image_" + posit_count].ctx.clearRect(0, 0, o.canvas_width, o.canvas_height);

				if(self.cvsController["image_" + posit_count].skewWidth){
					tmpWidth = self.cvsController["image_" + posit_count].skewWidth;
					self.cvsController["image_" + posit_count].skewWidth = undefined;
				}else{
					tmpWidth = self._skewWidth(self.cvsController["image_" + posit_count].ctx, self.cvsController["image_" + posit_count].cvsBuffer[0], -60);
				}

				self.cvsController["image_" + posit_count].cvs.attr({
					width: tmpWidth
				});

				self._skew(self.cvsController["image_" + posit_count].ctx, self.cvsController["image_" + posit_count].cvsBuffer[0], -60, posit_count);

				console.log('Startbreite von cvs: ',posit_count,' = ',' | Neue Breite: ', tmpWidth);
			}
				//********************************************************************************************
				//********************************************************************************************
				//********************************************************************************************
				//********************************************************************************************
				//********************************************************************************************
				//********************************************************************************************
				// HIER MORGEN ALS EINE FUNKTION SCHREIBEN SIEHE EINFACH * -1 !!!!!!!!!!!!!!!!!!!!!!!!!!!
				//********************************************************************************************
				//********************************************************************************************
				//********************************************************************************************
				//********************************************************************************************
				//********************************************************************************************

			// 3. alles was kleiner als cur_index ist soll links gedreht sein
			for (var negat_count = 1; negat_count < self.cur_index; negat_count++) {
				self.cvsController["image_" + negat_count].ctx.clearRect(0, 0, o.canvas_width, o.canvas_height);

				if(self.cvsController["image_" + negat_count].skewWidth){
					tmpWidth = self.cvsController["image_" + negat_count].skewWidth;
					self.cvsController["image_" + negat_count].skewWidth = undefined;
				}else{
					tmpWidth = self._skewWidth(self.cvsController["image_" + negat_count].ctx, self.cvsController["image_" + negat_count].cvsBuffer[0], +60);
				}

				self.cvsController["image_" + negat_count].cvs.attr({
					width: tmpWidth
				});

				self._skew(self.cvsController["image_" + negat_count].ctx, self.cvsController["image_" + negat_count].cvsBuffer[0], +60, negat_count);

				console.log('Startbreite von cvs: ',negat_count,' = ',' | Neue Breite: ', tmpWidth);
			}
				
		},

		_setMidPosition: function() {
			var self = this,
				o = self.options,
				tmpWidth,
				p = $('#epslider'),
				wrapperpos = p.position(),
				wallignment = 20;

				var halfwrapperwidth = o.widthFixedWrapper / 2;

				o.widthAllCvs = 0;

				for (var counter = 1; counter < self.cur_index; counter++) {

					tmpWidth = self._skewWidth(self.cvsController["image_" + counter].ctx, self.cvsController["image_" + counter].cvsBuffer[0], +60);

					self.cvsController["image_" + counter].skewWidth = tmpWidth;

					o.widthAllCvs = o.widthAllCvs - tmpWidth-wallignment;
						
				};

				// $('#epslider').css({left: wrapperpos.left-o.widthFixedWrapper-120}); // wrapperpos.left
				$('#epslider').css({left: o.widthAllCvs});



				console.log("wrapperpos: ",wrapperpos);
				console.log("Neuer Index: ",self.cur_index," Alter Index: ",self.oldIndexAfterClick);
				console.log("CVS_Wrapper Länge: ", o.widthAllCvs*-1, 'halfwrapperwidth: ', halfwrapperwidth);
		},

		_cvs_loader: function() {

			 var self = this,
					o = self.options,
					canvas_width = o.canvas_width,
					canvas_height = o.canvas_height,
					index = o.index;

			var imgController = {}; 
			self.slider = $('<ul id="epslider"/>');
			self.element.append(self.slider);

			for (var sload = 0; sload <= o.max_images; sload++)
			// for (var sload = 0; sload <= o.images.length; sload++)
			{

			var offset = (canvas_width > o.canvas_height) ? (o.canvas_width - o.canvas_height) : 0,
					li = $('<li />');
					self.slider.append(li);
					console.log(self.element, self.slider);
					self.cvsController["image_" + index] = {
						cvs: $('<canvas width="'+canvas_width+'" height="'+canvas_height+'" id="cvs_'+index+'" />'),
						ctx: undefined
					};
					self.cvsController["image_" + index].cvs.appendTo(li);
					self.cvsController["image_" + index].ctx = self.cvsController["image_" + index].cvs[0].getContext("2d");

					self.cvsController["image_" + index].cvs.on('click', $.proxy(function(index) {
						self.slide(index);
					}, self.cvsController["image_" + index], index));

					imgController["image_" + index] = $('<img src="img/'+index+'.png?' + new Date().getTime() + '" id="image_'+index+'" width="" height=""/>');
					//imgController["image_" + index] = $('<img src="'+o.images[sload] +'?' + new Date().getTime() + '" id="image_'+index+'" width="" height=""/>');

					console.log(imgController["image_" + index]);

					imgController["image_" + index].on('load', $.proxy(function(index) {

								var cvsBuffer,
									bufferCtx;

								self.cvsController["image_" + index].image = imgController["image_" + index];
								self._skalor(index);

								self.cvsController["image_" + index].cvsBuffer = $('<canvas/>');
								cvsBuffer = self.cvsController["image_" + index].cvsBuffer;
								cvsBuffer.css({
									height: 2*self.cvsController["image_" + index].imgHeight + "px",
									width: self.cvsController["image_" + index].imgWidth + "px"
								});

								cvsBuffer[0].width = self.cvsController["image_" + index].imgWidth;
								cvsBuffer[0].height = 2*self.cvsController["image_" + index].imgHeight;

								bufferCtx = cvsBuffer[0].getContext("2d");

								// Kontext-Zustand sichern
					            bufferCtx.save();
					            // Um doppelte BildhÃ¶he nach unten verschieben
					            bufferCtx.translate(0, cvsBuffer[0].height);
					            // Bild nach oben spiegeln = negative Skalierung um negative AusgangsgrÃ¶sse
					            bufferCtx.scale(1, -1);
					            // Vertikal gespiegeltes Bild in Kontext zeichnen
					            bufferCtx.drawImage(self.cvsController["image_" + index].image[0], 0, 0, self.cvsController["image_" + index].imgWidth, self.cvsController["image_" + index].imgHeight);
					            // Zustand des Kontextes wiederherstellen
					            bufferCtx.restore();

					            // AUSBLEND-GRADIENT FÜR GESPIEGELTES BILD IN CANVAS RENDERN
					            // Kontext-Zustand speichern
					            bufferCtx.save();
					            // Um Bildhöhe verschieben
					            bufferCtx.translate(0, self.cvsController["image_" + index].imgHeight);
					            // Verknüpfungseigenschaft festlegen
					            bufferCtx.globalCompositeOperation = "destination-in";
					            // Veritkalen linearen Verlauf für BildhÃ¶he instanziieren
					            var objGradient = bufferCtx.createLinearGradient(0, 0, 0, self.cvsController["image_" + index].imgHeight);
					            // Verlaufspunkte setzen
					            objGradient.addColorStop(o.reflexion.start, "rgba(0,0,0," + o.opacity.start + ")");             // Anfangswerte: Farbe/Transparenz
					            objGradient.addColorStop(o.reflexion.end, "rgba(0,0,0," + o.opacity.end + ")");             // Endwerte: Farbe/Transparenz
					            // Verlaufsobjekt an FÃ¼llstyle zuweisen
					            bufferCtx.fillStyle = objGradient;
					            // Rechteck mit Verlauf zeichnen (wg. Verknüpfung wird nur nicht transparenter Bereich angezeigt)
					            bufferCtx.fillRect(0, 0, self.cvsController["image_" + index].imgWidth, self.cvsController["image_" + index].imgHeight);
					            // Zustandn wiederherstellen
					            bufferCtx.restore();

					            bufferCtx.drawImage(self.cvsController["image_" + index].image[0], 0, 0, self.cvsController["image_" + index].imgWidth, self.cvsController["image_" + index].imgHeight);

								self.cvsController["image_" + index].ctx.drawImage(cvsBuffer[0], 0, 0);
					            

					            $('body').append(self.cvsController["image_" + index].cvsBuffer);
								
						}, imgController["image_" + index], index));

					index = index+1;
				}

			if(self.slider.length){
					
					var totalImages = $("#epslider > li").length, 
							imageWidth = $("#epslider > li:first").outerWidth(true),
							totalWidth = imageWidth * totalImages,
							visibleImages = Math.round($("#epslider-wrap").width() / imageWidth),
							visibleWidth = visibleImages * imageWidth,
							stopPosition = (visibleWidth - totalWidth),
							rotatestyles = "-webkit-transform: rotateY(1deg); -moz-transform: rotateY(1deg); transform: rotateY(1deg);";
									
							$("#epslider").width(totalWidth);


							// Slide Function for MouseClick Event
							self.prevButton.on("click", function(evt){
							//	console.log(self.prevButton);
									if(self.slider.position().left > -50000 && !self.slider.is(":animated")){
											self.slider.animate({left : "+=" + imageWidth/3 + "px"});
											self.cur_index--;
											self.oldIndexAfterClick = self.cur_index+1;
											self._slide();
									}
									return false;
							});
							
							self.nextButton.on("click", function(evt){
								evt.preventDefault();
							// console.log(self.nextButton, evt);
									if(self.slider.position().left > -50000 && !self.slider.is(":animated")){
											self.slider.animate({left : "-=" + imageWidth/3 + "px"});
											self.cur_index++;
											self.oldIndexAfterClick = self.cur_index-1;
											self._slide();
									}
									return false;
							});


							self.setcurrentPicture.on( "slide", function( event, ui ) {
								console.log("UI: ",ui);
								self.cur_index = ui.value;
								self._slide();
								// Animation NICht machen so lange er auf dem slider die indexe ändert --> animation erst feuern wenn der Nutzer los lässt
							} );
				}
		},

		_skalor: function(index) {
			var self = this,
				o = self.options;

				var tmpScaledWidth = 0,
					tmpScaledHeight = 0,
					faktor			= 0,
					cvsCtrl = self.cvsController["image_" + index];

				console.log("cvsCtrl.image:",cvsCtrl.image,", Index:",index,", cvsControllerWidth:", cvsCtrl.image[0].width, "cvsCtrl: ", cvsCtrl);

				cvsCtrl.imgWidth = cvsCtrl.image[0].width;
				cvsCtrl.imgHeight = cvsCtrl.image[0].height;

				console.log("Image before Dimensions",cvsCtrl.imgWidth, cvsCtrl.imgHeight);

				//---------------------------------------
				console.log("o.CanvasWidth Cur: ", o.canvas_width);

				if(cvsCtrl.imgWidth > o.canvas_width) {

						faktor = o.canvas_width / cvsCtrl.imgWidth;
						cvsCtrl.imgWidth = o.canvas_width;
						cvsCtrl.imgHeight = faktor * cvsCtrl.imgHeight;

						console.log("Image after Dimensions",cvsCtrl.imgWidth," || ", cvsCtrl.imgHeight);
				
				}

				else {
					// no skaling
				}

				if(cvsCtrl.imgHeight > (o.canvas_height / 2)) {

						faktor = (o.canvas_height / 2) / cvsCtrl.imgHeight;
						cvsCtrl.imgHeight = (o.canvas_height / 2);
						cvsCtrl.imgWidth = faktor * cvsCtrl.imgWidth;

						console.log("Image after Dimensions",cvsCtrl.imgHeight," || ", cvsCtrl.imgHeight);
				}

				else {
					// no skaling
				}

				cvsCtrl.image[0].width = cvsCtrl.imgWidth;
				cvsCtrl.image[0].height = cvsCtrl.imgHeight;
		},

		  _skew: function(context, img, angle, index) {
		  	var self = this,
		  		   o = self.options,
				   cos = Math.cos(angle * Math.PI / 180),
				   w = self.cvsController["image_" + index].imgWidth,
	 			   h = self.cvsController["image_" + index].imgHeight,
			       w2 = w * cos,
				   sx,
				   sy,
				   sw,
				   sh,
				   dw,
				   dh,
				   dx,
				   dy,
				   sWidth,
				   sHeight,
				   dWidth,
				   dHeight;

		       if (cos <= 0) return;
		       if (w2 < 1) return;

		      var scalingFactor     = 0.6 + 0.4 * cos;
		      var sliceNum          = w2 / o.grid;
		      var sliceWidthOrigin  = w / sliceNum;                    

		      var sliceWidthDest    = sliceWidthOrigin * w2 / w;
		      var heightDelta       = h * ((1 - scalingFactor) / sliceNum);

		      for(var n = 0; n < sliceNum; n++) {
		        sx = Math.floor(sliceWidthOrigin * n);
		        sy = 0;
		        sw = Math.floor(sliceWidthOrigin);
		        sh = h;
		  
		        dx = n * sliceWidthDest;
		        dy = (angle > 0) ? ((heightDelta * n) / 3) : heightDelta * sliceNum / 3 - heightDelta * n /3; 
		        dw = sliceWidthDest;
		        dh = (angle > 0) ? h - (heightDelta * n) : h * scalingFactor + heightDelta * n;

		        context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);	
		    }
	      },

	    _skewWidth: function(context, img, angle){
            var cos = Math.cos(angle * Math.PI / 180);
            if (cos <= 0) return img.width;

            var self = this,
                o = self.options,
                w = img.width,
                w2 = w * cos;

            if (w2 < 1) return w;

            var sliceNum          = w2 / o.grid,
                sliceWidthOrigin  = w / sliceNum,
                sliceWidthDest    = sliceWidthOrigin * w2 / w;

            return parseInt(sliceWidthDest*sliceNum);
        },


		refresh: function(cur_view) { 
					var self = this,
					o = self.options,
					canvas_width = o.canvas_width,
					canvas_height = o.canvas_height,
					index = o.index;

					imgController["image_" + index] = $('<img src="img/'+index+'.jpg" id="image_'+index+'" width="150" height="150"/>');
					self._skew(self.cvsController["image_" + index].ctx, self.imgController["image_" + index][0], -10, -90, o.pw, 10, o.sf, 0.1);
		},

		_init_posmod: function() {
				var ul = $('<ul id="epslider"/>');
				var scrollTarget = 1;
				var scrollSnapped = 0;
				var item = null;
				var itemOffset = null;
				var normOffset = null;
				var itemClass = null;
				var scrollLeft = null;
				var currentId = null;
				var delta = 1;

				var items = Array.prototype.slice.apply(ul.children);
				var viewWidth = ul.offsetWidth;
				var halfViewWidth = Math.floor(ul.offsetWidth / 2);
				var numItems = items.length;

				for (var i = 0; i < numItems; i++) {
				  items[i]._offsetLeft = items[i].offsetLeft;
				  items[i].addEventListener('click', this.imageClickHandler, false);
				}

				var leftMargin = items[0]._offsetLeft;
		},

		_destroy: function() {

		},

	});

	return ep;
});

// 		_skew: function(ctx, img, left, top, portviewWidth, portviewHeight, scalingFactor, offset, index) { 
// 			if(typeof offset === 'undefined') offset = 0;

// 			var self = this,
// 					o = self.options,
// 					// w = img.width,
// 					// h = img.height,
// 					w = self.cvsController["image_" + index].imgWidth,
// 					h = self.cvsController["image_" + index].imgHeight,
// 					polarity = (portviewWidth > 0) ? 1 : -1,
// 					sliceNum = Math.abs(portviewWidth),
// 					sliceWidthOrigin = w / sliceNum,                   
// 					sliceWidthDest = sliceWidthOrigin * Math.abs(portviewWidth) / w,
// 					heightScale = h * ((1 - scalingFactor) / sliceNum),
// 					sx,
// 					sy,
// 					dx,
// 					dy,
// 					sWidth,
// 					sHeight,
// 					dWidth,
// 					dHeight;

// 			for(var n = 0; n < sliceNum; n++) 
// 			{
// 				sx = sliceWidthOrigin * n;
// 				sy = 0;
// 				sWidth = sliceWidthOrigin;
// 				sHeight = h;
// 				dx = left + (n * sliceWidthDest * polarity);
// 				dy = top + parseInt((heightScale * n) / 2);
// 				dWidth = sliceWidthDest;
// 				dHeight = h - (heightScale * n);

// 				ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight); 
// 			}
// //			console.log("Skew: ",sliceNum);
// 		},


//self.cvsController["image_" + index].ctx.drawImage(self.cvsController["image_" + index].image[0], 0, 0, self.cvsController["image_" + index].imgWidth, self.cvsController["image_" + index].imgHeight);



// // self.cvsController["image_" + index].ctx.drawImage(this, 0, 0, o.canvas_width, o.canvas_height);
// self._skew(self.cvsController["image_" + index].ctx, imgController["image_" + index][0], 300, 30, 200, 30, 1, 0);
// self._skew(self.cvsController["image_" + index].ctx, imgController["image_" + index][0], -10, 10, o.pw, 10, o.sf, 0.1);
// self.cvsController["image_" + index].ctx.save();
// self.cvsController["image_" + index].ctx.scale(1, -1);
// self.cvsController["image_" + index].ctx.translate(0, -canvas_height);
// // self.cvsController["image_" + index].ctx.save();
// self.cvsController["image_" + index].ctx.scale(1, -1);

// var gradient = self.cvsController["image_" + index].ctx.createLinearGradient( 0, 0, 0, canvas_height);
// self._skew(self.cvsController["image_" + index].ctx, imgController["image_" + index][0], -10, -90, o.pw, 10, o.sf, 0.1);
// gradient.addColorStop( 0, 'rgba( 32, 32, 32, 0.5 )' );
// gradient.addColorStop( 0.5, 'rgba( 32, 32, 32, 1.0 )' );
// self.cvsController["image_" + index].ctx.fillStyle = gradient;
// self.cvsController["image_" + index].ctx.rect( 0, 0, canvas_width, canvas_height );
// self.cvsController["image_" + index].ctx.fill();
// // self.cvsController["image_" + index].ctx.save();

// self.cvsController["image_" + index].ctx.restore();


// // Slide Function for KeyboardPress Event
// $(document).keydown(function(e){
//    switch(e.keyCode){
//      case 37: if($("#epslider").position().left < 0 && !$("#epslider").is(":animated")){
//                  $("#epslider").animate({left : "+=" + imageWidth*2 + "px"});
//                 } break;

//      case 39: if($("#epslider").position().left > stopPosition && !$("#epslider").is(":animated")){
//                  $("#epslider").animate({left : "-=" + imageWidth*2 + "px"});
//                 } break;
//    }
// });

// Slide Function for Mousewheel Event

// $(document).mousewheel(function(event, delta){

// if(delta > 0)
// {
//     if($("#epslider").position().left < 0 && !$("#epslider").is(":animated")){
//          $("#epslider").animate({left : "+=" + imageWidth + "px"});
//         }
// }

// else
// {
//     if(delta < 0)
//     {
//           if($("#epslider").position().left > stopPosition && !$("#epslider").is(":animated")){
//                $("#epslider").animate({left : "-=" + imageWidth + "px"});
//               }
//     }
// }
// event.preventDefault();
// });


// // Swipe Function for Mobile Devices Event

//  $( document ).on( "swiperight",function() {
//     if($("#epslider").position().left < 0 && !$("#epslider").is(":animated")){
//         $("#epslider").animate({left : "+=" + imageWidth + "px"});
//     }
//  }); 

//  $( document ).on( "swipeleft",function() {
//     if($("#epslider").position().left > stopPosition && !$("#epslider").is(":animated")){
//         $("#epslider").animate({left : "-=" + imageWidth + "px"});
//     }
//  }); 