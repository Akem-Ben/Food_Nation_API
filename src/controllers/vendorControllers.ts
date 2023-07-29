import {Request, Response, NextFunction} from 'express';
import {JwtPayload} from 'jsonwebtoken';
import {v4} from 'uuid';
import axios from 'axios';
import {GenerateSignature, GenerateSignatureForVerify, checkPassword, GenerateSalt,
    passWordGenerator,
    hashPassword} from '../utils/helpers';
import {axiosVerifyVendor} from '../utils/helpers';
import {vendorSchema, option,
    loginSchema,
    updateSchema, foodCreateSchema} from '../utils/validators';
import {sendmail,
    emailHtml} from '../utils/notification'
import { VendorInstance, VendorAttributes } from '../model/vendorModels';
import { GMAI_USER } from '../configurations';
import {VendorPayLoad} from '../interface';
import {HttpError} from 'http-errors';
import { FoodInstance } from '../model/foodModel';

export const verifyVendor = async (req:Request, res:Response)=>{
    try{
        const reg_number:any = req.query.reg_number;
        if (!reg_number) {
            return res.status(400).json({
              msg: 'Bad Request: Registration number is required.',
            });
          }
          const regex = /^AC-\d{8}$/;
          if (!regex.test(reg_number)) {
            return res.status(400).json({
                message: `Invalid Registration Number`
              })
          }
          const response = await axiosVerifyVendor(reg_number)
          if(response === "not found"){
              return res.status(404).json({
                  message: `This business is not registered`
                })
            }
          const userDetails = response.findCompany
          const token = await GenerateSignatureForVerify(userDetails.reg_no)
          res.cookie('token', token)
        // res.clearCookie('cookies')
          return res.status(200).json({
            msg: `Business Verified`,
            company_name: userDetails.company_name,
            reg_no: userDetails.reg_no,
          })
    }catch(err:any){
        console.log(err.message);
        return res.status(500).json({
            msg: `Internal Server Error`
        })
    }
}

export const registerVendor = async(req:JwtPayload, res:Response)=>{
    try{
        const id = v4()
        const userId = req.regNo
        const company_details = await axiosVerifyVendor(userId)
        const userDetails = company_details.findCompany
        const { email, phone_no, name_of_owner, restaurant_name, address, cover_image} = req.body;
        const validate = vendorSchema.validate(req.body, option)
        if(validate.error){
            return res.status(400).json({
                Error: validate.error.details[0].message,
              });
        }
        const vendor = await VendorInstance.findOne({where:{email:email}})
        const restaurant = await VendorInstance.findOne({where:{restaurant_name:restaurant_name}})// as unknown as VendorAttributes
        if(vendor || restaurant){
            return res.status(400).json({
                msg: `Email/Restaurant name already Exists`
            })
        }
        const salt = await GenerateSalt()
        const password = await passWordGenerator(restaurant_name)
        const hash = await hashPassword(password, salt)
        const html = emailHtml(email, password)

        const newVendor:any = await VendorInstance.create({
            id: id,
            email,
            restaurant_name,
            name_of_owner,
            company_name: userDetails.company_name,
            password: hash,
            address,
            salt,
            phone_no,
            isAvailable: true,
            role: "vendor",
            cover_image,
            rating: 0,
            orders: 0
        }) as unknown as VendorAttributes

        if(newVendor){
            await sendmail(GMAI_USER!, email, "Welcome", html)
            const token = await GenerateSignature({
                id:newVendor.id,
                email:newVendor.email
            })
            res.cookie('token', token)
            return res.status(200).json({
                message: `Vendor Created Successfully`,
                newVendor
            })
        }
        return res.status(400).json({
            message: `Unable to create`
        })

    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({
            msg: `Internal Server Error`
        })
    }
}

