import { useState } from 'react'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

import { api } from '../../../../../lib/axios'

import { Calendar } from '../../../../../components/Calendar'

import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'
import { useQuery } from '@tanstack/react-query'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()

  const username = String(router.query.username)
  const isDateSelected = !!selectedDate

  const weekDay = isDateSelected ? dayjs(selectedDate).format('dddd') : null
  const describleDate = isDateSelected
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectedDateWithoutTime = dayjs(selectedDate).format('YYYY-MM-DD')

  const { data: avaibalibilty } = useQuery<Availability>(
    ['availability', selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability/`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })
      return response.data
    },
    {
      enabled: isDateSelected,
    },
  )

  function handleSelectTime(hour: number) {
    const dateWithHour = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectDateTime(dateWithHour)
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describleDate}</span>
          </TimePickerHeader>
          <TimePickerList>
            {avaibalibilty?.possibleTimes.map((hour) => {
              return (
                <TimePickerItem
                  key={hour}
                  disabled={!avaibalibilty?.availableTimes.includes(hour)}
                  onClick={() => handleSelectTime(hour)}
                >
                  {String(hour).padStart(2, '0')}:00
                </TimePickerItem>
              )
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
