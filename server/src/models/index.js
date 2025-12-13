const sequelize = require('../config/db');
const User = require('./user');
const Role = require('./role');

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database & tables synced!');

        const roles = await Role.findAll();
        if (roles.length === 0) {
            await Role.bulkCreate([
                { name: 'admin' },
                { name: 'user' },
                { name: 'moderator' }
            ]);
            console.log('Default roles created');
        }
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

module.exports = {
    User,
    Role,
    syncDatabase
};