export const vendorLogin = async (req:Request, res:Response) => {
    try{
    const {email, password} = req.body;
    const validateResult = loginSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //check if user exist
    const Vendor:any = (await VendorInstance.findOne({
      where: { email: email },
    })) as unknown as VendorAttributes;

    if(!Vendor) return res.status(404).json({msg:`Vendor not Found`})

        const validation = await checkPassword(
          password,
          Vendor.password
        );
  
        if (validation) {
          const token = await GenerateSignature({
            id: Vendor.id,
            email: Vendor.email
          })

          res.cookie('token', token)
        //   res.clearCookie('token')
        return res.status(200).json({
            message: `Login Successful`,
            id: Vendor.id,
            email: Vendor.email,
            role: Vendor.role
        })
    }
    return res.status(400).json({
        message: `Wrong Password`
    })
    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({
            message: `Internal Server Error`
        })
    }
}

export const vendorChangeLoginPassword = async (req:JwtPayload, res:Response) => {
    try{
        const {new_password, confirm_password} = req.body;
        if(new_password !== confirm_password){
            return res.status(400).json({
                message: `Password Mismatch`
            })
        }
        const userId = req.vendor.id;
        const vendor:any = await VendorInstance.findOne({where: { id: userId },
        }) as unknown as VendorAttributes;
          const token = await GenerateSignature({
            id: vendor.id,
            email: vendor.email
          })
          res.cookie('token', token)
          const new_salt = await GenerateSalt()
          const hash = await hashPassword(new_password, new_salt)
          const updatedPassword = await VendorInstance.update(
            {
             password:hash,
             salt: new_salt 
            },
            { where: { id: userId } }
          ) as unknown as VendorAttributes;
       
          if (updatedPassword) {
            return res.status(200).json({
              message: "You have successfully updated your profile",
              id:vendor.id,
              email: vendor.email,
              role: vendor.role
            });
          }
          return res.status(400).json({
            message: "Unsuccessful, contact Admin",
            vendor
          });
    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({
            message: `Internal Server Error`
        })
    }
}

// export const vendorEditProfile = async (req:JwtPayload, res:Response)=>{
//     try{
//         const userEmail = req.vendor.email
//         const {email, restaurant_name, name_of_owner, address, phone_no, cover_image} = req.body
//         const validateResult = updateSchema.validate(req.body, option);
//     if (validateResult.error) {
//       return res.status(400).json({
//         Error: validateResult.error.details[0].message,
//       });
//     }
//     const findVendor = await VendorInstance.findOne({where: {email:userEmail}}) as unknown as VendorAttributes

//         if(!findVendor) return res.status(404).json({msg: `You cannot this profile`})
//         const updatedVendor = (await VendorInstance.update(
//             {
//             email:email || findVendor.email,
//             restaurant_name:restaurant_name || findVendor.restaurant_name,
//             name_of_owner:name_of_owner || findVendor.name_of_owner,
//             address: address || findVendor.address,
//             cover_image: cover_image || findVendor.cover_image,
//             phone_no:phone_no || findVendor.phone_no
//             },
//             { where: { email: userEmail } }
//           )) as unknown as VendorAttributes;
       
//           if (updatedVendor) {
//             const newVendor = await VendorInstance.findOne({where: {email:updatedVendor.email}}) as unknown as VendorAttributes
//             return res.status(200).json({
//               message: "You have successfully updated your profile",
//               newVendor
//             });
//           }
//           return res.status(400).json({
//             message: "Error updating your profile",
//           });
//         }catch(err:any){
//             console.log(err.message)
//             return res.status(500).json({message: `Internal Server Error`})
//         }
//}

export const getAllVendors = async(req:JwtPayload, res:Response)=>{
    try{
        const vendor = await VendorInstance.findAll({})
        return res.status(200).json({
            message: `Successful`,
            vendor
        })
    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({
            msg: `Internal Server Error`
        })
    }
}

