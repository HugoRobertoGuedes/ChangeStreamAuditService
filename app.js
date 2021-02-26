// Imports|Consts
import dotenv from "dotenv";
import { CreateConnection, GetConnection } from "./src/Context.js";
import { CreateFile, AddLogFile } from "./src/Log.js";

// Config
dotenv.config();

/**
 * Run the Service
 */
async function Run() {
  try {
    // .ENV
    var URL = process.env.URL;
    var DATABASE_NAME = process.env.DATABASE_NAME;
    var COLLECTION_NAME = process.env.COLLECTION_NAME;
    var URL_USER = process.env.URL_USER;
    var URL_PASS = process.env.URL_PASS;
    var URL_SECRET = process.env.URL_SECRET;
    var TYPE_AUDIT = process.env.TYPE_AUDIT;
    var AUDIT_COLLECTION_NAME = process.env.AUDIT_COLLECTION_NAME;
    var AUDIT_DBNAME_NAME = process.env.AUDIT_DBNAME_NAME;

    // Vars
    let changeStream;
    let _database_stream;
    let _database_audience;
    let _url;
    let _audit_coll;

    // Valid Configs
    if (URL == null || URL == "")
      throw new Error("Por favor informar a URL de conexão com o banco.");
    if(TYPE_AUDIT == null || TYPE_AUDIT == "")
      throw new Error("Por favor informar o tipo de auditoria.");
    if(URL_SECRET == null || URL_SECRET == "")
      throw new Error("Por favor informar se o banco é autenticado ou não.")
    if(AUDIT_COLLECTION_NAME == null || AUDIT_COLLECTION_NAME == "")
      throw new Error("Por favor informar o nome da collection onde será salvo a auditoria.")
    if(AUDIT_DBNAME_NAME == null || AUDIT_DBNAME_NAME == "")
      throw new Error("Por favor informar o nome da database onde será salvo a auditoria.");
    if (TYPE_AUDIT == "DB")
      if (DATABASE_NAME == null || DATABASE_NAME == "")
        throw new Error(
          "Para auditar o banco inteiro, por favor informar o nome do Banco."
        );
    if (TYPE_AUDIT == "COLL")
      if (COLLECTION_NAME == null || COLLECTION_NAME == "")
        throw new Error(
          "Para auditar a collection, por favor informar o nome da collection."
        );
    if (URL_SECRET == "true")
      if (URL_USER == null || URL_USER == "")
        throw new Error(
          "Por favor informar os dados de autenticação do banco."
        );
    if (URL_PASS == null || URL_PASS == "")
      throw new Error("Por favor informar os dados de autenticação do banco.");

    // Create Log file
    await CreateFile(TYPE_AUDIT == "DB" ? DATABASE_NAME : COLLECTION_NAME);

    // Create Connection
    // Url
    if (URL_SECRET == "true") {
      _url = `mongodb://${URL_USER}:${encodeURIComponent(URL_PASS)}@${URL}`;
      await CreateConnection(_url);
    } else {
      await CreateConnection(URL);
    }

    // Set config DB
    _database_stream = await GetConnection(DATABASE_NAME);
    _database_audience = await GetConnection(AUDIT_DBNAME_NAME);
    _audit_coll = _database_audience.collection(AUDIT_COLLECTION_NAME);

    // Watching events
    if (TYPE_AUDIT == "DB") {
      changeStream = _database_stream.watch();
      changeStream.on("change", (next) => {
        _audit_coll.insertOne(next);
      });
    }
    if (TYPE_AUDIT == "COLL") {
      const coll = _database_stream.collection(COLLECTION_NAME);
      changeStream = coll.watch();
      changeStream.on("change", (next) => {
        _audit_coll.insertOne(next);
      });
    }
  } catch (error) {
    await AddLogFile(error.message);
  }
}

// Start App
Run().catch(console.dir);
