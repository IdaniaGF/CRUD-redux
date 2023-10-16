import { PayloadAction, createSlice } from "@reduxjs/toolkit";

//separamos aparte el userId type en caso de que se cambie de number a string, solo se cambie en una sola parte del código
export type UserId = string;

export interface User {
	name: string;
	email: string;
	github: string;
}

export interface UserWithId extends User {
	id: UserId;
}

const defaultInitialState: UserWithId[] = [
	{
		id: "1",
		name: "Peter Doe",
		email: "peter@gmail.com",
		github: "peter",
	},
	{
		id: "2",
		name: "Lena Whitehouse",
		email: "lena@gmail.com",
		github: "lenaWhite",
	},
	{
		id: "3",
		name: "Phil Less",
		email: "phill@gmail.com",
		github: "PhilLess",
	},
];

//Inmediately invoqued function expresion, una forma de encapsular lógica para incializar una constante
const initialState: UserWithId[] = (() => {
	const persistedState = localStorage.getItem("__redux__state__");
	if (persistedState) return JSON.parse(persistedState).users;
	return defaultInitialState;
})();

// CON REDUX TOOLKIT NO TIENES QUE CAMBIOS INMUTABLES COMO DECIA EN LA DOCUMENTACION DE REDUX, SINO QUE PUEDES MUTAR EL ESTADO ANTERIOR, ES DECIR, no es necesario devolver y generar un nunevo estado, PUEDES USAR HERRAMIENTAS COMO state.push(). Esto es gracias a que redux toolkit usa una librería por detras llamada immmer, immer realiza los cambios de manera immutable por ti. El coste es que pesa mas y el rendimiento es menor, así que trata de usar sus utilidades. Ver la documentacion

export const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {
		addNewUser: (state, action: PayloadAction<User>) => {
			const id = crypto.randomUUID(); // por ejemplo aqui se esta mutando el estado anterior
			state.push({ id, ...action.payload });
		},
		// payload action is a tool from redux, that allow us to indicate the type of the payload instead of typing all the action param
		deleteUserById: (state, action: PayloadAction<UserId>) => {
			const id = action.payload;
			return state.filter((user) => user.id !== id);
		},
		rollbackUser: (state, action: PayloadAction<UserWithId>) => {
			const isUserAlreadyDefined = state.find(
				(user) => user.id === action.payload.id,
			);
			if (!isUserAlreadyDefined) {
				state.push(action.payload);
			}
		},
	},
});

export default usersSlice.reducer;

// it is recommended to export the action itself. With this, we avoid using the string name of the action and commit type errors
export const { addNewUser, deleteUserById, rollbackUser } = usersSlice.actions;
