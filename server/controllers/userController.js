export const updateUser = async (req, res) => {
  try {
    const { full_name, username, bio, location } = req.body;
    const updateData = { full_name, username, bio, location };

    if (req.file) {
      updateData.profile_picture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};