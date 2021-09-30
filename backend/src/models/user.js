module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            field: 'first_name',
            type: DataTypes.TEXT,
            allowNull: false
        },
        lastName: {
            field: 'last_name',
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    })

    User.associate = (models) => {
        User.hasMany(models.List, {
            foreignKey: {
                name: 'userId',
                field: 'user_id'
            }
        })
    }

    return User
}
