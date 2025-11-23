const Category = require('../models/Category');
const Product = require('../models/Product');
const sequelize = require('../config/database');

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

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada', data: null });
    }

    if (!nombre) {
      return res.status(400).json({ success: false, message: 'Nombre es requerido', data: null });
    }

    await category.update({ nombre });

    res.json({ success: true, message: 'Categoría actualizada', data: category });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar categoría', data: null });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada', data: null });
    }
    // Ejecutar eliminaciones dentro de una transacción para garantizar atomicidad
    await sequelize.transaction(async (t) => {
      await Product.destroy({ where: { CategoryId: id }, transaction: t });
      await category.destroy({ transaction: t });
    });

    res.json({ success: true, message: 'Categoría y productos asociados eliminados', data: null });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar categoría', data: null });
  }
};
