const formatDateAsString = (date) => {

  return date.toDateString().split(' ').slice(0, 3).join(' ');  // Only take the first 3 elements (week, month, day).
}

export { formatDateAsString };
