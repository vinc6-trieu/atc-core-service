import dotenv from 'dotenv'

dotenv.config()

export const SlackConfig = {
  token: {
    token: process.env.TOKEN_SLACK,
  },
  channel: {
    atlas_slack_dev: process.env.SLACK_DEV,
    atlas_slack_prod: process.env.SLACK_PROD,
    atlas_slack_test: process.env.SLACK_TEST,
    atlas_slack_error: process.env.SLACK_ERROR,
  },
}
