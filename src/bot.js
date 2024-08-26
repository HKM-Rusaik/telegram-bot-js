import TelegramBot from "node-telegram-bot-api";
import { userData } from "./userData.js";
import {
  handleCallbackQuery,
  handleStartCommand,
  handleMessage,
} from "./handlers..js";

import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

export function startBot() {
  bot.onText(/\/start/, (msg) => handleStartCommand(bot, msg, userData));
  bot.on("callback_query", (callbackQuery) =>
    handleCallbackQuery(bot, callbackQuery, userData)
  );
  bot.on("message", (msg) => handleMessage(bot, msg, userData));

  console.log("Bot is running...");
}
