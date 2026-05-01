import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useSubmissionStore = create((set, get) => ({
  isLoading: false,
  submissions: [],
  submission: null,
  submissionCount: null,

  getAllSubmission: async() => {
        try {
            set({isLoading: true})
            const res = await axiosInstance.get(`/submission/all-submission`)
            set({submissions: res.data.data})
            toast.success(res.data.message)
        } catch (error) {
            console.log("Error getting all submissions: ", error);
            toast.error("error getting all submissions")            
        } finally{
            set({isLoading: false})
        }
    },

    getSubmissionsForProblem : async(problemId) => {
        try {
            set({isLoading: true})

            const res = await axiosInstance.get(`/submission/get-submission/${problemId}`)
            set({submission: res.data.data})
        } catch (error) {
            console.log("Error is finding submission: ", error);
            toast.error("Error no submission find")
            
        } finally{
            set({isLoading: false})
        }

    },

    getAllTheSubmissionsForProblem: async(problemId) => {
        try {
            set({isLoading: true})
            const res = await axiosInstance.get(`/submission/get-submissions-count/${problemId}`)

            set({submissionCount: res.data.count})
            
        } catch (error) {
            console.log("Error in finding all submission", error);
            toast.error("Error finding all submission")            
        } finally{
            set({isLoading: false})
        }
    },

}));
