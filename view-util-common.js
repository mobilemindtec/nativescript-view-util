var application = require("@nativescript/core/application");
var frameModule = require("@nativescript/core/ui/frame");
var platform = require("@nativescript/core/platform");
var colorModule = require("@nativescript/core/color");
var Color = colorModule.Color;

var keyboardIsOpened



exports.capitalize = function(text) {
  if(text)
    return text.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  return ""
};

var DensityResources = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  XHIGH: 3,
  XXHIGH: 4,
  XXXHIGH: 5,
}
exports.DensityResources = DensityResources
