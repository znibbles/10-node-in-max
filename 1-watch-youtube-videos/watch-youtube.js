const maxApi = require("max-api");
const ytdl = require('ytdl-core');

maxApi.addHandler("open", (url) => {
	// const url = `${BASE_URL}breed/${name}/images/random`;
	// request(url).then((data) => {
	// 	if (data.status === "success") {
	// 		maxApi.outlet("dog", data.message);
	// 	} else {
	// 		maxApi.post("Error fetching dog image: " + data.message);
	// 	}
  // });
  
  ytdl.getInfo(url)
    .then(info => {
      let format = ytdl.chooseFormat(info.formats, {});
      maxApi.outlet("download_url", format.url);
    })
    .catch(() => {
      maxApi.post(`Error fetching video: ${url}`)
    })
});