import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'

import Icon from 'react-native-vector-icons/Feather'

import { useAuth } from '../../hooks/Auth'
import api from '../../services/api'

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProvidersListTitle,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderMeta,
  ProviderMetaText
} from './styles'

export interface Provider {
  id: string
  name: string
  avatarUrl: string
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const { navigate } = useNavigation()

  const [providers, setProviders] = useState<Provider[]>([])

  useEffect(() => {
    api.get('/providers').then(response => setProviders(response.data))
  }, [])

  const navigateToProfile = useCallback(() => {
    // navigate('Profile')
    signOut()
  }, [signOut])

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId })
    },
    [navigate]
  )

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo, {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user.avatarUrl }} />
        </ProfileButton>
      </Header>

      <ProvidersList
        data={providers}
        keyExtractor={provider => provider.id}
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        }
        renderItem={({ item: provider }) => (
          <ProviderContainer
            onPress={() => navigateToCreateAppointment(provider.id)}
          >
            <ProviderAvatar source={{ uri: provider.avatarUrl }} />

            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
              </ProviderMeta>

              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>08:00 às 18:00</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  )
}

export default Dashboard
