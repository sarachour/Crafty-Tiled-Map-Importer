Crafty.scene("main", function() {

	var elements = [
	];
	map = Crafty.e("TiledLevel").tiledLevel("web/levels/level_test.json")
	
	map.bind("TiledLevelLoaded",function(){
		map.forEach(function(e){
			Crafty.e("2D, DOM, player, Collision,SolidHitBox") //SolidHitBox or WiredHitBox
			.origin("center")
			.attr({x: 0, y: 0, _active: true})
			.collision(e.region); //Change the Polygon points to see how the HitBox works
		},2);



	} )

	

	//when everything is loaded, run the main scene
	require(elements, function() {	   
		
	});

});
