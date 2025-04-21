const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Food = require("./models/Food");
const User = require("./models/User");

const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "123456";

// Kết nối MongoDB
mongoose.connect("mongodb+srv://Dangjone9:F01667326216@cluster0.lmxi6.mongodb.net/Foods?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Kết nối MongoDB thành công"))
  .catch((err) => {
    console.error("Lỗi kết nối MongoDB:", err);
    res.status(500).json({ message: "Lỗi kết nối MongoDB", error: err.message });
  });

// Middleware xác thực Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Không có token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ" });

    req.user = decoded;
    next();
  });
};

// Hàm sinh mã category
const getCategoryCode = (category) => {
  if (['Cơm', 'Bánh mì', 'Món Tây'].includes(category)) return 'RICE';
  if (['Món nước', 'Lẩu', 'Món Việt'].includes(category)) return 'DRIN';
  if (['Món Nhật', 'Mì'].includes(category)) return 'NOOD';
  return 'UNKN';
};

// Cấu hình multer
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ cho phép tải lên file ảnh"));
    }
  }
});

// Route đăng ký
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Tên đăng nhập và mật khẩu không được bỏ trống" });
  }

  try {
    const userExist = await User.findOne({ username });
    if (userExist) return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.json({ message: "Đăng ký thành công!" });
  } catch (err) {
    console.error("Lỗi server:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// Route đăng nhập
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({ message: "Đăng nhập thành công!", token, isAdmin: user.username === 'admin' });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// Route xem thông tin người dùng
app.get("/profile", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

  res.json({
    user: {
      userId: user._id,
      username: user.username,
      isAdmin: user.isAdmin
    }
  });
});

// Route lấy danh sách món ăn
app.get("/foods", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách món ăn", error: err.message });
  }
});

// Route tạo món ăn mới
app.post("/foods/add", upload.single("image"), async (req, res) => {
  try {
    const { name, category, description, price } = req.body;

    if (!name || !category || !description || !price) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin món ăn!" });
    }

    const image = req.file ? req.file.filename : null;

    const code = getCategoryCode(category);
    const count = await Food.countDocuments({ id: { $regex: `^FOOD${code}` } });
    const newId = `FOOD${code}${(count + 1).toString().padStart(3, '0')}`;

    const newFood = new Food({
      id: newId,
      name,
      category,
      description,
      price,
      image
    });

    await newFood.save();
    res.json(newFood);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo món ăn", error: err.message });
  }
});

// Route xoá món ăn theo _id
app.delete("/foods/delete/:id", async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Không tìm thấy món ăn để xoá" });
    }

    res.json({ message: "Xoá món ăn thành công!" });
  } catch (err) {
    console.error("Lỗi khi xoá món ăn:", err);
    res.status(500).json({ message: "Lỗi khi xoá món ăn", error: err.message });
  }
});


// Route lấy ID tiếp theo dựa vào category
app.get("/foods/next-id/:category", async (req, res) => {
  try {
    const category = req.params.category;
    if (!category) return res.status(400).json({ message: "Thiếu category" });

    const code = getCategoryCode(category);
    const count = await Food.countDocuments({ id: { $regex: `^FOOD${code}` } });
    const nextId = `FOOD${code}${(count + 1).toString().padStart(3, '0')}`;

    res.json({ nextId });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy ID tiếp theo", error: err.message });
  }
});

// Route cập nhật món ăn
app.put("/foods/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, description, category, price } = req.body;

    const updatedFood = await Food.findByIdAndUpdate(id, {
      name,
      image,
      description,
      category,
      price
    }, { new: true });

    if (!updatedFood) {
      return res.status(404).send("Không tìm thấy món ăn để cập nhật");
    }

    res.json(updatedFood);
  } catch (err) {
    res.status(500).send("Lỗi server: " + err.message);
  }
});

// Route lấy chi tiết món ăn theo ID
app.get("/foods/:id", async (req, res) => {
  try {
    const food = await Food.findOne({ id: req.params.id });
    if (!food) return res.status(404).json({ message: "Không tìm thấy món ăn" });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết món ăn", error: err.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server đang chạy tại http://localhost:5000");
});
