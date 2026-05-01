import {create} from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

export const useExecutionStore = create((set) => ({
    isExecuting: false,
    submission: null,

    executeCode: async(source_code, languageId, stdin, expected_outputs, problemId) => {
      try {
         set({isExecuting: true})
          console.log("Submission:",JSON.stringify({
                  source_code,
                  languageId,
                  stdin,
                  expected_outputs,
                  problemId
              }));
  
          const res = await axiosInstance.post("/execute-code",{source_code, languageId, stdin, expected_outputs, problemId})
  
          set({submission: res.data.data})
      } catch (error) {
        console.log("error executing code");
        toast.error("error in executing code")
        
      }finally{
        set({isExecuting: false})
      }
    }

}))