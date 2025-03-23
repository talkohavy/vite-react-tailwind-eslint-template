import { DatePicker as DatePickerOriginal, useDatePicker } from '@ark-ui/react/date-picker';
import { Portal } from '@ark-ui/react/portal';
import CalendarIcon from '../svgs/CalendarIcon';
import DownArrow from '../svgs/DownArrow';
import styles from './DatePicker.module.scss';

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
  selectionMode?: 'single' | 'range' | 'multiple';
  label?: string;
};

export default function DatePicker(props: DatePickerProps) {
  const { label, selectionMode = 'single' } = props;

  const datePicker = useDatePicker({ selectionMode });

  return (
    <>
      <button type='button' onClick={() => datePicker.clearValue()}>
        Clear
      </button>

      <RootProvider value={datePicker}>
        {label && <Label>{label}</Label>}

        <Control className={styles.control}>
          <Input index={0} className={styles.input} />
          {selectionMode === 'range' && <Input index={1} />}

          <Trigger className={styles.trigger}>
            <CalendarIcon />
          </Trigger>

          <ClearTrigger>Clear</ClearTrigger>
        </Control>

        {/* <DatePickerOriginal.PresetTrigger value='last7Days'>Last 7 days</DatePickerOriginal.PresetTrigger>
        <DatePickerOriginal.PresetTrigger value='thisMonth'>This month</DatePickerOriginal.PresetTrigger>
        <DatePickerOriginal.PresetTrigger value='last30Days'>Last 30 days</DatePickerOriginal.PresetTrigger>
        <DatePickerOriginal.PresetTrigger value='thisYear'>This year</DatePickerOriginal.PresetTrigger> */}

        <Portal>
          <Positioner>
            <Content className={styles.content}>
              {/* <YearSelect /> */}

              {/* <MonthSelect /> */}

              <View view='day' className={styles.dayView}>
                <Context>
                  {(datePicker) => (
                    <>
                      <ViewControl className={styles.dayViewControl}>
                        <PrevTrigger className={styles.prevNextTrigger}>
                          <DownArrow className='rotate-90 size-3.5' />
                        </PrevTrigger>

                        <ViewTrigger className={styles.viewTrigger}>
                          <RangeText />
                        </ViewTrigger>

                        <NextTrigger className={styles.prevNextTrigger}>
                          <DownArrow className='-rotate-90 size-3.5' />
                        </NextTrigger>
                      </ViewControl>

                      <Table className={styles.table}>
                        <TableHead>
                          <TableRow>
                            {datePicker.weekDays.map((weekDay, id) => (
                              <TableHeader key={id} className={styles.tableHeader}>
                                {weekDay.short}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {datePicker.weeks.map((week, id) => (
                            <TableRow key={id}>
                              {week.map((day, id) => (
                                <TableCell key={id} value={day} className={styles.tableCell}>
                                  <TableCellTrigger className={styles.tableCellTrigger}>{day.day}</TableCellTrigger>
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

              {/* <View view='month'>
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
              </View> */}

              {/* <View view='year'>
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
              </View> */}
            </Content>
          </Positioner>
        </Portal>
      </RootProvider>
    </>
  );
}
