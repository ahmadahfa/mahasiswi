var directionsDisplay;
var mapss;
var directionsService = new google.maps.DirectionsService();
function ambil_peta_main() {
   google.maps.event.addDomListener(window, 'load', ambil_peta);
}

function ambil_peta() {
    document.getElementById("main_map").style.display = "block";
    document.getElementById("detail").style.display = "none";      
    document.getElementById("map_custom").style.display = "none";      
    document.getElementById("map_route").style.display = "none";      
    document.getElementById("menu").style.display = "none";    

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
      /*heatmap: { enabled: false },*/
      query: {
        select: "col5",
        from: "1gF2_vVtpaOIgLRdx4c4kpvS5eFwGuZxQ38Y1AG0",
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
      windowLayer(0, e, infoWindow, map);
    });

    ambil_peta_main();
}

function windowLayer(index, e, infoWindow, map)
{
  e.infoWindowHtml = "<div class='googft-info-window'>";   
  e.infoWindowHtml += "<b>Tipe: </b><font>" + e.row['Tipe'].value + "</font><br>";
  e.infoWindowHtml += "<b>Nama: </b>" + e.row['Nama'].value + "<br>";
  e.infoWindowHtml += "<b>Wilayah: </b>" + e.row['Alamat'].value + "<br>";
  e.infoWindowHtml += "<b>Deskripsi: </b>" + e.row['Deskripsi'].value + "<br>";  
  if (index == 0)
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
    //alert("masuk");
  document.getElementById("main_map").style.display = "none";
  document.getElementById("detail").style.display = "block";    
  document.getElementById("map_custom").style.display = "block";      
  document.getElementById("map_route").style.display = "none";        
  document.getElementById("menu").style.display = "block";      

  document.getElementById("term").disabled = false;
  document.getElementById("sta").disabled = false;
  document.getElementById("hot").disabled = false;
  document.getElementById("wis").disabled = false;
  document.getElementById("rest").disabled = false;
  document.getElementById("all").disabled = false;
  //alert(kode);
  var URLHead = "https://www.googleapis.com/fusiontables/v1/query?sql=";
  var URLTable = "SELECT * FROM+1gF2_vVtpaOIgLRdx4c4kpvS5eFwGuZxQ38Y1AG0"; 
  var URLwhere = " where Kode IN '" + kode + "'";
  var URLkey = "&key=AIzaSyBQ6xAt27WIjhDQ6JAbJQtv69DXntsnhO0";
  var query = URLHead + URLTable + URLwhere + URLkey;
  
  $.get(query, function (data) {
   
    var kode = data.rows[0][0];
   
    var nama = data.rows[0][3];
    
    var global_latitude = data.rows[0][5];
   
    var global_longitude = data.rows[0][6];
    //alert(kode + " " + nama + " " + global_latitude + " "+ global_longitude);
    document.getElementById("term").onchange = function() {detail(0, kode, nama, global_latitude, global_longitude);};
    document.getElementById("sta").onchange = function() {detail(1, kode, nama, global_latitude, global_longitude);};
    document.getElementById("hot").onchange = function() {detail(2, kode, nama, global_latitude, global_longitude);};
    document.getElementById("rest").onchange = function() {detail(3, kode, nama, global_latitude, global_longitude);};
    document.getElementById("wis").onchange = function() {detail(4, kode, nama, global_latitude, global_longitude);};
    document.getElementById("all").onchange = function() {detail(5, kode, nama, global_latitude, global_longitude);};
    //alert("cantik 3");
    detail(5, kode, nama, global_latitude, global_longitude);
    //alert("cantik 4");
  }, 'json'); 
}

