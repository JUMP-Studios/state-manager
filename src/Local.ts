/* eslint-disable roblox-ts/no-private-identifier */
import Object from "@rbxts/object-utils";
import None from "./None";
import { MapToNone } from "./util";
import Table from "@jumpstudios/table-util";

export default interface State<S = {}, P = {}> {
	shouldUpdate(newState: Partial<S>): boolean;
	willUpdate(newState: Partial<S>): void;
	willBeDestroyed(): void;
}

function filterNone<T extends Record<string, unknown> = {}>(given: T) {
	for (const [key, value] of Object.entries(given)) {
		if (value === None) {
			(given as Partial<Record<string, unknown>>)[key as string] = undefined;
		} else if (type(value) === "table") {
			filterNone(value as Record<string, unknown>)
		}
	}

	return given
}

export default abstract class State<S = {}, P = {}> {
	state = {} as S;
	props: P;

	constructor(props: P) {
		this.props = props
	}
	protected update(newState: MapToNone<S> | Partial<S>) {
		let shouldUpdate = true;

		if (this["shouldUpdate"] !== undefined) {
			if (!this.shouldUpdate(newState as Partial<S>)) {
				shouldUpdate = false;
			}
		}

		newState = filterNone(Table.reconcile(Object.copy(this.state as {}), newState as Partial<S>, true));

		if (this["willUpdate"] !== undefined && shouldUpdate) {
			this.willUpdate(newState as Partial<S>);
		}

		this.state = newState as S
	}
	protected setState(updateState: MapToNone<S>) {
		this.update(updateState);
	}
}
