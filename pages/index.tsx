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
    setBlobURLs(blobURLs.filter((t) => t != blob));
  }

  return (
    <div>
      <div className="m-4 flex gap-4">
        <button
          className=" w-1/2 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
          onClick={record}
          disabled={!!recorder}
        >
          Record
        </button>
        <button
          className="w-1/2 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
          onClick={stop}
          disabled={!recorder}
        >
          Stop
        </button>
      </div>
      {recorder && <div className="m-4 h-12 w-full text-center">recording</div>}
      <div className="flex flex-col-reverse">
        {blobURLs.map((blobURL, i) => (
          <div
            key={blobURL}
            className="m-4 flex items-center justify-center bg-orange-50"
          >
            <div className="flex h-12 w-12 items-center justify-center">
              {i}
            </div>
            <audio
              className="h-12 w-full"
              key={blobURL}
              src={blobURL}
              controls
            />
            <button
              className="hover:bg-blue h-12 w-12 bg-white"
              onClick={() => remove(blobURL)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
