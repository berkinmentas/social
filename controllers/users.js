import User from "../models/User.js";

// READ

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json({
      error: false,
      message: "Kullanıcı başarıyla bulunmuştur",
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      error: true,
      message: err.message,
    });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lasatName, occupation, location, picturePath }) => {
        return {
          _id,
          firstName,
          lasatName,
          occupation,
          location,
          picturePath,
        };
      }
    );

    res.status(202).json({
      error: false,
      message: "İşlem başariyla gerçekleştirildi.",
      data: formattedFriends,
    });
  } catch (err) {
    res.status(404).json({ error: true, message: err.message });
  }
};

// UPDATE

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lasatName, occupation, location, picturePath }) => {
        return {
          _id,
          firstName,
          lasatName,
          occupation,
          location,
          picturePath,
        };
      }
    );

    res.status(202).json({
      error: false,
      message: "İşlem başarıyla gerçekleştirilmiştir.",
      data: formattedFriends,
    });
  } catch (err) {
    res.status(404).json({ error: true, message: err.message });
  }
};
