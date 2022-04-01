class Webcam {
  constructor(e, t = "user", s = null, i = null) {
    (this._webcamElement = e),
      (this._webcamElement.width = this._webcamElement.width || 640),
      (this._webcamElement.height =
        this._webcamElement.height || 0.75 * this._webcamElement.width),
      (this._facingMode = t),
      (this._webcamList = []),
      (this._streamList = []),
      (this._selectedDeviceId = ""),
      (this._canvasElement = s),
      (this._snapSoundElement = i);
  }
  get facingMode() {
    return this._facingMode;
  }
  set facingMode(e) {
    this._facingMode = e;
  }
  get webcamList() {
    return this._webcamList;
  }
  get webcamCount() {
    return this._webcamList.length;
  }
  get selectedDeviceId() {
    return this._selectedDeviceId;
  }
  getVideoInputs(e) {
    return (
      (this._webcamList = []),
      e.forEach((e) => {
        "videoinput" === e.kind && this._webcamList.push(e);
      }),
      1 == this._webcamList.length && (this._facingMode = "user"),
      this._webcamList
      
    );
  }
  getMediaConstraints() {
    var e = {};
    return (
      "" == this._selectedDeviceId
        ? (e.facingMode = this._facingMode)
        : (e.deviceId = { exact: this._selectedDeviceId }),
      { video: e, audio: !1 }
    );
  }
  selectCamera() {
    for (let e of this._webcamList)
      if (
        ("user" == this._facingMode &&
          e.label.toLowerCase().includes("front")) ||
        ("enviroment" == this._facingMode &&
          e.label.toLowerCase().includes("back"))
      ) {
        this._selectedDeviceId = e.deviceId;
        break;
      }
  }
  flip() {
    (this._facingMode = "user" == this._facingMode ? "enviroment" : "user"),
      (this._webcamElement.style.transform = ""),
      this.selectCamera();
  }
  async start(e = !0) {
    return new Promise((t, s) => {
      this.stop(),
        navigator.mediaDevices
          .getUserMedia(this.getMediaConstraints())
          .then((i) => {
            this._streamList.push(i),
              this.info()
                .then((i) => {
                  this.selectCamera(),
                    e
                      ? this.stream()
                          .then((e) => {
                            t(this._facingMode);
                          })
                          .catch((e) => {
                            s(e);
                          })
                      : t(this._selectedDeviceId);
                })
                .catch((e) => {
                  s(e);
                });
          })
          .catch((e) => {
            s(e);
          });
    });
  }
  async info() {
    return new Promise((e, t) => {
      navigator.mediaDevices
        .enumerateDevices()
        .then((t) => {
          this.getVideoInputs(t), e(this._webcamList);
        })
        .catch((e) => {
          t(e);
        });
    });
  }
  async stream() {
    return new Promise((e, t) => {
      navigator.mediaDevices
        .getUserMedia(this.getMediaConstraints())
        .then((t) => {
          this._streamList.push(t),
            (this._webcamElement.srcObject = t),
            "user" == this._facingMode &&
              (this._webcamElement.style.transform = "scale(-1,1)"),
            this._webcamElement.play(),
            e(this._facingMode);
        })
        .catch((e) => {
          console.log(e), t(e);
        });
    });
  }
  stop() {
    this._streamList.forEach((e) => {
      e.getTracks().forEach((e) => {
        e.stop();
      });
    });
  }
  snap() {
    if (null != this._canvasElement) {
      null != this._snapSoundElement && this._snapSoundElement.play(),
        (this._canvasElement.height = this._webcamElement.scrollHeight),
        (this._canvasElement.width = this._webcamElement.scrollWidth);
      let e = this._canvasElement.getContext("2d");
      return (
        "user" == this._facingMode &&
          (e.translate(this._canvasElement.width, 0), e.scale(-1, 1)),
        e.clearRect(
          0,
          0,
          this._canvasElement.width,
          this._canvasElement.height
        ),
        e.drawImage(
          this._webcamElement,
          0,
          0,
          this._canvasElement.width,
          this._canvasElement.height
        ),
        this._canvasElement.toDataURL("image/png")
      );
    }
    throw "canvas element is missing";
  }
}
