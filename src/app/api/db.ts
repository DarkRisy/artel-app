'use server'
import pg from "pg"


const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  postgresql://postgres:Nowoodessa21@@db.vnputjiagckeokakesam.supabase.co:5432/postgres
  // 'Artel', 'postgres', 'nowoodessa', {
  // host: 'localhost',
  // dialect: 'postgres',
  // dialectModule: pg,
})

try {
  await sequelize.authenticate()
  console.log('Соединение с БД было успешно установлено')
} catch (e) {
  console.log('Невозможно выполнить подключение к БД: ', e)
}

export const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
},
  {
    timestamps: false
  });

export const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Phone: {
      type: DataTypes.STRING,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: 'id',
      },
      allowNull: true,
    }
  },
  {
  }
)
export const UserCart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

},
  { timestamps: false })


  export const UserProduct = sequelize.define(
  'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false
    }
  )
  export const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    // autoIncrement: true,
    primaryKey: true,
  },

},
  { timestamps: false })
  export const ConstructionStage = sequelize.define(
  'ConstructionStage',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Image_1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Image_2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Image_3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      OrderId: {
        type: DataTypes.INTEGER,
        references: {
          model: UserProduct,
          key: 'id',
        },
        allowNull: true,
      }
    },
    {
      timestamps: false
    }
  )
  


UserCart.hasOne(User)
User.belongsTo(UserCart)
UserCart.hasMany(UserProduct);
UserProduct.belongsTo(UserCart);
Order.hasMany(UserProduct);
UserProduct.belongsTo(Order);
UserProduct.hasMany(ConstructionStage);
ConstructionStage.belongsTo(UserProduct);

Role.sync({ alter: true })
const role = await Role.findOne({ where: { name: "Пользователь" } })
console.log("ИМЯ РОЛИ: ",role.name)
if (role.name != "Пользователь") {
  await Role.create({
    id: 1,
    name: "Пользователь"
  })
  await Role.create({
    id: 2,
    name: "Администратор"
  })
}

sequelize.sync({ alter: true })
