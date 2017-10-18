"use strict";

const { ipcRenderer } = require("electron");
document.addEventListener("DOMContentLoaded", function() {
  let version = ipcRenderer.sendSync("tweets");
  console.log(version);
});
