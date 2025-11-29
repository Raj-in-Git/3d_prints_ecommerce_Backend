const Product = require("../models/Product");

// CREATE product
exports.createProduct = async (req, res) => {
  try {
    // console.log("REQ.BODY:", req.body);
    // console.log("REQ.FILES:", req.files);

    // Use null-prototype safe access
    const body = req.body || {};

    // Extract fields safely
    const name = body.name?.trim();
    const price = body.price ? Number(body.price) : undefined;
    const description = body.description?.trim();
    const material = body.material?.trim();
    const customizable = body.customizable === "true" || body.customizable === true;

    // // Log type conversion
    // console.log({ name, price, description, material, customizable });

    // Check required fields
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!price && price !== 0) missingFields.push("price"); // allow 0
    if (!material) missingFields.push("material");
    if (missingFields.length > 0) {
      return res.status(400).json({ message: "Missing required fields", missingFields });
    }

    const images = req.files ? req.files.map(file => file.path) : [];

    const product = new Product({
      name,
      price,
      description,
      material,
      customizable,
      images,
    });

    const savedProduct = await product.save();


    const response = {
      message: "Product saved successfully",
      product: savedProduct
    };

    // Log the response JSON
    console.log("Response JSON:", response);

    res.status(201).json(response);

  } catch (err) {
    console.error("Failed to save product:", err);

    if (err.name === "ValidationError") {
      const invalidFields = Object.keys(err.errors);
      return res.status(400).json({ message: "Validation error", invalidFields, error: err.message });
    }

    res.status(500).json({ message: "Failed to save product", error: err.message });
  }
};

// GET all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

// GET single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
    console.log(product);
  } catch (err) {
    console.error("Failed to fetch product:", err);
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
  }
};

// UPDATE product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, material, customizable, existingImages } = req.body;

    // Parse existingImages if it's a JSON string
    let retainedImages = [];
    if (existingImages) {
      retainedImages = Array.isArray(existingImages)
        ? existingImages
        : JSON.parse(existingImages);
    }

    // Add new uploaded images
    const newImages = req.files ? req.files.map(file => file.path) : [];
    const finalImages = [...retainedImages, ...newImages];

    // Prepare update data
    const updateData = { name, price, description, material };
    if (customizable !== undefined) updateData.customizable = customizable === "true" || customizable === true;
    updateData.images = finalImages;

    console.log(updateData);

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (err) {
    console.error("Failed to update product:", err);
    if (err.name === "ValidationError") {
      const invalidFields = Object.keys(err.errors);
      return res.status(400).json({ message: "Validation error", invalidFields, error: err.message });
    }
    res.status(500).json({ message: "Failed to update product", error: err.message });
  }
};


// DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Failed to delete product:", err);
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
};
