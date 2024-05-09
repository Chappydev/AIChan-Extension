import { getChatResponse } from "../utility/chatFunctions";
import useSWRImmutable from "swr/immutable";
import { useEffect, useState } from "react";

const useAssistant = (chat, setChat) => {
  let [type, setType] = useState(undefined);
  let [content, setContent] = useState(undefined);
  let [waiting, setWaiting] = useState(undefined);

  useEffect(() => {
    const lastMsg = chat.at(-1);

    console.log(lastMsg);
    if (lastMsg && lastMsg.role === "user") {
      console.log("lastMsg is user");
      // type = lastMsg.type;
      setType(lastMsg.type);
      setContent(lastMsg.type === "custom"
        ? chat.filter((msg) => msg.raw).map((msg) => msg.raw)
        : lastMsg.raw.content);
      setWaiting(lastMsg.waiting);
    }
  }, [chat]);

  // custom condition only for testing purposes
  const shouldFetch =
    // type &&
    type &&
    content &&
    !waiting &&
    // (type === "custom"
    (type === "custom"
      ? !content[content.length - 1].content.startsWith("//")
      : true);

  console.log(shouldFetch);
  console.log(type, content, waiting, type, type === "custom"
    ? !content[content.length - 1].content.startsWith("//")
    : null);

  const response = useSWRImmutable(
    shouldFetch ? [`/api/ai/${type}`, content] : null,
    getChatResponse,
    {
      errorRetryCount: 2,
    }
  );
  console.log(response);

  useEffect(() => {
    if (response.data) {
      const { data } = response;
      const newChat = {
        content: data.content,
        role: data.role,
        type: chat[chat.length - 1],
        raw: data,
      };
      setChat([...chat, newChat]);
    }
    // eslint-disable-next-line
  }, [response.data]);

  return response;
};

export default useAssistant;
