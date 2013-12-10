
function ambil_peta_main() {
	 google.maps.event.addDomListener(window, 'load', ambil_peta);
}

function ambil_peta() {
    document.getElementById("main_map").style.display = "block";
    document.getElementById("detail").style.display = "none";      
    document.getElementById("menu").style.display = "none";    

	  google.maps.visualRefresh = true;

    var isMobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) ||
      (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/));
    
    if (isMobile) {
      var viewport = document.querySelector("meta[name=viewport]");
      viewport.setAttribute('content', 'initial-scale=1.0, user-scalable=no');
    }

    var mapDiv = document.getElementById('googft-mapCanvas');
    mapDiv.style.width = isMobile ? '100%' : '80%';
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

  document.getElementById("main_map").style.display = "none";
  document.getElementById("detail").style.display = "block";      
  document.getElementById("menu").style.display = "block";      

  var URLHead = "https://www.googleapis.com/fusiontables/v1/query?sql=";
  var URLTable = "SELECT * FROM+1JCrZd25DtYmrkdfClmh8YKdEvYvtKNEmi36vs7o"; 
  var URLwhere = " where Kode IN '" + kode + "'";
  var URLkey = "&key=AIzaSyBQ6xAt27WIjhDQ6JAbJQtv69DXntsnhO0";
  var query = URLHead + URLTable + URLwhere + URLkey;
  
  $.get(query, function (data) {
    var kode = data.rows[0][0];
    var nama = data.rows[0][2];
    var global_latitude = data.rows[0][4];
    var global_longitude = data.rows[0][5];
    
    detail(kode, nama, global_latitude, global_longitude);
  }); 
}

function detail(kode, nama, lat, lon)
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

    detail_main(kode, nama, lat, lon);   
}

function detail_main(kode, nama, lat, lon) {
    google.maps.event.addDomListener(window, 'load', detail); 
    get_around_place(kode, nama, lat, lon);
}

function get_around_place(kode, nama, lat, lon) {
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
        var kode2 = data.rows[i][0];
        var nama2 = data.rows[i][2];
        var lat2 = data.rows[i][4];
        var lon2 = data.rows[i][5];  
        //alert(lat + " " + lon + " " + lat2 + " " + lon2);
        var koor1 = new google.maps.LatLng(lat, lon);
        var koor2 = new google.maps.LatLng(lat2, lon2);
        var res  = google.maps.geometry.spherical.computeDistanceBetween(koor1,koor2);
       // alert(res + " " + (res + 2000));
        if (res <= 1000) {
          distance_seribu = mahasiswi_sort(kode2, nama2, res, distance_seribu);
          //alert(distance_seribu) ;
        }
        else if (res > 1000 && res <= 3000) {
          distance_tigaribu = mahasiswi_sort(kode2, nama2, res, distance_tigaribu);
        }
        else if (res > 3000 && res < 5000) {
          distance_limaribu = mahasiswi_sort(kode2, nama2, res, distance_limaribu);
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
      /*alert("Stasiun " + stasiun);
      alert("Terminal " + terminal);
      alert("Hotel " + hotel);
      alert("Wisata " + wisata);
      alert("rumah_makan " + rumah_makan);*/

      list_place(0, stasiun);
      list_place(1, terminal);
      list_place(2, hotel);
      list_place(3, wisata);
      list_place(4, rumah_makan);
	 }); 
	
}

function mahasiswi_sort(kode, nama, res, distance) {
  var arr_main = distance.split("-");
  //alert(arr_seribu.length);
  if (arr_main.length == 0) {
       distance = kode + ";" + nama + ";" +  res + "-";
       //alert(distance);
       return distance;
  }
  else {
    var j = 0;
    var text = "";
    for (j = 0; j < arr_main.length; j++) {
        var jarak = arr_main[j].split(";");
        var jarak_int = parseInt(jarak[2]);
        if (res < jarak_int) break;
        else {
          text += arr_main[j] + "-";
        }
    }
    text += (kode + ";" + nama + ";" + res + "-");
    for (var k = j; k<arr_main.length; k++) {
       text += arr_main[k] + "-";
    }
    distance = text;
    return distance;
  }
}

function list_place(index, place) {
  
  //alert(place);
  var text_seribu = "";
  var text_tigaribu = "";
  var text_limaribu = "";
  var sem = "";
  var arr_list = place.split("-");
  for (var i = 0; i<arr_list.length; i++) {
      var temp = arr_list[i].split(";");
      if (parseInt(temp[2]) <= 1000) {
          text_seribu += "<li>" + temp[1] + " : " + Math.round(temp[2]) +" meter</li>";
      }
      else if (parseInt(temp[2]) > 1000 && parseInt(temp[2]) <= 3000) {
          text_tigaribu += "<li>" + temp[1] + " : " + Math.round(temp[2]) +" meter</li>";
      }
      else if (parseInt(temp[2]) > 3000 && parseInt(temp[2]) <= 5000) {
          text_limaribu += "<li>" + temp[1] + " : " + Math.round(temp[2]) +" meter</li>";
      }
  }
  /*alert(text_seribu);
  alert(text_tigaribu);
  alert(text_limaribu);*/  
  if (index == 0) {	
      
	  if(text_seribu.length >0) {
			document.getElementById("stasiun-1000").innerHTML = text_seribu;
	  }
	  else	{ 
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