function detail(index, kode, nama, lat, lon)
{
    //alert(index + " " + kode + " " + nama);
    var sum = "";
    if (index == 0) sum = "Tipe IN 'terminal'";
    else if (index == 1) sum = "Tipe IN 'stasiun'";
    else if (index == 2) sum = "Tipe IN 'hotel'";
    else if (index == 3) sum = "Tipe IN 'restoran'";
    else if (index == 4) sum = "Tipe IN 'wisata'";
    google.maps.visualRefresh = true;

    var isMobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) ||
      (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/));
    
    if (isMobile) {

      
      var viewport = document.querySelector("meta[name=viewport]");
      viewport.setAttribute('content', 'initial-scale=1.0, user-scalable=no');
    }

    var mapDiv = document.getElementById('detail-googft-mapCanvas');
    mapDiv.style.width = isMobile ? '100%' : '800px';
    mapDiv.style.height = isMobile ? '100%' : '450px';
    var map = new google.maps.Map(mapDiv, {
      center: new google.maps.LatLng(lat, lon),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP

    });

    var marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(lat, lon),
      //animation: google.maps.Animation.BOUNCE 
    });

    var circle = new google.maps.Circle({
      map: map,
      clickable: false,
      center: new google.maps.LatLng(lat, lon),
      radius: 1000,    // metres
      fillColor: '#111111',
	  strokeWeight:1
    });

    //circle.bindTo('center', marker, 'position');

    var circle2 = new google.maps.Circle({
      map: map,
      clickable: false,
      center: new google.maps.LatLng(lat, lon),
      radius: 3000,    // metres
      fillColor: '#333333',
	  strokeWeight:1
    });


    //circle2.bindTo('center', marker, 'position');

    var circle3 = new google.maps.Circle({
      map: map,
      clickable: false,
      center: new google.maps.LatLng(lat, lon),
      radius: 5000,    // metres
      fillColor: '#555555',
	  strokeWeight:1
    });

    var infoWindow = new google.maps.InfoWindow();
    var layer = new google.maps.FusionTablesLayer({
      map: map,
      suppressInfoWindows: true,
      heatmap: { enabled: false },
      query: {
        select: "col5",
        from: "1gF2_vVtpaOIgLRdx4c4kpvS5eFwGuZxQ38Y1AG0",
        where: sum
      },
      options: {
        styleId: 2
      }
    });

    google.maps.event.addListener(layer, 'click', function(e) {
      windowLayer(1, e, infoWindow, map);
    });

    /*var marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(lat, lon),
    });*/

    //circle3.bindTo('center', marker, 'position');
    
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

    
    detail_main(kode, nama, lat, lon);   
}

function detail_main(kode, nama, lat, lon) {
    google.maps.event.addDomListener(window, 'load', detail); 
    get_around_place(kode, nama, lat, lon);
}

