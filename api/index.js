const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");
const User = require("./models/user");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const Chat = require("./models/message");
mongoose
  .connect(
    "mongodb+srv://alexzli0725:alexzli0725@cluster0.i9bbyx3.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB");
  });

app.listen(port, () => {
  console.log("Server is running on 3000");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({
      name,
      email,
      password,
    });

    newUser.verificationToken = crypto.randomBytes(20).toString("hex");
    await newUser.save();

    sendVerificationEmail(newUser.email, newUser.verificationToken);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("error registering the user");
    res.status(500).json({ message: "Registration fialed" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "alexzli0725@gmail.com",
      pass: "qkur ywgy qhtd phcd",
    },
  });

  const mailOptions = {
    from: "matchmake.com",
    to: email,
    subject: "Email verification",
    text: `Please click on the following link to verify your email: http://localhost:3000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error sending the verification email");
  }
};

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "invalid verification token" });
    }
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({ message: "email verified successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "email verification failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "error login" });
  }
});

app.put("/users/:userId/gender", async (req, res) => {
  try {
    const { userId } = req.params;
    const { gender } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { gender: gender },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User gender updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error updating user gender", error });
  }
});

app.put("/users/:userId/description", async (req, res) => {
  try {
    const { userId } = req.params;
    const { description } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        description: description,
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User description updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating the user description" });
  }
});

app.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "error fetching the user details" });
  }
});

app.put("/users/:userId/turn-ons/add", async (req, res) => {
  try {
    const { userId } = req.params;
    const { turnOn } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { turnOns: turnOn },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "turn on updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error adding the turn on" });
  }
});

app.put("/users/:userId/turn-ons/remove", async (req, res) => {
  try {
    const { userId } = req.params;
    const { turnOn } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { turnOns: turnOn },
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json({ message: "turn on removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "error removing turn on" });
  }
});

app.put("/users/:userId/looking-for", async (req, res) => {
  try {
    const { userId } = req.params;
    const { lookingFor } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { lookingFor: lookingFor },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user" });
    }
    res.status(200).json({ message: "Looking for updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "error updating looking for" });
  }
});

app.put("/users/:userId/looking-for/remove", async (req, res) => {
  try {
    const { userId } = req.params;
    const { lookingFor } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { lookingFor: lookingFor },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user" });
    }
    res.status(200).json({ message: "Looking for updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error removing looking for", error });
  }
});

app.post("/users/:userId/profile-images", async (req, res) => {
  try {
    const { userId } = req.params;
    const { imageUrl } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profileImages.push(imageUrl);
    await user.save();
    res.status(200).json({ message: "image has been added", user });
  } catch (error) {
    res.status(500).json({ message: "error adding the profile images" });
  }
});

app.get("/profiles", async (req, res) => {
  try {
    const { userId, gender, turnOns, lookingFor } = req.query;
    let filter = { gender: gender === "male" ? "female" : "male" };
    if (turnOns) {
      filter.turnOns = { $in: turnOns };
    }
    if (lookingFor) {
      filter.lookingFor = { $in: lookingFor };
    }
    const currentUser = await User.findById(userId)
      .populate("matches", "_id")
      .populate("crushes", "_id");

    const friendIds = currentUser.matches.map((friend) => friend._id);
    const crushIds = currentUser.crushes.map((crush) => crush._id);

    const profiles = await User.find(filter)
      .where("_id")
      .nin([userId, ...friendIds, ...crushIds]);

    return res.status(200).json({ profiles });
  } catch (error) {
    res.status(500).json({ message: "error fetching user profiles", error });
  }
});

app.post("/send-like", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { receivedLikes: currentUserId },
    });
    await User.findByIdAndUpdate(currentUserId, {
      $push: { crushes: selectedUserId },
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: "error sending a like", error });
  }
});

app.get("/received-likes/:userId/details", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const receivedLikesArray = [];
    for (const LikedUserId of user.receivedLikes) {
      const likedUser = await User.findById(LikedUserId);
      if (likedUser) {
        receivedLikesArray.push(likedUser);
      }
    }
    res.status(200).json({ receivedLikesArray });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the details", error });
  }
});

app.post("/create-match", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { matches: currentUserId },
      $pull: { crushes: currentUserId },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $push: { matches: selectedUserId },
      $pull: { receivedLikes: selectedUserId },
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: "Error creating a match", error });
  }
});

app.get("/users/:userId/matches", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const matchIds = user.matches;

    const matches = await User.find({ _id: { $in: matchIds } });

    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({ message: "error retrieving the matches", error });
  }
});

io.on("connection", (socket) => {
  console.log("a user is connected");
  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, message } = data;
      console.log("data", data);
      const newMessage = new Chat({ senderId, receiverId, message });
      await newMessage.save();
      io.to(receiverId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.log("Error handling the messages");
    }
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
});

http.listen(8000, () => {
  console.log("Socket.IO servers running on port 8000");
});

app.get("/messages", async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    console.log(senderId);
    console.log(receiverId);
    const messages = await Chat.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).populate("senderId", "_id name");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error in getting messages", error });
  }
});
