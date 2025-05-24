import type { QueryParamValue } from '../types';

export class QueryStringComposer {
  private searchParams: URLSearchParams;

  constructor(searchQuery: string) {
    this.searchParams = new URLSearchParams(searchQuery);
  }

  setParam(key: string, value: QueryParamValue | QueryParamValue[] | undefined): void {
    this.removeExistingKey(key);

    if (value === undefined || value == null) return;

    if (Array.isArray(value)) return void this.appendArrayValuesToKey(key, value);

    this.searchParams.set(key, String(value));
  }

  setParams(params: Record<string, QueryParamValue | QueryParamValue[] | undefined>): void {
    Object.entries(params).forEach(([key, value]) => {
      this.setParam(key, value);
    });
  }

  toString(): string {
    return this.searchParams.toString();
  }

  /**
   * @example
   * parseQueryParams(window.location.search);
   */
  parseQueryParams(): Record<string, any> {
    const paramsObject: Record<string, string[]> = {};

    // Group all values by key to handle arrays
    this.searchParams.forEach((value, key) => {
      if (!paramsObject[key]) {
        paramsObject[key] = [];
      }
      paramsObject[key].push(value);
    });

    // Process values to convert types and handle arrays
    const result: Record<string, any> = {};
    Object.entries(paramsObject).forEach(([key, values]) => {
      // If there's only one value, don't create an array
      if (values.length === 1) {
        result[key] = this.parseValue(values[0]!);
      } else {
        result[key] = values.map(this.parseValue);
      }
    });

    return result;
  }

  private parseValue(value: string): QueryParamValue {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (!isNaN(Number(value)) && value.trim() !== '') return Number(value);

    return value; // <--- Keep string values as they are!
  }

  private removeExistingKey(key: string): void {
    this.searchParams.delete(key);
  }

  private appendArrayValuesToKey(key: string, values: QueryParamValue[]): void {
    values.forEach((val) => {
      if (val !== undefined && val !== null) {
        this.searchParams.append(key, String(val));
      }
    });
  }
}
