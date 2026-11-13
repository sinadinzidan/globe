import { randomInt } from 'node:crypto';
import {
  WORK_ORDER_NUMBER_MINIMUM,
  WORK_ORDER_NUMBER_PREFIX,
  WORK_ORDER_NUMBER_RANGE,
} from '../constants/work-order.constant.js';

/** A new work order number. Uniqueness is enforced by the database. */
export const generateWorkOrderNumber = () =>
  `${WORK_ORDER_NUMBER_PREFIX}${String(WORK_ORDER_NUMBER_MINIMUM + randomInt(WORK_ORDER_NUMBER_RANGE))}`;
