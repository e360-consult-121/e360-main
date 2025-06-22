import { Request, Response, NextFunction } from "express";
import { VisaTypeModel } from "../../models/VisaType";
import { UserModel } from "../../models/Users";
import { VisaApplicationModel } from "../../models/VisaApplication";
import { VisaStepModel as stepModel } from "../../models/VisaStep";
import { LeadModel as leadModel } from "../../leadModels/leadModel";
import { PaymentModel as paymentModel } from "../../leadModels/paymentModel";
import { currencyConversion } from "../../services/currencyConversion/currencyConversion";
import { VisaStepRequirementModel as reqModel } from "../../models/VisaStepRequirement";
import { VisaTypeEnum, paymentStatus } from "../../types/enums/enums";
import AppError from "../../utils/appError";
import { ObjectId } from "mongoose";
import { RoleEnum } from "../../types/enums/enums";
import { searchPaginatedQuery } from "../../services/searchAndPagination/searchPaginatedQuery";

// API for fetchAllClients
export const fetchAllClients = async (req: Request, res: Response) => {
  const {
    search,
    page = "1",
    limit = "10",
    sortBy = "name",
    order = "asc",
    status, // Add this
    dateFilter, // Add this
  } = req.query;

  const sortFieldsMap: Record<string, string> = {
    name: "name",
    email: "email",
    phone: "phone",
    totalApplications: "totalApplications",
    totalRevenue: "totalRevenue",
    startingDate: "startingDate",
  };

  const sortField = sortFieldsMap[sortBy as string] || "name";
  const sortOrder = order === "desc" ? -1 : 1;

  const additionalFilters: any = { role: RoleEnum.USER };

  // Add status filter
  if (status && status !== "All") {
    additionalFilters.status = status;
  }

  if (Array.isArray(req.assignedIds) && req.assignedIds.length > 0) {
    additionalFilters._id = { $in: req.assignedIds };
  }

  if (Array.isArray(req.assignedIds) && req.assignedIds.length > 0) {
    additionalFilters._id = { $in: req.assignedIds };
  }

  const postMatchStages = [
    {
      $lookup: {
        from: "visaapplications",
        localField: "_id",
        foreignField: "userId",
        as: "applications",
      },
    },

    {
      $addFields: {
        totalApplications: { $size: "$applications" },
        completedApplications: {
          $size: {
            $filter: {
              input: "$applications",
              cond: { $eq: ["$$this.status", "COMPLETED"] },
            },
          },
        },
        pendingApplications: {
          $size: {
            $filter: {
              input: "$applications",
              cond: { $eq: ["$$this.status", "PENDING"] },
            },
          },
        },
        latestApplication: {
          $arrayElemAt: [
            {
              $sortArray: {
                input: "$applications",
                sortBy: { createdAt: -1 },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $match: {
        ...(dateFilter && dateFilter !== "All"
          ? {
              "latestApplication.createdAt": {
                ...(dateFilter === "Today"
                  ? {
                      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                      $lt: new Date(new Date().setHours(23, 59, 59, 999)),
                    }
                  : {}),
                ...(dateFilter === "Yesterday"
                  ? {
                      $gte: new Date(
                        new Date(
                          new Date().setDate(new Date().getDate() - 1)
                        ).setHours(0, 0, 0, 0)
                      ),
                      $lt: new Date(
                        new Date(
                          new Date().setDate(new Date().getDate() - 1)
                        ).setHours(23, 59, 59, 999)
                      ),
                    }
                  : {}),
              },
            }
          : {}),
      },
    },
    {
      $lookup: {
        from: "visatypes",
        localField: "latestApplication.visaTypeId",
        foreignField: "_id",
        as: "visaTypeInfo",
      },
    },

    {
      $lookup: {
        from: "leads",
        localField: "latestApplication.leadId",
        foreignField: "_id",
        as: "leadInfo",
      },
    },

    {
      $lookup: {
        from: "payments",
        localField: "applications.paymentId",
        foreignField: "_id",
        as: "payments",
      },
    },

    {
      $project: {
        userId: "$_id",
        name: 1,
        email: 1,
        phone: 1,
        nanoUserId: 1,
        totalApplications: 1,
        completedApplications: 1,
        pendingApplications: 1,
        caseId: "$nanoUserId",
        lastService: {
          $ifNull: [{ $arrayElemAt: ["$visaTypeInfo.visaType", 0] }, "N/A"],
        },
        startingDate: {
          $ifNull: [
            {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$latestApplication.createdAt",
              },
            },
            "N/A",
          ],
        },
        status: {
          $ifNull: ["$latestApplication.status", "N/A"],
        },

        payments: {
          $filter: {
            input: "$payments",
            cond: { $eq: ["$$this.status", "PAID"] },
          },
        },
      },
    },
  ];

  const customSort = {
    [sortField]: sortOrder,
  };

  try {
    const result = await searchPaginatedQuery({
      model: UserModel,
      collectionName: "users",
      search: search as string,
      page: Number(page),
      limit: Number(limit),
      additionalFilters,
      postMatchStages,
      customSort,
    });

    // Post-process for currency conversion (since it requires async operations)
    const enrichedData = await Promise.all(
      result.data.map(async (user: any) => {
        let totalRevenue = 0;

        if (user.payments && user.payments.length > 0) {
          for (const payment of user.payments) {
            if (!payment.amount) continue;

            const currency = payment.currency?.trim().toUpperCase() || "USD";
            let amountInUSD = payment.amount;

            if (currency !== "USD") {
              const converted = await currencyConversion(
                currency,
                "USD",
                payment.amount
              );
              if (converted === null) {
                console.error(
                  `Skipping payment due to failed conversion from ${currency}`
                );
                continue;
              }
              amountInUSD = converted;
            }

            totalRevenue += amountInUSD;
          }
        }

        return {
          ...user,
          totalRevenue,
          payments: undefined, // Remove payments array from final response
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Clients with visa application stats fetched successfully",
      data: enrichedData,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    });
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
};

//fetch all the visa appliactions of a client
export const fetchClientVisaApplications = async (
  req: Request,
  res: Response
) => {
  const { userid } = req.params;

  if (!userid) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const filter: any = { userId: userid };

    if (Array.isArray(req.assignedIds) && req.assignedIds.length > 0) {
      filter._id = { $in: req.assignedIds };
    }

    const applications = await VisaApplicationModel.find(filter).populate({
      path: "visaTypeId",
      select: "visaType",
    });

    if (!applications.length) {
      return res
        .status(404)
        .json({ message: "No visa applications found for this user" });
    }

    return res.status(200).json({ data: applications });
  } catch (error) {
    console.error("Error fetching visa applications:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// fetch All applications of a particular client
export const getAllApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { clientId } = req.params;

  const applications = await VisaApplicationModel.find({
    userId: clientId,
  })
    .sort({ createdAt: -1 })
    .populate({ path: "userId" })
    .populate({ path: "visaTypeId", select: "visaType" })
    .exec();

  res.status(200).json({
    success: true,
    data: applications,
  });
};

// new api for all info of visaApplication for new created client and application
// visaApplication -->> payment ki info

// create visaType
// export const createVisaType = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<Response | void> => {

//     const {visaType} = req.body;

//     console.log("visa")
//     // Validate the VisaTypeEnum
//     if (!Object.values(VisaTypeEnum).includes(visaType)) {
//         return res.status(400).json({ message: 'Invalid visa type.' });
//     }

//     const newVisaType = await VisaTypeModel.create({
//         visaType,
//     });

//     if (!newVisaType)
//         throw new AppError("Failed to creat new visaType", 500);

//     res.status(201).json({
//         message: 'Visa type created successfully.',
//         visaType: newVisaType,
//     });
// };

// // controller to push new steps in visaType steps
// export const addStepToVisaType = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<Response | void> => {
//     const { visaTypeId, stepName, stepNumber, stepSource, stepType } = req.body;

//     if (!visaTypeId || !stepName || stepNumber == null || !stepSource || !stepType) {
//         throw new AppError("visaTypeId, stepName, stepNumber, stepSource, and stepType are required.", 400);
//     }

//     const visaType = await VisaTypeModel.findById(visaTypeId);
//     if (!visaType) {
//         throw new AppError("VisaType not found.", 404);
//     }

//     const newStep = await stepModel.create({
//         visaTypeId,
//         stepName,
//         stepNumber,
//         stepSource,
//         stepType,
//     });

//     res.status(201).json({
//         message: "Step added successfully.",
//         step: newStep,
//     });
// };

// // Controller to create a new Requirement and push it to a particular steps in VisaType
// export const createRequirementAndPushToVisaType = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<Response | void> => {
//     const { visaTypeId, stepNumber, requirementData } = req.body;

//     if (!visaTypeId || !stepNumber || !requirementData) {
//         throw new AppError("visaTypeId, stepNumber, and requirementData are required.", 400);
//     }

//     // 1. Check if visaType exists
//     const visaType = await VisaTypeModel.findById(visaTypeId);
//     if (!visaType) {
//         throw new AppError("VisaType not found.", 404);
//     }

//     // 2. Find the visaStep using visaTypeId and stepNumber
//     const visaStep = await stepModel.findOne({ visaTypeId, stepNumber });
//     if (!visaStep) {
//         throw new AppError("Step not found for given visaType and stepNumber.", 404);
//     }

//     // 3. Create requirement with visaTypeId and visaStepId
//     const newRequirement = await reqModel.create({
//         visaTypeId,
//         visaStepId: visaStep._id,
//         question: requirementData.question,
//         requirementType: requirementData.requirementType,
//         required: requirementData.required ?? true, // fallback to true
//         options: requirementData.options || [],
//     });

//     res.status(201).json({
//         message: "Requirement created successfully.",
//         requirement: newRequirement,
//     });
// };
