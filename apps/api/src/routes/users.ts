import router from "./admin/categories";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";
import { getUsers } from "../services/user.service";

router.get("/admin/users", authMiddleware, adminMiddleware, async (req, res) => {
	try {
		const users = await getUsers();
  	res.json(users);
	} catch (error) {
		console.error("Помилка при отриманні користувачів:", error);
		res.status(500).json({ error: "Помилка при отриманні користувачів:" });
	}
});

export default router;