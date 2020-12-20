import React, { useCallback, useRef } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TextInput,
  Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { useNavigation } from '@react-navigation/native'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/mobile'
import * as Yup from 'yup'

import Input from '../../components/Input'
import Button from '../../components/Button'

import getValidationErrors from '../../utils/getValidationErrors'
import { useAuth } from '../../hooks/Auth'
import api from '../../services/api'

import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar
} from './styles'

interface ProfileFormData {
  name: string
  email: string
  oldPassword?: string
  password?: string
  passwordConfirmation?: string
}

const SignIn: React.FC = () => {
  const { user, updateUser } = useAuth()

  const emailInputRef = useRef<TextInput>(null)
  const oldPasswordInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const passwordConfirmationInputRef = useRef<TextInput>(null)

  const formRef = useRef<FormHandles>(null)
  const navigation = useNavigation()

  const handleSignUp = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: val => Boolean(val.length),
            then: Yup.string().min(6, 'No mínimo 6 dígitos'),
            otherwise: Yup.string()
          }),
          passwordConfirmation: Yup.string()
            .when('oldPassword', {
              is: val => Boolean(val.length),
              then: Yup.string().min(6, 'No mínimo 6 dígitos'),
              otherwise: Yup.string()
            })
            .oneOf([Yup.ref('password')], 'Confirmação incorreta')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        const {
          name,
          email,
          oldPassword,
          password,
          passwordConfirmation
        } = data

        const formData = Object.assign(
          {
            name,
            email
          },
          oldPassword
            ? {
                oldPassword,
                password,
                passwordConfirmation
              }
            : {}
        )

        const response = await api.put('/profile', formData)

        await updateUser(response.data)

        Alert.alert('Perfil atualizado com sucesso')

        navigation.goBack()
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)

          return
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente.'
        )
      }
    },
    [navigation, updateUser]
  )

  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleUpdateAvatar = useCallback(() => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        return
      }

      if (response.errorMessage) {
        Alert.alert('Erro ao atualizar o seu avatar.')
        return
      }

      const data = new FormData()

      data.append('avatar', {
        uri: response.uri,
        name: `${user.id}.jpg`,
        type: 'image/jpeg'
      })

      api
        .patch('users/avatar', data)
        .then(response => updateUser(response.data))
    })
  }, [updateUser, user.id])

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          // contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatarUrl }} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form
              onSubmit={handleSignUp}
              ref={formRef}
              initialData={{
                name: user.name,
                email: user.email
              }}
            >
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />

              <Input
                ref={emailInputRef}
                name="email"
                icon="mail"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
              />

              <Input
                ref={oldPasswordInputRef}
                name="oldPassword"
                icon="lock"
                placeholder="Senha atual"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                containerStyle={{ marginTop: 16 }}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <Input
                ref={oldPasswordInputRef}
                name="password"
                icon="lock"
                placeholder="Nova senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordConfirmationInputRef.current?.focus()
                }
              />

              <Input
                ref={passwordConfirmationInputRef}
                name="passwordConfirmation"
                icon="lock"
                placeholder="Confirmar senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default SignIn
