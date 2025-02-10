import User from "../models/User.js";
import { Op } from "sequelize";
import { parseISO } from "date-fns";
import * as Yup from "yup";

class UserController {
  async index(req, res) {
    const {
      name,
      email,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    let where = {};
    let order = [];

    if (name) where = { ...where, name: { [Op.like]: `%${name}%` } };
    if (email) where = { ...where, email: { [Op.like]: `%${email}%` } };
    if (createdBefore)
      where = { ...where, created_at: { [Op.lte]: parseISO(createdBefore) } };
    if (createdAfter)
      where = { ...where, created_at: { [Op.gte]: parseISO(createdAfter) } };
    if (updatedBefore)
      where = { ...where, updated_at: { [Op.lte]: parseISO(updatedBefore) } };
    if (updatedAfter)
      where = { ...where, updated_at: { [Op.gte]: parseISO(updatedAfter) } };

    if (sort) {
      order = sort.split(",").map((item) => item.split(":"));
    }

    const data = await User.findAll({
      attributes: { exclude: ["password", "password_hash"] },
      where,
      order,
      limit,
      offset: limit * page - limit,
    });

    return res.json(data);
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password", "password_hash"] },
      });

      if (user) {
        return res.json(user);
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(8),
        passwordConfirmation: Yup.string().when(
          "password",
          (password, field) =>
            password ? field.required().oneOf([Yup.ref("password")]) : field,
        ),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Validation fails" });
      }

      const { id, name, email, fileId, createdAt, updatedAt } =
        await User.create(req.body);
      return res
        .status(201)
        .json({ id, name, email, fileId, createdAt, updatedAt });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(8),
        password: Yup.string()
          .min(8)
          .when("oldPassword", {
            is: (oldPassword) => !!oldPassword,
            then: (schema) => schema.required(),
            otherwise: (schema) => schema.notRequired(),
          }),
        passwordConfirmation: Yup.string().when("password", {
          is: (password) => !!password,
          then: (schema) =>
            schema
              .required()
              .oneOf([Yup.ref("password")], "Passwords must match"),
          otherwise: (schema) => schema.notRequired(),
        }),
      });

      try {
        await schema.validate(req.body, { abortEarly: false });
      } catch (err) {
        //console.log("erro");
        //console.log(err);
        return res
          .status(400)
          .json({ error: "Validation fails", messages: err.inner });
      }

      const { id } = req.params;

      // Procura o id do usuário a ser editado
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Checa password
      const { oldPassword } = req.body;
      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: "Password does not match" });
      }

      user.set(req.body);

      const { name, email, fileId, createdAt, updatedAt } = await user.save();

      return res
        .status(201)
        .json({ id, name, email, fileId, createdAt, updatedAt });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.destroy();

      return res.status(204).send();
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new UserController();
