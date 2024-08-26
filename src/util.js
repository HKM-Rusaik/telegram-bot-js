export function getWelcomeMessage(userData, chatId) {
  return `
  🏅 Welcome to Super Solana Volume Bot 🏅
  The first and only auto volume bot on Solana.
  To get started, please deposit first. Tap the "Start" button below to proceed.
  
  🔍 Deposit SOL Amount Calculation:
      Pool SOL Amount * 0.2
  
  📜 Token Info: #FREEDUREV/SOL
  9CYyWq82QKRDgRHBquSiZjELP4Tuu1Jn1v9tN6B9SXDk
  
  ⌛ Bot worked: 0 min
  💹 Bot made: 0 
  
  💳 Your Deposit Wallet:
  HkatBj4QmhiM8LVQSpBuykH43D6pvZTC8PpEPL82aHaf
  💰 Balance: ${userData[chatId]?.depositAmount || 0} SOL
    `;
}

export function getKeyboardOptions() {
  return [
    [{ text: "Super Solana Volume Bot", callback_data: "1" }],
    [{ text: "Start", callback_data: "2" }],
    [{ text: "Target Volume Amount(10M)", callback_data: "3" }],
    [
      { text: "TRX Rating 5 min", callback_data: "4" },
      { text: "Buy with 550% SOL", callback_data: "5" },
    ],
    [{ text: "Set Wallet Size", callback_data: "6" }],
    [
      { text: "Divide", callback_data: "7" },
      { text: "Gather", callback_data: "8" },
      { text: "Withdraw", callback_data: "9" },
    ],
    [
      { text: "Refresh", callback_data: "10" },
      { text: "Help", callback_data: "11" },
    ],
    [{ text: "Close", callback_data: "12" }],
  ];
}

export function sendReplyWithKeyboard(bot, chatId, text) {
  const options = {
    reply_markup: {
      inline_keyboard: getKeyboardOptions(),
    },
  };

  bot.sendMessage(chatId, text, options);
}

export function getWithdrawalMessage(depositAmount) {
  return `
  💳 Withdrawal Processed
  
  Your deposit has been updated. The remaining balance is ${depositAmount} SOL.
    `;
}

export function getRefreshConfirmationMessage() {
  return "Are you sure you want to refresh all data? Reply with 'Yes' or 'No'.";
}
