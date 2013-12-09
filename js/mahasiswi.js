
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
    mapDiv.style.height = isMobile ? '100%' : '500px';
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
  alert(kode);
  document.getElementById("main_map").style.display = "none";
  document.getElementById("detail_map").style.display = "block";
  var URLHead = "https://www.googleapis.com/fusiontables/v1/query?sql=";
  var URLTable = "SELECT * FROM+1JCrZd25DtYmrkdfClmh8YKdEvYvtKNEmi36vs7o"; 
  var URLwhere = " where Kode IN '" + kode + "'";
  var URLkey = "&key=AIzaSyBQ6xAt27WIjhDQ6JAbJQtv69DXntsnhO0";
  var query = URLHead + URLTable + URLwhere + URLkey;
  
  $.get(query, function (data) {
    var kode = data.rows[0][0];
    var global_latitude = data.rows[0][4];
    var global_longitude = data.rows[0][5];
    
    detail(kode, global_latitude, global_longitude);
  }); 
}

function detail(kode, lat, lon)
{
    google.maps.visualRefresh = true;

    var isMobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) ||
      (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/));
    
    if (isMobile) {
      var viewport = document.querySelector("meta[name=viewport]");
      viewport.setAttribute('content', 'initial-scale=1.0, user-scalable=no');
    }

    var mapDiv = document.getElementById('detail-googft-mapCanvas');
    mapDiv.style.width = isMobile ? '100%' : '800px';
    mapDiv.style.height = isMobile ? '100%' : '500px';
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
      radius: 1000,    // metres
      fillColor: '#AA0000'
    });

    circle.bindTo('center', marker, 'position');

    var circle2 = new google.maps.Circle({
      map: map,
      radius: 3000,    // metres
      fillColor: '#FF0000'
    });


    circle2.bindTo('center', marker, 'position');

    var circle3 = new google.maps.Circle({
      map: map,
      radius: 5000,    // metres
      fillColor: '#FF00FF'
    });

    circle3.bindTo('center', marker, 'position');
    
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

    detail_main(kode, lat, lon);   
}

function detail_main(kode, lat, lon) {
    google.maps.event.addDomListener(window, 'load', detail); 
    get_around_place(kode, lat, lon);
}

function get_around_place(kode, lat, lon) {
    var URLHead = "https://www.googleapis.com/fusiontables/v1/query?sql=";
    var URLTable = "SELECT * FROM+1JCrZd25DtYmrkdfClmh8YKdEvYvtKNEmi36vs7o"; 
    var URLwhere = " where Kode NOT EQUAL TO '" + kode + "'";
    var URLkey = "&key=AIzaSyBQ6xAt27WIjhDQ6JAbJQtv69DXntsnhO0";
  	var query = URLHead + URLTable + URLwhere + URLkey;
  	var distance_seribu = "";
    var distance_tigaribu = "";
    var distance_limaribu = "";
	  $.get(query, function (data) {
      for (var i = 0; i < data.rows.length; i++)	 {
        var kode = data.rows[i][0];
        var lat2 = data.rows[i][4];
        var lon2 = data.rows[i][5];  
        //alert(lat + " " + lon + " " + lat2 + " " + lon2);
        var koor1 = new google.maps.LatLng(lat, lon);
        var koor2 = new google.maps.LatLng(lat2, lon2);
        var res  = google.maps.geometry.spherical.computeDistanceBetween(koor1,koor2);
       // alert(res + " " + (res + 2000));
        if (res <= 1000) {
          distance_seribu = mahasiswi_sort(kode, res, distance_seribu);
          //alert(distance_seribu) ;
        }
        else if (res > 1000 && res <= 3000) {
          distance_tigaribu = mahasiswi_sort(kode, res, distance_tigaribu);
        }
        else if (res > 3000 && res < 5000) {
          distance_limaribu = mahasiswi_sort(kode, res, distance_limaribu);
        } 
      }
      /*alert(distance_seribu);
      alert(distance_tigaribu);
      alert(distance_limaribu);*/
      var stasiun = "";
      var terminal = "";
      var rumah_makan = "";
      var hotel = "";
      var wisata = "";
      var arr_distance = distance_seribu.split("-");
      for (var j = 0; j<arr_distance.length; j++) {
          var temp = arr_distance[j].split(";");
          if (temp[0].indexOf("STA") !== -1) stasiun += arr_distance[j] + "-";
          else if (temp[0].indexOf("TER") !== -1) terminal += arr_distance[j] + "-";
          else if (temp[0].indexOf("HOT") !== -1) hotel += arr_distance[j] + "-";
          else if (temp[0].indexOf("WIS") !== -1) wisata += arr_distance[j] + "-";
          else if (temp[0].indexOf("RES") !== -1) rumah_makan += arr_distance[j] + "-";
      }
      arr_distance = distance_tigaribu.split("-");
      for (var j = 0; j<arr_distance.length; j++) {
          var temp = arr_distance[j].split(";");
          if (temp[0].indexOf("STA") !== -1) stasiun += arr_distance[j] + "-";
          else if (temp[0].indexOf("TER") !== -1) terminal += arr_distance[j] + "-";
          else if (temp[0].indexOf("HOT") !== -1) hotel += arr_distance[j] + "-";
          else if (temp[0].indexOf("WIS") !== -1) wisata += arr_distance[j] + "-";
          else if (temp[0].indexOf("RES") !== -1) rumah_makan += arr_distance[j] + "-"; 
      }

      arr_distance = distance_limaribu.split("-");
      for (var j = 0; j<arr_distance.length; j++) {
          var temp = arr_distance[j].split(";");
          if (temp[0].indexOf("STA") !== -1) stasiun += arr_distance[j] + "-";
          else if (temp[0].indexOf("TER") !== -1) terminal += arr_distance[j] + "-";
          else if (temp[0].indexOf("HOT") !== -1) hotel += arr_distance[j] + "-";
          else if (temp[0].indexOf("WIS") !== -1) wisata += arr_distance[j] + "-";
          else if (temp[0].indexOf("RES") !== -1) rumah_makan += arr_distance[j] + "-";
      }
      alert("Stasiun " + stasiun);
      alert("Terminal " + terminal);
      alert("Hotel " + hotel);
      alert("Wisata " + wisata);
      alert("rumah_makan " + rumah_makan);
	 }); 
	
}

function mahasiswi_sort(kode, res, distance) {
  var arr_main = distance.split("-");
  //alert(arr_seribu.length);
  if (arr_main.length == 0) {
       distance = kode + ";" + res + "-";
       //alert(distance);
       return distance;
  }
  else {
    var j = 0;
    var text = "";
    for (j = 0; j < arr_main.length; j++) {
        var jarak = arr_main[j].split(";");
        var jarak_int = parseInt(jarak[1]);
        if (res < jarak_int) break;
        else {
          text += arr_main[j] + "-";
        }
    }
    text += (kode + ";" + res + "-");
    for (var k = j; k<arr_main.length; k++) {
       text += arr_main[k] + "-";
    }
    distance = text;
    return distance;
  }
}

function getDistance(){

}


