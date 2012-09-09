var stva = {};

var mapStyles = [
 {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { hue: "#ffb400" },
      { lightness: 100 }
    ]
  },{
    featureType: "road",
    stylers: [
      { visibility: "on" },
      { hue: "#91ff00" },
      { saturation: -62 },
      { gamma: 1.98 },
      { lightness: 45 }
    ]
  },{
    featureType: "water",
    stylers: [
      { hue: "#005eff" },
      { gamma: 0.72 },
      { lightness: 42 }
    ]
  },{
    featureType: "transit.line",
    stylers: [
      { visibility: "off" }
    ]
  },{
    featureType: "administrative.locality",
    stylers: [
      { visibility: "on" }
    ]
  },{
    featureType: "administrative.neighborhood",
    elementType: "geometry",
    stylers: [
      { visibility: "simplified" }
    ]
  },{
    featureType: "landscape",
    stylers: [
      { visibility: "on" },
      { gamma: 0.41 },
      { lightness: 46 }
    ]
  },{
    featureType: "administrative.neighborhood",
    elementType: "labels.text",
    stylers: [
      { visibility: "on" },
      { saturation: 33 },
      { lightness: 20 }
    ]
  }
];

$(function(){

  stva.init();

});

stva.add_company_modal = function(type){

 $('.add').colorbox({ iframe:true,width:"40%", height:"90%"});

};


stva.resize_sidebar = function(){

  $(".list-wrap").height($(window).height() - ($('.masthead').height()+$(".tabs").height()));

};

stva.sidebar_tabs = function(){

  var $tabs = $('.tabs');


 $tabs.find('a').click(function(e) {

    $tabs.find('.active').removeClass('active');
    $(this).addClass('active');
   
    e.preventDefault();

    var $list = $('.list');

    if ($(this).hasClass('support')) {

      $list.find("li:not([data-type='support'])").hide();
      $list.find("li[data-type='support']").show();

    } else if ($(this).hasClass('startups')) {

      $list.find("li:not([data-type='startup'])").hide();
      $list.find("li[data-type='startup']").show();

    } else if ($(this).hasClass('events')) {

      $list.find("li:not([data-type='events'])").hide();
      $list.find("li[data-type='events']").show();

    }

 });

};


