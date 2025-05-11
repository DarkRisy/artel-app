'use server'
import pg from "pg"
import { seedProducts } from "./db_product";
const bcrypt = require('bcrypt');


// Хешируем пароль один раз для обоих пользователей


// Создаём админа (роль 2), если его нет

const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME || 'Artel',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'nowoodessa',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432, 
    dialect: 'postgres',
    dialectModule: pg,
    logging: process.env.NODE_ENV === 'development', 
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  try {
    await sequelize.authenticate();
    console.log('Соединение с БД было успешно установлено');
  } catch (e) {
    console.error('Невозможно выполнить подключение к БД: ', e);
    process.exit(1);
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
      validate: {
        isEmail: true
      }
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true
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
    CategoryId: {
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
  serviceType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  foundationArea: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  foundationDepth: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  foundationType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  drainageLength: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  drainageDepth: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  drainageElements: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  drainageMaterial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  drainageType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  earthworkVolume: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  earthworkDepth: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  earthworkEquipment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  earthworkType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  earthworkComment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  farmbildingArea: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  farmbildingHeight: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  farmbildingMaterial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  farmbildingType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  greenhouseArea: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  greenhouseHeating: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  greenhouseIrrigation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  greenhouseFeatures: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  greenhouseType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  landscapeArea: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  landscapeWorks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  landscapePavingType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  livestockArea: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  livestockFeatures: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  livestockAnimalCount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  livestockVentilation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  livestockType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  roadCoating: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  roadFeatures: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  roadLength: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  roadWidth: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  roadType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  storageCapacity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  storageTemperature: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storageVentilation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  storageType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timing: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  budget: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hasDocs: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  attachments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contactMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  callTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },


},
  {})


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
        model: Order,
        key: 'id',
      },
      allowNull: true,
    }
  },
  {

  }
)





Order.hasMany(ConstructionStage);
ConstructionStage.belongsTo(Order);
User.hasMany(Order);
Order.belongsTo(User);


Role.sync({ alter: true })
async function initializeRoles() {
  try {
    // Пытаемся найти роль "Пользователь"
    let role = await Role.findOne({ where: { name: "Пользователь" } });

    // Если роль не найдена, создаем обе роли
    if (!role) {
      console.log("Роли не найдены, создаем...");

      await Role.create({
        id: 1,
        name: "Пользователь"
      });

      await Role.create({
        id: 2,
        name: "Администратор"
      });
      await Role.create({
        id: 3,
        name: "Менеджер"
      });

      console.log("Роли успешно созданы");
    } else {
      console.log("Роль 'Пользователь' уже существует:", role.name);
    }
  } catch (error) {
    console.error("Ошибка при инициализации ролей:", error);
  }
}

// Вызываем функцию инициализации
initializeRoles();
seedProducts()
  // .then(() => process.exit(0))
  // .catch(() => process.exit(1));
sequelize.sync({ alter: true })



async function createDefaultUsers() {
  try {
    const hashedPassword = await bcrypt.hash('123asd123@', 10);

    // Создаём администратора
    const [admin, adminCreated] = await User.findOrCreate({
      where: { Email: 'admin@gmail.com' },
      defaults: {
        Name: 'Администратор Системы',
        Email: 'admin@gmail.com',
        emailVerified: true,
        Phone: '+79991234567',
        Password: hashedPassword,
        roleId: 2
      }
    });

    console.log(adminCreated ? 'Администратор создан' : 'Администратор уже существует');

    // Создаём менеджера
    const [manager, managerCreated] = await User.findOrCreate({
      where: { Email: 'manager@gmail.com' },
      defaults: {
        Name: 'Менеджер Проектов',
        Email: 'manager@gmail.com',
        emailVerified: true,
        Phone: '+79997654321',
        Password: hashedPassword,
        roleId: 3
      }
    });

    console.log(managerCreated ? 'Менеджер создан' : 'Менеджер уже существует');

    return { admin, manager };
  } catch (error) {
    console.error('Ошибка при создании пользователей по умолчанию:', error);
    throw error;
  }
}
(async () => {
  await createDefaultUsers();
})();