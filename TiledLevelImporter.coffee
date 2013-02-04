Crafty.c "TiledLevel",
    makeTiles : (ts, drawType) ->
        {image: tsImage, firstgid: tNum, imagewidth: tsWidth} =ts
        {imageheight: tsHeight, tilewidth: tWidth, tileheight: tHeight} = ts
        {tileproperties: tsProperties} = ts
        #console.log ts
        xCount = tsWidth/tWidth | 0
        yCount = tsHeight/tHeight | 0
        sMap = {}
        #Crafty.load [tsImage], ->
        for i in [0...yCount * xCount] by 1
            #console.log _ref
            posx = i % xCount
            posy = i / xCount | 0 
            sName = "tileSprite#{tNum}"
            tName = "tile#{tNum}"
            sMap[sName] = [posx, posy]
            components = "2D, #{drawType}, #{sName}, MapTile"
            if tsProperties
                if tsProperties[tNum - 1]
                    if tsProperties[tNum - 1]["components"]
                        components += ", #{tsProperties[tNum - 1]["components"]}"
            #console.log components
            Crafty.c tName,
                comp: components
                init: ->
                    @addComponent(@comp)
                    @
            tNum++ 
        #console.log sMap
        Crafty.sprite(tWidth, tHeight, tsImage, sMap)
        return null

    makeTileLayer: (layer) ->
        {data: lData, width: lWidth, height: lHeight} = layer
        layerDetails = {tiles:[], width:lWidth, height:lHeight}

        for tDatum, i in lData
            if tDatum
                tile = Crafty.e "tile#{tDatum}"
                tile.x = (i % lWidth) * tile.w
                tile.y = (i / lWidth | 0) * tile.h
                #tile.attr({x: (i % lWidth) * tile.w, y: (i  / lWidth | 0) * tile.h})
                #console.log "#{tile.x} #{tile.y}"
                layerDetails.tiles[i] = tile
        return layerDetails

    makeObjectLayer: (layer) ->
        layerDetails = {
            tiles: [],
            width: layer.width,
            height: layer.height,
            visible: layer.visible,
            x: layer.x,
            y: layer.y,
            w : layer.w,
            h : layer.h,
            opacity : layer.opacity,
            name: layer.name
            objects : {}
        };
        objs = layerDetails.objects;
        console.log layer.objects
        for i in [0...layer.objects.length]
            o = layer.objects[i]
            if o.ellipse?
                poly = [];
                #TODO: Add ellipse to bounding regions
                console.log "WARNING: Ellipse regions not supported."
            else if o.polygon?
                poly = for idx in [0...o.polygon.length]
                         [o.polygon[idx].x+o.x, o.polygon[idx].y+o.y];
            else
                poly = [[o.x,o.y], [o.x+o.width, o.y],
                    [o.x+o.width, o.y+o.height], [o.x, o.y+o.height]]
            objs[o.name] = {
                region : new Crafty.polygon(poly),
                type : o.type,
                properties : o.properties,
                visible : o.visible
            };
        
        #@TODO : Create Tiled Object class that is collidable
        #for i in [0...layer.objects.length]
        #    console.log layer.objects[i]

        return layerDetails

    makeImageLayer: (layer) ->
        layerDetails = {
            name : layer.name,
            properties : layer.properties,
            transparentcolor : layer.transparentcolor,
        };
        
        layerDetails.image = Crafty.e("2D,DOM,Image").image(layer.image).
          attr({
            w : layer.width,
            h : layer.height,
            x : layer.x,
            y : layer.y,
            visible : layer.visible,
            alpha : layer.alpha
        })
        return layerDetails; 
   
    makeLayer : (layer) ->
        #console.log layer
        type = layer.type
        #console.log layer.type;
        #console.log layer
        if layer.type == "tilelayer"
          layerDetails = this.makeTileLayer(layer);
          layerDetails.type = "tile";
        else if layer.type == "objectgroup"
          layerDetails = this.makeObjectLayer(layer);
          layerDetails.type = "object";
        else if(layer.type == "imagelayer")
          layerDetails = this.makeImageLayer(layer);
          layerDetails.type = "image";
        @_layerArray.push(layerDetails)
        return null

    tiledLevel : (levelURL, drawType) ->
        $.ajax
            type: 'GET'
            url: levelURL
            dataType: 'json'
            data: {}
            async: false
            success: (level) =>
                #console.log level
                {layers: lLayers, tilesets: tss} = level
                drawType = drawType ? "Canvas"
                tsImages = for ts in tss
                    ts.image
                #Load image layers
                for l in lLayers when l.image?
                    tsImages.push l.image

                #console.log tsImages
                Crafty.load tsImages, =>
                    @makeTiles(ts, drawType) for ts in tss
                    @makeLayer(layer) for layer in lLayers
                    @trigger("TiledLevelLoaded", this)
                    return null
                return null
        return @
        
    getTile: (r,c,l=0)->
        layer = @_layerArray[l]
        
        return null if not layer? or r < 0 or r>=layer.height or c<0 or c>=layer.width or layer.type != "tile"
        
        tile = layer.tiles[c + r*layer.width]
        
        if tile
            return tile
        else
            return undefined

    getImage: (l=0) ->
        layer = @_layerArray[l]

        return null if not layer? or layer.type  !=  "image" 

        return layer.image;

    getObject: (name, l=0) ->
        layer = @_layerArray[l]

        return null if not layer? or layer.type  !=  "object" 

        obj = layer.objects[name];
        if obj
            return obj
        else
            return undefined

    forEach: (fxn, l=0) ->
        layer = @_layerArray[l]

        return null if not layer? 

        if(layer.type == "object")
            for obj of layer.objects
                fxn layer.objects[obj]
        else if(layer.type == "image")
                fxn layer;
        else if(layer.type == "tile")
                for i in [0...layer.width-1]
                    for j in [0...layer.height-1]
                        fxn this.getTile(i,j,l)
        return null;

    init: -> 
        @_layerArray = []
        @
