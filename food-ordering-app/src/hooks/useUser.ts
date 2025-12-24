import { userService } from "../services/userService";
import type { User } from "../types/types";

export const useUser = () => {
  const fetchUsers = () => {
    return userService.fetchUsers();
  };

  const addUser = (user: Omit<User, "id">) => {
    return userService.addUser(user);
  };

  return {
    fetchUsers,
    addUser,
  };
};

export default useUser;
