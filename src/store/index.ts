import { Middleware, configureStore } from "@reduxjs/toolkit";
import { toast } from "sonner";
import usersReducer, { rollbackUser } from "./users/slice";
//Un middleware es algo que se ejecuta a mitad de algo. Podemos colocar un middleware entre la ejecución del dispatch y la del reducer. O entre la actualización del estado y el re renderizado de la interfaz. Es decir, nos permite capturar cada vez que ehace un dispatch y esperar a que termine el reducer. Nos permite cambiar la funcionaldiad de lo que está haciendo la aplicación.
// Una mala práctica es crear la lógica de la persistencia de datos en cada reducer, pero una mejor práctica es hacerlo a través del middleware

//el primer argumento devuelve la store, el segundo devuelve una función para pasar a la siguiente etapa y el tercer argumento de la tercer función es la acción que se le está pasando
// cada funcion devuelve inyecta la información que puede en ese instante, es decir, cada funcion representa una etapa del flujo view, state, actiion en el que se basa redux
// con middleware podemos ejecutar acciones antes y después de que se actualice el estado, podemos validar datos, enviar peticiones asincronas, antes y después

const exampleMiddleware: Middleware = (store) => (next) => (action) => {
	// podemos ver el estado antes de que se actualice
	console.log(store.getState());
	// actualiza el estado
	next(action);
	// ejecuta una función después de actualizado el estado
	console.log(store.getState());
};

const syncWithDataBase: Middleware = (store) => (next) => (action) => {
	const { type, payload } = action;
	const previousState = store.getState();
	next(action);

	if (type === "users/deleteUserById") {
		const userIdToRemove = payload;
		const userToRemove = previousState.users.find(
			(user) => user.id === userIdToRemove,
		);

		fetch(`https//jsonplaceholder.typicode.com/users/${userIdToRemove}`, {
			method: "DELETE",
		})
			.then((res) => {
				if (res.ok)
					toast.success(`Usuario ${userIdToRemove} eliminado correctamente`);
				throw new Error("Error al eliminar el usuario");
			})
			.catch((err) => {
				toast.error(`Error deleting user ${userIdToRemove}`);
				if (userToRemove) store.dispatch(rollbackUser);
				console.log(err);
				console.log("error");
			});
	}
};

const persistanceLocalStorageMiddleware: Middleware =
	(store) => (next) => (action) => {
		next(action);
		localStorage.setItem("__redux__state__", JSON.stringify(store.getState()));
	};

export const store = configureStore({
	reducer: {
		users: usersReducer,
	},
	middleware: [persistanceLocalStorageMiddleware, syncWithDataBase],
});

// this lines helps to deal with typescript redux issues
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
