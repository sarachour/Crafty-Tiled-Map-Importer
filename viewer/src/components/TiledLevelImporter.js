// Generated by CoffeeScript 1.4.0
(function() {

  Crafty.c("TiledLevel", {
    makeTiles: function(ts, drawType) {
      var components, i, posx, posy, sMap, sName, tHeight, tName, tNum, tWidth, tsHeight, tsImage, tsProperties, tsWidth, xCount, yCount, _i, _ref;
      tsImage = ts.image, tNum = ts.firstgid, tsWidth = ts.imagewidth;
      tsHeight = ts.imageheight, tWidth = ts.tilewidth, tHeight = ts.tileheight;
      tsProperties = ts.tileproperties;
      xCount = tsWidth / tWidth | 0;
      yCount = tsHeight / tHeight | 0;
      sMap = {};
      for (i = _i = 0, _ref = yCount * xCount; _i < _ref; i = _i += 1) {
        posx = i % xCount;
        posy = i / xCount | 0;
        sName = "tileSprite" + tNum;
        tName = "tile" + tNum;
        sMap[sName] = [posx, posy];
        components = "2D, " + drawType + ", " + sName + ", MapTile";
        if (tsProperties) {
          if (tsProperties[tNum - 1]) {
            if (tsProperties[tNum - 1]["components"]) {
              components += ", " + tsProperties[tNum - 1]["components"];
            }
          }
        }
        Crafty.c(tName, {
          comp: components,
          init: function() {
            this.addComponent(this.comp);
            return this;
          }
        });
        tNum++;
      }
      Crafty.sprite(tWidth, tHeight, tsImage, sMap);
      return null;
    },
    makeTileLayer: function(layer) {
      var i, lData, lHeight, lWidth, layerDetails, tDatum, tile, _i, _len;
      lData = layer.data, lWidth = layer.width, lHeight = layer.height;
      layerDetails = {
        tiles: [],
        width: lWidth,
        height: lHeight
      };
      for (i = _i = 0, _len = lData.length; _i < _len; i = ++_i) {
        tDatum = lData[i];
        if (tDatum) {
          tile = Crafty.e("tile" + tDatum);
          tile.x = (i % lWidth) * tile.w;
          tile.y = (i / lWidth | 0) * tile.h;
          layerDetails.tiles[i] = tile;
        }
      }
      return layerDetails;
    },
    makeObjectLayer: function(layer) {
      var PI, i, idx, layerDetails, o, objs, poly, resolution, _i, _j, _ref, _ref1, _ref2;
      layerDetails = {
        tiles: [],
        width: layer.width,
        height: layer.height,
        visible: layer.visible,
        x: layer.x,
        y: layer.y,
        w: layer.w,
        h: layer.h,
        opacity: layer.opacity,
        name: layer.name,
        objects: {}
      };
      objs = layerDetails.objects;
      console.log(layer.objects);
      for (i = _i = 0, _ref = layer.objects.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        o = layer.objects[i];
        console.log(o);
        if (o.ellipse != null) {
          poly = [];
          resolution = 40;
          PI = 3.14159;
          for (i = _j = 0, _ref1 = 2 * PI, _ref2 = 2 * PI / resolution; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = _j += _ref2) {
            poly.push([o.x + o.width * Math.cos(i), o.y + o.height * Math.sin(i)]);
          }
        } else if (o.polygon != null) {
          poly = (function() {
            var _k, _ref3, _results;
            _results = [];
            for (idx = _k = 0, _ref3 = o.polygon.length; 0 <= _ref3 ? _k < _ref3 : _k > _ref3; idx = 0 <= _ref3 ? ++_k : --_k) {
              _results.push([o.polygon[idx].x + o.x, o.polygon[idx].y + o.y]);
            }
            return _results;
          })();
        } else if (o.polyline != null) {
          poly = (function() {
            var _k, _ref3, _results;
            _results = [];
            for (idx = _k = 0, _ref3 = o.polyline.length; 0 <= _ref3 ? _k < _ref3 : _k > _ref3; idx = 0 <= _ref3 ? ++_k : --_k) {
              _results.push([o.polyline[idx].x + o.x, o.polyline[idx].y + o.y]);
            }
            return _results;
          })();
        } else {
          poly = [[o.x, o.y], [o.x + o.width, o.y], [o.x + o.width, o.y + o.height], [o.x, o.y + o.height]];
        }
        objs[o.name] = {
          region: new Crafty.polygon(poly),
          type: o.type,
          properties: o.properties,
          visible: o.visible
        };
      }
      return layerDetails;
    },
    makeImageLayer: function(layer) {
      var layerDetails;
      layerDetails = {
        name: layer.name,
        properties: layer.properties,
        transparentcolor: layer.transparentcolor
      };
      layerDetails.image = Crafty.e("2D,DOM,Image").image(layer.image).attr({
        w: layer.width,
        h: layer.height,
        x: layer.x,
        y: layer.y,
        visible: layer.visible,
        alpha: layer.alpha
      });
      return layerDetails;
    },
    makeLayer: function(layer) {
      var layerDetails, type;
      type = layer.type;
      if (layer.type === "tilelayer") {
        layerDetails = this.makeTileLayer(layer);
        layerDetails.type = "tile";
      } else if (layer.type === "objectgroup") {
        layerDetails = this.makeObjectLayer(layer);
        layerDetails.type = "object";
      } else if (layer.type === "imagelayer") {
        layerDetails = this.makeImageLayer(layer);
        layerDetails.type = "image";
      }
      this._layerArray.push(layerDetails);
      return null;
    },
    tiledLevel: function(levelURL, drawType) {
      var relativeToRoot,
        _this = this;
      relativeToRoot = function(im) {
        var imageArray, j, levelArray, str, _i, _ref;
        levelArray = levelURL.split("/");
        imageArray = im.split("/");
        levelArray.pop();
        while (imageArray[0] === "..") {
          imageArray.shift();
          levelArray.pop();
        }
        while (imageArray.length > 0) {
          levelArray.push(imageArray.shift());
        }
        str = levelArray[0];
        for (j = _i = 1, _ref = levelArray.length; 1 <= _ref ? _i < _ref : _i > _ref; j = 1 <= _ref ? ++_i : --_i) {
          str += "/" + levelArray[j];
        }
        return str;
      };
      $.ajax({
        type: 'GET',
        url: levelURL,
        dataType: 'json',
        data: {},
        async: false,
        success: function(level) {
          var l, lLayers, ts, tsImages, tss, _i, _j, _k, _len, _len1, _len2;
          lLayers = level.layers, tss = level.tilesets;
          drawType = drawType != null ? drawType : "Canvas";
          for (_i = 0, _len = tss.length; _i < _len; _i++) {
            ts = tss[_i];
            ts.image = relativeToRoot(ts.image);
          }
          for (_j = 0, _len1 = lLayers.length; _j < _len1; _j++) {
            l = lLayers[_j];
            if (l.image != null) {
              l.image = relativeToRoot(l.image);
            }
          }
          tsImages = (function() {
            var _k, _len2, _results;
            _results = [];
            for (_k = 0, _len2 = tss.length; _k < _len2; _k++) {
              ts = tss[_k];
              _results.push(ts.image);
            }
            return _results;
          })();
          for (_k = 0, _len2 = lLayers.length; _k < _len2; _k++) {
            l = lLayers[_k];
            if (l.image != null) {
              tsImages.push(l.image);
            }
          }
          console.log(tsImages);
          Crafty.load(tsImages, function() {
            var layer, _l, _len3, _len4, _m;
            for (_l = 0, _len3 = tss.length; _l < _len3; _l++) {
              ts = tss[_l];
              _this.makeTiles(ts, drawType);
            }
            for (_m = 0, _len4 = lLayers.length; _m < _len4; _m++) {
              layer = lLayers[_m];
              _this.makeLayer(layer);
            }
            _this.trigger("TiledLevelLoaded", _this);
            return null;
          });
          return null;
        }
      });
      return this;
    },
    getTile: function(r, c, l) {
      var layer, tile;
      if (l == null) {
        l = 0;
      }
      layer = this._layerArray[l];
      if (!(layer != null) || r < 0 || r >= layer.height || c < 0 || c >= layer.width || layer.type !== "tile") {
        return null;
      }
      tile = layer.tiles[c + r * layer.width];
      if (tile) {
        return tile;
      } else {
        return void 0;
      }
    },
    getImage: function(l) {
      var layer;
      if (l == null) {
        l = 0;
      }
      layer = this._layerArray[l];
      if (!(layer != null) || layer.type !== "image") {
        return null;
      }
      return layer.image;
    },
    getObject: function(name, l) {
      var layer, obj;
      if (l == null) {
        l = 0;
      }
      layer = this._layerArray[l];
      if (!(layer != null) || layer.type !== "object") {
        return null;
      }
      obj = layer.objects[name];
      if (obj) {
        return obj;
      } else {
        return void 0;
      }
    },
    forEach: function(fxn, l) {
      var i, j, layer, obj, _i, _j, _ref, _ref1;
      if (l == null) {
        l = 0;
      }
      layer = this._layerArray[l];
      if (!(layer != null)) {
        return null;
      }
      if (layer.type === "object") {
        for (obj in layer.objects) {
          fxn(layer.objects[obj]);
        }
      } else if (layer.type === "image") {
        fxn(layer);
      } else if (layer.type === "tile") {
        for (i = _i = 0, _ref = layer.width - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          for (j = _j = 0, _ref1 = layer.height - 1; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
            fxn(this.getTile(i, j, l));
          }
        }
      }
      return null;
    },
    init: function() {
      this._layerArray = [];
      return this;
    }
  });

}).call(this);
