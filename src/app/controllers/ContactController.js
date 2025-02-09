import Contact from "../models/Contact.js";
import Customer from "../models/Customer.js";
import { Op } from "sequelize";
import { parseISO } from "date-fns";
import * as Yup from "yup";

class ContactController {
  async index(req, res) {
    const {
      name,
      email,
      phone,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    let where = { customer_id: req.params.customerId };
    let order = [];

    if (name) where = { ...where, name: { [Op.like]: `%${name}%` } };
    if (email) where = { ...where, email: { [Op.like]: `%${email}%` } };
    if (phone) where = { ...where, phone: { [Op.like]: `%${phone}%` } };
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

    const data = await Contact.findAll({
      where,
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "status"],
          required: true,
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
      const contact = await Contact.findByPk(id);

      if (contact) {
        return res.json(contact);
      } else {
        return res.status(404).json({ error: "Contact not found" });
      }
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      const { name, email, phone } = req.body;
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        phone: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Validation fails" });
      }

      const newContact = await Contact.create({
        customer_id: req.params.customerId,
        name,
        email,
        phone,
      });
      return res.status(201).json(newContact);
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;

      const contact = await Contact.findByPk(id);

      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }

      await contact.update({ name, email, phone });

      return res.json(contact);
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const contact = await Contact.findByPk(id);

      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }

      await contact.destroy();

      return res.status(204).send();
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new ContactController();
