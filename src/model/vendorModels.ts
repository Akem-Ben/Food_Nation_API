import {DataTypes, Model} from 'sequelize';
import {database} from '../configurations/';
import {FoodInstance} from './foodModel';


interface VendorAttributes {
    id: string;
    email: string;
    restaurant_name: string;
    name_of_owner: string;
    company_name: string;
    password: string;
    salt: string;
    address: string;
    phone_no: string;
    isAvailable: boolean;
    role: string;
    cover_image: string;
    rating: number;
    orders: number
}

export class VendorInstance extends Model<VendorAttributes> {}

VendorInstance.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Email is required"
            },
            isEmail: {
                msg: "Email is invalid"
            }
        }
    },
    restaurant_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: "restaurant name is required",
            },
          },
    },
    name_of_owner: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: "ownder's name is required",
            },
          },
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: "Password is required",
            },
            notEmpty: {
              msg: "Password is required",
            },
          },
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_no: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notNull:{
                msg: 'Phone Number is required'
            },
            notEmpty:{
                msg: 'Phone Number is required'
            }
        }
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cover_image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    orders: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }

},{
    sequelize: database,
    tableName: 'Vendor'
}
)

VendorInstance.hasMany(FoodInstance, {foreignKey:'VendorId' as 'Food'})
FoodInstance.belongsTo(VendorInstance, {foreignKey: 'VendorId' as 'Vendor'})