// Vercel Serverless Function: /api/send-telegram
// Required Vercel Environment Variables:
// TELEGRAM_BOT_TOKEN = token from @BotFather (secret)
// TELEGRAM_CHAT_ID   = your Telegram chat ID
//
// Never put the bot token in index.html or commit it to GitHub.

function cleanText(value, maxLength) {
  return String(value == null ? "" : value).trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (char) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char];
  });
}

function getBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch (_) { return {}; }
  }
  return {};
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Only POST requests are allowed." });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Missing Telegram environment variable(s).");
    return res.status(500).json({
      success: false,
      error: "Telegram bot settings are missing in Vercel."
    });
  }

  const body = getBody(req);
  const guestName = cleanText(body.guestName || "Gáwhar", 100);
  const hostName = cleanText(body.hostName || "Miyras", 100);
  const restaurant = cleanText(body.restaurant, 200);
  const date = cleanText(body.date, 40);
  const time = cleanText(body.time, 40);
  const agreement = cleanText(body.agreement || "Ushırasıw usınısı maqúllandı", 250);

  if (!restaurant || !date || !time) {
    return res.status(400).json({
      success: false,
      error: "Restaurant, date, and time are required."
    });
  }

  const message = [
    "❤️ <b>Gáwhar ushırasıwǵa kelisti!</b>",
    "",
    "<b>Qonaq:</b> " + escapeHtml(guestName),
    "<b>Usınıs etiwshi:</b> " + escapeHtml(hostName),
    "<b>Restoran:</b> " + escapeHtml(restaurant),
    "<b>Sáne:</b> " + escapeHtml(date),
    "<b>Waqıt:</b> " + escapeHtml(time),
    "<b>Kelisim:</b> " + escapeHtml(agreement),
    "",
    "<i>Gáwhar Invitation saytınan jiberildi</i>"
  ].join("\n");

  try {
    const telegramResponse = await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });

    const result = await telegramResponse.json().catch(function () { return {}; });

    if (!telegramResponse.ok || !result.ok) {
      console.error("Telegram rejected message:", {
        status: telegramResponse.status,
        description: result.description || "Unknown Telegram error"
      });
      return res.status(502).json({
        success: false,
        error: "Telegram bot could not send the message. Check bot token and chat ID."
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Telegram request failed:", error && error.message ? error.message : "Unknown error");
    return res.status(500).json({
      success: false,
      error: "Server could not reach Telegram."
    });
  }
};
