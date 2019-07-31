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
        const fileName = message.split(" ")[5];
        if (fileName) {
          sendNewLayer(fileName);
        } else {
          console.log("something went wrong!");
        }
      }
    }
  );


  //更新通知を受けて他のLayerを取りに行く関数
  export const sendNewLayer = async (fileName: string) => {
    // console.log(`fileName: ${fileName}`);
    const request = await fetch(`https://hyper-illust-creator.herokuapp.com/api/getlayer/${fileName}`,{
      method: "GET",
      mode: "cors"
    });
    const newLayer = await request.text();

    //console.dir(newLayer);

    const activeTab = (await chromep.tabs.query({ active: true })) as Tab[];
    const targetId = activeTab[0].id;
    chrome.tabs.sendMessage(targetId, {
      tag: "gotLayer",
      body: {
        svg: newLayer,
        name: fileName
      }
    });
  }

//拡張のアイコンを押すとキャンバスがクリアされる
chrome.browserAction.onClicked.addListener(async tab => {
  console.log("clearButton is Clicked!");
  const activeTab = (await chromep.tabs.query({ active: true })) as Tab[];
  const targetId = activeTab[0].id;
  chrome.tabs.sendMessage(targetId, {
    tag: "clearCanvas",
    body: ""
  });
});