function get_around_place(kode, nama, lat, lon) {
    var URLHead = "https://www.googleapis.com/fusiontables/v1/query?sql=";
    var URLTable = "SELECT * FROM+1gF2_vVtpaOIgLRdx4c4kpvS5eFwGuZxQ38Y1AG0"; 
    var URLwhere = " where Kode NOT EQUAL TO '" + kode + "'";
    var URLkey = "&key=AIzaSyBQ6xAt27WIjhDQ6JAbJQtv69DXntsnhO0";
    var query = URLHead + URLTable + URLwhere + URLkey;
    var distance_seribu = "";
    var distance_tigaribu = "";
    var distance_limaribu = "";
    $.get(query, function (data) {
      for (var i = 0; i < data.rows.length; i++)   {
        var kode2 = data.rows[i][0];
        var nama2 = data.rows[i][3];
        var lat2 = data.rows[i][5];
        var lon2 = data.rows[i][6];  
        //alert(lat + " " + lon + " " + lat2 + " " + lon2);
        var koor1 = new google.maps.LatLng(lat, lon);
        var koor2 = new google.maps.LatLng(lat2, lon2);
        var res  = google.maps.geometry.spherical.computeDistanceBetween(koor1,koor2);
       // alert(res + " " + (res + 2000));
    var central_temp = lat2 + ";" + lon2;
        if (res <= 1000) {
          distance_seribu = mahasiswi_sort(kode2, nama2, res, central_temp, distance_seribu);
          //alert(distance_seribu) ;
        }
        else if (res > 1000 && res <= 3000) {
          distance_tigaribu = mahasiswi_sort(kode2, nama2, res, central_temp, distance_tigaribu);
        }
        else if (res > 3000 && res < 5000) {
          distance_limaribu = mahasiswi_sort(kode2, nama2, res, central_temp, distance_limaribu);
        } 
      }
      /*alert(distance_seribu);
      alert(distance_tigaribu);
      alert(distance_limaribu);*/
    var central = lat + ";" + lon;
      var stasiun = "";
      var terminal = "";
      var rumah_makan = "";
      var hotel = "";
      var wisata = "";
      var arr_distance = distance_seribu.split("/");
      for (var j = 0; j<arr_distance.length; j++) {
          var temp = arr_distance[j].split(";");
          if (temp[0].indexOf("STA") !== -1) stasiun += arr_distance[j] + "/";
          else if (temp[0].indexOf("TER") !== -1) terminal += arr_distance[j] + "/";
          else if (temp[0].indexOf("HOT") !== -1) hotel += arr_distance[j] + "/";
          else if (temp[0].indexOf("WIS") !== -1) wisata += arr_distance[j] + "/";
          else if (temp[0].indexOf("RES") !== -1) rumah_makan += arr_distance[j] + "/";
      }
      arr_distance = distance_tigaribu.split("/");
      for (var j = 0; j<arr_distance.length; j++) {
          var temp = arr_distance[j].split(";");
          if (temp[0].indexOf("STA") !== -1) stasiun += arr_distance[j] + "/";
          else if (temp[0].indexOf("TER") !== -1) terminal += arr_distance[j] + "/";
          else if (temp[0].indexOf("HOT") !== -1) hotel += arr_distance[j] + "/";
          else if (temp[0].indexOf("WIS") !== -1) wisata += arr_distance[j] + "/";
          else if (temp[0].indexOf("RES") !== -1) rumah_makan += arr_distance[j] + "/"; 
      }

      arr_distance = distance_limaribu.split("/");
      for (var j = 0; j<arr_distance.length; j++) {
          var temp = arr_distance[j].split(";");
          if (temp[0].indexOf("STA") !== -1) stasiun += arr_distance[j] + "/";
          else if (temp[0].indexOf("TER") !== -1) terminal += arr_distance[j] + "/";
          else if (temp[0].indexOf("HOT") !== -1) hotel += arr_distance[j] + "/";
          else if (temp[0].indexOf("WIS") !== -1) wisata += arr_distance[j] + "/";
          else if (temp[0].indexOf("RES") !== -1) rumah_makan += arr_distance[j] + "/";
      }
      /*alert("Stasiun " + stasiun);
      alert("Terminal " + terminal);
      alert("Hotel " + hotel);
      alert("Wisata " + wisata);
      alert("rumah_makan " + rumah_makan);*/

      list_place(0, kode, stasiun, central);
      list_place(1, kode, terminal, central);
      list_place(2, kode, hotel, central);
      list_place(3, kode, wisata, central);
      list_place(4, kode, rumah_makan, central);
   },'json'); 
  
}

function mahasiswi_sort(kode, nama, res, central_temp, distance) {
  var arr_main = distance.split("/");
  //alert(arr_seribu.length);
  if (arr_main.length == 0) {
       distance = kode + ";" + nama + ";" + central_temp + ";" + res + "/";
       //alert(distance);
       return distance;
  }
  else {
    var j = 0;
    var text = "";
    for (j = 0; j < arr_main.length; j++) {
        var jarak = arr_main[j].split(";");
        var jarak_int = parseInt(jarak[4]);
        if (res < jarak_int) break;
        else {
          text += arr_main[j] + "/";
        }
    }
    text += (kode + ";" + nama + ";" + central_temp + ";" +  res + "/");
    for (var k = j; k<arr_main.length; k++) {
       text += arr_main[k] + "/";
    }
    distance = text;
    return distance;
  }
}

