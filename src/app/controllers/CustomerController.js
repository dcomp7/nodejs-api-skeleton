class CustumerController {
  constructor() {
    this.customers = {
      1: { id: 1, name: "John Doe", email: "john@example.com" },
      2: { id: 2, name: "Jane Smith", email: "jane@example.com" },
      3: { id: 3, name: "Bob Johnson", email: "bob@example.com" },
    };
    this.nextId = 4;
  }

  index(req, res) {
    return res.json(this.customers);
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

export default new CustumerController();
