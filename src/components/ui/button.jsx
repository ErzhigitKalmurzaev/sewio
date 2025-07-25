import React from 'react'
import { LoadingButton } from '@mui/lab';
import styled from '@emotion/styled'

const Button = ({ variant = "default", active,  disabled, type, sx, loading, children, width, onClick, icon, ...props }) => {
    const VARIANTS = {
        default: {
            padding: "0 10px",
            height: "33px",
            background: "#2F4F4F",
            color: "white",
            fontSize: "13px",
            fontWeight: "400",
            fontFamily: "Inter",
            textTransform: 'capitalize',
            border: "1px solid #2F4F4F",
            borderRadius: "6px",
            ":hover": {
                transition: "0.5s all ease",
                color: "#2F4F4F",
                background: "white",
                border: "1px solid #2F4F4F",
            },
            ":disabled": {
                background: "#dadada",
                color: "gray"
            }
        },
        filterActive: {
            padding: "3px 10px",
            background: "#2F4F4F",
            color: "white",
            fontSize: "14px",
            textTransform: "capitalize",
            borderRadius: "30px",

            "@media (max-width: 768px)" : {
                fontSize: "13px",
                borderRadius: "20px",
            }
        },
        filter: {
            padding: "2px 10px",
            background: "white",
            border: "1px solid #2F4F4F",
            color: "#2F4F4F",
            fontSize: "14px",
            textTransform: "capitalize",
            borderRadius: "30px",
            ":hover": {
                transition: "0.5s all ease",
                color: "white",
                background: "#2F4F4F",
                border: "1px solid #2F4F4F",
            },
            "@media (max-width: 768px)" : {
                fontSize: "13px",
                borderRadius: "20px",
            }
        },
        red: {
            padding: "0px 10px",
            height: "33px",
            background: "#e24949",
            color: "white",
            fontSize: "13px",
            fontWeight: "400",
            fontFamily: "Inter",
            textTransform: 'capitalize',
            border: "1px solid #e24949",
            borderRadius: "6px",
            ":hover": {
                transition: "0.5s all ease",
                color: "#e24949",
                background: "white",
                border: "1px solid #e24949",
            },
            ":disabled": {
                background: "#dadada",
                color: "gray"
            }
        },
        green: {
            padding: "0px 10px",
            height: "33px",
            background: "#3da065",
            color: "white",
            fontSize: "13px",
            fontWeight: "400",
            fontFamily: "Inter",
            textTransform: 'capitalize',
            border: "1px solid #3da065",
            borderRadius: "6px",
            ":hover": {
                transition: "0.5s all ease",
                color: "#3da065",
                background: "white",
                border: "1px solid #3da065",
            },
            ":disabled": {
                background: "#dadada",
                color: "gray"
            }
        },
        blue: {
            padding: "0px 10px",
            height: "33px",
            background: "#3a78aa",
            color: "white",
            fontSize: "13px",
            fontFamily: "Inter",
            fontWeight: "400",
            textTransform: 'capitalize',
            border: "1px solid #3a78aa",
            borderRadius: "8px",
            ":hover": {
                transition: "0.5s all ease",
                color: "#3a78aa",
                background: "white",
                border: "1px solid #3a78aa",
            },
            ":disabled": {
                background: "#dadada",
                color: "gray"
            }
        },
        white: {
            padding: "0px 10px",
            height: "33px",
            background: "white",
            color: "#2F4F4F",
            fontSize: "13px",
            fontWeight: "400",
            fontFamily: "Inter",
            textTransform: 'capitalize',
            border: "1px solid #2F4F4F",
            borderRadius: "8px",
            ":hover": {
                transition: "0.5s all ease",
                color: "white",
                background: "#2F4F4F",
                border: "1px solid #2F4F4F",
            },
            ":disabled": {
                background: "#dadada",
                color: "gray"
            }
        },
        notHover: {
            padding: "0 12px",
            height: "35px",
            background: "#2F4F4F",
            color: "white",
            fontSize: "13px",
            fontWeight: "400",
            fontFamily: "Inter",
            textTransform: 'capitalize',
            border: "1px solid #2F4F4F",
            borderRadius: "8px"
        },
        petrol: {
            padding: "0px 10px",
            height: "33px",
            background: "#0B4F6C",
            color: "white",
            fontSize: "13px",
            fontWeight: "400",
            fontFamily: "Inter",
            textTransform: 'capitalize',
            border: "1px solid #0B4F6C",
            borderRadius: "6px",
            ":hover": {
                transition: "0.5s all ease",
                color: "#0B4F6C",
                background: "white",
                border: "1px solid #0B4F6C",
            },
            ":disabled": {
                background: "#dadada",
                color: "gray"
            }
        }
    }

    return (
        <StyledButton 
            loading={loading} 
            type={type} 
            disabled={disabled} 
            width={width} 
            styles={VARIANTS[variant]} 
            onClick={onClick}
            onDoubleClick={() => {}}
            {...props}
        >
            {icon ? icon : ''} {children}
        </StyledButton>
    )
}

export default Button

const StyledButton = styled(LoadingButton)`
    width: ${props => props.width ? props.width : ""};
    ${({ styles }) => ({ ...styles })};
    text-transform: 'capitalize';
    white-space: nowrap;
    &:disabled {
        border: 1px solid #c0c0c0;
    } ;
    :active {
     transform: translateY(2px)
    }
    
`