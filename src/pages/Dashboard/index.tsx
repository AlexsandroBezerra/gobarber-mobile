import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import Button from '../../components/Button'

import { useAuth } from '../../hooks/Auth'

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar
} from './styles'

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const { navigate } = useNavigation()

  const navigateToProfile = useCallback(() => {
    navigate('Profile')
  }, [navigate])

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
      <Button onPress={signOut}>signOut</Button>
    </Container>
  )
}

export default Dashboard
