import { supabase } from "@/lib/supabase/supabase";
import { AppError } from "@/utils/AppError";
import { CreateUserDTO } from "@/types/user.types";

class UserService {
  async createUser(data: CreateUserDTO) {
    // Verify unique wallet_address
    const { data: walletUser } = await supabase
      .from("users")
      .select("id")
      .eq("wallet_address", data.wallet_address)
      .single();

    if (walletUser) throw new AppError("Wallet_address_already_registered", 409);

    // Verify unique username
    const { data: usernameUser } = await supabase
      .from("users")
      .select("id")
      .eq("username", data.username)
      .single();

    if (usernameUser) throw new AppError("Username_already_taken", 409);

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{
        wallet_address: data.wallet_address,
        username: data.username,
        name: data.name,
        bio: data.bio,
        email: data.email,
        is_freelancer: data.is_freelancer ?? false,
      }])
      .select()
      .single();

    if (insertError) throw new AppError("Error_creating_user", 500);
    return newUser;
  }

    async getUserById(id: string) {
    const { data, error } = await supabase
        .from("users")
        .select("id, wallet_address, username, name, bio, is_freelancer")
        .eq("id", id)
        .single();

    if (error) return null;
    return data;
    }
}

export const userService = new UserService();