import { StateComponent, StateConstructor } from "./util";

export default function createState<P>(component: StateConstructor<{}, P>, props: StateComponent<{}, P>["props"]) {
	new component(props)
}