const app = require('./app');
const sequelize = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida');

    // Cargar modelos y definir asociaciones antes de sincronizar
    const Product = require('./models/Product');
    const Category = require('./models/Category');
    const Role = require('./models/Role');
    const User = require('./models/User');

    Category.hasMany(Product, { foreignKey: 'CategoryId' });
    Product.belongsTo(Category, { foreignKey: 'CategoryId' });

    // User - Role
    Role.hasMany(User, { foreignKey: 'RoleId' });
    User.belongsTo(Role, { foreignKey: 'RoleId' });

    await sequelize.sync({ alter: true });
    // Seed roles and admin AFTER syncing models/tables
    const seed = require('./seeders/seedRolesAndAdmin');
    await seed();

    console.log('Modelos sincronizados');
    

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