function list_place(index, kode, place, central) {
  
  //alert(place);
  var text_seribu = "";
  var text_tigaribu = "";
  var text_limaribu = "";
  var sem = "";
  var arr_list = place.split("/");
  //alert(arr_list);
  for (var i = 0; i<arr_list.length; i++) {
      var temp = arr_list[i].split(";");
    var coordinate = kode + ";" + temp[2] + ";" + temp[3] + ";" + central+";"+temp[0];
      if (parseInt(temp[4]) <= 1000) {
    
          text_seribu += "<li>" + temp[1] + " : " + Math.round(temp[4]) +" meter</br>";
          text_seribu += '<button type="button" class="btn btn-info" data-toggle="button" onclick = "getDistance(\'' + coordinate + '\')">Check Route</button><br/></li>';
      }
      else if (parseInt(temp[4]) > 1000 && parseInt(temp[4]) <= 3000) {
          text_tigaribu += "<li>" + temp[1] + " : " + Math.round(temp[4]) +" meter</br>";
      text_tigaribu += '<button type="button" class="btn btn-info" data-toggle="button" onclick = "getDistance(\'' + coordinate + '\')">Check Route</button><br/></li>';
      }
      else if (parseInt(temp[4]) > 3000 && parseInt(temp[4]) <= 5000) {
          text_limaribu += "<li>" + temp[1] + " : " + Math.round(temp[4]) +" meter</br>";
      text_limaribu += '<button type="button" class="btn btn-info" data-toggle="button" onclick = "getDistance(\'' + coordinate + '\')">Check Route</button><br/></li>';
      }
  }
  /*alert(text_seribu);
  alert(text_tigaribu);
  alert(text_limaribu);*/  
  if (index == 0) { 
      
    if(text_seribu.length >0) {
      document.getElementById("stasiun-1000").innerHTML = text_seribu;
    }
    else  { 
    document.getElementById("stasiun-1000").innerHTML="<span>Data tidak tersedia</span>";   
    }
    
    if(text_tigaribu.length >0 ){
    document.getElementById("stasiun-3000").innerHTML = text_tigaribu;
    }
    else {
    document.getElementById("stasiun-3000").innerHTML="<span>Data tidak tersedia</span>";
    }
    
    if(text_limaribu.length>0){
    document.getElementById("stasiun-5000").innerHTML = text_limaribu;
    }
    else {
    document.getElementById("stasiun-5000").innerHTML ="<span>Data tidak tersedia</span>";
    }
  } 
  else if (index == 1) {
    if(text_seribu.length >0){
    document.getElementById("terminal-1000").innerHTML = text_seribu;
    }
    else {
    document.getElementById("terminal-1000").innerHTML = "<span>Data tidak tersedia</span>";
    
    }
    if(text_tigaribu.length >0){
    document.getElementById("terminal-3000").innerHTML = text_tigaribu;
    }
    else {
    document.getElementById("terminal-3000").innerHTML = "<span>Data tidak tersedia</span>";
    
    }
    if(text_limaribu.length >0){
     document.getElementById("terminal-5000").innerHTML = text_limaribu;
    }
    else {
    document.getElementById("terminal-5000").innerHTML = "<span>Data tidak tersedia</span>";
    
    }
    
    
      
      
     
  }
  else if (index == 2) {
    if(text_seribu.length >0){
    document.getElementById("hotel-1000").innerHTML = text_seribu;
    }
    else {
    document.getElementById("hotel-1000").innerHTML = "<span>Data tidak tersedia</span>";
    }
    if(text_tigaribu.length >0){
    document.getElementById("hotel-3000").innerHTML = text_tigaribu;
    }
    else {
    document.getElementById("hotel-3000").innerHTML = "<span>Data tidak tersedia</span>";
    }
    if(text_limaribu.length >0){
    document.getElementById("hotel-5000").innerHTML = text_limaribu;
    }
    else {
    document.getElementById("hotel-5000").innerHTML = "<span>Data tidak tersedia</span>";
    }
      
      
      
  }
  else if (index == 3) {
    if(text_seribu.length >0){
    document.getElementById("wisata-1000").innerHTML = text_seribu;
    }
    else {
    document.getElementById("wisata-1000").innerHTML = "<span>Data tidak tersedia</span>";
    }
    if(text_tigaribu.length >0){
    document.getElementById("wisata-3000").innerHTML = text_tigaribu;
    }
    else {
    document.getElementById("wisata-3000").innerHTML = "<span>Data tidak tersedia</span>";
    }
    if(text_limaribu.length >0){
    document.getElementById("wisata-5000").innerHTML = text_limaribu;
    }
    else {
    document.getElementById("wisata-5000").innerHTML = "<span>Data tidak tersedia</span>";
    }      
  }
  else if (index == 4) {
    if(text_seribu.length >0){
    document.getElementById("rumahmakan-1000").innerHTML = text_seribu;
    }
    else {
    document.getElementById("rumahmakan-1000").innerHTML = "<span>Data tidak tersedia</span>";
    }
    if(text_tigaribu.length >0){
    document.getElementById("rumahmakan-3000").innerHTML = text_tigaribu;
    }
    else {
    document.getElementById("rumahmakan-3000").innerHTML = "<span>Data tidak tersedia</span>";
    }
    if(text_limaribu.length >0){
    document.getElementById("rumahmakan-5000").innerHTML = text_limaribu;
    }
    else {
    document.getElementById("rumahmakan-5000").innerHTML = "<span>Data tidak tersedia</span>";
    }   
  }
}

