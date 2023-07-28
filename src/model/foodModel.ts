import {DataTypes, Model} from 'sequelize';
import {database} from '../configurations/';


interface FoodAttributes {
    id: string;
    order_count: number;
    name: string;
    date_created: Date;
    date_updated: Date;
    vendorId: string;
    price: string;
    image: string;
    ready_time: string;
    isAvailable: boolean;
    rating: number;
    description: string;
}

export class FoodInstance extends Model<FoodAttributes> {}

FoodInstance.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    order_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: "food name is required",
            },
          },
    },
    date_created: {
        type: DataTypes.DATE,
    },
date_updated: {
        type: DataTypes.DATE,
    },
    vendorId: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: "price name is required",
            },
          },
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Food Image is required'
            }
        }
    },
    ready_time: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notNull:{
                msg: 'Estimated ready Time required'
            },
        }
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

},{
    sequelize: database,
    tableName: 'Vendor'
}
)