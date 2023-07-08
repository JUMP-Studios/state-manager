import { StateComponent, StateConstructor } from "./util";

export default function createState<S, P>(component: StateConstructor<S, P>, props: StateComponent<S, P>["props"]) {
	return new component(props)
}