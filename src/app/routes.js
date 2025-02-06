import { Router } from "express";
import customer from "./controllers/CustomerController";

const routes = new Router();

routes.get("/customer", customer.index);
routes.get("/customer/:id", customer.show);
routes.post("/customer", customer.create);
routes.put("/customer/:id", customer.update);
routes.delete("/customer/:id", customer.destroy);

export default routes;
