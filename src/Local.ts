/* eslint-disable roblox-ts/no-private-identifier */
import Object from "@rbxts/object-utils";
import { MapToNone } from "./util";
import Table from "@jumpstudios/table-util";
import None from "./None";

interface State<S = {}, P = {}> {
	shouldUpdate(newState: S): boolean;
	willUpdate(newState: S): void;
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

abstract class State<S = {}, P = {}> {
	state = {} as S;
	props: P;

	constructor(props: P) {
		this.props = props
	}
	protected update(newState: MapToNone<S> | Partial<S>) {
		let shouldUpdate = true;
		newState = filterNone(Table.reconcile(Object.copy(this.state as {}), newState as Partial<S>, true));

		if (this["shouldUpdate"] !== undefined) {
			if (!this.shouldUpdate(newState as S)) {
				shouldUpdate = false;
			}
		}

		if (this["willUpdate"] !== undefined && !Object.isEmpty(this.state as {}) && shouldUpdate) {
			this.willUpdate(newState as S);
		}

		this.state = newState as S
	}
	protected setState(updateState: MapToNone<S>) {
		this.update(updateState);
	}
}

export = State