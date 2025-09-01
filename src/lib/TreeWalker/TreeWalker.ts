export class TreeWalker {
  constructor(private readonly tree: Record<string, any>) {}

  /**
   * @returns the value of that last key inside keysArr
   */
  getValueFromTree(keysArr: Array<string>) {
    const value = keysArr.reduce((acc, currentKey) => acc[currentKey], this.tree);

    return value;
  }

  /**
   * @description
   * Tree could be either an object or an array of objects.
   * If it's an array of objects, we will iterate over each object and apply the callback to each one.
   */
  updateValueInTree(dottedKey: string, callback: (oldValue: any) => any): void {
    const keysArr = this.getKeysArrFromDottedKey(dottedKey);

    const arrayOfObjects: Array<Record<string, any>> = Array.isArray(this.tree) ? this.tree : [this.tree];

    arrayOfObjects.forEach((obj) => {
      let pointer: any = obj;

      keysArr.forEach((key, index) => {
        if (!(key in pointer)) return; // <--- throw new Error(`Key "${key}" not found in the tree at path "${keysArr.slice(0, index).join('.')}"`);

        if (index === keysArr.length - 1) {
          // assign the new value:
          pointer[key] = callback(pointer[key]);
        } else {
          // walk the tree:
          pointer = pointer[key];
        }
      });
    });
  }

  getTree(): Record<string, any> {
    return this.tree;
  }

  toString(): string {
    return JSON.stringify(this.tree);
  }

  private getKeysArrFromDottedKey(dottedKey: string): Array<string> {
    return dottedKey.split('.');
  }
}
