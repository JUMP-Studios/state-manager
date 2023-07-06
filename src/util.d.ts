export type InferNone<T> = T extends undefined ? symbol : never;
export type MapToNone<T> = Partial<{ [K in keyof T]-?: NonNullable<T[K]> | InferNone<T[K]> }>;
export type Creatable = keyof Pick<
	CreatableInstances,
	"StringValue" | "NumberValue" | "Vector3Value" | "BoolValue" | "ObjectValue"
>;
export type AllowedValues = string | number | boolean | Instance | Vector3 | undefined;
export type StateInstances<T> = {
	[K in keyof T]: T[K] extends string
		? CreatableInstances["StringValue"]
		: T[K] extends number
		? CreatableInstances["NumberValue"]
		: T[K] extends boolean
		? CreatableInstances["BoolValue"]
		: T[K] extends Vector3
		? CreatableInstances["Vector3Value"]
		: T[K] extends Instance
		? CreatableInstances["ObjectValue"]
		: never;
};
export type ValueContainer = Record<string, unknown>;
