import styled from "styled-components";
import exp from "node:constants";

export const WrapperContain = styled.div`
    margin: auto;
    /* Kích thước mặc định */
    width: 100%;
    @media (min-width: 576px) { /* sm */
        /* Thay đổi width khi màn hình là sm hoặc lớn hơn */
        width: 95%; /* hoặc bất kỳ giá trị nào phù hợp */
        margin: auto;
    }
    @media (min-width: 768px) { /* sm */
        /* Thay đổi width khi màn hình là sm hoặc lớn hơn */
        width: 95%; /* hoặc bất kỳ giá trị nào phù hợp */
        margin: auto;
    }
    @media (min-width: 1200px) { /* md */
        /* Thay đổi width khi màn hình là lg hoặc lớn hơn */
        width: 1200px; /* hoặc bất kỳ giá trị nào phù hợp */
        margin: auto;
    }
`;
export const WrapperCateName = styled.h1 `
    color: #0E6830;
    font-size: 30px;
    font-weight: 400;
    display: block;
    margin-bottom: 10px;
    margin-left: 20px;
`