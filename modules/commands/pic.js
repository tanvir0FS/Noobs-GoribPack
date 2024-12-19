
module.exports.config = {

	name: "pic",
	version: "1.0.0",
	permission: 0,
	credits: "ryuko",
  premium: false,
	prefix: true,
	description: "search an image",
	category: "with prefix",
	usages: "searchimage [text]",
	cooldowns: 60,
	dependencies: {
		"axios":"",
		"fs-extra":"",
		"googlethis":"",
    "cloudscraper":""
	}
};




module.exports.run = async ({matches, event, api, extra, args}) => {
    
    const axios = global.nodemodule['axios'];
    const google = global.nodemodule["googlethis"];
const cloudscraper = global.nodemodule["cloudscraper"];
const fs = global.nodemodule["fs"];

var query = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
  //let query = args.join(" ");
  api.sendMessage(`FINDING: ${query}...`, event.threadID, event.messageID);
  
  let result = await google.image(query, {safe: false});
  if(result.length === 0) {
    api.sendMessage(`your image search did not return any result.`, event.threadID, event.messageID)
    return;
  }
  
  let streams = [];
  let counter = 0;
  
  console.log(result)
  
  for(let image of result) {
    // Only show 9 images
    if(counter >= 9)
      break;
      
    console.log(`${counter} : ${image.url}`);
    
    // Ignore urls that does not ends with .jpg or .png
    let url = image.url;
    if(!url.endsWith(".jpg") && !url.endsWith(".png"))
      continue;
    
   let path = __dirname + `/cache/search-image-${counter}.jpg`;
    let hasError = false;
    await cloudscraper.get({uri: url, encoding: null})
      .then((buffer) => fs.writeFileSync(path, buffer))
      .catch((error) => {
        console.log(error)
        hasError = true;
      });
      
    if(hasError)
      continue;
    
    console.log(`pushed to streams : ${path}`) ;
    streams.push(fs.createReadStream(path).on("end", async () => {
      if(fs.existsSync(path)) {
        fs.unlink(path, (err) => {
          if(err) return console.log(err);
            
          console.log(`deleted file : ${path}`);
        });
      }
    }));
    
    counter += 1;
  }
  
  api.sendMessage("[🤍] SENDING YOUR IMAGES...", event.threadID, event.messageID)
  
  let msg = {
    body: `[🤍] 𝘚𝘵𝘢𝘺 𝘞𝘪𝘵𝘩 𝘛𝘢𝘯𝘷𝘪𝘳 𝘉𝘰𝘵 🥀`,
    attachment: streams
  };
  
  api.sendMessage(msg, event.threadID, event.messageID);
};



  