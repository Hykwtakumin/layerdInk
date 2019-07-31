import chromep from "chrome-promise";
import Tab = chrome.tabs.Tab;
import {createSocketIOClient} from "./socket";

console.log("this is background script.");

const upload = async (data: any, fileName: string) => {
    const revivedBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    console.dir(revivedBlob);
    const formData = new FormData();
    formData.append(`file`, revivedBlob, `${fileName}.svg`);
    // const request = await fetch(
    //   `https://hyper-illust-creator.herokuapp.com/api/upload`,
    //   {
    //     method: "POST",
    //     body: formData,
    //     mode: "cors"
    //   }
    // );

    
    const request = await fetch(`https://hyper-illust-creator.herokuapp.com/api/postlayer`, {
      method: "POST",
      body: formData,
      mode: "cors"
    });
    const response = await request.json();
    console.dir(response);
    const activeTab = (await chromep.tabs.query({ active: true })) as Tab[];
    const targetId = activeTab[0].id;
    if (response && response.ok) {
      //pasteToClipBoard(response.url);
      chrome.tabs.sendMessage(targetId, {
        tag: "uploaded",
        body: response
      });
    } else {
      chrome.tabs.sendMessage(targetId, {
        tag: "uploadFailed",
        body: "upload is failed!"
      });
    }
  };

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const msg = message;

    if (msg.tag === "upload") {
        const blobUrl = msg.body;
        const xhr = new XMLHttpRequest();
    
        xhr.addEventListener("load", async () => {
          const blobBuffer = xhr.response;
          await upload(blobBuffer, msg.name);
          sendResponse();
        });
    
        xhr.open("GET", blobUrl);
        xhr.responseType = "arraybuffer";
        xhr.send();
    
        // const result = await upload(msg.body, msg.name);
        // console.dir(result);
      } else if (msg.tag === "getlayer") {
        //ここもよしなに書き換えていく
        const request = await fetch("https://hyper-illust-creator.herokuapp.com/api/getlayer/hykwtakumin.svg");
        const newLayer = await request.text();
        const response = {
          tag: "gotlayer",
          body: newLayer
        }
      }
  });

  createSocketIOClient(
    "https://hyper-illust-creator.herokuapp.com/",
    "scrapbox",
    "hykwtakumin",
    (message: string) => {
      console.log(message);
      if (message.includes("updated")) {
        console.info(`updated! : ${message}`);
      }
    }
  );