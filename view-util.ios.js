var common = require("./view-util-common")
var application = require("application");
var frameModule = require("ui/frame");
var platform = require("platform");
var colorModule = require("color");
var Color = colorModule.Color;


var keyboardIsOpened

global.moduleMerge(common, exports);

exports.addViewIcon = function(view, position, iconName){
    var icon = UIImage.imageNamed(iconName)
    var button = view.ios
    button.titleLabel.textAlignment = NSTextAlignmentCenter
    button.setImageForState(icon, UIControlStateNormal)
    
    if(position == 'left'){
		button.transform = CGAffineTransformMakeScale(1.0, -1.0);
		button.titleLabel.transform = CGAffineTransformMakeScale(1.0, -1.0);
		button.imageView.transform = CGAffineTransformMakeScale(1.0, -1.0);    		    
	    button.titleEdgeInsets = UIEdgeInsetsMake(0, 10, 0, 0);    	
    }else if(position == 'right'){    	
		button.transform = CGAffineTransformMakeScale(-1.0, 1.0);
		button.titleLabel.transform = CGAffineTransformMakeScale(-1.0, 1.0);
		button.imageView.transform = CGAffineTransformMakeScale(-1.0, 1.0);    	
		button.titleEdgeInsets = UIEdgeInsetsMake(0, 0, 0, 10);    	
	}
}

exports.buttonRoundedAll = function(view, hexaColor, raduis){
  buttonRounded(view, hexaColor, raduis, raduis, raduis, raduis)
}

function buttonRounded(view, hexaColor, top_left, top_right, bottom_right, bottom_left){    
    view.ios.clipsToBounds = true;
    view.ios.layer.cornerRadius = top_right;   
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
	
    textView.ios.addTargetActionForControlEvents(new MyChangeListener(), "onChange", UIControlEventEditingChanged)
}

var _onGlobalLayoutListener
var _onGlobalLayoutListenerView

exports.addKeyboardChangeListener = function(view, onKeyboardOpenCallback, onKeyboardCloseCallback){

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
}