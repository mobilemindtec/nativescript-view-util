var common = require("./view-util-common")
var application = require("application");
var frameModule = require("ui/frame");
var dialogsModule = require("nativescript-dialog");
var platform = require("platform");
var color = require("color");

var keyboardIsOpened

global.moduleMerge(common, exports);

exports.addViewIcon = function(view, position, iconName){
}

exports.buttonRoundedAll = function(view, hexaColor, raduis){
  buttonRounded(view, hexaColor, raduis, raduis, raduis, raduis)
}

function buttonRounded(view, hexaColor, top_left, top_right, bottom_right, bottom_left){    
}

exports.buttonRounded = buttonRounded;

exports.addTextChangeListener = function(textView, textChangeCallback){
    textField.addTargetAction(null, function(textField){cd 
      textChangeCallback(textField.text)
    })
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