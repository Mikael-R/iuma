import styled from "styled-components";

export const WrapperCard = styled.div`
    width: 100%;
    height: 758px;
`;

export const Card = styled.div`
    padding: 0 16px;
        > .container-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 300px;
        width: 100%;
        min-width: 100px;
        height: 500px;
        background: #FFFFFF 0% 0% no-repeat padding-box;
        box-shadow: 0px 3px 6px #00000029;
        border-radius: 15px;
        padding: 2rem;
        opacity: 1;
        flex-wrap: wrap;

        @media screen and (max-width: 475px) {
            padding: 16px 16px 0px 16px;
        }
        @media screen and (max-width: 375px) {
            padding: 16px 0 0 0;
        }
        > img {
            max-width: 270px;
            min-height: 240px;
        }
       
        > .content-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;

            > h1 {
                margin: 1rem 0;
                text-align: center;
                font: normal normal normal 25px/39px "DM Sans";
                letter-spacing: 0px;
                color: #2F373C;
                opacity: 1;
                font-weight: 700;
            }
            
            > .info {
                display: flex;
                align-items: center;
                flex-direction: column;
                gap: 10px;
                
                > span {
                    text-align: center;
                    font: normal normal normal 20px/24px DM Sans;
                    letter-spacing: 0px;
                    color: #2F373C;
                    opacity: 1;
                }

                &:nth-child() {
                    
                }
                &:nth-child() {

                }
                &:nth-child() {

                }
                &:nth-child() {

                }
            }
        }
    }

`;