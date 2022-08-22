import styled from "styled-components";

export const  Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 65vh;

    @media screen and (max-width: 768px) {
        align-items: start;
        margin: 20px 0 0 0;
    }
`