import {DataTypes, Model} from 'sequelize';
import {database} from '../configurations';


export interface UserAttributes {
    id?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    password: string;
    address?: string;
    phone_no?: string;
    role?: string;
    salt?: string;
    otp?: string;
    otp_expiry?: number;
    verified?: boolean
}

export class VendorInstance extends Model<UserAttributes> {}

VendorInstance.init({
     id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false
},
email: {
    type: DataTypes.STRING,
    allowNull: false,
},
firstname: {
    type: DataTypes.STRING,
    allowNull: false,
},
lastname: {
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
},
phone_no: {
    type: DataTypes.INTEGER,
    allowNull: false
},
address:{
    type: DataTypes.STRING,
    allowNull: false
},
otp:{
    type: DataTypes.INTEGER
},
otp_expiry:{
    type: DataTypes.TIME
},
verified:{
    type: DataTypes.BOOLEAN
},
role:{
    type: DataTypes.STRING
},

},{
    sequelize: database,
    tableName: 'User'
}
)