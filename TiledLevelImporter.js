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
    makeTileLayer: function(layer){
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
    makeObjectLayer: function(layer){

    	layerDetails = {
	        tiles: [],
	        width: layer.width,
	        height: layer.height
	    };

	    return layerDetails;
    },
    makeImageLayer: function(layer){
    	layerDetails = {
	        tiles: [],
	        width: layer.width,
	        height: layer.height
	    };

	    return layerDetails;

    },
    makeLayer: function(layer) {
      var layerDetails;
      console.log(layer.type);
      if(layer.type == "tilelayer"){
      	layerDetails = this.makeTileLayer(layer);
      }
      else if(layer.type == "objectgroup"){
      	layerDetails = this.makeObjectLayer(layer);
      }
      else if(layer.type == "imagelayer"){
      	layerDetails = this.makeImageLayer(layer);
      }
      
      this._layerArray.push(layerDetails);
      return null;
    },
    tiledLevel: function(levelURL, drawType) {
      var _this = this;
      $.ajax({
        type: 'GET',
        url: levelURL,
        dataType: 'json',
        data: {},
        async: false,
        success: function(level) {
          var lLayers, ts, tsImages, tss;
          lLayers = level.layers, tss = level.tilesets;
          drawType = drawType != null ? drawType : "Canvas";
          tsImages = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = tss.length; _i < _len; _i++) {
              ts = tss[_i];
              _results.push(ts.image);
            }
            return _results;
          })();
          Crafty.load(tsImages, function() {
            var layer, _i, _j, _len, _len1;
            for (_i = 0, _len = tss.length; _i < _len; _i++) {
              ts = tss[_i];
              _this.makeTiles(ts, drawType);
            }
            for (_j = 0, _len1 = lLayers.length; _j < _len1; _j++) {
              layer = lLayers[_j];
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
      if (!(layer != null) || r < 0 || r >= layer.height || c < 0 || c >= layer.width) {
        return null;
      }
      tile = layer.tiles[c + r * layer.width];
      if (tile) {
        return tile;
      } else {
        return void 0;
      }
    },
    init: function() {
      this._layerArray = [];
      return this;
    }
  });

}).call(this);