import { baseApi } from "../../../app/api";


export const consultationApi = baseApi.injectEndpoints({
    endpoints:(build) => ({
        fetchAllConsultations : build.query({
            query:()=>({
                url:"/admin/consultations/fetchAllConsultations",
                method:"GET"
            })
        }),
        sendConsultationLink : build.mutation({
            query:(leadId)=>({
                url:`/admin/consultations/${leadId}/sendConsultationLink`,
                method:"POST"
            })
        }),
        canlendlyWebhook : build.mutation({
            query:()=>({
                url:`/admin/consultations/webhook/calendly`,
                method:"POST"
            })
        }),
        markConsultationAsCompleted : build.mutation({
            query:(consultationId)=>({
                url:`/admin/consultations/${consultationId}/markConsultationAsCompleted`,
                method:"POST"
            })
        })
    }),
})

export const {useFetchAllConsultationsQuery,useMarkConsultationAsCompletedMutation,useSendConsultationLinkMutation, useCanlendlyWebhookMutation}  = consultationApi