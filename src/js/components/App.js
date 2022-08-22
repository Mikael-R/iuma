import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import 'styles/css/App.css';

//login
import MapfreQuery from "js/components/Login/MapfreQuery";
import PhoneInput from "js/components/Login/PhoneInput";
import UserForm from "js/components/Login/UserForm";
import additionalInfo from 'js/components/UserForm/AdditionalInfo';
import PhoneChange from "js/components/Login/PhoneChange";
import PhoneChangeValidate from "js/components/Login/PhoneChangeValidate";
import AccessDifficulty from "js/components/Login/AccessDifficulty";

//outros
import StorePlacesList from "js/components/StorePlaces/StorePlacesList";
import Store from "js/components/StorePlaces/Store";
import Places from "js/components/StorePlaces/Places";
import MapfreBalance from "js/components/Balance/MapfreBalance";
import Voucher from "js/components/Balance/Voucher";
import VoucherTemp from "js/components/Balance/VoucherTemp";
import EditUserInfo from "js/components/UserForm/EditUserInfo.js";
import HelpScreen from "js/components/HelpArea/HelpScreen.js";
import RequestSys from "js/components/SYS/RequestSys.js";
import FormSys from "js/components/SYS/FormSys.js";
import OrdersSys from 'js/components/SYS/OrdersSys.js';
import CofryHome from 'js/components/Cofry/CofryHome.js';
import Product from 'js/components/RedeemPoints/Product.js';

//landings StorePlaces
import StoreLanding from "js/components/StorePlaces/StoreLanding";
import AutoLogin from './Login/AutoLogin';
import CofryEstablishments from './Cofry/CofryEstablishments';
import MuralCampaign from './Campaigns/MuralCampaign';
import CofryPromotion from './Cofry/CofryPromotion';

//Oficinas MAPFRE
import LoginRepair from 'js/components/CarRepair/LoginRepair.js';
import PhoneLogin from 'js/components/CarRepair/PhoneLogin.js';
import NewEntry from 'js/components/CarRepair/NewEntry';
import HistoryEntries from 'js/components/CarRepair/HistoryEntries';
import { OficinasEmbaixadoras } from './Oficinas/OficinasEmbaixadoras';
import Maps from './MapsOficinas/Maps';


class App extends Component {
  
  render() {
    return (
      <Switch>
        {/* <Route exact path='/home-clubmapfre' component={ HomeModal } /> */}

        <Route exact path='/login-clubmapfre' component={ MapfreQuery } />

        <Route exact path='/confirmarCelular-clubmapfre' component={ PhoneInput } />

        <Route exact path='/cadastroCliente-clubmapfre' component={ UserForm } />

        <Route exact path='/mudarCelular-clubmapfre' component={ PhoneChange } />

        <Route exact path='/mudarCelularConfirmacao' component={ PhoneChangeValidate } />

        <Route exact path='/dificuldadeAcesso-clubmapfre' component={ AccessDifficulty } />

        <Route exact path='/ofertas' component={ StorePlacesList } />

        <Route exact path='/oferta' component={ Store } />

        <Route exact path='/estabelecimento' component={ Places } />

        <Route exact path='/landingOferta' component={ StoreLanding } />

        <Route exact path='/minhaConta' component={ MapfreBalance } />
        
        <Route exact path='/minhaConta/detalhes' component={ Voucher } />
        
        <Route exact path='/voucherPromo' component={ VoucherTemp } />

        <Route exact path='/meusDados' component={ EditUserInfo } />

        <Route path='/informacoes-complementares' component={ additionalInfo } />
        
        <Route exact path='/faq' component={ HelpScreen } />

        <Route exact path='/solicitarAssistencia' component={ RequestSys } />
        
        <Route path='/formAssistencia/:id' component={ FormSys } />

        <Route exact path='/minhasSolicitacoes' component={ OrdersSys } />

        <Route exact path='/cofryMapfre' component={ CofryHome } />

        <Route path='/estabelecimentosCofry' component={ CofryEstablishments } />

        <Route path='/promotionCofry' component={ CofryPromotion } />

        <Route path='/entrance' component={ AutoLogin } />

        <Route path='/share-image/' component={ MuralCampaign } />

        <Route path='/produto-pontos/' component={ Product } />

        <Route path='/oficinas' component={ LoginRepair } />

        <Route path='/login-telefone' component={ PhoneLogin } />

        <Route path='/nova-saida' component={ NewEntry } />

        <Route path='/historico-saidas' component={ HistoryEntries } />

        <Route path='/oficinas-embaixadoras' component={ OficinasEmbaixadoras } />
        
        <Route path='/maps' component={ Maps } />

      </Switch>
    );
  }
}

export default App;