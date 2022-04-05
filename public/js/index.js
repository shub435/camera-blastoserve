const webcamElement = document.getElementById("webcam");
const canvasElement = document.getElementById("canvas");
const snapSoundElement = document.getElementById("snapSound");
const btn = document.getElementById("openCamera");
let takeSnap = document.getElementById("take-snap");
let cameraList = document.getElementById("camera-list");
let img = document.querySelector("#download-photo");
let tryAgainId = document.getElementById("try-again");
let newUser = "user";
const webcam = new Webcam(
  webcamElement,
  { newUser },
  canvasElement,
  snapSoundElement
);

//onclick on oencamera

btn.addEventListener("click", initial, false);
function initial() {
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

//to get the camera list
// console.log(navigator.mediaDevices.enumerateDevices());
var label = document.createElement("label");

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
        // webcam.webcamList.push(device.deviceId);
        labels.push(device.label);
        console.log(labels);
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
  label.innerHTML = "Choose your camera: ";
  label.htmlFor = "camera";

  cameraList.appendChild(label).appendChild(select);
};

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
  takeSnap.style.display = "block";
  webcamElement.style.opacity = "1";
  webcamElement.style.display = "block";
  cameraList.style.display = "block";
  genarate();
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
  cameraList.removeChild(label);
}

const link = document.getElementById("download_image");
//to take the picture

takeSnap.addEventListener(
  "click",
  function takePicture() {
    var picture = webcam.snap(function (datauri) {
      console.log(datauri);
    });

    link.style.display = "flex";
    tryAgainId.style.display = "flex";
    img.style.opacity = "1";
    img.src = picture;
    link.href = img.src;
    var block = picture.split(";");
    // Get the content type of the image
    var contentType = block[0].split(":")[1]; // In this case "image/png"
    // get the real base64 content of the file
    var realData = block[1].split(",")[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."

    // Convert it to a blob to upload
    var Image = b64toImage(realData, contentType);
    console.log(Image);
    img.value = `image_${Image.size}  ${Image.type} `;

    canvasElement.style.display = "block";

    // document.querySelector("#download-photo").href = picture;
    stopCamera();

    // img.value = `${picture}.png`;
    console.log("img", img.value);
    btn.style.display = "none";
    takeSnap.style.display = "none";
  },
  false
);

//convert image string into image
function b64toImage(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
//collect the data

let fname = document.getElementById("fname");
let lname = document.getElementById("lname");
let number = document.getElementById("number");
let submitButton = document.querySelector(".submit-btn");

const formSubmit = document.getElementById("form_submit");
formSubmit.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    console.log("clicked");

    var blob = new Blob(
      [
        `
  'First Name': ${fname.value}
  'Last Name': ${lname.value}
  'Mobile Number': ${number.value}
  `,
      ],
      { type: "text/plain;charset=utf-8" }
    );
    saveAs(blob, "patient-details.txt");

    fname.value = "";
    lname.value = "";

    number.value = "";
    picture = "";
    // img.value = "";
    canvasElement.style.display = "none";
    btn.style.display = "block";
    btn.innerHTML = "open camera";
    // alert("data saved successfully");
  },
  false
);

//try again

function tryAgain() {
  startCamera();
  img.style.opacity = "0";
  link.style.display = "none";
  tryAgainId.style.display = "none";
}
