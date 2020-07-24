const formatDateAsString = (date) => {
  let dateInfo = date.toDateString().split(' ');
  return dateInfo[0] + ' ' + dateInfo[2];  // Take day and date.
}

const formatAsCoordinate = (latitude, longitude, decimals = 5) => {
  let dir1 = latitude < 0 ? 'S' : 'N';
  let dir2 = longitude < 0 ? 'W' : 'E';
  return `${latitude.toFixed(decimals)}&#xb0;${dir1}, ${longitude.toFixed(decimals)}&#xb0;${dir2}`;
}

export { formatDateAsString, formatAsCoordinate };
