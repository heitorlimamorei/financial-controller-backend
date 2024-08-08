export function arrayToHashMap<T>(
  arr: T[],
  keyProp: keyof T,
): Record<string, T> {
  const hashMap: Record<string, T> = {};
  arr.forEach((obj) => {
    const keyValue = obj[keyProp] as unknown as string;
    hashMap[keyValue] = obj;
  });
  return hashMap;
}
