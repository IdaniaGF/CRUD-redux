import { User, UserId, addNewUser, deleteUserById } from "../store/users/slice";
import { useAppDispatch } from "./store";

// this allow us to import useAppDispatch in every component abstract this logic
export const useUserActions = () => {
	const dispatch = useAppDispatch();

	const addUser = ({ name, email, github }: User) => {
		dispatch(addNewUser({ name, email, github }));
	};

	const removeUser = (id: UserId) => {
		dispatch(deleteUserById(id));
	};
	return { addUser, removeUser };
};
