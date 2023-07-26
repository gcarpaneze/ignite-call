import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'

import { ConfirmForm, FormActions, FormError, FormHeader } from './styles'
import dayjs from 'dayjs'
import { api } from '../../../../../lib/axios'
import { useRouter } from 'next/router'

const confirmFormSchema = z.object({
  name: z.string().min(3, { message: 'Digite seu nome' }),
  email: z.string().email({ message: 'Digite um email válido' }),
  observation: z.string().nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

interface confirmStepProps {
  schedulingDate: Date
  onSelectDateTime: (setInitialValue: null) => void
}

export function ConfirmStep({
  schedulingDate,
  onSelectDateTime,
}: confirmStepProps) {
  const router = useRouter()
  const username = String(router.query.username)

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  })

  const describleDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describleHour = dayjs(schedulingDate).format('HH[h00]')

  function handleCancelSchedule() {
    onSelectDateTime(null)
  }

  async function handleConfirmSchedule(data: ConfirmFormData) {
    const { email, name, observation } = data

    await api.post(`/users/${username}/schedule`, {
      name,
      email,
      observation,
      date: schedulingDate,
    })

    handleCancelSchedule()
  }

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmSchedule)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          {describleDate}
        </Text>

        <Text>
          <Clock />
          {describleHour}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" {...register('name')} />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          {...register('email')}
        />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observation')} />
      </label>

      <FormActions>
        <Button type="button" variant="tertiary" onClick={handleCancelSchedule}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}
