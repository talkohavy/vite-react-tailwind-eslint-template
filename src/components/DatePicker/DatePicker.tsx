import { DatePicker as DatePickerOriginal, useDatePicker } from '@ark-ui/react/date-picker';
import { Portal } from '@ark-ui/react/portal';

const {
  RootProvider,
  Label,
  Control,
  Input,
  Trigger,
  ClearTrigger,
  Positioner,
  Content,
  YearSelect,
  MonthSelect,
  View,
  Context,
  ViewControl,
  PrevTrigger,
  NextTrigger,
  RangeText,
  ViewTrigger,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableCellTrigger,
} = DatePickerOriginal;

type DatePickerProps = {
  label?: string;
};

export default function DatePicker(props: DatePickerProps) {
  const { label } = props;

  const datePicker = useDatePicker();

  return (
    <>
      <button type='button' onClick={() => datePicker.clearValue()}>
        Clear
      </button>

      <RootProvider value={datePicker}>
        {label && <Label>{label}</Label>}

        <Control>
          <Input />
          <Trigger>📅</Trigger>
          <ClearTrigger>Clear</ClearTrigger>
        </Control>

        <Portal>
          <Positioner>
            <Content>
              <YearSelect />
              <MonthSelect />
              <View view='day'>
                <Context>
                  {(datePicker) => (
                    <>
                      <ViewControl>
                        <PrevTrigger>Prev</PrevTrigger>
                        <ViewTrigger>
                          <RangeText />
                        </ViewTrigger>
                        <NextTrigger>Next</NextTrigger>
                      </ViewControl>
                      <Table>
                        <TableHead>
                          <TableRow>
                            {datePicker.weekDays.map((weekDay, id) => (
                              <TableHeader key={id}>{weekDay.short}</TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {datePicker.weeks.map((week, id) => (
                            <TableRow key={id}>
                              {week.map((day, id) => (
                                <TableCell key={id} value={day}>
                                  <TableCellTrigger>{day.day}</TableCellTrigger>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </Context>
              </View>
              <View view='month'>
                <Context>
                  {(datePicker) => (
                    <>
                      <ViewControl>
                        <PrevTrigger>Prev</PrevTrigger>
                        <ViewTrigger>
                          <RangeText />
                        </ViewTrigger>
                        <NextTrigger>Next</NextTrigger>
                      </ViewControl>
                      <Table>
                        <TableBody>
                          {datePicker.getMonthsGrid({ columns: 4, format: 'short' }).map((months, id) => (
                            <TableRow key={id}>
                              {months.map((month, id) => (
                                <TableCell key={id} value={month.value}>
                                  <TableCellTrigger>{month.label}</TableCellTrigger>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </Context>
              </View>
              <View view='year'>
                <Context>
                  {(datePicker) => (
                    <>
                      <ViewControl>
                        <PrevTrigger>Prev</PrevTrigger>
                        <ViewTrigger>
                          <RangeText />
                        </ViewTrigger>
                        <NextTrigger>Next</NextTrigger>
                      </ViewControl>
                      <Table>
                        <TableBody>
                          {datePicker.getYearsGrid({ columns: 4 }).map((years, id) => (
                            <TableRow key={id}>
                              {years.map((year, id) => (
                                <TableCell key={id} value={year.value}>
                                  <TableCellTrigger>{year.label}</TableCellTrigger>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </Context>
              </View>
            </Content>
          </Positioner>
        </Portal>
      </RootProvider>
    </>
  );
}
