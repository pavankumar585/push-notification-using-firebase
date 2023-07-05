const { User, validate } = require("../models/user");

async function createUser(req, res) {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).json({ status: false, message: "User already exist" });

    
  } catch (error) {
    res.status(500).json({ status: false, message: error.message })
  }
}

module.exports.createUser = createUser;
