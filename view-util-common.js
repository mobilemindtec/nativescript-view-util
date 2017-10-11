var application = require("application");
var frameModule = require("ui/frame");
var platform = require("platform");
var colorModule = require("color");
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
