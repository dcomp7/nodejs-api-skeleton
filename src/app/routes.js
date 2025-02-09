import { Router } from "express";
import customer from "./controllers/CustomerController";
import contact from "./controllers/ContactController";
import user from "./controllers/UserController";

const routes = new Router();

routes.get("/customers", customer.index);
routes.get("/customers/:id", customer.show);
routes.post("/customers", customer.create);
routes.put("/customers/:id", customer.update);
routes.delete("/customers/:id", customer.delete);

routes.get("/customers/:customerId/contacts", contact.index);
routes.get("/customers/:customerId/contacts/:id", contact.show);
routes.post("/customers/:customerId/contacts", contact.create);
routes.put("/customers/:customerId/contacts/:id", contact.update);
routes.delete("/customers/:customerId/contacts/:id", contact.delete);

routes.get("/users", user.index);
routes.get("/users/:id", user.show);
routes.post("/users", user.create);
routes.put("/users/:id", user.update);
routes.delete("/users/:id", user.delete);

export default routes;
