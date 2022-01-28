export const rankingsCalculator = (results, maxMarks, totalAttendance) => {
  let percentageToBeRanked = [];
  let studentDataToBeAdded = {};
  let students = Object.keys(results);

  students.forEach((student) => {
    let attendance = results[student].attendance;
    let subs = Object.keys(results[student].subjects);
    let subCount = 0;

    let marksObtained = subs.reduce((partial_sum, sub) => {
      let curr_sub_mark = results[student].subjects[sub];
      if (curr_sub_mark === "-1") partial_sum += 0;
      else if (curr_sub_mark === "" || curr_sub_mark.toLowerCase() === "ab") {
        partial_sum += 0;
        ++subCount;
      } else {
        partial_sum += +curr_sub_mark;
        ++subCount;
      }
      return partial_sum;
    }, 0);

    const totalMarks = maxMarks * subCount;
    const percentage = ((marksObtained / totalMarks) * 100).toFixed(2);
    const attendancePercentage =
      attendance !== ""
        ? ((+attendance / +totalAttendance) * 100).toFixed(2)
        : 0;

    percentageToBeRanked.push({ student, percentage });

    studentDataToBeAdded[student] = {
      maxMarks,
      totalMarks,
      percentage,
      marksObtained,
      totalAttendance,
      attendancePercentage,
    };
  });

  percentageToBeRanked.sort((a, b) => {
    if (+a.percentage < +b.percentage) return 1;
    if (+a.percentage > +b.percentage) return -1;
    return 0;
  });

  percentageToBeRanked.forEach((x) => {
    studentDataToBeAdded = {
      ...studentDataToBeAdded,
      [x.student]: {
        ...studentDataToBeAdded[x.student],
        rank:
          percentageToBeRanked.findIndex((y) => x.percentage === y.percentage) +
          1,
      },
    };
  });

  return studentDataToBeAdded;
};
