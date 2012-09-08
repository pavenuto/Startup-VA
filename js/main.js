var stva = {};

$(function(){

	stva.init();

});


stva.init = function(){

	$('#map_canvas').gmap({'center': '37.5536117554, -77.4605636597', 'zoom': 11, 'disableDefaultUI':true, 'callback': function() {
		var self = this;
		self.addMarker({'position': this.get('map').getCenter() }).click(function() {
			self.openInfoWindow({ 'content': '<h3 class="startup-name">Startup Name</h3><a class="url" href="#">www.domain.com</a>' }, this);
		});
	}});

};