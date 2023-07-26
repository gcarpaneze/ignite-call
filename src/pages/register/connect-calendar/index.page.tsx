import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { ArrowRight, Check } from 'phosphor-react'
import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'

import { Container, Header } from '../styles'
import { AuthError, ConnectItem, ContentBox } from './styles'
import { NextSeo } from 'next-seo'

export default function ConnectCalendar() {
  const router = useRouter()
  const session = useSession()

  const hasAuthError = !!router.query.error
  const isAuthenticated = session.status === 'authenticated'

  return (
    <>
      <NextSeo title="Conecte sua agenda do Google | Ignite Call" noindex />

      <Container>
        <Header>
          <Heading as="strong">Conecte sua agenda!</Heading>
          <Text>
            Conecte seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados
          </Text>
        </Header>

        <MultiStep size={4} currentStep={2} />

        <ContentBox>
          <ConnectItem>
            <Text>Google Calendar</Text>

            {isAuthenticated ? (
              <Button size="sm" disabled>
                Conectado
                <Check />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => signIn('google')}
              >
                Conectar
                <ArrowRight />
              </Button>
            )}
          </ConnectItem>

          {hasAuthError && (
            <AuthError size="sm">
              Falha ao se conectar com o Google, verifique se você habilitou as
              permissões de acesso ao Google Calendar
            </AuthError>
          )}

          <Button
            disabled={!isAuthenticated}
            onClick={() => router.push('time-intervals')}
          >
            Próximo passo
            <ArrowRight />
          </Button>
        </ContentBox>
      </Container>
    </>
  )
}
