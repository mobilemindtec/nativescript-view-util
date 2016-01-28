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
    }else if(position == 'top'){
      view.android.setCompoundDrawablesWithIntrinsicBounds(null, icon, null, null);
    }

    // setCompoundDrawablesWithIntrinsicBounds(left, top, right, bottom)

}

exports.buttonRoundedAll = function(view, hexaColor, raduis){
  buttonRounded(view, hexaColor, raduis, raduis, raduis, raduis)
}

function buttonRounded(view, hexaColor, top_left, top_right, bottom_right, bottom_left){    
  var shape =  new android.graphics.drawable.GradientDrawable();

  shape.setCornerRadii([top_left, top_left, top_right, top_right, bottom_right, bottom_right, bottom_left, bottom_left]);  
  var color = android.graphics.Color.parseColor(hexaColor)  
  shape.setColor(color);
  view.android.setBackground(shape)
}

exports.buttonRounded = buttonRounded;

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

    if(args.color) {
      nativeView.setProgressBackgroundTintList(android.content.res.ColorStateList.valueOf(android.graphics.Color.parseColor(args.color)))
      nativeView.setProgressBackgroundTintMode(android.graphics.PorterDuff.Mode.XOR)
    }    
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


exports.getSdCard = function(){
  /*
    // Final set of paths
    var rv = []
    // Primary physical SD-CARD (not emulated)
    var rawExternalStorage =  java.lang.System.getenv("EXTERNAL_STORAGE")
    // All Secondary SD-CARDs (all exclude primary) separated by ":"
    var rawSecondaryStoragesStr =    java.lang.System.getenv("SECONDARY_STORAGE")
    // Primary emulated SD-CARD
    var rawEmulatedStorageTarget =   java.lang.System.getenv("EMULATED_STORAGE_TARGET")

    if(android.text.TextUtils.isEmpty(rawEmulatedStorageTarget))
    {
        // Device has physical external storage; use plain paths.
        if(android.text.TextUtils.isEmpty(rawExternalStorage)){
            // EXTERNAL_STORAGE undefined; falling back to default.
            rv.push("/storage/sdcard0");
        }else{
            rv.push(rawExternalStorage);
        }
    }else{
        // Device has emulated storage; external storage paths should have
        // userId burned into them.
        var rawUserId;
        if(android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.JELLY_BEAN_MR1){
            rawUserId = ""
        }else{
            var path = android.os.Environment.getExternalStorageDirectory().getAbsolutePath()
            var folders = DIR_SEPORATOR.split(path)
            var lastFolder = folders[folders.length - 1]
            var isDigit = false
            try{
                java.lang.Integer.valueOf(lastFolder)
                isDigit = true
            }catch(ignored){
            }

            rawUserId = isDigit ? lastFolder : ""
        }
        // /storage/emulated/0[1,2,...]
        if(android.text.TextUtils.isEmpty(rawUserId)){
            rv.push(rawEmulatedStorageTarget);
        }else{
            rv.push(rawEmulatedStorageTarget + java.io.File.separator + rawUserId);
        }
    }

    // Add all secondary storages
    if(!android.text.TextUtils.isEmpty(rawSecondaryStoragesStr))
    {
        // All Secondary SD-CARDs splited into array
        var rawSecondaryStorages = rawSecondaryStoragesStr.split(File.pathSeparator);
        for(var i = 0; i < rawSecondaryStorages.length; i++)
          rv.push(rawSecondaryStorages[i])
    }

    return rv
    */
}