import {User} from "../models/User";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";
import { Op } from "sequelize";

export class userController {
  constructor() {}



  public async create(...params) {
    const [req, res, next] = params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const {
      name,
      password
    } = req.body;
    try {
     
        let user = await User.findOne({ where: { name: name } });
        if (user) {
          return res.status(HttpStatusCodes.BAD_REQUEST).json({
            errors: [
              {
                msg: "name already used",
              },
            ],
          });
     
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      await User.create({
        name: name,
       
        password: hashed,
     
        isAdmin: false,
      });
      res.json({ message: "User Registered" });
    } catch (err) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
  public updateUser = (...params) => {
    const [req, res, next] = params;
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    const {
      name,
      password
  
    } = req.body;
    User.findOne({
      where: {
        [Op.or]: [{ name: name }, { id: id }],
      },
    })
      .then(async (user) => {
        if (!user || user["id"] == id) {
          let passtosend = password;
         
            const salt = await bcrypt.genSalt(10);
            passtosend = await bcrypt.hash(password, salt);
       
       
            res.json({ message: `User `, result: 'User' });
       
        }
      })
      .catch(() => {
        res.status(500).send({ error: "name already used" });
      });
  };

  public findAllUsers = (...params) => {
    const [req, res, next] = params;

    User.findAll({
      attributes: { exclude: ["password"] },
    }).then((users) => {
      res.json({ message: "Users retrieved", result: users });
    });
  };

  public findOneUser = (...params) => {
    const [req, res, next] = params;
    const { id } = req.params;
    User.findOne({ where: { id: id } }).then((user) =>
      res.json({ message: "User retrieved", result: user })
    );
  };

  public deleteUser = (...params) => {
    const [req, res, next] = params;
    const { id } = req.params;
    User.destroy({ where: { id: id } }).then(() => {
      res.json({ message: `User ${id} deleted` });
    });
  };
}
