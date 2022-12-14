import { useState } from "react";
import { Recorder } from "../utils/Recorder";
import { RecordButton } from "../components/buttons";

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
    <div className="container max-w-md m-auto">
      <div className="m-4 flex gap-4 items-center justify-center">
        <RecordButton
          onClick={record}
          disabled={!!recorder}
        />
        <button
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
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
