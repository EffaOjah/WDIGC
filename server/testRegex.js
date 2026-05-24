const youtubeLink = "https://youtu.be/DXfiGwg1bgk?si=Wint3jRYsE1l4xnf";
const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
const match = youtubeLink.match(regExp);
const videoId = (match && match[1] && match[1].length === 11) ? match[1] : "";
console.log("Match:", match);
console.log("Extracted Video ID:", videoId);
console.log("Matches 11-char requirement:", videoId.length === 11);
