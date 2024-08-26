import {
  getWelcomeMessage,
  getWithdrawalMessage,
  sendReplyWithKeyboard,
} from "./util.js";
export function handleStartCommand(bot, msg, userData) {
  const chatId = msg.chat.id;

  userData[chatId] = {
    depositAmount: 0,
    transactionStatus: "pending",
  };

  const messageText = getWelcomeMessage(userData, chatId);
  sendReplyWithKeyboard(bot, chatId, messageText);
}
export function handleCallbackQuery(bot, callbackQuery, userData) {
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  const action = callbackQuery.data;

  switch (action) {
    case "2":
      if (userData[chatId]) {
        userData[chatId].transactionStatus = "awaiting_deposit";
        bot.sendMessage(
          chatId,
          "Please deposit first. Enter the deposit amount."
        );
      }
      break;

    case "9":
      if (userData[chatId]) {
        userData[chatId].transactionStatus = "awaiting_withdrawal";
        bot.sendMessage(
          chatId,
          "Please enter the amount you want to withdraw."
        );
      }
      break;

    case "10":
      if (userData[chatId]) {
        userData[chatId].transactionStatus = "awaiting_refresh_confirmation";
        const confirmationMessage = getRefreshConfirmationMessage();

        bot.sendMessage(chatId, confirmationMessage);
      }
      break;

    default:
      bot.editMessageText(`Selected option: ${callbackQuery.data}`, {
        chat_id: message.chat.id,
        message_id: message.message_id,
      });
      break;
  }
}

export function handleMessage(bot, msg, userData) {
  const chatId = msg.chat.id;
  const text = msg.text;

  console.log(`Received message: ${text} from chatId: ${chatId}`);

  if (userData[chatId]) {
    switch (userData[chatId].transactionStatus) {
      case "awaiting_deposit":
        handleDeposit(bot, chatId, text, userData);
        break;

      case "awaiting_withdrawal":
        handleWithdrawal(bot, chatId, text, userData);
        break;

      case "awaiting_refresh_confirmation":
        handleRefreshConfirmation(bot, chatId, text, userData);
        break;

      default:
        bot.sendMessage(chatId, "Unknown status. Please start over.");
        break;
    }
  }
}

function handleDeposit(bot, chatId, text, userData) {
  const depositAmount = parseFloat(text);
  if (!isNaN(depositAmount)) {
    if (depositAmount >= 10) {
      userData[chatId].depositAmount = depositAmount;
      userData[chatId].transactionStatus = "deposit_completed";
      const messageText = `Deposit of ${depositAmount} SOL received. Transaction completed.\n\n${getWelcomeMessage(
        userData,
        chatId
      )}`;
      sendReplyWithKeyboard(bot, chatId, messageText);
    } else {
      bot.sendMessage(
        chatId,
        "Deposit amount must be at least 10 SOL. Please enter a valid amount.",
        {
          reply_markup: {
            inline_keyboard: [[{ text: "Start Over", callback_data: "2" }]],
          },
        }
      );
    }
  } else {
    bot.sendMessage(chatId, "Invalid deposit amount. Please enter a number.", {
      reply_markup: {
        inline_keyboard: [[{ text: "Start Over", callback_data: "2" }]],
      },
    });
  }
}

function handleWithdrawal(bot, chatId, text, userData) {
  const withdrawAmount = parseFloat(text);
  if (!isNaN(withdrawAmount)) {
    if (
      withdrawAmount > 0 &&
      withdrawAmount <= userData[chatId].depositAmount
    ) {
      userData[chatId].depositAmount -= withdrawAmount;
      userData[chatId].transactionStatus = "withdrawal_completed";
      const messageText = getWithdrawalMessage(userData[chatId].depositAmount);
      sendReplyWithKeyboard(bot, chatId, messageText);
    } else {
      bot.sendMessage(
        chatId,
        "Invalid withdrawal amount. Ensure it is greater than 0 and does not exceed your balance.",
        {
          reply_markup: {
            inline_keyboard: [[{ text: "Start Over", callback_data: "2" }]],
          },
        }
      );
    }
  } else {
    bot.sendMessage(
      chatId,
      "Invalid amount. Please enter a valid number for withdrawal.",
      {
        reply_markup: {
          inline_keyboard: [[{ text: "Start Over", callback_data: "2" }]],
        },
      }
    );
  }
}

function handleRefreshConfirmation(bot, chatId, text, userData) {
  switch (text) {
    case "yes":
      // Reset user data
      userData[chatId] = {
        depositAmount: 0,
        transactionStatus: "pending",
      };
      bot.sendMessage(
        chatId,
        "All data has been refreshed. You can start over."
      );
      break;

    case "no":
      bot.sendMessage(chatId, "No changes made. You can continue.");
      break;

    default:
      bot.sendMessage(chatId, "Please enter 'Yes' or 'No'.", {
        reply_markup: {
          inline_keyboard: [[{ text: "Start Over", callback_data: "2" }]],
        },
      });
      break;
  }
}
