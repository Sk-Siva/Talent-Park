export const sendToken = (user, statusCode, res, message) => {
  // Generate JWT token for the authenticated user
  const token = user.getJWTToken();

  // Cookie options
  const options = {
    expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE) * 1000), // Convert expiration time to milliseconds
    httpOnly: true, // Prevent client-side access for security
  };

  // Send response with token, user data, and success message
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user,
      message,
      token,
    });
};
