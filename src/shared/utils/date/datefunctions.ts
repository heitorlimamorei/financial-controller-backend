import { firebaseTimesStampType } from '../firebase/firebase.types';

export const firestoreTimestampToDate = (
  timestamp: firebaseTimesStampType,
): Date => {
  const milliseconds =
    timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);
  return new Date(milliseconds);
};

export const hasDatePassed = (date: firebaseTimesStampType) => {
  const dateF = firestoreTimestampToDate(date);
  const today = new Date();
  return dateF < today;
};

export const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const dayString = day < 10 ? day.toString().padStart(2, '0') : day;
  const monthString = month < 10 ? month.toString().padStart(2, '0') : month;
  return `${dayString}/${monthString}/${date.getFullYear()}`;
};

export const toggleDateToJson = (date: Date) => {
  if (!(date instanceof Date))
    throw new Error('This method supports only Date');
  return date.toJSON();
};

export const toggleJsonToDate = (date: string) => {
  if (!(typeof date == 'string'))
    throw new Error('This method supports only string');
  return new Date(date);
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const addDays = (nDays: number, date: Date): Date => {
  const dateF = { ...date };
  dateF.setDate(dateF.getDate() + nDays);
  return dateF;
};
