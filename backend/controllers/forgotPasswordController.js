async function sendVerificationEmail(req, res) {
    res.send("Looks good")
}

async function verifyEmail(req, res) {
    res.send("Looks good")
}

async function resetPassword(req, res) {
    res.send("Looks good")
}

module.exports.sendVerificationEmail = sendVerificationEmail;
module.exports.verifyEmail = verifyEmail;
module.exports.resetPassword = resetPassword;