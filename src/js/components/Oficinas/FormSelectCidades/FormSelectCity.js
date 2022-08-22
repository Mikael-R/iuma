import React from 'react';
import db from '../Helpers/Db'
import * as S from './style'

function FormSelectCity({icon, title, placeholder, invisible, listOptCities, stateSelected, setCitiesSelected}) {

  const cities = listOptCities.map((item)=> {
    const city = {
      cidade: item.establishment.cidade,
      estado: item.establishment.estado
    }
    return city;
  
  });

  const citiesFiltered = cities.filter((e)=>{ return e.estado === stateSelected });
  const jsonObject = citiesFiltered.map(JSON.stringify);
  const uniqueSet = new Set(jsonObject);
  const uniqueArray = Array.from(uniqueSet).map(JSON.parse);


  return (
    <S.Container>
        <form >
          <div className='titleName'>
          <img src={icon} alt="Icone Localização"/>
            <p>{title}</p>
          </div>   
          <div className='ctn-select'>
            <select  onChange={(e) => setCitiesSelected(e.target.value)} disabled={stateSelected === '' ? true : false} name="cidade" id="cidade" defaultValue={'DEFAULT'}>
              <option  value={0} disabled selected>{placeholder}</option>
              {uniqueArray.map((item, index)=>(
              <option value={item.cidade} key={index}>{item.cidade}</option>))}
            </select>
              <S.ImagemC style={invisible} src={db.Select.Icon} alt='Icon Select'/>
          </div>   
        </form>
    </S.Container>
  );
}

export default FormSelectCity;