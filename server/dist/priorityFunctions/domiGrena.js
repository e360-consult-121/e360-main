"use strict";
// import { ParsedxxxData } from "../parsingFunctions/domiGrenaParse";
// import { leadPriority } from "../types/enums/enums";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomiGrenaPriority = getDomiGrenaPriority;
const dominicaPriority_1 = require("./dominicaPriority");
const grenadaPriority_1 = require("./grenadaPriority");
function getDomiGrenaPriority(data) {
    const visaTypeName = data["visaTypeName"];
    console.log("Visa Type Name:", visaTypeName);
    if (visaTypeName === "DOMINICA") {
        return (0, dominicaPriority_1.getDominicaPriority)(data);
    }
    else if (visaTypeName === "GRENADA") {
        return (0, grenadaPriority_1.getGrenadaPriority)(data);
    }
    else {
        throw new Error("Unknown visa type in form data");
    }
}
