const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({
      success: true,
      message: 'Categorías obtenidas correctamente',
      data: categories
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      data: null
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ success: false, message: 'Nombre es requerido', data: null });
    }

    const category = await Category.create({ nombre });
    res.status(201).json({ success: true, message: 'Categoría creada', data: category });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ success: false, message: 'Error al crear categoría', data: null });
  }
};
