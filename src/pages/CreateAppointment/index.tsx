import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'

import { useAuth } from '../../hooks/Auth'
import api from '../../services/api'

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName
} from './styles'

interface RouteParams {
  providerId: string
}

export interface Provider {
  id: string
  name: string
  avatarUrl: string
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth()

  const { params } = useRoute()
  const { goBack } = useNavigation()
  const routeParams = params as RouteParams

  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId
  )

  useEffect(() => {
    api.get('/providers').then(response => setProviders(response.data))
  }, [])

  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId)
  }, [])

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatarUrl }} />
      </Header>

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
    </Container>
  )
}

export default CreateAppointment
