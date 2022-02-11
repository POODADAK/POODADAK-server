const generateS3UploadURL = require("../config/s3");

exports.getS3Url = async (req, res, next) => {
  const url = await generateS3UploadURL();
  res.json({ s3Url: url });
};
