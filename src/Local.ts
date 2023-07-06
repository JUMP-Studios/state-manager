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
			(given as Partial<Record<string, undefined>>)[key as string] = undefined;
		}
	}
}

export default abstract class State<S = {}, P = {}> {
	state = {} as Partial<S>;
	props = {} as Partial<P>;

	protected update(newState: MapToNone<S> | Partial<S>) {
		let shouldUpdate = true;

		if (this["shouldUpdate"] !== undefined) {
			if (!this.shouldUpdate(newState as Partial<S>)) {
				shouldUpdate = false;
			}
		}

		if (this["willUpdate"] !== undefined && shouldUpdate) {
			this.willUpdate(newState as Partial<S>);
		}

		filterNone(Table.reconcile(this.state as {}, newState as Partial<S>, true));
	}
	protected setState(updateState: MapToNone<S>) {
		this.update(updateState);
	}
}
