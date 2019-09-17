import * as fs from 'fs';

export const getCourses =  () => {
  const rawdata = fs.readFileSync('data.json').toString();
  const courses = JSON.parse(rawdata);
  return courses;
};
