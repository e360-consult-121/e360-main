import { baseApi } from "../../../app/api";


export const clientInformationApi = baseApi.injectEndpoints({
    endpoints:(build) => ({
    sendPaymentLink: build.mutation({
        query:({leadid,body })=>({
            url:`/admin/payment/${leadid}/sendPaymentLink`,
            method:"POST",
            data:body 
        })
    })
    
    
    })

})

export const { useSendPaymentLinkMutation } = clientInformationApi