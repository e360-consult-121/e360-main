import { baseApi } from "../../../app/api";


export const clientInformationApi = baseApi.injectEndpoints({
    endpoints:(build) => ({
    sendPaymentLink: build.mutation({
        query:({leadId,data})=>({
            url:`/payment/${leadId}/sendPaymentLink`,
            method:"POST",
            data:data
        })
    })
    
    
    })

})

export const { useSendPaymentLinkMutation } = clientInformationApi