var application = require("application");
var frameModule = require("ui/frame");
var keyboardIsOpened
var dialogsModule = require("nativescript-dialog")

exports.addViewIcon = function(view, position, iconName){
    
    var iconres = application.android.context.getResources().getIdentifier(iconName, "drawable", application.android.context.getPackageName());
    var icon = application.android.context.getResources().getDrawable(iconres)
    icon.setBounds( 0, 0, icon.getIntrinsicWidth(), icon.getIntrinsicHeight() );    

    if(position == 'left'){
      view.android.setCompoundDrawablesWithIntrinsicBounds(icon, null, null, null);
    }else if(position == 'right'){
      view.android.setCompoundDrawablesWithIntrinsicBounds(null, null, icon, null);
    }

    // setCompoundDrawablesWithIntrinsicBounds(left, top, right, bottom)

}

exports.addTextChangeListener = function(textView, textChangeCallback){

   textView.android.addTextChangedListener(new android.text.TextWatcher({

      onTextChanged: function(charSequence, start, before, count) {

        textChangeCallback(charSequence.toString())

      },

      beforeTextChanged: function(charSequence, start, count, after) {

      },

      afterTextChanged: function(editable) {

      }

    }));
}

var _onGlobalLayoutListener
var _onGlobalLayoutListenerView

exports.addKeyboardChangeListener = function(view, onKeyboardOpenCallback, onKeyboardCloseCallback){

  _onGlobalLayoutListenerView = view
  _onGlobalLayoutListener = new android.view.ViewTreeObserver.OnGlobalLayoutListener({      
      onGlobalLayout: function() {
          if(_onGlobalLayoutListenerView && _onGlobalLayoutListenerView.android){
            if (keyboardShown(_onGlobalLayoutListenerView.android.getRootView())) {
                onKeyboardOpenCallback()
            } else {
                onKeyboardCloseCallback()
            }
          }
      }
  })

  view.android.getViewTreeObserver().addOnGlobalLayoutListener(_onGlobalLayoutListener);  

  application.android.on(application.AndroidApplication.activityBackPressedEvent, function(args){
    removeKeyboardChangeListener()
  }, view);

}

function removeKeyboardChangeListener(){
  if(_onGlobalLayoutListenerView && _onGlobalLayoutListenerView.android){
    if(android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.JELLY_BEAN) {
      _onGlobalLayoutListenerView.android.getViewTreeObserver().removeGlobalOnLayoutListener(_onGlobalLayoutListener);
    } else {
      _onGlobalLayoutListenerView.android.getViewTreeObserver().removeOnGlobalLayoutListener(_onGlobalLayoutListener);
    }
  }

  console.log("#################### removeKeyboardChangeListener")
}

exports.removeKeyboardChangeListener = removeKeyboardChangeListener;

function keyboardShown(rootView) {
    var softKeyboardHeight = 100;
    var r = new android.graphics.Rect();
    rootView.getWindowVisibleDisplayFrame(r);
    var dm = rootView.getResources().getDisplayMetrics();
    var heightDiff = rootView.getBottom() - r.bottom;
    return heightDiff > softKeyboardHeight * dm.density;
}


exports.progressOpen = function(args){
  
  var nativeView;

  if(application.ios){
    nativeView = UIActivityIndicatorView.alloc().initWithActivityIndicatorStyle(UIActivityIndicatorViewStyle.UIActivityIndicatorViewStyleGray);
    nativeView.startAnimating();
  } else if(application.android){
    nativeView = new android.widget.ProgressBar(application.android.currentContext);
    nativeView.setIndeterminate(true);
  }
  
  var params = {
    title: args.title,
    message: args.message,    
    nativeView: nativeView
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
  return text.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
