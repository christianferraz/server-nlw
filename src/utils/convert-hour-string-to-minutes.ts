export const convertHoursStringtoMinuts = (hoursString: string) => {
  const [hours, minutes] = hoursString.split(':').map(Number) // map converte cada array em numeros
  const minutesAmount = (hours * 60) + minutes
  return minutesAmount
}