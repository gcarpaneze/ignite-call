import { useMemo, useState } from 'react'
import { CaretLeft, CaretRight } from 'phosphor-react'
import dayjs, { Dayjs } from 'dayjs'
import { useQuery } from '@tanstack/react-query'

import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'
import { api } from '../../lib/axios'
import { useRouter } from 'next/router'

interface CalendarWeek {
  weekNumber: number
  days: Array<{
    date: Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

interface CalendarProps {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const router = useRouter()
  const username = String(router.query.username)

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const { data: blockedDates } = useQuery<BlockedDates>(
    ['availability', currentDate.get('year'), currentDate.get('month')],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates/`, {
        params: {
          year: currentDate.get('year'),
          month: String(currentDate.get('month') + 1).padStart(2, '0'),
        },
      })
      return response.data
    },
  )

  function handlePreviusMonth() {
    const previusMonthDate = currentDate.subtract(1, 'month')
    setCurrentDate(previusMonthDate)
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, 'month')
    setCurrentDate(nextMonthDate)
  }

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const daysInMontyArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    const firstWeekDay = currentDate.get('day')

    const previusMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()

    const lastWeekDay = currentDate.set('date', currentDate.daysInMonth())

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay.get('day') + 1),
    }).map((_, i) => {
      return lastWeekDay.add(i + 1, 'day')
    })

    const calendarDays = [
      ...previusMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMontyArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(date.get('day')) ||
            blockedDates.blockedDates.includes(date.get('date')),
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const startWeek = i % 7 === 0

        if (startWeek) {
          weeks.push({
            weekNumber: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }
        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviusMonth} title="Previus Month">
            <CaretLeft />
          </button>

          <button onClick={handleNextMonth} title="Next Month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            <th>DOM.</th>
            <th>SEG.</th>
            <th>TER.</th>
            <th>QUA.</th>
            <th>QUI.</th>
            <th>SEX.</th>
            <th>SAB.</th>
          </tr>
        </thead>

        <tbody>
          {calendarWeeks.map(({ days, weekNumber }) => {
            return (
              <tr key={weekNumber}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.get('day')}>
                      <CalendarDay
                        disabled={disabled}
                        onClick={() => onDateSelected(date.toDate())}
                      >
                        {date.get('date')}
                      </CalendarDay>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
