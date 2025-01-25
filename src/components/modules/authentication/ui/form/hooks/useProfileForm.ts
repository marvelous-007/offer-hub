import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../schema/user-profile.schema";
import { z } from "zod";

const useProfileForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      wallet: "",
    },
  });

  const onSubmit = async () => {
    console.log("submiting");
  };

  return {
    form,
    onSubmit,
  };
};

export default useProfileForm;
