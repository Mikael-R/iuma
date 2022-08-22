import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  background: #f0f0f0;
`
export const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  
  

  @media screen and (max-width: 1100px) {
    flex-direction: column-reverse;

  }
`;

export const ContainerLeft = styled.div`
  width: 40%;
  min-height: 740px;
  background: #F0F0F0;
  display: flex;
  justify-content: flex-end;

  @media screen and (max-width: 1100px) {
    width: 100%;
    min-height: fit-content;
    justify-content: center;
  }
`
export const ContainerOne = styled.div`
  position: relative;
  max-width: 720px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #F0F0F0 0% 0% no-repeat padding-box;;
`

export const Form = styled.div`
  max-width: 441px;
  min-height: 450px;

 > h1 {
  width: 80%;
  padding: 0 16px;
  @media screen and (max-width: 475px) {
    font-size: 22px;
  }
  @media screen and (max-width: 375px) {
    font-size: 19px;
  }
 }
 > .ContainerSelect {
  display: flex;
    flex-direction: column;
    gap: 21.9px;
    margin: 41.9px 0;
    padding: 0 16px;

 }
    @media screen and (max-width: 475px) {
      margin: 10px 0 40px 0;
    }

`

export const ContainerRight = styled.div`
  width: 60%;

  @media screen and (max-width: 1100px) {
    margin: 0 auto;
    width: fit-content;
  }
`

export const ContainerTwo = styled.div`
  height: 100%;
  position: relative;

  > img:nth-child(1) {
    position: absolute;
    top: 0;
    left: 0;
  @media screen and (max-width: 1100px) {
    display: none;
  }
  
}
> img:nth-child(2) {
  display: none;
    @media screen and (max-width: 1100px) {
      display: block;
    }
}

  > img {
      width: 100%;
      height: 100%;
    }

`

export const WrapperMaps = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;

  > h1 {
    font: normal normal bold 35px/39px "Dm Sans";
      letter-spacing: 0px;
      color: #4A4A4A;
      opacity: 1;
      margin: 50px 0 -35px;

      @media screen and (max-width: 768px) {
        font-size: 28px;
        margin: 10px 0 0 0;
      }
      @media screen and (max-width: 500px) {
        font-size: 25px;
      }
      @media screen and (max-width: 375px) {
        font-size: 22px;
      }
  }
`
export const WrapperOficinas = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background: #f0f0f0;
`
export const ContainerOficinas = styled.div`
  max-width: 1440px;
  width: 100%;

  > .One {
    display: flex;

    > .Arrows {
      display: flex;
      width: 2rem;
      height: 1.5rem;
    }
    > .Arrows:nth-child(1) {
      transform: rotate(33deg);
    }
  }
`

export const WrapperCards = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  > .changePag {
        width: 97%;
        height: fit-content;
        gap: 20.5px;

        display: flex;
        align-items: center;
        justify-content: center;

        @media screen and (max-width: 768px) {
          width: 94%;
        }
        @media screen and (max-width: 425px) {
          width: 87%;
        }

        .Left-Right {
            display: flex;
            width: 14px;
            height: 34px;
            gap: 15px;
        }


        > .Left-Right :nth-child(1) {
            transform: rotate(90deg);
            cursor: pointer;
        }
        > .Left-Right :nth-child(2) {
            transform: rotate(270deg);
            cursor: pointer;
        }
    }
`;
export const ContainerCard = styled.div`
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
    margin-top: 3rem;
`;



