import Customer from "../models/Customer.js";

class CustomerController {
  async index(req, res) {
    const data = await Customer.findAll();

    return res.json(data);
  }

  show(req, res) {
    const { id } = req.params;
    const customer = this.customers[id];

    if (customer) {
      return res.json(customer);
    } else {
      return res.status(404).json({ error: "Customer not found" });
    }
  }

  create(req, res) {
    const { name, email } = req.body;
    const id = this.nextId++;
    const newCustomer = { id, name, email };
    this.customers[id] = newCustomer;

    return res.status(201).json(newCustomer);
  }

  update(req, res) {
    const { id } = req.params;
    const { name, email } = req.body;
    const customer = this.customers[id];

    if (customer) {
      customer.name = name;
      customer.email = email;
      return res.json(customer);
    } else {
      return res.status(404).json({ error: "Customer not found" });
    }
  }

  destroy(req, res) {
    const { id } = req.params;
    const customer = this.customers[id];

    if (customer) {
      delete this.customers[id];
      return res.status(204).send();
    } else {
      return res.status(404).json({ error: "Customer not found" });
    }
  }
}

export default new CustomerController();