export const vendorEditProfile = async (req: JwtPayload, res: Response) => {
    try {
      const vend = req.vendor.id;
      const { email, restaurant_name, name_of_owner, address, phone_no, cover_image } = req.body;
  
    //   const validateResult = updateSchema.validate(req.body, option);
    //   if (validateResult.error) {
    //     return res.status(400).json({
    //       Error: validateResult.error.details[0].message,
    //     });
    //   }
  
      const findVendor = await VendorInstance.findOne({ where: { id: vend } }) as unknown as VendorAttributes;
  
      if (!findVendor) return res.status(404).json({ msg: `You cannot edit this profile` });
  
      // Create an object to store the fields that need to be updated
      const updatedFields: Partial<VendorAttributes> = {};
  
      // Check if email is provided and not empty, then add it to the updatedFields object
      if (email !== '') {
        updatedFields.email = email;
      }
  
      // Add other fields to the updatedFields object if they are provided and not empty
      if (restaurant_name !== '') {
        updatedFields.restaurant_name = restaurant_name;
      }
  
      if (name_of_owner !== '') {
        updatedFields.name_of_owner = name_of_owner;
      }
  
      if (address !== '') {
        updatedFields.address = address;
      }
  
      if (phone_no !== '') {
        updatedFields.phone_no = phone_no;
      }
  
      if (cover_image !== '') {
        updatedFields.cover_image = cover_image;
      }
  
      // Perform the update operation with the fields from updatedFields
      const rowsAffected:any = await VendorInstance.update(updatedFields, {
        where: { id: vend },
      });
      if (rowsAffected ) {
        const newVendor = await VendorInstance.findOne({ where: { id: vend } }) as unknown as VendorAttributes;
        return res.status(200).json({
          message: "You have successfully updated your profile",
          newVendor,
        });
      }
  
      return res.status(400).json({
        message: "Error updating your profile",
      });
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).json({ message: `Internal Server Error` });
    }
}

export const deleteVendor = async (req:JwtPayload, res:Response)=>{
    try{
        const userEmail = req.query.email
        const delUser = await VendorInstance.destroy({where: {email:userEmail}}) as unknown as VendorAttributes
        if(delUser){
            const allUsers = await VendorInstance.findAll({}) 
        return res.status(200).json({msg: `Deleted successfully`, allUsers})
        }
    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({msg: `Internal Server Error`})
    }
}

export const getSingleVendor = async (req:JwtPayload, res:Response)=>{
    try{
        const userId = req.vendor.id;
        const vendor = await VendorInstance.findOne({where: {id:userId}})
        if(!vendor) return res.status(404).json({msg: `Vendor not found`})
        return res.status(200).json({msg: `Here is your profile`, vendor})
    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({msg: `Internal Server Error`})
    }
}

export const getSingleVendorProfile = async (req:JwtPayload, res:Response)=>{
    try{
        const userId = req.vendor.id;    
       const Vendor = await VendorInstance.findOne({
            where:{id:userId},
        include: [
            {
                model:FoodInstance,
                as: 'food',
                attributes:["id", "name", "description", "order_count", "ready_time", "image", "price", "rating", "vendorId"]
            }
        ]})as unknown as VendorAttributes;
        if(!Vendor) return res.status(404).json({msg: `Vendor not found`})
        return res.status(200).json({
            Vendor
        })
    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({msg: `Internal Server Error`})
    }
}

export const vendorCreateFood = async (req:JwtPayload, res:Response)=>{
    try{
        const creatorId = req.vendor.id;
        const foodId = v4()
        const {name, price, image, ready_time, description} = req.body;
        const validateInput = foodCreateSchema.validate(req.body, option)
        if(validateInput.error){
            console.log(validateInput.error)
            return res.status(400).json({
                Error: validateInput.error.details[0].message,
              });
        }
        const vendor = await VendorInstance.findOne({where: {id:creatorId}})
        if(vendor){
        const newFood = await FoodInstance.create({
            id: foodId,
            order_count: 0,
            name,
            date_created: new Date(),
            date_updated: new Date(),
            vendorId: creatorId,
            price,
            image,
            ready_time,
            isAvailable: true,
            rating: 0,
            description
        })
        return res.status(200).json({
            message: `Food successfully created`,
            newFood
        })
    }
    return res.status(404).json({
        message: `You are not on our database`
    })
    }catch(err:any){
        console.log(err)
        return res.status(500).json({
            msg: `Internal Server Error`
        })
    }
}