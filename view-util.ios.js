var common = require("./view-util-common")
var application = require("@nativescript/core/application");
var frameModule = require("@nativescript/core/ui/frame");
var platform = require("@nativescript/core/platform");
var colorModule = require("@nativescript/core/color");
var Color = colorModule.Color;

Object.assign(module.exports, require("./view-util-common"))

var keyboardIsOpened
var whiteColor = UIColor.whiteColor

exports.addViewIcon = function(view, position, iconName){
    var icon = UIImage.imageNamed(iconName)

    if(view.ios instanceof UIButton){

      console.log("add icon UIButton ")

      var button = view.ios
      button.titleLabel.textAlignment = NSTextAlignmentCenter
      button.setImageForState(icon, UIControlStateNormal)
      button.tintColor = whiteColor
      if(position == 'left'){
        button.transform = CGAffineTransformMakeScale(1.0, -1.0);
        button.titleLabel.transform = CGAffineTransformMakeScale(1.0, -1.0);
        button.imageView.transform = CGAffineTransformMakeScale(1.0, -1.0);
        button.titleEdgeInsets = UIEdgeInsetsMake(0, 10, 0, 0);
      }else if(position == 'right'){
        button.transform = CGAffineTransformMakeScale(-1.0, 1.0);
        button.titleLabel.transform = CGAffineTransformMakeScale(-1.0, 1.0);
        button.imageView.transform = CGAffineTransformMakeScale(-1.0, 1.0);
        button.titleEdgeInsets = UIEdgeInsetsMake(0, 0, 0, -10);
      }
    }else if(view.ios instanceof UILabel){

      console.log("add icon UILabel ")

      var label = view.ios
      var attachment = NSTextAttachment.alloc().init()
      attachment.image = icon

      attachmentString = NSAttributedString.attributedStringWithAttachment(attachment)

      var textAttr = NSMutableAttributedString.alloc().initWithString(label.text)
      textAttr.appendAttributedString(attachmentString)

      if(position == 'left'){
        label.textAlignment = NSTextAlignmentLeft
      }else {
        label.textAlignment = NSTextAlignmentRight
      }

      label.attributedText = textAttr
    }else if(view.ios instanceof UITextField){
      var textField = view.ios

      console.log("add icon UITextField ")

      if(position == 'left'){
        textField.leftViewMode = UITextFieldViewModeAlways
        textField.leftView = UIImageView.alloc().initWithImage(icon)
      }else {
        textField.rightViewMode = UITextFieldViewModeAlways
        textField.rightView = UIImageView.alloc().initWithImage(icon)
      }
    }else{
      console.log("not icon view.. type not supported ")
    }
}

exports.buttonRoundedAll = function(view, hexaColor, raduis){
  buttonRounded(view, hexaColor, raduis, raduis, raduis, raduis)
}

function buttonRounded(view, hexaColor, top_left, top_right, bottom_right, bottom_left){
    view.ios.clipsToBounds = true;
    view.ios.layer.cornerRadius = top_left;
}

exports.buttonRounded = buttonRounded;

exports.addTextChangeListener = function(textView, textChangeCallback){

	MyChangeListener = NSObject.extend({
		onChange: function(textField){
			textChangeCallback(textField.text)
		}
	}, {
	    name: "MyChangeListener",
	    exposedMethods: {
	        // Declare the signature of the aboutTap. We can not infer it, since it is not inherited from base class or protocol.
	        onChange: { returns: interop.types.void, params: [ UITextField ] }
	    }
	})

	var textWatcher = new MyChangeListener()
    textView.ios.addTargetActionForControlEvents(textWatcher, "onChange", UIControlEventEditingChanged)

  return textWatcher
}

exports.removeTextChangeListener = function(textView, textWatcher){
	textView.ios.removeTargetActionForControlEvents(textWatcher, "onChange", UIControlEventEditingChanged)
}

var _onGlobalLayoutListener
var _onGlobalLayoutListenerView

exports.addKeyboardChangeListener = function(view, onKeyboardOpenCallback, onKeyboardCloseCallback){
	
	MyKeyboardListener = NSObject.extend({
		onShow: function(){
			onKeyboardOpenCallback()
		},
		onHide: function(){
			onKeyboardCloseCallback()
		}
	}, {
	    name: "MyKeyboardListener",
	    exposedMethods: {
		// Declare the signature of the aboutTap. We can not infer it, since it is not inherited from base class or protocol.
		onShow: { returns: interop.types.void, params: [ ] },
		onHide: { returns: interop.types.void, params: [ ] }
	    }
	})
	
	var keyboardListener = new MyKeyboardListener()
	var defaultCenter = NSNotificationCenter.defaultCenter
	defaultCenter.addObserverSelectorNameObject(keyboardListener, 'onShow', UIKeyboardDidShowNotification, null)
	defaultCenter.addObserverSelectorNameObject(keyboardListener, 'onHide', UIKeyboardDidHideNotification, null)
}

exports.keyboardHidden = function(){
	var controller = frameModule.topmost().ios.controller;
	controller.view.endEditing(true);
}

exports.keyboardShow = function(){
	var controller = frameModule.topmost().ios.controller;
	controller.view.endEditing(true);
}

function removeKeyboardChangeListener(){
}

exports.removeKeyboardChangeListener = removeKeyboardChangeListener;

exports.getExtraKey = function(key){

  return undefined
}

exports.transparentNav = function() {

}

exports.getStatusBarHeight = function() {
    return 0;
}

exports.navColor = function(colorArg){
  var navigationBar = frameModule.topmost().ios.controller.navigationBar;
  navigationBar.barTintColor = new Color(colorArg).ios
  navigationBar.titleTextAttributes = new NSDictionary([whiteColor], [NSForegroundColorAttributeName]);
  navigationBar.barStyle = 1;
  navigationBar.tintColor = whiteColor;
}

exports.normalNav = function(){

}

exports.softInputAdjustPan = function(){
}


exports.forceRemoveFocus = function(layout, editText){
}

exports.getDensityResources = function(){

   	var width = platform.screen.mainScreen.widthPixels / platform.screen.mainScreen.scale
    var height = platform.screen.mainScreen.heightPixels / platform.screen.mainScreen.scale

    //http://ios-resolution.com/
    switch(width){
      case 414: // IPhone 6 Plus
        return common.DensityResources.HIGH
      case 1242: // IPhone 6 Plus Retina
        return common.DensityResources.XXXHIGH
      case 375: // IPhone 6
        return common.DensityResources.HIGH
      case 750: // IPhone 6 Retina
        return common.DensityResources.XXHIGH
      case 320:
        if(height == 568) // iPhone 5, 5c, 5s, iPod touch 5th gen
          return common.DensityResources.HIGH
        else if(height == 480) // iPhone 1st, 3G, 3GS, 4, 3S, 5, iPod touch 1st-4th gen
          return common.DensityResources.XXHIGH
      case 640:
        if(height == 1136) // iPhone 5, 5c, 5s, iPod touch 5th gen Retina
          return common.DensityResources.HIGH
        else if(height == 960) // iPhone 1st, 3G, 3GS, 4, 3S, 5, iPod touch 1st-4th gen Retina
          return common.DensityResources.XXHIGH
      case 768: // iPad (1st gen, 2, 3rd gen, 4th gen) - iPad mini
        return common.DensityResources.HIGH
      case 1536: // iPad (1st gen, 2, 3rd gen, 4th gen) Retina - iPad mini
        return common.DensityResources.XXHIGH
    }

    return common.DensityResources.HIGH
}
