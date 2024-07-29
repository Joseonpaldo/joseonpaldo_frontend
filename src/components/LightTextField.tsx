import {FormControl,  styled, TextField, TextFieldProps} from "@mui/material";
import React from "react";

const StyledTextField = styled(TextField)<TextFieldProps>(({theme}) => ({
    "& .MuiOutlinedInput-input": {
        fontWeight: 500,
        color: theme.palette.text.primary,
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderRadius: "8px",
        border: "2px solid",
        borderColor:
            theme.palette.mode === "light"
                ? theme.palette.secondary.light
                : theme.palette.divider,
    },
    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.secondary.light,
    },
}));

const LightTextField = (props: TextFieldProps) => {
    return <FormControl variant="outlined" fullWidth>
        <StyledTextField {...props}/>
    </FormControl>;
};

export default LightTextField;
