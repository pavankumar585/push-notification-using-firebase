const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

async function createUser(req, res) {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).json({ status: false, message: "User already exist" });

    user = new User(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    
    delete user.password;

    res.status(201).json({ status: true, user })
  } catch (error) {
    res.status(500).json({ status: false, message: error.message })
  }
}

module.exports.createUser = createUser;
