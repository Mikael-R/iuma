import styled from "styled-components";

export const Container = styled.div`
    > form {
        > select {
                position: relative;
                -webkit-appearance: none;
                width: 100%;
                height: 40px;
                border-radius: 5px;
                background: #FFFFFF 0% 0% no-repeat padding-box;
                box-shadow: inset 0px 3px 6px #0000001a;
                border: 1px solid #EDEDED;
                opacity: 1;
                padding-left: 10px;

                &::placeholder {
                    font: normal normal normal 18px/39px 'Source Sans Pro';
                    letter-spacing: 0px;
                    color: #B5B5B5;
                    opacity: 1;
                }
            }
            > img {
                position: absolute;
                width: 2rem;
                height: 1.5rem;
                right: 0;
                top: 45%;
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