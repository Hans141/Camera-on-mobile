feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
const message = document.getElementById("messageError")
let streamStarted = false;

const [play, pause, screenshot] = buttons;

const constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
  }
};

cameraOptions.onchange = () => {
  console.log('run on change')
  const updatedConstraints = {
    ...constraints,
    deviceId: cameraOptions.value
  };
  console.log('updatedConstraints', updatedConstraints)
  startStream(updatedConstraints);
};

play.onclick = () => {
  if (streamStarted) {
    video.play();
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    return;
  }
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: cameraOptions.value
      }
    };
    startStream(updatedConstraints);
  }
};

const pauseStream = () => {
  video.pause();
  play.classList.remove('d-none');
  pause.classList.add('d-none');
};

const doScreenshot = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  screenshotImage.src = canvas.toDataURL('image/webp');
  screenshotImage.classList.remove('d-none');
};

pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;

const startStream = async (constraints) => {
  try {
    // console.log('constraints', constraints)
    console.log('cameraOptions.value', cameraOptions.value)
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: cameraOptions.value
      }
    });
    handleStream(stream);
  } catch (error) {
    message.textContent = error
  }
};


const handleStream = (stream) => {
  console.log('stream', stream)
  video.srcObject = stream;
  play.classList.add('d-none');
  pause.classList.remove('d-none');
  screenshot.classList.remove('d-none');

};

// navigator.mediaDevices.addEventListener("devicechange", event => {
//   console.log('first', first)
// })
const getCameraSelection = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    console.log('videoDevices', videoDevices)
    let x = videoDevices.length;
    let y = videoDevices[0].label;
    let z = videoDevices[1].label;
    message.textContent = x + "  " + y + "  " + z
    const options = videoDevices.map(videoDevice => {
      return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
    cameraOptions.innerHTML = options.join('');
  } catch (error) {
    message.textContent = error
  }
};

getCameraSelection();