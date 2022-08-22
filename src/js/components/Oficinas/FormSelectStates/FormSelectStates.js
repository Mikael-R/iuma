import React from 'react';
import db from '../Helpers/Db'
import * as S from './style'

function FormSelectStates({icon, title, placeholder, invisible,setStateSelected,listOpt}) {

  const states2 = listOpt.map((item)=> item.establishment.estado);
  const  arr = [...new Set(states2)];


  return (
    <S.Container>
      <form >
        <div className='titleName'>
        <img src={icon} alt="Icone Localização"/>
        <p>{title}</p>
        </div>   
        <div className='ctn-select'>
          <select onChange={(e)=> setStateSelected(e.target.value)} name="estado" id="estado" defaultValue={'DEFAULT'}>
            <option value='' disabled selected>{placeholder}</option>
              {arr.map((elemet, index) =>(
              <option key={index} value={elemet}>{elemet}</option>))}
          </select>
            <S.ImagemC style={invisible} src={db.Select.Icon} alt='Icon Select'/>
       </div>   
      </form>
    </S.Container>
  );
}
export default FormSelectStates;