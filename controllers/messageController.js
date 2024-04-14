const sequelize = require("../utils/database");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const AWS = require("aws-sdk");

const SALT = 10;
const SECRET_KEY = process.env.SECRET_KEY;

// Model
const User = sequelize.models.user;
const Message = sequelize.models.message;

exports.storeMessage = async (req, res, next) => {
  let token = req.headers.token;
  let body = req.body;
  if (token !== "" && body.message) {
    jwt.verify(token, SECRET_KEY, async function (err, decryptToken) {
      if (err) {
        /*
            err = {
              name: 'JsonWebTokenError',
              message: 'jwt malformed'
            }

          */
        console.log(err);
      }
      try {
        let message = await Message.create({
          userId: decryptToken.userId,
          message: body.message,
          toUser: body.to,
        });

        res.status(201).json({
          status: "success",
          data: { user: decryptToken.name, message: message.id },
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Server Error" });
      }
    });
  } else {
    res.status(404).json({ status: "error", message: "User Not Found." });
  }
};

exports.getAllMessages = async (req, res, next) => {
  let token = req.headers.token;

  let body = req.body;
  if (token !== "" && body) {
    let skip = body.skip !== undefined ? body.skip : 0;
    jwt.verify(token, SECRET_KEY, async function (err, decryptToken) {
      if (err) {
        /*
            err = {
              name: 'JsonWebTokenError',
              message: 'jwt malformed'
            }

          */
        console.log(err);
      }
      try {
        let message = await Message.findAll({
          where: {
            [Op.and]: [
              {
                [Op.or]: [
                  {
                    [Op.and]: [
                      {
                        userId: decryptToken.userId,
                      },
                      {
                        toUser: body.to,
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        userId: body.to,
                      },
                      {
                        toUser: decryptToken.userId,
                      },
                    ],
                  },
                ],
              },
            ],

            id: {
              [Op.gt]: [skip],
            },
          },
        });

        res.status(201).json({
          status: "success",
          data: { user: decryptToken.name, message: message },
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Server Error" });
      }
    });
  } else {
    res.status(404).json({ status: "error", message: "User Not Found." });
  }
};

function uploadToS3(data, fileName) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3Bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    // bucket:BUCKET_NAME
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((res, rej) => {
    s3Bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Somthing WentWrong..", err);
        rej(err);
      } else {
        console.log(s3response.Location);
        res(s3response.Location);
      }
    });
  });
}

exports.sendImage = (req, res, next) => {
  console.log(req.file);

  if (req.file) {
    const fileName = `image_${Date.now().toString()}.jpg`;
    uploadToS3(req.file.buffer, fileName)
      .then((result) => {
        return res.json({ message: "uploaded successfully", imgUrl: result });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
