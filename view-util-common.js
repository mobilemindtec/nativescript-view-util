var application = require("application");
var frameModule = require("ui/frame");
var dialogsModule = require("nativescript-dialog");
var platform = require("platform");
var colorModule = require("color");
var Color = colorModule.Color;

var keyboardIsOpened


exports.progressOpen = function(args){
  
  var nativeView;

  if(application.ios){
    nativeView = UIActivityIndicatorView.alloc().initWithActivityIndicatorStyle(UIActivityIndicatorViewStyle.UIActivityIndicatorViewStyleGray);
    nativeView.startAnimating();
  } else if(application.android){
    nativeView = new android.widget.ProgressBar(application.android.currentContext);
    nativeView.setIndeterminate(true);

    if(args.color){
      var color = new Color(args.color)
      var drawable = nativeView.getIndeterminateDrawable()
      drawable.setColorFilter(color.android, android.graphics.PorterDuff.Mode.MULTIPLY);
    }
  }
  
  var params = {
    title: args.title,
    message: args.message,    
    nativeView: nativeView,
    titleColor: args.titleColor,
    textColor: args.textColor,
    cancelable: args.cancelable
  }

  if(args.cancelable)
    params.cancelButtonText = "CANCELAR"

  dialogsModule.show(params).then(
    function(r){ 
      if(args.onCloseCallback)
        args.onCloseCallback(r)
    },
    function(e){
      console.log("Error: " + e)
    }
  );  
}

exports.progressClose = function(){
  dialogsModule.close()
}


exports.capitalize = function(text) {
  if(text)
    return text.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  return ""
};