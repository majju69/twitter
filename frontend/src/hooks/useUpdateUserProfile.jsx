import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUserProfile=()=>
{
    const queryClient=useQueryClient();
    const {mutateAsync:updateProfile,isPending:isUpdatingProfile}=useMutation({
		mutationFn: async(formData)=>{
			try {
				const res=await fetch(`/api/users/update`,{
					method:"POST",
					headers:{"Content-Type":"application/json"},
					body:JSON.stringify(formData)
				});
				const data=await res.json();
				if(!res.ok) throw new Error(data.error||"Failed to update profile");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess:()=>{
			Promise.all([
				queryClient.invalidateQueries({queryKey:["authUser"]}),
				queryClient.invalidateQueries({queryKey:["userProfile"]})
			])
			toast.success("Profile updated successfully");
			// alert("Profile updated successfully");
		},
		onError:(error)=>{
			toast.error(error.message);
		}
	});
    return {updateProfile,isUpdatingProfile}
}

export default useUpdateUserProfile;