stva.init = function(){
    
  var $map = $("#map_canvas"),
      $list = $('.list');

  $map.gmap({'center': '37.5536117554, -77.4605636597', 'styles': mapStyles, 'zoom': 11, 'streetViewControl':false,'mapTypeControl':false});

  stva.resize_sidebar();

  $(window).bind('resize',stva.resize_sidebar);
  stva.add_company_modal();

  stva.sidebar_tabs();


  $.getJSON("http://backend.startvirginia.com/apis/json/companies/", function(data){
      
    var html = "";
    
    $.each(data, function(i, startup) {

      if (startup.fields.hiring) {

        hiring_value = "<p class='hiring-flag'>Hiring</p>";

      } else {

        hiring_value = "";

      }
            
      html += "<li id='startup_"+startup.pk+"' data-type='startup'><a href='#'><h3>"+startup.fields.name+"</h3>"+hiring_value+"</a></li>";
            
      $map.gmap('addMarker', {
        'position': new google.maps.LatLng(startup.fields.latitude, startup.fields.longitude),
        'bounds': true,
        'icon': "http://startvirginia.com/img/startup-marker.png"},
        function(map,marker){

            $("#startup_"+startup.pk).live("click", function(e){

              e.preventDefault();

              $map.gmap('openInfoWindow', { 'content': '<h3 class="startup-name">'+startup.fields.name+'</h3><a target="_blank" class="url" href="'+startup.fields.url+'">'+startup.fields.url+'</a><p class="description">'+startup.fields.description+"</p><p class='hiring'>"+startup.fields.hiring+"<p class='industry'>"+startup.fields.industry+"</p><p class='address'>"+startup.fields.street1+" "+startup.fields.street2+"<br> "+startup.fields.city+", "+startup.fields.state+"</p>" }, $(marker));

            });

      }).click(function() {
        $map.gmap('openInfoWindow', { 'content': '<h3 class="startup-name">'+startup.fields.name+'</h3><a target="_blank" class="url" href="'+startup.fields.url+'">'+startup.fields.url+'</a><p class="description">'+startup.fields.description+"</p><p class='hiring'>"+startup.fields.hiring+"<p class='industry'>"+startup.fields.industry+"</p><p class='address'>"+startup.fields.street1+" "+startup.fields.street2+"<br> "+startup.fields.city+", "+startup.fields.state+"</p>"}, this);
      });

    });

    $list.append(html);

    var size =$list.find("li[data-type='startup']").size();

    $('.startups').append("<span>"+size+"</span>");

  });


    $.getJSON("http://backend.startvirginia.com/apis/json/resources/", function(data){
          
        
        var html = "";
        
        $.each(data, function(i, startup) {
                
          html += "<li id='support_"+startup.pk+"' style='display: none' data-type='support'><a href='#'><h3>"+startup.fields.name+"</h3><p>"+startup.fields.description+"</p></a></li>";
            
          var item = $("a", {
              className: 'support',
              href: "#",
              text: "<h3>"+startup.fields.name+"</h3><p>"+startup.fields.description+"</p>",
              click: function(e){
                    e.preventDefault();
                    $map.gmap('openInfoWindow', { 'content': '<h3 class="startup-name">'+startup.fields.name+'</h3><a target="_blank" class="url" href="'+startup.fields.url+'">'+startup.fields.url+'</a><p class="description">'+startup.fields.description+"</p><p class='hiring'>"+startup.fields.hiring+"<p class='address'>"+startup.fields.street1+" "+startup.fields.street2+"<br> "+startup.fields.city+", "+startup.fields.state+"</p>" }, this);
              }
          });


          $map.gmap('addMarker', {
            'position': new google.maps.LatLng(startup.fields.latitude, startup.fields.longitude),
            'bounds': true,
            'icon': "http://startvirginia.com/img/support-marker.png"
          }, function(map,marker){


            $("#support_"+startup.pk).live("click", function(e){

              e.preventDefault();

              $map.gmap('openInfoWindow', { 'content': '<h3 class="startup-name">'+startup.fields.name+'</h3><a target="_blank" class="url" href="'+startup.fields.url+'">'+startup.fields.url+'</a><p class="description">'+startup.fields.description+"</p><p class='hiring'>"+startup.fields.hiring+"</p><p class='address'>"+startup.fields.street1+" "+startup.fields.street2+"<br> "+startup.fields.city+", "+startup.fields.state+"</p>" }, $(marker));

            });

          }).click(function() {
            $map.gmap('openInfoWindow', { 'content': '<h3 class="startup-name">'+startup.fields.name+'</h3><a target="_blank" class="url" href="'+startup.fields.url+'">'+startup.fields.url+'</a><p class="description">'+startup.fields.description+"</p><p class='hiring'>"+startup.fields.hiring+"</p><p class='address'>"+startup.fields.street1+" "+startup.fields.street2+"<br> "+startup.fields.city+", "+startup.fields.state+"</p>" }, this);
          });

        });

        $list.append(html);

        var size =$list.find("li[data-type='support']").size();

        $('.support').append("<span>"+size+"</span>");
    
    });


  $.getJSON("http://backend.startvirginia.com/apis/json/events/", function(data){

        var html = "";
        
        $.each(data, function(i, startup) {
                
          html += "<li id='event_"+startup.pk+"' style='display: none' data-type='events'><a href='#'><p class='when'>"+Date.parse(startup.fields.when).toString("M/d")+"</p><h3>"+startup.fields.name+"</h3></a></li>";
            
          var item = $("a", {
              className: 'support',
              href: "#",
              text: "<h3>"+startup.fields.name+"</h3><p>"+startup.fields.description+"</p>",
              click: function(e){
                    e.preventDefault();
                    $map.gmap('openInfoWindow', { 'content': '<p class="when">'+Date.parse(startup.fields.when).toString("M/d")+'</p><h3 class="startup-name">'+startup.fields.name+'</h3><a target="_blank" class="url" href="'+startup.fields.url+'">'+startup.fields.url+'</a><p class="description">'+startup.fields.description+"</p><p class='address'>"+startup.fields.street1+" "+startup.fields.street2+"<br> "+startup.fields.city+", "+startup.fields.state+"</p>" }, this);
              }
          });


          $map.gmap('addMarker', {
            'position': new google.maps.LatLng(startup.fields.latitude, startup.fields.longitude),
            'bounds': true,
            'icon': "http://startvirginia.com/img/event-marker.png"
          }, function(map,marker){


            $("#event_"+startup.pk).live("click", function(e){

              e.preventDefault();

              $map.gmap('openInfoWindow', { 'content': '<p class="when">'+Date.parse(startup.fields.when).toString("M/d")+'</p><h3 class="startup-name">'+startup.fields.name+'</h3><a target="_blank" class="url" href="'+startup.fields.url+'">'+startup.fields.url+'</a><p class="description">'+startup.fields.description+"</p><p class='address'>"+startup.fields.street1+" "+startup.fields.street2+"<br> "+startup.fields.city+", "+startup.fields.state+"</p>" }, $(marker));

            });

          }).click(function() {
            $map.gmap('openInfoWindow', { 'content': '<h3 class="startup-name">'+startup.fields.name+'</h3><p class="when">'+startup.fields.when+'</p><a target="_blank" class="url" href="'+startup.fields.url+'">'+startup.fields.url+'</a><p class="description">'+startup.fields.description+"</p><p class='industry'>"+startup.fields.industry+"</p><p class='address'>"+startup.fields.street1+" "+startup.fields.street2+"<br> "+startup.fields.city+", "+startup.fields.state+"</p>" }, this);
          });

        });

        $list.append(html);

        var size =$list.find("li[data-type='events']").size();

        $('.events').append("<span>"+size+"</span>");
    
    });


    $("[data-type='support']").hide();

    /* All external links should be new windows */
    $("a.url").live("click",function(e){
        $(this).attr('target', '_blank');
    });

    $('.add-dropdown ').hover(function() {
      $(this).find('ul').show();
    }, function() {
       $(this).find('ul').hide();
    });


};