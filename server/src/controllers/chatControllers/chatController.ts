import { Request, Response } from "express";
import mongoose, { Schema, Document, Types } from "mongoose";
import axios from "axios";
import { senderTypeEnum , messageTypeEnum} from "../../types/enums/enums";
import { MessageModel} from "../../models/chatModels/msgModel";
import moment from "moment"; 
// Temp saare docs store karwane 

export const msgSend= async (req: Request, res: Response) => {

    const {  textMsg } = req.body;
    const { visaApplicationId } = req.params;

    let senderId: Types.ObjectId;
    let senderType: senderTypeEnum;

      if (req.admin) {
        senderId = new Types.ObjectId(req.admin.id);
        senderType = senderTypeEnum.ADMIN;
      }
      else if (req.user) {
        senderId = new Types.ObjectId(req.user.id);
        senderType = senderTypeEnum.USER;
      }
      else {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
    
    
      const newMessage = await MessageModel.create({
        visaApplicationId: new Types.ObjectId(visaApplicationId),
        senderId,
        senderType,
        messageType : messageTypeEnum.TextMsg,
        textMsg: textMsg
      });
    
      res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: newMessage,
      });
};





export const fetchAllMsg = async (req: Request, res: Response) => {
  const { visaApplicationId } = req.params;

  if (!Types.ObjectId.isValid(visaApplicationId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid visaApplicationId",
    });
  }

  const messages = await MessageModel.aggregate([
    {
      $match: {
        visaApplicationId: new Types.ObjectId(visaApplicationId),
      },
    },
    {
      $project: {
        textMsg: 1,
        senderType: 1,
        fileUrl: 1,
        fileName: 1,
        createdAt: 1,
        date: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: "$date",
        messages: {
          $push: {
            textMsg: "$textMsg",
            senderType: "$senderType",
            fileUrl: "$fileUrl",
            fileName: "$fileName",
            createdAt: "$createdAt",
          },
        },
      },
    },
    {
      $sort: { _id: -1 }, // date descending
    },
  ]);

  res.status(200).json({
    success: true,
    data: messages.reduce((acc, curr) => {
      acc[curr._id] = curr.messages;
      return acc;
    }, {} as Record<string, any[]>),
  });
};


// API for moving document to document vault
export const moveToDocVault = async (req: Request, res: Response) => {
  
};


// API for sending file 
export const uploadFile = async (req: Request, res: Response) => {
  const { visaApplicationId } = req.params;

  if (!visaApplicationId || !req.file) {
    return res.status(400).json({ success: false, message: "visaApplicationId and file are required" });
  }

    const file = req.file;

  let senderId: Types.ObjectId;
  let senderType: senderTypeEnum;

  if (req.admin) {
    senderId = new Types.ObjectId(req.admin.id);
    senderType = senderTypeEnum.ADMIN;
  } else if (req.user) {
    senderId = new Types.ObjectId(req.user.id);
    senderType = senderTypeEnum.USER;
  } else {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const fileUrl = req.file.path; // If using local storage
  const fileName = req.file.originalname;

  const newMessage = await MessageModel.create({
    visaApplicationId: new Types.ObjectId(visaApplicationId),
    senderId,
    senderType,
    messageType: messageTypeEnum.FileMsg,
    fileUrl : (file as any)?.location,
    fileName : (file as any)?.originalname,
    textMsg: null,
  });

  res.status(201).json({ success: true, data: newMessage });
};
