import { createIntegerNumbersOnlyRule } from '../../Input/logic/rules/createIntegerNumbersOnlyRule';

export const DELAY_START_RUNNING = 350;
export const DELAY_BETWEEN_STEPS = 50;

export const allowNumbersOnly = createIntegerNumbersOnlyRule(20);
