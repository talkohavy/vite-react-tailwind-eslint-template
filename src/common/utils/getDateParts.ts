enum DateParts {
  Day = 'day',
  DayPeriod = 'dayPeriod',
  Era = 'era',
  Hour = 'hour',
  Literal = 'literal',
  Minute = 'minute',
  Month = 'month',
  Second = 'second',
  TimeZoneName = 'timeZoneName',
  Weekday = 'weekday',
  Year = 'year',
}

type DateByParts = {
  day: any;
  dayPeriod: any;
  era: any;
  hour: any;
  literal: any;
  minute: any;
  month: any;
  second: any;
  timeZoneName: any;
  weekday: any;
  year: any;
};

type Options = {
  localeMatcher?: 'best fit' | 'lookup' | undefined;
  weekday?: 'long' | 'short' | 'narrow' | undefined;
  era?: 'long' | 'short' | 'narrow' | undefined;
  year?: 'numeric' | '2-digit' | undefined;
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' | undefined;
  day?: 'numeric' | '2-digit' | undefined;
  hour?: 'numeric' | '2-digit' | undefined;
  minute?: 'numeric' | '2-digit' | undefined;
  second?: 'numeric' | '2-digit' | undefined;
  timeZoneName?: 'short' | 'long' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric' | undefined;
  formatMatcher?: 'best fit' | 'basic' | undefined;
  hour12?: boolean | undefined;
  timeZone?: string | undefined;
};

export function getDateParts(date: Date, options = {} as Options) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: options.year || 'numeric',
    month: options.month || 'short',
    day: options.day || '2-digit',
    hour: options.hour || '2-digit',
    minute: options.minute || '2-digit',
    second: options.second || '2-digit',
    weekday: options.weekday || 'long',
    hour12: options.hour12 || true, // true = 24-hour format. false = 12-hour format.
    dayPeriod: undefined, // if `hour12` is `false`, `dayPeriod` will NOT be part of `parts`. `undefined` value returns either 'AM' or 'PM'.
    timeZoneName: 'longOffset',
  });

  const partsAsArray = formatter.formatToParts(date.getTime());

  const partsAsObject = partsAsArray.reduce((acc, currentItem) => {
    if (currentItem.type !== DateParts.Literal) {
      acc[currentItem.type as DateParts] = currentItem.value;
    }

    return acc;
  }, {} as DateByParts);

  return partsAsObject;
}
