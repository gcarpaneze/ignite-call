export function convertTimeStringToMinutes(timeString: string) {
  const [hours, minutes] = timeString
    .split(':')
    .map((partOfTime) => Number(partOfTime))

  return hours * 60 + minutes
}

convertTimeStringToMinutes('08:00')
