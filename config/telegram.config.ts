import dotenv from 'dotenv'

dotenv.config()

export const TelegramConfig = {
  chatId: {
    error: process.env.CHAT_ERROR_ID_TELEGRAM,
    success: process.env.CHAT_SUCCESS_ID_TELEGRAM,
  },
  token: {
    token: process.env.TOKEN_TELEGRAM,
    idGroup: process.env.ID_GROUP_TELEGRAM,
  },
}
