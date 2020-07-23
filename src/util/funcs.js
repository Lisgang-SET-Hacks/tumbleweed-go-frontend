const formatDateAsString = (date) => {

  let dateInfo = date.toDateString().split(' ');

  return dateInfo[0] + ' ' + dateInfo[2];  // Take day and date.
}

export { formatDateAsString };
