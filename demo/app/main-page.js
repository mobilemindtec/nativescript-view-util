var ViewUtil = require('nativescript-view-util')
var observableModule = require("data/observable");

var viewModel = new observableModule.fromObject({   
  'message': ''  
})

exports.loaded = function(args) {
    var page = args.object;
    page.bindingContext = viewModel

    var textSearch = page.getViewById('textSearch')    
    var btnRounded = page.getViewById('btnRounded')
    var btnLeftIcon = page.getViewById('btnLeftIcon')
    var btnRightIcon = page.getViewById('btnRightIcon') 
 
    ViewUtil.addTextChangeListener(textSearch, function(text){
    	viewModel.set('message', text)
    }) 

    ViewUtil.buttonRoundedAll(btnRounded, '#483D8B', 10)
    ViewUtil.addViewIcon(btnLeftIcon, 'left', 'ic_back')
    ViewUtil.addViewIcon(btnRightIcon, 'right', 'ic_back')
}

