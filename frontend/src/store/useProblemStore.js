import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"



export const useProblemStore = create((set) => ({
    problems: [],
    problem: null,
    solvedProblem: [],
    isProblemsLoading: false,
    isProblemLoading: false,

    getAllProblems: async() => {
       try {
          set({isProblemsLoading: true})
          const res = await axiosInstance.get("/problem/get-all-problem")
                 
          set({problems: res.data.data})
       } catch (error) {
         console.log("Error getting all problems : ", error);
         toast.error("Error in getting problems")         
       }finally{
         set({isProblemsLoading: false})
       }
    },

    getProblemById: async(id) => { 
       try {
         
         set({isProblemLoading: true})
         console.log(id);
        const res = await axiosInstance.get(`/problem/get-problem/${id}`)
        console.log("res : ", res);
       
        set({problem: res.data?.data})  
        
       } catch (error) {
          console.log("Error is finding unique problem by id", error.message);
          toast.error("Error in fetching problem by id")
       }finally{
        set({isProblemLoading: false})
       }
       
    },

    getSolvedProblemByUser: async() => {
      try {
        // set({isProblemLoading: true})
        const res = await axiosInstance.get("/problem/solved-problem")
        set({solvedProblem: res.data.data})
      } catch (error) {
        console.log("Error fetching solved problems: ", error);
        toast.error("Error fetching solved problems")        
      }
      // finally{
        // set({isProblemLoading: false})
      // }
    }
    
}))