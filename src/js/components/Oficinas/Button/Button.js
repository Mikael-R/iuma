import React, { useState } from 'react'
import * as S from './style';

export const Button = ({title, filtroDosCardsDeAcordoComSelecionado}) => {

  return (
    <S.Container >
        <S.Button onClick={filtroDosCardsDeAcordoComSelecionado}>{title}</S.Button>
    </S.Container>
  )
}
