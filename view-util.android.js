var common = require("./view-util-common")
var application = require("application");
var frameModule = require("ui/frame");
var platform = require("platform");
var colorModule = require("color");
var Color = colorModule.Color;

var keyboardIsOpened

global.moduleMerge(common, exports);

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
  var color = new Color(hexaColor)  
  shape.setColor(color.android);
  view.android.setBackground(shape)
}

exports.buttonRounded = buttonRounded;


exports.addTextChangeListener = function(textView, textChangeCallback){
  
  var textWatcher = new android.text.TextWatcher({

    onTextChanged: function(charSequence, start, before, count) {

      textChangeCallback(charSequence.toString())
    },

    beforeTextChanged: function(charSequence, start, count, after) {
    },

    afterTextChanged: function(editable) {
    }    

  })

  textView.android.addTextChangedListener(textWatcher);

  return textWatcher
}

exports.removeTextChangeListener = function(textView, textWatcher){  
  textView.android.removeTextChangedListener(textWatcher)
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

exports.keyboardHidden = function(){
  var activity = application.android.foregroundActivity || application.android.startActivity  
  var view = activity.getCurrentFocus();
  var imm = activity.getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
  
  if (!view) 
      view = new android.view.View(activity);
    
  imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
}

exports.keyboardShow = function(){
  var activity = application.android.foregroundActivity || application.android.startActivity  
  var imm = activity.getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
  imm.toggleSoftInput(0, android.view.inputmethod.InputMethodManager.HIDE_NOT_ALWAYS);
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

exports.getExtraKey = function(key){
  var activity = application.android.foregroundActivity || application.android.startActivity  

  if(activity.getIntent() && activity.getIntent().getExtras()){

    var extra =  activity.getIntent().getExtras()

    if(extra.containsKey(key)){
      return extra.get(key)
    }
  }

  return undefined    
}


// Event handler for Page "loaded" event attached in main-page.xml
exports.transparentNav = function() {



    // Get the event sender
    if (application.android && platform.device.sdkVersion >= '21') {
        var window = application.android.startActivity.getWindow();
        // set the status bar to Color.Transparent
        window.setStatusBarColor(0x000000);
 
        var decorView = window.getDecorView();

        decorView.setSystemUiVisibility(
              android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | android.view.View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
            | android.view.View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
            | android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
 
    //var statusHeight = getStatusBarHeight();
    // // Need to add some padding to whatever your first View(widget)
    // var actionbar = page.actionBar._toolbar;
    // // Set the padding to match the Status Bar height
    // actionbar.setPadding(0, statusHeight, 0, 0);
 
     //var lab = page.getViewById('myLabel').android;
     //lab.setPadding(0, statusHeight, 0, 0);
 
} 

exports.normalNav = function(args){
  if (application.android && platform.device.sdkVersion >= '21') {
      var window = application.android.startActivity.getWindow();
      // set the status bar to Color.Transparent

      if(args && args.color)
        window.setStatusBarColor(new Color(args.color).android);

      var decorView = window.getDecorView();
      decorView.setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_VISIBLE);
    }

}
 
// A method to find height of the status bar
exports.getStatusBarHeight = function() {
    var result = 0;
    var res = application.android.currentContext.getResources()
    var resourceId = res.getIdentifier('status_bar_height', 'dimen', 'android');
    if (resourceId && resourceId > 0) {
        result = res.getDimensionPixelSize(resourceId);
    }
    return result;
}

exports.navColor = function(colorArg){
  if (application.android) {
    var window = application.android.startActivity.getWindow();
    window.setNavigationBarColor(new Color(colorArg).android);  
  }
}

exports.softInputAdjustPan = function(){
  var act = application.android.foregroundActivity || application.android.startActivity;
  act.getWindow().setSoftInputMode(android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);  
}


// Prevent the first textfield from receiving focus on Android
// See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
exports.forceRemoveFocus = function(layout, editText){
  layout.android.setFocusableInTouchMode(true);
  layout.android.setFocusable(true); 
  editText.android.clearFocus();     
}