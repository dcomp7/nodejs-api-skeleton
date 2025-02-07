import Customer from "../models/Customer.js";
import Contact from "../models/Contact.js";
import { Op } from "sequelize";
import { parseISO } from "date-fns";
import * as Yup from "yup";

class CustomerController {
  async index(req, res) {
    const {
      name,
      email,
      status,
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
    if (status) where = { ...where, status };
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

    const data = await Customer.findAll({
      where,
      include: [
        {
          model: Contact,
          as: "contacts",
          attributes: ["id"],
        },
      ],
      order,
      limit,
      offset: limit * page - limit,
    });

    return res.json(data);
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const customer = await Customer.findByPk(id);

      if (customer) {
        return res.json(customer);
      } else {
        return res.status(404).json({ error: "Customer not found" });
      }
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      const { name, email, status } = req.body;
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        status: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Validation fails" });
      }

      const newCustomer = await Customer.create({ name, email, status });
      return res.status(201).json(newCustomer);
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, status } = req.body;
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        status: Yup.string(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Validation fails" });
      }

      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      await customer.update({ name, email, status });

      return res.json(customer);
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      await customer.destroy();

      return res.status(204).send();
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new CustomerController();
