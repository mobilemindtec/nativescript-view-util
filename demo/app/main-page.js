var ViewUtil = require('./nativescript-view-util')
var observableModule = require("data/observable");

var viewModel = new observableModule.Observable({   
  'message': '' 
})

exports.loaded = function(args) {
    var page = args.object;
    page.bindingContext = viewModel

    var textSearch = page.getViewById('textSearch')
    var btnLoading = page.getViewById('btnLoading')
    var btnRounded = page.getViewById('btnRounded')
    var btnLeftIcon = page.getViewById('btnLeftIcon')
    var btnRightIcon = page.getViewById('btnRightIcon') 

    ViewUtil.addTextChangeListener(textSearch, function(text){
    	viewModel.set('message', text)
    }) 

    ViewUtil.buttonRoundedAll(btnRounded, '#483D8B', 10)
    ViewUtil.addViewIcon(btnLeftIcon, 'left', 'icon')
    ViewUtil.addViewIcon(btnRightIcon, 'right', 'icon')
}

exports.onLoading = function(){
	ViewUtil.progressOpen({
	    title: "My Title",
	    message: "NativeScript plugin baby!!",    	    
	    titleColor: "#4682B4",
	    textColor: "#A52A2A",
	    cancelable: true		
	})
}

