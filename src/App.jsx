import { AssistantChat } from "./chat/components/AssistantChat";
import useChat from "./chat/hooks/useChat";
import useAssistant from "./chat/hooks/useAssistant";
import useOptions from "./chat/hooks/useOptions";
import { LineContext } from "./chat/contexts/LineContext";
import "./App.scss";
import { useState } from "react";

function App() {
  // const [count, setCount] = useState(0)

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
  //       <p>Hello Vite + React!</p>
  //       <p>
  //         <button type="button" onClick={() => setCount((count) => count + 1)}>
  //           count is: {count}
  //         </button>
  //       </p>
  //       <p>
  //         Edit <code>App.jsx</code> and save to test HMR updates.
  //       </p>
  //       <p>
  //         <a
  //           className="App-link"
  //           href="https://reactjs.org"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           Learn React
  //         </a>
  //         {' | '}
  //         <a
  //           className="App-link"
  //           href="https://vitejs.dev/guide/features.html"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           Vite Docs
  //         </a>
  //       </p>
  //     </header>
  //   </div>
  // )
  const [refLines, setRefLines] = useState(["日本語難しいね"])
  // const exampleRefLines = ["日本語難しいね"];

  const {
    chat,
    setChat,
    ref: chatScrollRef,
    onComplete,
  } = useChat(refLines);
  const options = useOptions(refLines, chat, setChat);
  const { isLoading, error } = useAssistant(chat, setChat);

  return (
    <LineContext.Provider value={{ refLines, setRefLines }}>
      <div className="wrapperWrapper">
        <div className="chatWrapper">
          <AssistantChat
            options={options}
            chat={chat}
            setChat={setChat}
            scrollRef={chatScrollRef}
            onComplete={onComplete}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </LineContext.Provider>
  );
}

export default App;
