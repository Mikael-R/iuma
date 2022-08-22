import Location from '../../../../styles/assets/icons/IconSelectLocation.svg'
import City from '../../../../styles/assets/icons/IconSelectCity.svg'
import Arrow from '../../../../styles/assets/icons/IconArrowDown.svg'

const db = {
    Estado: {
        Icon: Location,
        Name: "Estado",
        PlaceHolder: "Busque por um estado"
    },
    Cidade: {
        Icon: City,
        Name: "Cidade",
        PlaceHolder: "Busque por uma cidade"
    },
    Especialidade: {
        Name: "Especialidade",
        PlaceHolder: "Busque por uma especialidade"
    },
    Select: {
        Icon: Arrow
    }
}

export default db;