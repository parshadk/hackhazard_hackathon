"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = require("./database/db.js");
const razorpay_1 = __importDefault(require("razorpay"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
if (!process.env.Razorpay_Key || !process.env.Razorpay_Secret) {
    throw new Error("Razorpay Key and Secret are required");
}
exports.instance = new razorpay_1.default({
    key_id: process.env.Razorpay_Key,
    key_secret: process.env.Razorpay_Secret,
});
const app = (0, express_1.default)();
// using middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const port = process.env.PORT;
app.get("/", (req, res) => {
    res.send("Server is working");
});
app.use("/uploads", express_1.default.static("uploads"));
// importing routes
const user_js_1 = __importDefault(require("./routes/user.js"));
const course_js_1 = __importDefault(require("./routes/course.js"));
const admin_js_1 = __importDefault(require("./routes/admin.js"));
// using routes
app.use("/api", user_js_1.default);
app.use("/api", course_js_1.default);
app.use("/api", admin_js_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    (0, db_js_1.connectDb)();
});
