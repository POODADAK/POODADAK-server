const generateS3UploadURL = require("../config/s3");

exports.getS3Url = async (req, res, next) => {
  try {
    const url = await generateS3UploadURL();
    res.json({ s3Url: url });
  } catch (error) {
    res.status(400).json({
      result: "error",
      errMessage: "ERROR: fail to get s3URL...",
    });
  }
};
