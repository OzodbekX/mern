const sequlize = require("../db");
const { DataTypes } = require("sequelize");
const User = sequlize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" }
});
const Basket = sequlize.define("basket", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});
const BasketDevice = sequlize.define("basket_device", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});
const UserCard = sequlize.define("user_card", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    holderName: { type: DataTypes.STRING, allowNull: false },
    brand: { type: DataTypes.STRING, allowNull: false },
    last4: { type: DataTypes.STRING(4), allowNull: false },
    expiryMonth: { type: DataTypes.INTEGER, allowNull: false },
    expiryYear: { type: DataTypes.INTEGER, allowNull: false },
    isDefault: { type: DataTypes.BOOLEAN, defaultValue: false }
});
const Order = sequlize.define("order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    transactionId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
    items: { type: DataTypes.JSONB, allowNull: false },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    cardLast4: { type: DataTypes.STRING(4), allowNull: false },
    verificationCode: { type: DataTypes.STRING(6), allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "PENDING_VERIFICATION" }
});
const Device = sequlize.define("device", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    img: { type: DataTypes.STRING, allowNull: false }
});

const Type = sequlize.define("type", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
});
const Brand = sequlize.define("brand", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
});
const Rating = sequlize.define("rating", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.INTEGER, allowNull: false }
});
const DeviceInfo = sequlize.define("device_info", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false }
});

const TypeBrand = sequlize.define("type_brand", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});
User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(UserCard);
UserCard.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);

Type.hasMany(Device);
Device.belongsTo(Type);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasMany(Rating);
Rating.belongsTo(Device);

Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

Device.hasMany(DeviceInfo,{as:'info'});
DeviceInfo.belongsTo(Device);

Type.belongsToMany(Brand, { through: "type_brand" });
Brand.belongsToMany(Type, { through: "type_brand" });

module.exports = {
    User,
    Basket,
    BasketDevice,
    UserCard,
    Order,
    Device,
    Type,
    Brand,
    Rating,
    DeviceInfo,
    TypeBrand
};
