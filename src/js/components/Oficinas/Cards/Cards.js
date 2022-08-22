import React from "react";
import * as S from './styles'
import { configJson } from 'js/library/utils/firebaseUtils';


export const Cards = ({Imagem, Cidade, Estado, Rua, Numero, Cep, horarioInicio , horarioFim , Contato}) => {
    return (
        <S.Card>
            <div className="container-card" href="#Cards">
                <img alt="Oficinas" src={configJson.STORAGE_URL + encodeURIComponent('estabelecimento/' + Imagem) + '?alt=media'} width="100%" />
                
                <div className="content-info">
                    <h1 className="tituloCard">{Cidade} -<span>{Estado}</span></h1>
                    <div className="info">
                        <span>{Rua}, <span>{Numero}</span></span>
                        <span>{`CEP: ${Cep}`}</span>
                        <span>{`Segunda a Sexta das ${horarioInicio} às ${horarioFim}`}</span>
                        <span>{`Tel.${Contato.substr(4)}`}</span>
                    </div>
                </div>
            </div>
        </S.Card> 
    )
}

export default Cards;