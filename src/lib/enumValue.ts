/** The member of a string enum that a piece of text names, if there is one. */
export const findEnumValue = <Value extends string>(
  values: readonly Value[],
  text: string | null,
) => values.find((value) => value.valueOf() === text);
