var express = require("express");
var renderHtml = express.Router();
var path = require("path");
var fs = require("fs");

renderHtml.route("*").get((req, res) => {
  let fileUrl;
  if (req.url == "/") fileUrl = "/main";
  else fileUrl = req.url;

  if (fileUrl.includes("?")) {
    fileUrl = fileUrl.split("?")[0]
    let filePath = path.resolve("./public/html" + fileUrl + ".html");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    fs.createReadStream(filePath).pipe(res);
    return
  }

  let filePath = path.resolve("./public/html/" + fileUrl + ".html");
  const ext = path.extname(filePath);
  if (ext === ".html") {
    fs.exists(filePath, (exist) => {
      if (!exist) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html");
        res.end("<html><body><h1>Eror 404</h1></body></html>");
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      fs.createReadStream(filePath).pipe(res);
    });
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.end("<html><body><h1>Eror 404 not a HTML file</h1></body></html>");
  }
});

module.exports = renderHtml;
