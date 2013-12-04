
function ambil_peta_main() {
	 google.maps.event.addDomListener(window, 'load', ambil_peta);
}

function ambil_peta() {
  
	  google.maps.visualRefresh = true;

    var isMobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) ||
      (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/));
    
    if (isMobile) {
      var viewport = document.querySelector("meta[name=viewport]");
      viewport.setAttribute('content', 'initial-scale=1.0, user-scalable=no');
    }

    var mapDiv = document.getElementById('googft-mapCanvas');
    mapDiv.style.width = isMobile ? '100%' : '1200px';
    mapDiv.style.height = isMobile ? '100%' : '400px';
    var map = new google.maps.Map(mapDiv, {
      center: new google.maps.LatLng(-6.226256262359782, 106.88347505859372),
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infoWindow = new google.maps.InfoWindow();
    var layer = new google.maps.FusionTablesLayer({
      map: map,
      suppressInfoWindows: true,
      heatmap: { enabled: false },
      query: {
        select: "col2",
        from: "1JCrZd25DtYmrkdfClmh8YKdEvYvtKNEmi36vs7o",
        where: "Tipe = 'wisata'"
      },
      options: {
        styleId: 2
      }
    });
    if (isMobile) {
      var legend = document.getElementById('googft-legend');
      var legendOpenButton = document.getElementById('googft-legend-open');
      var legendCloseButton = document.getElementById('googft-legend-close');
      legend.style.display = 'none';
      legendOpenButton.style.display = 'block';
      legendCloseButton.style.display = 'block';
      legendOpenButton.onclick = function() {
        legend.style.display = 'block';
        legendOpenButton.style.display = 'none';
      }
      legendCloseButton.onclick = function() {
        legend.style.display = 'none';
        legendOpenButton.style.display = 'block';
      }
    }

    google.maps.event.addListener(layer, 'click', function(e) {
      windowLayer(e, infoWindow, map);
    });

    ambil_peta_main();
}

function windowLayer(e, infoWindow, map)
{
  e.infoWindowHtml = "<div class='googft-info-window'>";   
  e.infoWindowHtml += "<b>Tipe: </b><font>" + e.row['Tipe'].value + "</font><br>";
  e.infoWindowHtml += "<b>Nama: </b>" + e.row['Nama'].value + "<br>";
  e.infoWindowHtml += "<b>Alamat: </b>" + e.row['Alamat'].value + "<br>";
  e.infoWindowHtml += "<b>Deskripsi: </b>" + e.row['Deskripsi'].value + "<br>";  
  e.infoWindowHtml += "<a href = javascript:passing('" + e.row['Kode'].value + "')>Lihat penjelasan lebih detail</a>";  
  e.infoWindowHtml += "</div>";

  infoWindow.setOptions({
    content: e.infoWindowHtml,
        position: e.latLng,
        pixelOffset: e.pixelOffset
    });
  
  infoWindow.open(map);
}

function passing(kode) 
{
  var URLHead = "https://www.googleapis.com/fusiontables/v1/query?sql=";
  var URLTable = "SELECT * FROM+1JCrZd25DtYmrkdfClmh8YKdEvYvtKNEmi36vs7o"; 
  var URLwhere = " where Kode IN '" + kode + "'";
  var URLkey = "&key=AIzaSyBQ6xAt27WIjhDQ6JAbJQtv69DXntsnhO0";
  var query = URLHead + URLTable + URLwhere + URLkey;
  
  $.get(query, function (data) {
    
    var global_latitude = data.rows[0][4];
    var global_longitude = data.rows[0][5];
    
    detail(global_latitude, global_longitude);
  }); 
}

function detail(lat, lon)
{
    google.maps.visualRefresh = true;

    var isMobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) ||
      (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/));
    
    if (isMobile) {
      var viewport = document.querySelector("meta[name=viewport]");
      viewport.setAttribute('content', 'initial-scale=1.0, user-scalable=no');
    }

    var mapDiv = document.getElementById('googft-mapCanvas');
    mapDiv.style.width = isMobile ? '100%' : '800px';
    mapDiv.style.height = isMobile ? '100%' : '400px';
    var map = new google.maps.Map(mapDiv, {
      center: new google.maps.LatLng(lat, lon),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infoWindow = new google.maps.InfoWindow();
    var layer = new google.maps.FusionTablesLayer({
      map: map,
      suppressInfoWindows: true,
      heatmap: { enabled: false },
      query: {
        select: "col2",
        from: "1JCrZd25DtYmrkdfClmh8YKdEvYvtKNEmi36vs7o",
        where: ""
      },
      options: {
        styleId: 2
      }
    });

    var marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(lat, lon),
      /*title: 'The armpit of Cheshire'*/
    });

    var circle = new google.maps.Circle({
      map: map,
      radius: 500,    // metres
      fillColor: '#AA0000'
    });

    circle.bindTo('center', marker, 'position');

    var circle2 = new google.maps.Circle({
      map: map,
      radius: 1000,    // metres
      fillColor: '#FF0000'
    });


    circle2.bindTo('center', marker, 'position');
    
    if (isMobile) {
      var legend = document.getElementById('googft-legend');
      var legendOpenButton = document.getElementById('googft-legend-open');
      var legendCloseButton = document.getElementById('googft-legend-close');
      legend.style.display = 'none';
      legendOpenButton.style.display = 'block';
      legendCloseButton.style.display = 'block';
      legendOpenButton.onclick = function() {
        legend.style.display = 'block';
        legendOpenButton.style.display = 'none';
      }
      legendCloseButton.onclick = function() {
        legend.style.display = 'none';
        legendOpenButton.style.display = 'block';
      }
    }

    detail_main();   
}

function detail_main() {
    google.maps.event.addDomListener(window, 'load', detail); 
}

