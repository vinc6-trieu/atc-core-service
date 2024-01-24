export const VNPayConfig = {
  Sandbox: {
    TmnCode: process.env.VNPAY_TMN_CODE_SANDBOX,
    HashSecret: process.env.VNPAY_SECRET_SANDBOX,
    Url: process.env.VNPAY_URL_SANDBOX,
    ReturnUrl: process.env.URL_SANDBOX,
    SuccessRedirectURI: process.env.SUCCESS_REDIRECT_URI_SANDBOX,
  },
  Production: {
    TmnCode: process.env.VNPAY_TMN_CODE,
    HashSecret: process.env.VNPAY_SECRET,
    Url: process.env.VNPAY_URL || 'https://pay.vnpay.vn/vpcpay.html',
    ReturnUrl: process.env.URL,
    SuccessRedirectURI: process.env.SUCCESS_REDIRECT_URI,
  },
}
