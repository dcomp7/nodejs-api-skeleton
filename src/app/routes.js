import express from "express";
import authMiddleware from "./middlewares/auth.js";
import customer from "./controllers/CustomerController";
import contact from "./controllers/ContactController";
import user from "./controllers/UserController";
import session from "./controllers/SessionController";
import file from "./controllers/FileController";
import multer from "multer";
import multerConfig from "../config/multer";

const router = express.Router();
const uploadMiddleware = multer(multerConfig);

router.post("/sessions", session.create);

// Authenticated routes
router.use(authMiddleware);
router.get("/customers", customer.index);
router.get("/customers/:id", customer.show);
router.post("/customers", customer.create);
router.put("/customers/:id", customer.update);
router.delete("/customers/:id", customer.delete);

router.get("/customers/:customerId/contacts", contact.index);
router.get("/customers/:customerId/contacts/:id", contact.show);
router.post("/customers/:customerId/contacts", contact.create);
router.put("/customers/:customerId/contacts/:id", contact.update);
router.delete("/customers/:customerId/contacts/:id", contact.delete);

router.get("/users", user.index);
router.get("/users/:id", user.show);
router.post("/users", user.create);
router.put("/users/:id", user.update);
router.delete("/users/:id", user.delete);

router.post("/files", uploadMiddleware.single("file"), file.create);

export default router;
