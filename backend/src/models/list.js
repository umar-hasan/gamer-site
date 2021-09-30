module.exports = (sequelize, DataTypes) => {
    const List = sequelize.define('list', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    })


    List.associate = (models) => {
        List.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                field: 'user_id'
            }
        })

        List.belongsToMany(models.Game, {
            through: models.ListGame,
            foreignKey: {
                name: 'listId',
                field: 'list_id'
            }
        })
    }
    

    return List
}

