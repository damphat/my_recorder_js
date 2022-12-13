export class Recorder {
  private mediaRecorder: MediaRecorder | undefined;

  async start(): Promise<string> {
    var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);

    return new Promise((resolve, reject) => {
      this.mediaRecorder!.start();
      this.mediaRecorder!.ondataavailable = (ev) => {
        resolve(URL.createObjectURL(ev.data));
        stream.getTracks().forEach((t) => t.stop());
      };
      this.mediaRecorder!.onerror = (ev) => {
        reject(ev.target);
      };
    });
  }

  stop() {
    this.mediaRecorder?.stop();
  }
}
