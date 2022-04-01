const webcamElement = document.getElementById("webcam");
const canvasElement = document.getElementById("canvas");
const snapSoundElement = document.getElementById("snapSound");
const btn = document.getElementById("openCamera");
let takeSnap = document.getElementById("take-snap");
let cameraList = document.getElementById("camera-list");
let picture;
let newUser = "user";
const webcam = new Webcam(
  webcamElement,
  { newUser },
  canvasElement,
  snapSoundElement
);

console.log(webcam);

//onclick on oencamera

btn.addEventListener("click", initial, false);
function initial() {
  // if (select.value === '') {
  //   videoConstraints.facingMode = 'environment';
  // } else {
  //   videoConstraints.deviceId = { exact: select.value };
  // }
  // console.log("click");
  if (btn.innerHTML == "close camera") {
    stopCamera();
    btn.innerHTML = "open camera";
    cameraList.appendChild("");
  } else if (btn.innerHTML == "open camera") {
    startCamera();
    console.log("camera is started");
  } else {
    console.log("not found");
  }
}

//start camera fucntion
function startCamera() {
  console.log("click");
  webcam
    .start()
    .then((result) => {
      console.log("webcam started");
    })
    .catch((err) => {
      console.log(err);
    });
  btn.innerHTML = "close camera";

  takeSnap.style.color = "red";
  takeSnap.style.opacity = "1";
  webcamElement.style.opacity = "1";
  cameraList.style.display = "block";
  genarate();
  cameraList.appendChild("");
}

//to stop the camera

function stopCamera() {
  webcam.stop();
  webcamElement.style.display = "none";
  cameraList.style.display = "none";
  console.log("stop");
  webcamElement.style.opacity = "0";
  takeSnap.style.color = "#33333";
  takeSnap.style.opacity = "0";
}

//to take the picture
function takePicture() {
  picture = webcam.snap();

  console.log(picture);
  stopCamera();
  btn.style.display = "none";
  takeSnap.style.display = "none";
}

//to get the camera list
// console.log(navigator.mediaDevices.enumerateDevices());

let labels = [];
navigator.mediaDevices
  .enumerateDevices()
  .then(function (devices) {
    devices.forEach(function (device) {
      if (device.kind == "videoinput") {
        console.log(
          device.kind +
            ": " +
            device.label +
            " id = " +
            device.deviceId +
            " group id = " +
            device.groupId
        );
        webcam.webcamList.push(device.deviceId);
        labels.push(device.label);
        console.log(labels, webcam.webcamList);
      }
    });
  })
  .catch(function (err) {
    console.log(err.name + ": " + err.message);
  });
const genarate = () => {
  var select = document.createElement("select");
  select.name = "camera lists";
  select.id = "camera";
  console.log(labels);
  let count = 0;
  labels.forEach((val) => {
    var option = document.createElement("option");
    option.value = val != "" ? val : "camera " + count;
    option.text = val != "" ? val : "camera " + count;
    select.appendChild(option);
  });
  var label = document.createElement("label");
  label.innerHTML = "Choose your camera: ";
  label.htmlFor = "camera";
  cameraList.appendChild(label).appendChild(select);
};

//collect the data
let fname = document.getElementById("fname");
let lname = document.getElementById("lname");
let number = document.getElementById("number");

function handleSubmit() {
  // e.preventDefault();
  console.log("First Name : "+ fname.value);
  console.log("Last Name : "+ lname.value);
  console.log("Contact  Number : "+ number.value);
  console.log("image:"+ picture);
  fname.value = "";
  lname.value = "";
  number.value = "";
  picture = "";
}
