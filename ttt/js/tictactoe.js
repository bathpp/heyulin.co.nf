<script type="text/javascript">
	var dragid="";
	var timer;
	var send=1;
	var myimg=["x1","x2","x3","x4","x5","o1","o2","o3","o4","o5","tttboard"];
	function dragImgIdStart(event){	
		dragid = event.target.id;
		$('#'+dragid).css(
			{'-webkit-transition': 'All 0.0s ease',
  			'-moz-transition': 'All 0.0s ease',
  			'-o-transition': 'All 0.0s ease',
 			'-ms-transition': 'All 0.0s ease',
 			'transition': 'All 0.0s ease'});
	}
	function dragImgIdStop(event){	
		dragid = event.target.id;
			$('#'+dragid).css(
			{'-webkit-transition': 'All 0.2s ease',
  			'-moz-transition': 'All 0.2s ease',
  			'-o-transition': 'All 0.2s ease',
 			'-ms-transition': 'All 0.2s ease',
 			'transition': 'All 0.2s ease'});
	}

			
	function sendMongoStart(){
		if(send!=0){
			var xmlHttp=null;
			xmlHttp=GetXmlHttpObject();
		if (xmlHttp==null) {
			alert ("Browser does not support HTTP Request");
			return;
		}
		var url="ttt/e8set.php";
		url=url+"?imgstart=" + dragid;
		xmlHttp.open("GET",url,true); 
		xmlHttp.send(); 
		dragid="";
		}
	}
			
	function sendMongoStop(){
		var posx;
		var posy;
		if(send!=0){
			var xmlHttp=null;
			xmlHttp=GetXmlHttpObject();
		if (xmlHttp==null) {
			alert ("Browser does not support HTTP Request");
			return;
		}
		posx = $("#"+dragid).position().left;
		posy = $("#"+dragid).position().top;
			
		var url="ttt/e8set.php";
		url=url+"?imgstop=" + dragid + "&posx=" + posx + "&posy=" + posy;
		xmlHttp.open("GET",url,true); 
		xmlHttp.send(); 
		dragid="";
		}
	}
			
            
	function readworld(){
		var state;
		var xmlHttp=null;
		xmlHttp=GetXmlHttpObject();
		if (xmlHttp==null) {
			alert ("Browser does not support HTTP Request");
			return;
		}
		xmlHttp.onreadystatechange=function(){
			if (xmlHttp.readyState==4){
				state = xmlHttp.responseText;
				var worldstate = JSON.parse(state);
				for(var i=0; i<myimg.length; i++){
					imgid = myimg[i];
					x = worldstate[imgid][0];
					y = worldstate[imgid][1];
					dragable = worldstate[imgid][2];
					if(dragable==0){$("#"+imgid).draggable("disable");}
					if(dragable==1){				
						if(imgid!=dragid){
							$('#'+imgid).css({'left': x + 'px', 'top': y + 'px'});
							$("#"+imgid).draggable("enable");
						}
					}					
				}	
			}	
		}
		var url="ttt/e8get.php";
		//url=url+"?worldname=tictactoe";
		xmlHttp.open("GET",url,true); 
		xmlHttp.send();
	}

	function GetXmlHttpObject() {
		var xmlHttp=null;
		try {
	// Firefox, Opera 8.0+, Safari
			xmlHttp=new XMLHttpRequest();
		} catch (e) {
	//Internet Explorer
			try {
				xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e)  {
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
		}
		return xmlHttp;
	}

	function ol() {
		$('#world').height(500);
		$('#world').width(500);
		$('#world').css('position', 'absolute');
		$('#map').css('position', 'absolute');
		$("#world img").draggable({containment:"#world",scroll:false});
		$("#world img").on("dragstart", function(event) { dragImgIdStart(event); sendMongoStart();});
		$("#world img").on("dragstop" , function(event) { dragImgIdStop(event); sendMongoStop(); });	
		timer = setInterval('readworld();',100);
	}

</script>