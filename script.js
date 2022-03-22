'use strict';

var videoElement = document.querySelector('video');
var height =  {min: 720, ideal: 1080, max: 1440}
var width =  {min: 1280, ideal: 1920, max: 2560}
var videoSelect = document.querySelector('select#videoSource');

let overlay = document.getElementById("card-overlayer")
videoSelect.onchange = getStream;

getStream().then(getDevices).then(gotDevices);

function getDevices() {
  // AFAICT in Safari this only gets default devices until gUM is called :/
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  window.deviceInfos = deviceInfos; // make available to console
  console.log('Available input and output devices:', deviceInfos);
  for (const deviceInfo of deviceInfos) {
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
   if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    }
  }
}

function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const videoSource = videoSelect.value;
  const constraints = {
    video: { deviceId: videoSource ? { exact: videoSource } : undefined }
  };
  // console.log(constraints);
  let x = JSON.stringify(constraints);
  document.getElementsByClassName("noti")[0].textContent = x
  return navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoSelect.selectedIndex = [...videoSelect.options].
    findIndex(option => option.text === stream.getVideoTracks()[0].label);
  videoElement.srcObject = stream;
  videoElement.addEventListener('loadedmetadata', function(e){
  console.log(videoElement.videoWidth, videoElement.videoHeight);
  console.log(overlay)
  overlay.style.width = videoElement.videoWidth + "px";
  overlay.style.height = videoElement.videoHeight + "px";
  if(isMobile) {
  videoElement.style.height = "250px"
  videoElement.style.width = "333px"
  overlay.style.height = 250 + "px";
  overlay.style.width = 333 + "px";

  }
});
}

function handleError(error) {
  console.error('Error: ', error);
}
