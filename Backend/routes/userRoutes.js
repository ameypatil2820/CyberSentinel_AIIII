import express from "express";
import { getUsers, updateUserStatus, deleteUser, editUser } from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All user management endpoints require authentication and "Super Admin" role
router.use(protect);
router.use(authorizeRoles("Super Admin"));

router.route("/").get(getUsers);
router.route("/:id").put(editUser).delete(deleteUser);
router.route("/:id/status").put(updateUserStatus);

export default router;
