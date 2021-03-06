(function() {

  // A ColorSmoothie is a random colorful image which
  // can be drawn and stretched in a canvas.
  function ColorSmoothie() {
    this._colorPoints = [];
    for (var i = 0; i < 10; ++i) {
      var x = Math.random();
      var y = Math.random();
      var color = randomColor();
      this._colorPoints.push({x: x, y: y, color: color});
    }
    this._cache = null;
  }

  ColorSmoothie.prototype.draw = function(ctx, width, height) {
    if (this._cache !== null && this._cache.width === width &&
        this._cache.height === height) {
      ctx.drawImage(this._cache, 0, 0);
      return;
    }

    this._cache = document.createElement('canvas');
    this._cache.width = width;
    this._cache.height = height;

    var cacheCtx = this._cache.getContext('2d');
    var imgData = cacheCtx.getImageData(0, 0, width, height);

    var idx = 0;
    for (var y = 0; y < height; ++y) {
      for (var x = 0; x < width; ++x) {
        var color = this._colorForPoint(x/width, y/height);
        imgData.data[idx++] = color.r*255;
        imgData.data[idx++] = color.g*255;
        imgData.data[idx++] = color.b*255;
        imgData.data[idx++] = 255;
      }
    }

    cacheCtx.putImageData(imgData, 0, 0);
    this.draw(ctx, width, height);
  };

  ColorSmoothie.prototype._colorForPoint = function(x, y) {
    var r = 0;
    var g = 0;
    var b = 0;
    var totalRatios = 0;
    for (var i = 0, len = this._colorPoints.length; i < len; ++i) {
      var pt = this._colorPoints[i];
      var distanceSquared = Math.pow(pt.x-x, 2) + Math.pow(pt.y-y, 2);
      if (distanceSquared < 0.001) {
        return pt.color;
      }
      totalRatios += 1 / distanceSquared;
    }
    for (var i = 0, len = this._colorPoints.length; i < len; ++i) {
      var pt = this._colorPoints[i];
      var distanceSquared = Math.pow(pt.x-x, 2) + Math.pow(pt.y-y, 2);
      var frac = (1 / distanceSquared) / totalRatios;
      r += pt.color.r * frac;
      g += pt.color.g * frac;
      b += pt.color.b * frac;
    }
    return {r: r, g: g, b: b};
  };

  function randomColor() {
    return {r: Math.random(), g: Math.random(), b: Math.random()};
  }

  window.app.ColorSmoothie = ColorSmoothie;

})();
