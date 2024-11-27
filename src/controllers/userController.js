import userService from "../services/userService";
let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }
  // check email exist
  // compare password
  // return userInfor
  // access_token: JWT json webtoken
  let userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let handleRegister = async (req, res) => {
  let { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  try {
    let data = await userService.handleUserRegister(email, password);
    if (data) {
      return res.status(200).json(data);
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 2,
      message: "Error from server",
    });
  }
};
const createFood = async (req, res) => {
  try {
    let foodItem = req.body;
    console.log(foodItem);
    const food = await userService.createNewFood(foodItem);
    return res
      .status(201)
      .json({ message: "Food created successfully", data: food });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating food", error: error.message });
  }
};

const getFoods = async (req, res) => {
  try {
    const foods = await userService.getAllFoods();
    return res.status(200).json({ data: foods });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving foods", error: error.message });
  }
};

const deleteFood = async (req, res) => {
  try {
    const { id } = req.body;
    let check = await userService.deleteFoodById(id);
    if (check) {
      return res.status(200).json({ message: "Food deleted successfully" });
    } else {
      return res.status(301).json({ message: "Error Deleting" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting food", error: error.message });
  }
};

const updateFood = async (req, res) => {
  try {
    // Lấy thông tin đồ ăn từ request body
    const foodData = req.body; // { id: 1, name: 'Pizza', price: 100, ... }

    // Kiểm tra xem ID có được cung cấp không
    if (!foodData.id) {
      return res
        .status(400)
        .json({ message: "Food ID is required for updating." });
    }

    // Danh sách các trường bắt buộc
    const requiredFields = ["id", "name", "price"]; // Thêm các trường khác nếu cần

    // Kiểm tra xem các trường bắt buộc có bị thiếu không
    const missingFields = requiredFields.filter((field) => !foodData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Gọi hàm service để cập nhật thông tin đồ ăn
    const updatedFood = await userService.updateFoodService(foodData);

    // Kiểm tra xem món ăn có tồn tại và được cập nhật không
    if (!updatedFood) {
      return res
        .status(404)
        .json({ message: "Food not found or not updated." });
    }

    // Trả về kết quả thành công với thông tin món ăn đã được cập nhật
    return res
      .status(200)
      .json({ message: "Food updated successfully.", data: updatedFood });
  } catch (error) {
    // Xử lý lỗi và trả về lỗi
    return res
      .status(500)
      .json({ message: `Error updating food: ${error.message}` });
  }
};

module.exports = {
  handleLogin,
  createFood,
  getFoods,
  deleteFood,
  updateFood,
  handleRegister,
};
