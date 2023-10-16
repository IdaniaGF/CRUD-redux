import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";

// we use this to avoid type useSelector return type each time we use useSelector, in addition, we avoid import redux in every component, so when we want to stop using redux, we only change this lines instead of all the components
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
