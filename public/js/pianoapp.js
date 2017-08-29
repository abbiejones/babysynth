audioContext = new (window.AudioContext || window.webkitAudioContext);

let masterGainNode = null;
let biquadFilter = 0;
var noteFreq = {};
var mediaRecorder = 0;
var record = document.querySelector("#play");
var stopRecord = document.querySelector("#stop");
var soundClips = document.querySelector(".soundclips");

function setup(){
	masterGainNode = audioContext.createGain();
    biquadFilter = audioContext.createBiquadFilter();
    biquadFilter.type = "lowshelf";
    biquadFilter.frequency.value = 1000;
    biquadFilter.gain.value = 50;
    biquadFilter.connect(masterGainNode);
    masterGainNode.connect(audioContext.destination);
  	masterGainNode.gain.value = 0.5;
    stopRecord.disabled = true;
}

setup();

if (navigator.mediaDevices.getUserMedia){
    console.log('getUserMedia supported');
	
	var recordedChunks = [];
    var constraints = {audio:true};

    var onSuccess = function(stream){
        console.log("in on success");
        var mediaRecorder = new MediaRecorder(stream);

        record.onclick = function(){
            mediaRecorder.start();
            console.log("recording started");
            stopRecord.style.background = "#333"; 
            stopRecord.style.border = "#333"; 
            record.style.background = "green"; 
            record.style.border = "green";
            stopRecord.disabled = false;
            record.disabled = true;
        }

        stopRecord.onclick = function(){
            mediaRecorder.stop();
            console.log("recording stopped");
            stopRecord.style.background = "red";
            stopRecord.style.border = "red";
            record.style.background = "#333";
            record.style.border = "#333";
            stopRecord.disabled = true;
            record.disabled = false;
        }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      var recordingName = prompt('Enter a name for your recording','My unnamed clip');
      console.log(recordingName);
      var recordingBody = document.createElement('article');
      var recordingLabel = document.createElement('p');
      var audio = document.createElement('audio');
      var deleteButton = document.createElement('button');
     
      recordingBody.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if(recordingName === null) {
        recordingLabel.textContent = 'My unnamed clip';
      } else {
        recordingLabel.textContent = recordingName;
      }

      recordingBody.appendChild(audio);
      recordingBody.appendChild(recordingLabel);
      recordingBody.appendChild(deleteButton);
      soundClips.appendChild(recordingBody);

      audio.controls = true;
      var blob = new Blob(recordedChunks, {'type' : 'audio/wav'});
      //var blob = new Blob(recordedChunks, { 'type' : 'audio/ogg; codecs=opus' });
      recordedChunks = [];
      var audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped\n");
      console.log(audioURL);
      
      /* 
      var fd = new FormData();
      fd.append('name', recordingName);
      fd.append('data', blob);

      $.ajax({
        type:"POST",
        url: "/piano",
        data: {
            fd,
            processData:false,
            contentType: false,
            dataType: "script"
        }
      }).done(function(o){
        console.log(o);
      });
      */

      deleteButton.onclick = function(e) {
        evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      recordingLabel.onclick = function() {
        var existingName = recordingLabel.textContent;
        var newClipName = prompt('Enter a new name for your sound clip?');
        if(newClipName === null) {
          recordingLabel.textContent = existingName;
        } else {
          recordingLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      recordedChunks.push(e.data);
    }
  }

  var onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
} else {
   console.log('getUserMedia not supported on your browser!');
}

/*
var audioCtx = new AudioContext();
var source = audioCtx.createMediaStreamSource(stream);
var processor = context.createScriptProcessor(1024,1,1); 

source.connect(processor);
processor.connect(context.destination);

//var biquadFilter = audioCtx.createBiquadFilter();
//biquadFilter.type = "lowshelf";
//biquadFilter.frequency.value = 1000;
//biquadFilter.gain.value = 10;

//source.connect(biquadFilter);
//biquadFilter.connect(audioCtx.destination);
source.connect(audioCtx.destination);
*/

$('#ex1').slider({
        formatter: function(value) {
            masterGainNode.gain.value = value;
            return 'Current value: ' + value;
        }
    });
	
var noteFreq = {
	C:523.251130601197269,
	Csharp:554.365261953744192,
	D:587.329535834815120,
	Dsharp:622.253967444161821,
	E:659.255113825739859,
	F: 698.456462866007768,
	Fsharp:739.988845423268797,
	G:783.990871963498588,
	Gsharp:830.609395159890277,
	A:880.000000000000000,
	Asharp:932.327523036179832,
	B:987.766602512248223,
	Coctave:1046.502261202394538
};

var oscList = [];

for (var i = 0; i < 13; ++i){
	oscList[i] = null; 
}

function playTone(freq){
	let osc = audioContext.createOscillator();
	osc.connect(biquadFilter);
	osc.frequency.value = freq;	
    osc.type = "sawtooth";
	osc.start();

	return osc;
}

function stopTone(oscNum){
	oscList[oscNum].stop();
}

function changeVolume(event){
	masterGainNode.gain.value = volumeControl.value;
}

    $(".library").click(function(event){
        $.get("library.html", function(data){
            $("body").html(data);
        });
            
    });

    $(document).on('keydown',function(event){
        var note = event.which;
        switch(note){
            case 65:
                $('#4').addClass('pressedWhite');
                oscList[0] = playTone(noteFreq.C);		
                break;
            case 87:
                $('.cs').addClass('pressedBlack');
                oscList[1] = playTone(noteFreq.Csharp);
                break;
            case 83:
                $('.d').addClass('pressedWhite');
                oscList[2] = playTone(noteFreq.D);
                break;
            case 69:
                $('.ds').addClass('pressedBlack');
                oscList[3] = playTone(noteFreq.Dsharp);
                break;
            case 68:
                $('.e').addClass('pressedWhite');
                oscList[4] = playTone(noteFreq.E);
                break;
            case 70:
                $('.f').addClass('pressedWhite');
                oscList[5] = playTone(noteFreq.F);
                break;
            case 84:
                $('.fs').addClass('pressedBlack');
                oscList[6] = playTone(noteFreq.Fsharp);
                break;
            case 71:
                $('.g').addClass('pressedWhite');
                oscList[7] = playTone(noteFreq.G);
                break;
            case 89:
                $('.gs').addClass('pressedBlack');
                oscList[8] = playTone(noteFreq.Gsharp);
                break;
            case 72:
                $('.a').addClass('pressedWhite');
                oscList[9] = playTone(noteFreq.A);
                break;
            case 85:
                $('.as').addClass('pressedBlack');
                oscList[10] = playTone(noteFreq.Asharp);
                break;

            case 74:
                $('.b').addClass('pressedWhite');
                oscList[11] = playTone(noteFreq.B);
                break;
            case 75:
                $('#5').addClass('pressedWhite');
                oscList[12] = playTone(noteFreq.Coctave);
                break;
        }
    });

    $(document).keyup(function(event){
        var note = event.which;
        switch(note){
            case 65:
                $('#4').removeClass('pressedWhite');
                stopTone(0);
                break;
            case 87:
                $('.cs').removeClass('pressedBlack');
                stopTone(1);
                break;
            case 83:
                $('.d').removeClass('pressedWhite');
                stopTone(2);
                break;
            case 69:
                $('.ds').removeClass('pressedBlack');
                stopTone(3);
                break;
            case 68:
                $('.e').removeClass('pressedWhite');
                stopTone(4);
                break;
            case 70:
                $('.f').removeClass('pressedWhite');
                stopTone(5);
                break;
            case 84:
                $('.fs').removeClass('pressedBlack');
                stopTone(6);
                break;
            case 71:
                $('.g').removeClass('pressedWhite');
                stopTone(7);
                break;
            case 89:
                $('.gs').removeClass('pressedBlack');
                stopTone(8);
                break;
            case 72:
                $('.a').removeClass('pressedWhite');
                stopTone(9);
                break;
            case 85:
                $('.as').removeClass('pressedBlack');
                stopTone(10);
                break;
            case 74:
                $('.b').removeClass('pressedWhite');
                stopTone(11);
                break;
            case 75:
                $('#5').removeClass('pressedWhite');
                stopTone(12);
                break;
        }

})
