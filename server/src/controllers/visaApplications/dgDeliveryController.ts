import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError";
import { DgDeliveryModel } from "../../extraModels/dgDelivery";
import { DgShippingModel } from "../../extraModels/dgShipping";


// user karega
export const uploadDeliveryDetails = async (req: Request, res: Response) => {
    const { stepStatusId } = req.params;
    const {
      fullName,
      email,
      phoneNo,
      alternativePhoneNo,
      address,
      city,
      country,
      postalCode,
    } = req.body;
  
    const delivery = new DgDeliveryModel({
      fullName,
      email,
      phoneNo,
      alternativePhoneNo,
      address,
      city,
      country,
      postalCode,
      stepStatusId,
    });
  
    const savedDelivery = await delivery.save();
  
    res.status(201).json({
      success: true,
      message: 'Delivery details uploaded successfully',
      data: savedDelivery,
    });
   
};



// Admin karega 
export const uploadShippingDetails = async (req: Request, res: Response) => {
    const { stepStatusId } = req.params;
    const {
      courierService,
      trackingNo,
      trackingUrl,
      email,
      phoneNo
    } = req.body;
  
    const shipping = new DgShippingModel({
      courierService,
      trackingNo,
      trackingUrl,
      supportInfo: {
        email,
        phoneNo
      },
      stepStatusId,
    });
  
    const savedShipping = await shipping.save();
  
    res.status(201).json({
      success: true,
      message: 'Shipping details uploaded successfully',
      data: savedShipping,
    });
  };



// isme authorizaAdmin nahi lagana , user&admin dono ke liye run karenge 
export const fetchBothDetails = async (req: Request, res: Response) => {
    const { stepStatusId } = req.params;
  
    const deliveryDetails = await DgDeliveryModel.findOne({ stepStatusId });
    const shippingDetails = await DgShippingModel.findOne({ stepStatusId });
  
    res.status(200).json({
      success: true,
      message: 'Fetched delivery and shipping details successfully',
      data: {
        delivery: deliveryDetails,
        shipping: shippingDetails,
      },
    });
  };
  












  
  
  