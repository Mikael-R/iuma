import styled from "styled-components";

export const Container = styled.div`
    > form {
        > .ctn-select {
            width: auto;
            height: auto;
            position: relative;
            
            > select {
            
                -webkit-appearance: none;
                width: 100%;
                height: 40px;
                border-radius: 5px;
                background: #FFFFFF 0% 0% no-repeat padding-box;
                box-shadow: inset 0px 3px 6px #0000001a;
                border: 1px solid #EDEDED;
                opacity: 1;
                padding-left: 10px;

                &:nth-child(1) {
                    font: normal normal normal 18px/39px 'Source Sans Pro';
                    letter-spacing: 0px;
                    color: #B5B5B5;
                    opacity: 1;
                }
                &:focus-visible {
                    outline: none;
                }
                
            }

            
        }
                
        > .d_select {   
            position: absolute;
            width: 17.85px;
            right: 13px;
            top: 30%;        
        }
        > .titleName {
            display: flex;
            align-items: center;
            gap: 7.6px;
            height: 30px;
            
        > img {
            width: 13px;
            height: 21px;
        }
        > p {
            font: normal normal 600 18px 'Source Sans Pro';
            letter-spacing: 0px;
            color: #000000;
            opacity: 1;
        }
    }
}
`

export const ImagemC = styled.img`
    position: absolute;
    width: 2rem;
    height: 1.5rem;
    right: 10px;
    top: 25%;    
    transform: ${({active}) => active ? 'rotate(180deg)' : 'rotate(0deg)'};
    transition: all 0.3s ease-out;

    .disable {
        display: none;
    }
  `