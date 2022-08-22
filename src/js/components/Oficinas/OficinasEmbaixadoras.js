import React, { useState, useEffect } from 'react';
import * as S from './style';
import db from './Helpers/Db';
import Modal from './Modal/Modal'
import Imagem from '../../../../src/styles/assets/imgOficinas/imageBackground.png';
import ImagemMobile from '../../../../src/styles/assets/imgOficinas/imageBackgroundMobile.png';
import FormSelectStates from './FormSelectStates/FormSelectStates';
import FormSelectCity from './FormSelectCidades/FormSelectCity';
import Maps from '../MapsOficinas/Maps';
import { Button } from './Button/Button';
import { getStorePlaces_v2 } from '../../library/utils/API/getStorePlaces_v2';
import { getLastUserInfo } from '../../library/utils/helpers';
import Cards from './Cards/Cards';
import Arrow from '../../../styles/assets/icons/IconArrowDown.svg';

export const OficinasEmbaixadoras = () => {
    const [activeStore, setActiveStore] = useState(null)
    const [storeModal, setStoreModal] = useState(false)
  const [listOpt, setListOpt] = useState([]);
  const [listOptCities, setListOptCities] = useState([])
  const [stateSelected, setStateSelected] = useState('')
  const [citiesSelected, setCitiesSelected] = useState('')
  const [oficinasDaCidadeSelecionada, setOficinasDaCidadeSelecionada] = useState(false)
  const userInfo = getLastUserInfo();

  useEffect(() => {
    getStorePlaces_v2(userInfo.uId, ['establishment'], null, null, '', null, "[(description:LIKE:club_embaixadora)]", 0, 200, null).then((response) => {
      setListOpt(response.list)
      setListOptCities(response.list)
      console.log('Resposta', response)

    });

  },[])
  useEffect(()=>{
    console.log(stateSelected)
  }, [stateSelected])

  function filtroDosCardsDeAcordoComSelecionado() {
    setOficinasDaCidadeSelecionada(listOpt.filter((e) => e.establishment.cidade === citiesSelected));
    console.log(setOficinasDaCidadeSelecionada)
  }

  const onSelectPoint = (point) => {
      const lat = point.latLng.lat()
      const store = listOpt.find(({ establishment }) => {
          return establishment.location.lat === lat
      })
      if (!store) return
      console.log(store)
      setActiveStore(store)
      setStoreModal(true)
  }

  const closePoint = () => {
      setActiveStore(null)
      setStoreModal(false)
  }

  return (
    <>
        <Modal title="Title do map" show={storeModal} onClose={closePoint}>
            <p>
                Latitude:{JSON.stringify(activeStore)}
            </p>
        </Modal>

        <S.Wrapper>

        <S.Container>
        <S.ContainerLeft>
      <S.ContainerOne>
          <S.Form>
          <h1>Encontre uma oficina perto de você!</h1>
          <div className='ContainerSelect'>
            <FormSelectStates setStateSelected={setStateSelected} listOpt={listOpt} id="Estado"  icon={db.Estado.Icon} title="Estado" placeholder={db.Estado.PlaceHolder}/>
            <FormSelectCity  stateSelected={stateSelected} listOptCities={listOptCities} setCitiesSelected={setCitiesSelected} id="Cidade"  icon={db.Cidade.Icon} title="Cidade" placeholder={db.Cidade.PlaceHolder}/>
          </div>
          < Button  filtroDosCardsDeAcordoComSelecionado={filtroDosCardsDeAcordoComSelecionado} citiesSelected={citiesSelected} id="Buscar" title="Buscar Oficina"/>
          </S.Form>
        </S.ContainerOne>
        </S.ContainerLeft>


        <S.ContainerRight>
          <S.ContainerTwo>
          <img src={Imagem} alt="Imagem Desktop"/>
          <img src={ImagemMobile} alt="Imagem Mobile"/>
          </S.ContainerTwo>
        </S.ContainerRight>
      </S.Container>
    </S.Wrapper>

    <S.WrapperMaps>
          <h1>{listOpt.length} - Oficinas encontradas</h1>
      <Maps listOpt={listOpt} selectPoint={onSelectPoint}/>
    </S.WrapperMaps>


      <S.WrapperCards>
            <div className="changePag">
                <span>Fileiras por página <span>1-1</span></span>
                <div className="Left-Right">
                    <img src={Arrow} alt="Icon Arrow"/>
                    <img src={Arrow} alt="Icon Arrow"/>
                </div>
            </div>
        <S.ContainerCard >
        {listOpt.map((val, index) =>
          < Cards
            key={index}
            Imagem={val.establishment.fotoThumb}
            Cidade={val.establishment.cidade}
            Estado={val.establishment.estado}
            Rua={val.establishment.logradouro}
            Numero={val.establishment.numero}
            Cep={val.establishment.cep}
            horarioInicio={val.establishment.funcionamento[0].horarioInicio}
            horarioFim={val.establishment.funcionamento[0].horarioFim}
            Contato={val.establishment.contatos[0]}
          />
          )
        }
          </S.ContainerCard>
      </S.WrapperCards>

  </>
  )
}


