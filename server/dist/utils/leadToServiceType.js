"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceType = void 0;
const getServiceType = (visaType) => {
    if (visaType.includes("Dominica")) {
        return "Dominica Passport";
    }
    else if (visaType.includes("Grenada")) {
        return "Grenada Passport";
    }
    else if (visaType.includes("Portugal")) {
        return "Portugal D7 Visa";
    }
    else if (visaType.includes("Dubai")) {
        return "Dubai Business Setup";
    }
    else {
        return "Unknown Service Type";
    }
};
exports.getServiceType = getServiceType;
