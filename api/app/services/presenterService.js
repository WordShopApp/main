function profileUser (user) {
  return {
    user_id: user.user_id,
    username: username,
    avatar: user.avatar,
    palette: user.palette,
    created: user.created
  };
}

module.exports = {
  profileUser: profileUser
};