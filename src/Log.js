import fs from "fs";

// Vars
var nameFile;
var dir = "./logs/";

async function CreateFile(name) {
  // set namefile
  nameFile = dir + ((name == null || name == "") ? 'error' : name) + ".log";
  // Create path and file
  if (!fs.existsSync(dir)) await fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(nameFile)) await fs.writeFileSync(nameFile, "Start App");
}

async function AddLogFile(msg) {
  await CreateFile();
  fs.readFile(nameFile, "utf8", (err, data) => {
    const newLog =
      "At =: " +
      new Date().toLocaleDateString() +
      " | Hour =: " +
      new Date().toLocaleTimeString() +
      " | Log =: " +
      msg;
    fs.writeFileSync(nameFile, newLog, "utf8");
  });
}

export { CreateFile, AddLogFile };
