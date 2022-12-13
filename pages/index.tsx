import { useState } from "react";

class Recorder {
  private mediaRecorder: MediaRecorder | undefined;

  async start(): Promise<string> {
    var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);

    return new Promise((resolve, reject) => {
      this.mediaRecorder!.start();
      this.mediaRecorder!.ondataavailable = (ev) => {
        resolve(URL.createObjectURL(ev.data));
        stream.getTracks().forEach(t => t.stop());
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

const Home = () => {
  const [recorder, setRecorder] = useState<Recorder>();
  const [blobURLs, setBlobURLs] = useState<string[]>([]);

  async function record() {
    try {
      const r = new Recorder();
      setRecorder(r);
      setBlobURLs([await r.start(), ...blobURLs]);
    } catch (e) {
      alert(e);
    } finally {
      setRecorder(undefined);
    }
  }

  function stop() {
    recorder?.stop();
  }

  return (
    <div>
      <div className="p-8">
        <div className="btn-group">
          <button className="btn" onClick={record} disabled={!!recorder}>
            Start
          </button>
          <button className="btn" onClick={stop} disabled={!recorder}>
            Stop
          </button>
        </div>
      </div>
      <center className="p-8">
        {blobURLs.map((blobURL) => (
          <audio key={blobURL} src={blobURL} controls />
        ))}
      </center>
    </div>
  );
};

export default Home;
