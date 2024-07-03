
/*
* process.js*
* By Gagan Bhardwaj, e-sign: Y29weXJpZ2h0IEBHYWdhbiBiaGFyZHdhag==
*
*/



/*function enterUserBox(input1,strResp){
	
input1.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();

if (input1.value.trim().length<1) 
		{
			 
			alert("Please enter any response for User.");
			input1.value = "";
			input1.focus();
		}  
		else {
			  strResp+=User_log();
	}
  }
});
 return strResp;
}


function enterAgentBox(input2){

input2.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();

if (input2.value.trim().length<1) 
		{
			alert("Please enter any response for Bot.");
			input2.value = '';
			input2.focus();
		}  
		else {
				return Agent_log();
			}	
     }
 });

}
*/
//const obj = JSON.parse('{"name":"John", "age":30, "city":"New York"}');

//import { getTTS } from "/js/tts.js";


var strResp="";

 function processJSON(tts){
	//alert("local")
	
	 var JString = document.getElementById("userText").value;
	 clearPrev(sect)
	 
	
	 

	 //alert(JString.search("Request\":"));
     var arrRequest=[];
	 arrRequest=JString.match(/Request":/g)
	  if(arrRequest!=null)
	    {
			for (var i=0;i<arrRequest.length;i++){
		
				var reqStart=JString.search("Request\":")
				var respStart=JString.search("Response\":")
				
				var requestpart=JString.substring(0,parseInt(reqStart))
				var responsepart=JString.substring(parseInt(respStart),JString.length)
				
				requestpart=requestpart+"Req\":\"\",";
				//alert(requestpart)
				
					// alert(responsepart)
					
					var GotoNextStart=responsepart.search("\"GotoNext\":");
					var GotoNextpart =responsepart.substring(parseInt(GotoNextStart),responsepart.length);
					
					
						
				JString=requestpart+GotoNextpart
				//alert(JString)
			
			}	
		}
		
		
		   const obj = JSON.parse(JString);
		  		  
		
		
		   
		  for (const key in obj)
		  {
			  if(typeof obj[key]=="object")
			     {
				   if(obj[key]["Element"].search("_PP")>-1)
				   IVR_log(processPlayPrompt(obj[key],tts)) 
				   else if(obj[key]["Element"].search("_DM")>-1)
				     {
						
						if(obj[key]["Element"].search("MOL0130")>-1) 
						    { 
						      IVR_log(tts["MOL0130_ini_01"]); 
							  Caller_log(obj[key]["MOL0130_LangSel_DM_Result"]) 
					        }
						else if(obj[key]["Element"].search("MOL0210")>-1)
						    {IVR_log(tts["MOL0210_ini_01"]); 
							Caller_log(obj[key]["MOL0210_BHCrisis_DM_Result"].substring(0,1))					
						}		
						else { 						 
				       
							var inputMode='';
							if(obj[key]["OutParams"]["InputMode"]===undefined)
								{  
									if(parseInt(obj[key]["OutParams"]["LastCollectionConfidence"])==100)
									inputMode="DTMF"
									else
									inputMode="Speech"
								}
							else
							inputMode=obj[key]["OutParams"]["InputMode"]

							processDialogModule(obj[key],tts,inputMode) 	  
						} 
					}		
				 }
				
		  }
	 
	
	   if(obj["DisconnectedAtElement"].search("GenesysProviderRouting")>-1 || obj["DisconnectedAtElement"].search("GenesysMemberRouting")>-1)
	     {  var strExit="Initiated "+obj["DestinationType"] + " transfer to "+obj["Destination"]
	        exit_log(strExit)
		 }
	   else if(obj["DisconnectedAtElement"].search("_DM")>-1)
	   {
		var strExit="Disconnected while entering the input at "+obj["DisconnectedAtElement"] 
	        exit_log(strExit)

	   }

	   else if(obj["DisconnectedAtElement"].search("_PP")>-1)
	   {
		var strExit="Disconnected while playing the prompt at "+obj["DisconnectedAtElement"] 
	        exit_log(strExit)

	   }

	}

	


function processPlayPrompt(objPP,tts)
{


	var arrAudioToPlay= objPP["AudioToPlay"].split("->");
	var ttsToPrint='';

	for (key in arrAudioToPlay)
	{


  	if (tts[arrAudioToPlay[key]]===undefined)
	  ttsToPrint+= arrAudioToPlay[key];
	else
	  ttsToPrint+=tts[arrAudioToPlay[key]];
	  ttsToPrint+=".";
	} 
	
	return ttsToPrint;
}


function processDialogModule(objDM,tts,inputMode)
{
	//alert(inputMode)

	var elementName=objDM["Element"]
	var result=objDM[elementName+"_Result"]
	
	if (tts[objDM["InParams"]["InitialPrompt"]]===undefined)
	  IVR_log(objDM["InParams"]["InitialPrompt"]) 
  else
      IVR_log(tts[objDM["InParams"]["InitialPrompt"]]) 
    
if (tts[result]===undefined)
      Caller_log(result+" ("+inputMode+")") 	 
  else
      Caller_log(tts[result]+" ("+inputMode+")") 	 
		  	
      	
	  
	
	
}

function Caller_log(value) { 
var strRemove="";
	         
			 var A = document.createElement('p');
		       A.innerHTML =    "<font face = \"Verdana\" size = \"2\" color=\"#FFA500\" style=\"bold\"><b>Caller:</b> </font>" + "<font face = \"Verdana\" size = \"2\" >"+value + "</font>";
			  document.getElementById("sect").appendChild(A); 
				A.align="left"
				A.style="background-color:#E5E4E2;"
				strResp+="Caller: "+value+"\n"
					 
   }	
	
function IVR_log(value) {
			 
				
			  var U = document.createElement('p');
			  U.innerHTML =    "<font face = \"Verdana\" size = \"2\" color=\"#0000A5\"> <b>IVR:</b> </font>" +  "<font face = \"Verdana\" size = \"2\" >"+value+ "</font>";
   		      document.getElementById("sect").appendChild(U); 
			  U.align="left"
			
			   strResp+="IVR: "+value+"\n"
            
			
			
       }

 function exit_log(value) { 
		var strRemove="";
					
					 var A = document.createElement('p');
					   A.innerHTML =    "<b> <font face = \"Verdana\" size = \"2\" color=\"red\">"+value + "</font></b>";
					  document.getElementById("sect").appendChild(A); 
						A.align="left"
					
						strResp+=value+"\n"
							 
		   }	
			

function delbutton(sect,row,strRemove)
{
	            var D = document.createElement('button');
				 
				//D.innerHTML = 'click me';
				D.style = "background: url(img/delred.png); background-size: cover; padding: 8px; border: 0; float: right;";		
											
				sect.appendChild(D);
				D.onclick = function(){	
				//alert(sect.previousElementSibling.tagName)

				sect.removeChild(row);
				clearPrev(sect)	

				strRemove=strRemove.replace(/(\n)/g, "");
				strResp=strResp.replace(strRemove, "");
			};
	
  return strResp;		

}

function clearPrev(sect)
{

  var c = sect.children;
  var txt = "";
  var i;
  for (i = 0; i < c.length; i++) {

	
     if(c[i].tagName=="P")  
	 {
	   c[i].innerHTML=""		
	 }
	
  }



	//sect.removeChild(D);
	
}

function exp(){


var content=strResp;

// any kind of extension (.txt,.cpp,.cs,.bat)
var filename = "Chat_"+getFormattedTime()+".txt";

var blob = new Blob([content], {
 type: "text/plain;charset=utf-8"
});

if(strResp=="")
	alert("No Content to export!");
else
saveAs(blob, filename);
}

function getFormattedTime() {
    var today = new Date();
    var y = today.getFullYear();
    // JavaScript months are 0-based.
    var m = today.getMonth() + 1;
    var d = today.getDate();
    var h = today.getHours();
    var mi = today.getMinutes();
    var s = today.getSeconds();
    return y + m.toString() + d.toString() + "-" + h + mi + s;
}

function clr(input,input2)
{
 	input.innerHTML="";
	input2.value="start again.."
	input2.focus();
	strResp=""	
}

