// Imports|Consts
import dotenv from "dotenv";
import { CreateConnection, GetConnection } from "./src/Context.js";

// Config
dotenv.config();

// .ENV
var URL = process.env.URL;
var DATABASE_NAME = process.env.DATABASE_NAME;
var URL_USER = process.env.URL_USER;
var URL_PASS = process.env.URL_PASS;
var URL_SECRET = process.env.URL_SECRET;
var TYPE_AUDIT = process.env.TYPE_AUDIT;

// Vars
let changeStream;

/**
 * Run the Service
 */
async function Run() {
  try {
    await CreateConnection(URL, DATABASE_NAME);
    const database = await GetConnection();
    changeStream = database.watch();
    changeStream.on("change", (next) => {
      console.log(next);
    });
  } catch (error) {
    console.log(error);
  }
}

// Start App
Run().catch(console.dir);
