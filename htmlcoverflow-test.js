define(['testsuite/qunit', 'jquery', 'ep/ui/htmlcoverflow', 'ep/ui/validate', 'ep/sprite', '$ready!'], function (QUnit, $, ep) {

	QUnit.module("ep/ui/dialog");

	$('#epslider-wrap').uiHtmlcoverflow({});

	// QUnit.asyncTest("ep.ui.dialog", function() {

	// 	var dialog = $('#testDialog'),
	// 		instance;

	// 	dialog
	// 		.find(':input')
	// 			.uiValidate()
	// 		.end()
	// 		.uiDialog({
	// 			autoOpen : false,
	// 			title: 'ep.uiDialog',
	// 			modal:true,
	// 			form: {
	// 				'action': '?',
	// 				'method': 'post'
	// 			},
	// 			buttons: {
	// 				'Test': {
	// 					'class':	'epWidth80'
	// 				},
	// 				'Cancel': {
	// 					'class':	'epWidth80',
	// 					'click':	function(){
	// 						ep(this).uiDialog('close');
	// 					}
	// 				},
	// 				'Ok': {
	// 					'type':		'submit',
	// 					'class':	'epWidth80',
	// 					'click':	function(){
	// 						var elem = ep(this);
	// 						if( elem.uiDialog('option','form').uiForm('isValid') ){
	// 							elem.uiDialog('close');
	// 						};
	// 					}
	// 				}
	// 			}
	// 		});

	// 	instance = dialog.uiDialog('Instance');

	// 	QUnit.ok(dialog.is(':visible') === false, 'dialog is not shown exist yet' ); 

	// 	instance.open();

	// 	QUnit.ok(dialog.is(':visible') === true, 'dialog is open now' );

	// 	dialog
	// 		.uiDialog('option','form')
	// 			.uiForm('option',{
	// 				ajax:{
	// 					dataType: 'text',
	// 					success: function(){
	// 					//	console.log('success')
	// 					}
	// 				}
	// 			});
	// 	dialog
	// 		.uiDialog('option','title', 'Hallo Welt');

	// 	dialog
	// 		.uiDialog('option','buttons')['Test']
	// 			.html('')
	// 			.append(ep.sprite('stepper','s'))
	// 			.append('With icon');

	// 	$('.ui-widget-overlay').trigger('click');
	// 	$(document).trigger('click.dialog-overlay');

	// 	dialog.uiDialog('close');

	// 	QUnit.ok(dialog.is(':visible') === false, 'dialog is closed again' );

	// 	QUnit.ok(dialog.hasClass('ui-dialog-content') === true, 'dialog instance exists');

	// 	dialog.uiDialog('destroy');

	// 	QUnit.ok(dialog.hasClass('ui-dialog-content') === false, 'dialog instance doesn\'t exist anymore');

	// 	QUnit.start();
	// });
});