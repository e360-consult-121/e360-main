import { ParsedPortugalData } from "../parsingFunctions/portugalParse";
import { leadPriority } from "../types/enums/enums";

export const getPortugalPriority = (data:ParsedPortugalData):leadPriority => {

    return leadPriority.LOW
}