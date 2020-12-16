import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import Icon from 'react-native-vector-icons/Feather'

import { Container, Title, Description, OkButton, OkButtonText } from './styles'

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation()

  const handleOkPressed = useCallback(() => {
    reset({
      routes: [{ name: 'Dashboard' }],
      index: 0
    })
  }, [reset])

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento concluído</Title>
      <Description>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi,
        consequatur? Culpa vitae praesentium similique unde modi, facilis at
        sequi commodi eum reprehenderit aliquam repudiandae provident quae hic
        ut id beatae.
      </Description>

      <OkButton onPress={handleOkPressed}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  )
}

export default AppointmentCreated
