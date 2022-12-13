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
      setBlobURLs([...blobURLs, await r.start()]);
    } catch (e) {
      alert(e);
    } finally {
      setRecorder(undefined);
    }
  }

  function stop() {
    recorder?.stop();
  }

  function remove(blob: string) {
    setBlobURLs(blobURLs.filter(t => t != blob));
  }

  return (
    <div>
      <div className="flex m-4 gap-4">
          <button className=" w-1/2 disabled:bg-gray-400 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={record} disabled={!!recorder}>
            Record
          </button>
          <button className="w-1/2 disabled:bg-gray-400 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={stop} disabled={!recorder}>
            Stop
          </button>
      </div>
      {recorder && <div className="h-12 w-full text-center m-4">recording</div>}
      <div className="flex flex-col-reverse">
        {blobURLs.map((blobURL, i) => (
          <div key={blobURL} className="flex m-4 justify-center items-center bg-orange-50">
            <div className="w-12 h-12 flex justify-center items-center">{i}</div>
            <audio className="w-full h-12" key={blobURL} src={blobURL} controls />
            <button className="w-12 h-12 bg-white hover:bg-blue" onClick={() => remove(blobURL)}>❌</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