function getDistance(coordinate) {
  
  document.getElementById("term").disabled = true;
  document.getElementById("sta").disabled = true;
  document.getElementById("hot").disabled = true;
  document.getElementById("wis").disabled = true;
  document.getElementById("rest").disabled = true;
  document.getElementById("all").disabled = true;
  document.getElementById('menu').style.display="none";
  document.getElementById("map_custom").style.display = "none";      
  document.getElementById("map_route").style.display = "block";      
  var sementara = coordinate.split(";");
  var kodetarget=sementara[5];
  var lonpusat = sementara[4];
  var latpusat = sementara[3];
  var lon_target = sementara[2];
  var lat_target = sementara[1];
  var kode_lagi = sementara[0];
  document.getElementById("back_route").onclick = function() {
    passing(kode_lagi);
  };
  //alert(sementara);
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  
  var pusat = new google.maps.LatLng(parseFloat(latpusat), parseFloat(lonpusat));
  var target = new google.maps.LatLng(parseFloat(lat_target), parseFloat(lon_target));
  

  var mapDiv = document.getElementById('detail-googft-mapCanvas');
  var map = new google.maps.Map(mapDiv, {
    center: pusat,
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  directionsDisplay.setMap(map);

  var request = {
        origin: pusat,
        destination: target,
        travelMode: google.maps.DirectionsTravelMode.WALKING
    };
  directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];
        var alamatawal = "";
        var alamatakhir ="";
        for (var i = 0; i < route.legs.length; i++) {
          //alert(i + " " + route.legs[i]);
          alamatawal = route.legs[i].start_address + "";
          alamatakhir=route.legs[i].end_address+"";
        }
        computeTotalDistance(response,kode_lagi,kodetarget,alamatawal,alamatakhir);
      } else {
        alert("directions response "+status);
      }
  });
  
 
  
  
}

function computeTotalDistance(result,kode,kode2, alamat1, alamat2) {
      var totalDist = 0;
      var totalTime = 0;
      var myroute = result.routes[0];
      for (i = 0; i < myroute.legs.length; i++) {
        totalDist += myroute.legs[i].distance.value;
        totalTime += myroute.legs[i].duration.value;      
      }
      totalDist = totalDist / 1000 ;
	  var menit, detik;
	  menit = Math.round(totalTime/60)-1;
	  detik = totalTime % 60;
     //alert(totalDist);
	 //alert(totalTime);
	document.getElementById('routeTime').innerHTML = menit + " Menit "+ detik + " Detik";
	document.getElementById('routeDistance').innerHTML = totalDist + " km";
        
  var URLHead1 = "https://www.googleapis.com/fusiontables/v1/query?sql=";
  var URLTable1 = "SELECT * FROM+1gF2_vVtpaOIgLRdx4c4kpvS5eFwGuZxQ38Y1AG0"; 
  var URLwhere1 = " where Kode IN '" + kode + "'";
  var URLkey1 = "&key=AIzaSyBQ6xAt27WIjhDQ6JAbJQtv69DXntsnhO0";
  var query1 = URLHead1+ URLTable1 + URLwhere1 + URLkey1;
  //alert(query1);
  $.get(query1, function (data) {
    var nama1 = data.rows[0][3];
	document.getElementById('origin').innerHTML =nama1},'json'); 
	document.getElementById('oriAddress').innerHTML =alamat1; 
  
   var URLHead2 = "https://www.googleapis.com/fusiontables/v1/query?sql=";
  var URLTable2 = "SELECT * FROM+1gF2_vVtpaOIgLRdx4c4kpvS5eFwGuZxQ38Y1AG0"; 
  var URLwhere2 = " where Kode IN '" + kode2 + "'";
  var URLkey2 = "&key=AIzaSyBQ6xAt27WIjhDQ6JAbJQtv69DXntsnhO0";
  var query2 = URLHead2+ URLTable2 + URLwhere2 + URLkey2;
 // alert(query2);
  $.get(query2, function (data) {
    var nama2 = data.rows[0][3];
	document.getElementById('destination').innerHTML =nama2},'json');
	document.getElementById('destAddress').innerHTML =alamat2;  
	 
}
