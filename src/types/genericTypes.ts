// https://github.com/RaenonX-PokemonSleep/pokemon-sleep-ui-core/blob/main/src/utils/type.ts#L28-L29

/**
 * Defines a custom TypeScript type that allows a value of type T to be nullable (T | null | undefined).
 */
export type Nullable<T> = T | null | undefined;

/**
 * Defines a custom TypeScript type that creates an object type with optional properties specified by keys of the original type.
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/**
 * Defines a custom TypeScript type that makes all properties of a type optional.
 */
export type AllOptional<T> = Partial<T>;

/**
 * Defines a type `PartialNullable<T>` that represents an object with all properties of `T` as optional and nullable.
 */
export type PartialNullable<T> = { [P in keyof T]?: Nullable<T[P]> };
