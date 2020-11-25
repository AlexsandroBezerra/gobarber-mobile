import React from 'react'
import { ActivityIndicator, View } from 'react-native'

import AuthRoutes from './Auth.routes'
import AppRoutes from './App.routes'

import { useAuth } from '../hooks/Auth'

const Routes: React.FC = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    )
  }

  return user ? <AppRoutes /> : <AuthRoutes />
}

export default Routes
