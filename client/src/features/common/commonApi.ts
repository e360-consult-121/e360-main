import { baseApi } from "../../app/api";

export const commonApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
      //Fetch customers current visa application step  informationa and  requirements
      getCurrentStepInfo: build.query({
        query: (visaApplicationId) => ({
          url: `visaApplications/common/${visaApplicationId}/getCurrentStepInfo`,
          method: "GET"
        }),
      }),


      //lots of changes here 
      uploadDocument: build.mutation({
        // Use queryFn instead of query for complete control
        queryFn: async ({ reqStatusId, file }, _extraOptions,) => {
          try {
            const formData = new FormData();
            formData.append("file", file);
            
            // Log the file being sent
            console.log("Uploading file:", file?.name, file?.size, file?.type);
            
            // Use native fetch for complete control over headers
            const  baseUrl= import.meta.env.VITE_BACKEND_BASE_URL
            const response = await fetch(
              `${baseUrl}/api/v1/visaApplications/common/${reqStatusId}/uploadDocument`, 
              {
                method: 'POST',
                body: formData,
                // DO NOT set Content-Type header here - browser will set it correctly
                // Include credentials if needed for auth
                credentials: 'include'
              }
            );
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => null);
              return { 
                error: { 
                  status: response.status, 
                  data: errorData || 'Upload failed' 
                } 
              };
            }
            
            const result = await response.json();
            return { data: result };
          } catch (error) {
            console.error("Upload error:", error);
            return { 
              error: { 
                status: 500, 
                data: error
              } 
            };
          }
        }
      }),

      stepSubmit: build.mutation({
        query: (visaApplicationId) => { 
          return {
            url: `/visaApplications/client-side/${visaApplicationId}/stepSubmit`,
            method: "POST",
          };
        },
      }),
      moveToNextStep: build.mutation({
        query: (visaApplicationId) => { 
          return {
            url: `/visaApplications/client-side/${visaApplicationId}/moveToNextStep`,
            method: "POST",
          };
        },
      }),
      fetchDeliveryDetails: build.query({
        query: (stepStatusId) => { 
          return {
            url: `visaApplications/common/${stepStatusId}/fetchBothDetails`,
            method: "GET",
          };
        },
      }),
    })
})

export const {useFetchDeliveryDetailsQuery, useGetCurrentStepInfoQuery , useUploadDocumentMutation , useStepSubmitMutation ,useMoveToNextStepMutation} = commonApi;