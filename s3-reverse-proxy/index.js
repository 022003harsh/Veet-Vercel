const express = require("express");

const app = express();
const port = process.env.PORT || 8000;

const BASE_PATH = 'https//vercel-clone-outputs.s3.ap-south-1.amazonaws.com/_outputs'

const proxy = httpProxy.createProxy()

app.use((req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split('.')[0];
  const resolvesTo = `${BASE_PATH}/${subdomain}`;

  proxy.web(req, res, { target: resolvesTo, changeOrigin: true });

});

app.listen(port, () => {
  console.log(`Reverse proxy is running on port ${port}`);
});