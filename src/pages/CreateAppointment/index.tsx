import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Platform } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import DateTimePicker from '@react-native-community/datetimepicker'

import { useAuth } from '../../hooks/Auth'
import api from '../../services/api'

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText
} from './styles'
import { format } from 'date-fns'

interface RouteParams {
  providerId: string
}

export interface Provider {
  id: string
  name: string
  avatarUrl: string
}

interface AvailabilityItem {
  hour: number
  available: boolean
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth()

  const { params } = useRoute()
  const { goBack } = useNavigation()
  const routeParams = params as RouteParams

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedHour, setSelectedHour] = useState(0)
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId
  )
  const [availability, setAvailability] = useState<AvailabilityItem[]>([])

  useEffect(() => {
    api.get('/providers').then(response => setProviders(response.data))
  }, [])

  useEffect(() => {
    api
      .get(`/providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate()
        }
      })
      .then(response => setAvailability(response.data))
  }, [selectedProvider, selectedDate])

  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId)
  }, [])

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state)
  }, [])

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false)
      }

      if (date) {
        setSelectedDate(date)
      }
    },
    []
  )

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour)
  }, [])

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => ({
        hour,
        available,
        formattedHour: format(new Date().setHours(hour), 'HH:00')
      }))
  }, [availability])

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => ({
        hour,
        available,
        formattedHour: format(new Date().setHours(hour), 'HH:00')
      }))
  }, [availability])

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatarUrl }} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={selectedProvider === provider.id}
                onPress={() => handleSelectProvider(provider.id)}
              >
                <ProviderAvatar source={{ uri: provider.avatarUrl }} />
                <ProviderName selected={selectedProvider === provider.id}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              display="calendar"
              mode="date"
              onChange={handleDateChanged}
              value={selectedDate}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ formattedHour, available, hour }) => (
                <Hour
                  enabled={available}
                  key={formattedHour}
                  available={available}
                  selected={selectedHour === hour}
                  onPress={() => handleSelectHour(hour)}
                >
                  <HourText selected={selectedHour === hour}>
                    {formattedHour}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(
                ({ formattedHour, available, hour }) => (
                  <Hour
                    enabled={available}
                    key={formattedHour}
                    available={available}
                    selected={selectedHour === hour}
                    onPress={() => handleSelectHour(hour)}
                  >
                    <HourText selected={selectedHour === hour}>
                      {formattedHour}
                    </HourText>
                  </Hour>
                )
              )}
            </SectionContent>
          </Section>
        </Schedule>
      </Content>
    </Container>
  )
}

export default CreateAppointment
