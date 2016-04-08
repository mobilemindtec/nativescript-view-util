# nativescript-view-util

View Toos
./demo -> demo aoo

## Features

* `addViewIcon` -> add icon in button
* `buttonRoundedAll` -> round button corners
* `addTextChangeListener` -> create textview listener on change
* `progressOpen({title: '', message: '', titleColor: '', textColor: ''})` -> open a progress bar in dialog.. depends https://github.com/mobilemindtec/nativescript-dialog.git
* `progressClose` -> close a progress bar

### Android only

* `addKeyboardChangeListener(view, onKeyboardOpenCallback, onKeyboardCloseCallback)` -> key board listener to handler key board close
* `getExtraKey(key)` -> get value from intent extra by key
* `transparentNav({color: ''})` -> add traspacence to navbar
* `getStatusBarHeight` -> return status bar height
* `navColor(colorArg)` -> set navbar color

```
var ViewUtil = require('nativescript-view-util')

ViewUtil.addTextChangeListener(textSearch, function(text){
	// implements
}) 

ViewUtil.buttonRoundedAll(btnRounded, '#483D8B', 10)
ViewUtil.addViewIcon(btnLeftIcon, 'left', 'icon')
ViewUtil.addViewIcon(btnRightIcon, 'right', 'icon')

ViewUtil.progressOpen({
    title: "My Title",
    message: "NativeScript plugin baby!!",    	    
    titleColor: "#4682B4",
    textColor: "#A52A2A",
    cancelable: true		
})

```
